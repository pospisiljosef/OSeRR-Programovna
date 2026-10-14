import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { YearlyPlan } from '../types/scout';

const YEARLY_PLANS_COLLECTION = 'yearly_plans';
const DELETED_PLANS_KEY = 'scout_deleted_yearly_plans';
const CREATED_PLANS_KEY = 'scout_my_created_plans';

// Mock/default plan IDs that must NOT be displayed - only real user plans should be shown
export const DEFAULT_PLAN_IDS = new Set([
  'plan_rytiri_kulataho_stolu',
  'plan_pohadkovy_strom_benjaminci',
  'plan_kniha_dzungle_vlcata'
]);

function getDeletedPlanIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_PLANS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
}

export function markPlanDeletedLocally(planId: string) {
  try {
    const set = getDeletedPlanIds();
    set.add(planId);
    localStorage.setItem(DELETED_PLANS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {}
}

export function recordPlanCreatedLocally(planId: string) {
  try {
    const raw = localStorage.getItem(CREATED_PLANS_KEY);
    const set = raw ? new Set(JSON.parse(raw)) : new Set<string>();
    set.add(planId);
    localStorage.setItem(CREATED_PLANS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {}
}

export function isPlanCreatedLocally(planId: string): boolean {
  try {
    const raw = localStorage.getItem(CREATED_PLANS_KEY);
    if (!raw) return false;
    const set = new Set(JSON.parse(raw));
    return set.has(planId);
  } catch (e) {
    return false;
  }
}

// Purge any default mock plans from Firestore so only real user plans exist
let purged = false;
async function purgeDefaultPlansFromFirestore() {
  if (purged) return;
  purged = true;
  try {
    for (const defId of DEFAULT_PLAN_IDS) {
      const planRef = doc(db, YEARLY_PLANS_COLLECTION, defId);
      await deleteDoc(planRef);
    }
  } catch (err) {
    // ignore
  }
}

export function subscribeToYearlyPlans(onPlans: (plans: YearlyPlan[]) => void) {
  purgeDefaultPlansFromFirestore();

  const colRef = collection(db, YEARLY_PLANS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const deletedSet = getDeletedPlanIds();
      const plans: YearlyPlan[] = [];

      snapshot.forEach((snap) => {
        const id = snap.id;
        // Strictly filter out any mock/seed plans and any locally deleted plans
        if (!DEFAULT_PLAN_IDS.has(id) && !deletedSet.has(id)) {
          plans.push(snap.data() as YearlyPlan);
        }
      });

      onPlans(plans);
    },
    (error) => {
      console.warn('Firestore yearly plans subscription error:', error);
      onPlans([]);
    }
  );
}

export async function saveYearlyPlan(planData: Partial<YearlyPlan>): Promise<string> {
  const planId = planData.id || `plan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const isNew = !planData.id;

  const payload: any = {
    ...planData,
    id: planId,
    updatedAt: new Date().toISOString()
  };

  if (isNew) {
    payload.createdAt = new Date().toISOString();
    payload.ratingAverage = 5.0;
    payload.ratingCount = 0;
    payload.favoriteCount = 0;
  }

  try {
    const docRef = doc(db, YEARLY_PLANS_COLLECTION, planId);
    await setDoc(docRef, payload, { merge: true });
    recordPlanCreatedLocally(planId);
    return planId;
  } catch (error) {
    handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, `${YEARLY_PLANS_COLLECTION}/${planId}`);
  }
}

export async function deleteYearlyPlan(planId: string) {
  // 1. Mark as deleted locally so it never resurrects
  markPlanDeletedLocally(planId);

  // Remove from locally created set if present
  try {
    const raw = localStorage.getItem(CREATED_PLANS_KEY);
    if (raw) {
      const set = new Set(JSON.parse(raw));
      set.delete(planId);
      localStorage.setItem(CREATED_PLANS_KEY, JSON.stringify(Array.from(set)));
    }
  } catch (e) {}

  // 2. Delete from Firestore collection
  try {
    const docRef = doc(db, YEARLY_PLANS_COLLECTION, planId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Delete yearly plan error:', error);
  }
}

export async function toggleYearlyPlanFavorite(userId: string, planId: string, currentIsFav: boolean) {
  try {
    const favRef = doc(db, 'users', userId, 'plan_favorites', planId);

    if (currentIsFav) {
      await deleteDoc(favRef);
    } else {
      await setDoc(favRef, { planId, addedAt: new Date().toISOString() });
    }
  } catch (err) {
    console.warn('Toggle plan favorite error:', err);
  }
}

export function subscribeToUserPlanFavorites(userId: string, onFavorites: (favIds: string[]) => void) {
  const favCol = collection(db, 'users', userId, 'plan_favorites');
  return onSnapshot(
    favCol,
    (snapshot) => {
      const ids: string[] = [];
      snapshot.forEach((snap) => ids.push(snap.id));
      onFavorites(ids);
    },
    (err) => {
      console.warn('Plan favorites subscription error:', err);
      onFavorites([]);
    }
  );
}
