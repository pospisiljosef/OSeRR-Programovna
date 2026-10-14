import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  getDoc,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { ScoutProgram, ProgramReview } from '../types/scout';

const PROGRAMS_COLLECTION = 'programs';
const DELETED_PROGRAMS_KEY = 'scout_deleted_programs';

// Default program IDs that were previously seeded
const DEFAULT_PROGRAM_IDS = new Set([
  'prog-sifrovaci-orientak',
  'prog-ostrov-trosecniku',
  'prog-kouzelna-lucerna-vlcata',
  'prog-komunitni-mise-roveri',
  'prog-zlata-horecka-snih',
  'prog-vodni-pevnost-leto',
  'prog-eticka-kavarna-moralka',
  'prog-nocni-hvezdna-hlidka'
]);

function getDeletedProgramIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_PROGRAMS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
}

function markProgramDeletedLocally(programId: string) {
  try {
    const set = getDeletedProgramIds();
    set.add(programId);
    localStorage.setItem(DELETED_PROGRAMS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {}
}

// Purge any default seed programs from Firestore database so only real user programs exist
let purged = false;
async function purgeDefaultProgramsFromFirestore() {
  if (purged) return;
  purged = true;
  try {
    for (const defId of DEFAULT_PROGRAM_IDS) {
      const progRef = doc(db, PROGRAMS_COLLECTION, defId);
      await deleteDoc(progRef);
    }
  } catch (err) {
    // If some don't exist or offline, ignore
  }
}

// Trigger purge on start
purgeDefaultProgramsFromFirestore();

export function subscribeToPrograms(
  onPrograms: (programs: ScoutProgram[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, PROGRAMS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const deletedIds = getDeletedProgramIds();

      if (snapshot.empty) {
        onPrograms([]);
        return;
      }

      const list: ScoutProgram[] = [];
      snapshot.forEach((docSnap) => {
        // Exclude default seed programs and locally deleted programs
        if (DEFAULT_PROGRAM_IDS.has(docSnap.id) || deletedIds.has(docSnap.id)) {
          return;
        }
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          title: data.title || '',
          summary: data.summary || '',
          description: data.description || '',
          educationalGoals: data.educationalGoals || '',
          materials: data.materials || '',
          durationMinutes: Number(data.durationMinutes) || 45,
          minParticipants: data.minParticipants,
          maxParticipants: data.maxParticipants,
          ageCategories: data.ageCategories || ['skauti_skautky'],
          scoutMethods: data.scoutMethods || [],
          physicalDemand: Number(data.physicalDemand) || 5,
          intellectualDemand: Number(data.intellectualDemand) || 5,
          creativity: Number(data.creativity) || 5,
          teamwork: Number(data.teamwork) || 5,
          preparationDemand: Number(data.preparationDemand) || 5,
          environment: data.environment || 'both',
          weather: data.weather || ['sunny'],
          eventTypes: data.eventTypes || ['schuzka'],
          tags: data.tags || [],
          attachmentUrl: data.attachmentUrl || '',
          attachmentName: data.attachmentName || '',
          attachmentData: data.attachmentData || '',
          attachmentType: data.attachmentType || '',
          authorId: data.authorId || 'unknown',
          authorName: data.authorName || 'Skautský vedoucí',
          authorEmail: data.authorEmail || '',
          authorUnit: data.authorUnit || '',
          authorCenter: data.authorCenter || '',
          createdAt: data.createdAt || new Date().toISOString(),
          ratingAverage: Number(data.ratingAverage) || 5.0,
          ratingCount: Number(data.ratingCount) || 0,
          favoriteCount: Number(data.favoriteCount) || 0
        });
      });

      // Stable deterministic sort by newest with ID fallback
      list.sort((a, b) => {
        const diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (diff !== 0) return diff;
        return a.id.localeCompare(b.id);
      });
      onPrograms(list);
    },
    (error) => {
      console.error('Error fetching programs:', error);
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, PROGRAMS_COLLECTION);
    }
  );
}

export function removeUndefinedFields<T extends Record<string, any>>(obj: T): T {
  const clean: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }
  return clean;
}

export async function saveProgram(program: Omit<ScoutProgram, 'id' | 'createdAt' | 'ratingAverage' | 'ratingCount' | 'favoriteCount'> & { id?: string }) {
  const isNew = !program.id;
  const programId = program.id || 'prog_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const path = `${PROGRAMS_COLLECTION}/${programId}`;

  const payload: any = removeUndefinedFields({
    ...program,
    id: programId,
    durationMinutes: Number(program.durationMinutes) || 45,
    physicalDemand: Number(program.physicalDemand) || 5,
    intellectualDemand: Number(program.intellectualDemand) || 5,
    creativity: Number(program.creativity) || 5,
    teamwork: Number(program.teamwork) || 5,
    preparationDemand: Number(program.preparationDemand) || 5,
    attachmentUrl: program.attachmentUrl?.trim() || '',
    attachmentName: program.attachmentName?.trim() || '',
    attachmentData: program.attachmentData || '',
    attachmentType: program.attachmentType || '',
    eventTypes: program.eventTypes || ['schuzka'],
    authorName: program.authorName || 'Skautský vedoucí',
    authorEmail: program.authorEmail || '',
    authorUnit: program.authorUnit?.trim() || '',
    authorCenter: program.authorCenter?.trim() || '',
  });

  if (isNew) {
    payload.createdAt = new Date().toISOString();
    payload.ratingAverage = 5.0;
    payload.ratingCount = 0;
    payload.favoriteCount = 0;
  }

  try {
    const docRef = doc(db, PROGRAMS_COLLECTION, programId);
    await setDoc(docRef, payload, { merge: true });
    return programId;
  } catch (error) {
    handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, path);
  }
}

export async function updateAuthorInfoOnExistingPrograms(
  authorId: string,
  newAuthorName: string,
  newUnitName?: string,
  newCenterName?: string,
  userEmail?: string | null
) {
  try {
    const colRef = collection(db, PROGRAMS_COLLECTION);
    const snapshot = await getDocs(colRef);
    const updates: Promise<void>[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      // Only match programs truly authored by this specific user
      // If the document has an authorEmail, it MUST match the userEmail!
      let isMatch = false;
      if (userEmail && data.authorEmail) {
        isMatch = data.authorEmail.trim().toLowerCase() === userEmail.trim().toLowerCase();
      } else if (authorId && data.authorId) {
        isMatch = data.authorId === authorId;
      }

      if (isMatch) {
        updates.push(
          updateDoc(docSnap.ref, {
            authorName: newAuthorName,
            authorUnit: newUnitName?.trim() || '',
            authorCenter: newCenterName?.trim() || ''
          })
        );
      }
    });
    await Promise.all(updates);
  } catch (err) {
    console.warn('Could not update author info on existing programs:', err);
  }
}

export async function deleteProgram(programId: string) {
  markProgramDeletedLocally(programId);
  const path = `${PROGRAMS_COLLECTION}/${programId}`;
  try {
    const docRef = doc(db, PROGRAMS_COLLECTION, programId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Firestore delete caught:', error);
  }
}

export function subscribeToReviews(
  programId: string,
  onReviews: (reviews: ProgramReview[]) => void
) {
  const path = `${PROGRAMS_COLLECTION}/${programId}/reviews`;
  const colRef = collection(db, PROGRAMS_COLLECTION, programId, 'reviews');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: ProgramReview[] = [];
      snapshot.forEach((snap) => {
        const d = snap.data();
        list.push({
          id: snap.id,
          programId,
          userId: d.userId,
          userName: d.userName,
          userEmail: d.userEmail,
          rating: Number(d.rating) || 5,
          comment: d.comment || '',
          createdAt: d.createdAt || new Date().toISOString()
        });
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onReviews(list);
    },
    (err) => {
      console.warn('Error loading reviews:', err);
      onReviews([]);
    }
  );
}

export async function addProgramReview(
  programId: string, 
  review: { userId: string; userName: string; rating: number; comment: string; userEmail?: string }
) {
  const reviewId = 'rev_' + Date.now();
  const path = `${PROGRAMS_COLLECTION}/${programId}/reviews/${reviewId}`;
  try {
    const revDocRef = doc(db, PROGRAMS_COLLECTION, programId, 'reviews', reviewId);
    const revData: ProgramReview = {
      id: reviewId,
      programId,
      userId: review.userId,
      userName: review.userName,
      userEmail: review.userEmail || '',
      rating: review.rating,
      comment: review.comment,
      createdAt: new Date().toISOString()
    };
    await setDoc(revDocRef, revData);

    // Update program rating stats
    try {
      const progDocRef = doc(db, PROGRAMS_COLLECTION, programId);
      const progSnap = await getDoc(progDocRef);
      if (progSnap.exists()) {
        const currentData = progSnap.data();
        const curCount = Number(currentData.ratingCount) || 0;
        const curAvg = Number(currentData.ratingAverage) || 5;
        const newCount = curCount + 1;
        const newAvg = curCount === 0 ? review.rating : Math.round(((curAvg * curCount + review.rating) / newCount) * 10) / 10;
        await updateDoc(progDocRef, {
          ratingAverage: newAvg,
          ratingCount: newCount
        });
      }
    } catch (e) {
      console.warn('Failed to update ratingAverage on program doc:', e);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeToUserFavorites(
  userId: string,
  onFavoritesChange: (favoriteIds: string[]) => void
) {
  const path = `users/${userId}/favorites`;
  const colRef = collection(db, 'users', userId, 'favorites');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const ids: string[] = [];
      snapshot.forEach((snap) => {
        ids.push(snap.id);
      });
      onFavoritesChange(ids);
    },
    (err) => {
      console.warn('Error subscribing to favorites:', err);
      const local = localStorage.getItem(`scout_favs_${userId}`);
      if (local) {
        try {
          onFavoritesChange(JSON.parse(local));
        } catch (e) {}
      }
    }
  );
}

export async function toggleProgramFavorite(userId: string, programId: string, isFav: boolean) {
  const path = `users/${userId}/favorites/${programId}`;
  try {
    const favRef = doc(db, 'users', userId, 'favorites', programId);
    const progRef = doc(db, PROGRAMS_COLLECTION, programId);

    if (isFav) {
      await deleteDoc(favRef);
      try {
        const progSnap = await getDoc(progRef);
        if (progSnap.exists()) {
          const count = Math.max(0, (Number(progSnap.data().favoriteCount) || 1) - 1);
          await updateDoc(progRef, { favoriteCount: count });
        }
      } catch (e) {}
    } else {
      await setDoc(favRef, { programId, createdAt: new Date().toISOString() });
      try {
        const progSnap = await getDoc(progRef);
        if (progSnap.exists()) {
          const count = (Number(progSnap.data().favoriteCount) || 0) + 1;
          await updateDoc(progRef, { favoriteCount: count });
        }
      } catch (e) {}
    }
  } catch (error) {
    const key = `scout_favs_${userId}`;
    const cur = JSON.parse(localStorage.getItem(key) || '[]');
    let updated: string[];
    if (isFav) {
      updated = cur.filter((id: string) => id !== programId);
    } else {
      updated = [...cur, programId];
    }
    localStorage.setItem(key, JSON.stringify(updated));
    console.warn('Favorite toggled in local fallback', error);
  }
}
