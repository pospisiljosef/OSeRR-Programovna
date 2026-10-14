import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile,
  signInAnonymously
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase/config';
import { updateAuthorInfoOnExistingPrograms } from '../firebase/programService';

export interface ScoutUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  firstName?: string;
  nickname?: string;
  lastName?: string;
  unitName?: string;
  centerName?: string;
  photoURL?: string | null;
  isGuest?: boolean;
}

export function formatScoutName(
  firstName?: string, 
  nickname?: string, 
  lastName?: string, 
  fallback?: string | null
): string {
  let f = firstName?.trim() || '';
  const n = nickname?.trim() || '';
  let l = lastName?.trim() || '';

  // If first and last names are empty, extract them from fallback if available (e.g. Google displayName "Josef Pospíšil")
  if (!f && !l && fallback) {
    const cleaned = fallback.replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
    const parts = cleaned.split(' ');
    if (parts.length > 1) {
      f = parts[0];
      l = parts.slice(1).join(' ');
    } else if (parts.length === 1 && parts[0]) {
      f = parts[0];
    }
  }

  if (f && n && l) {
    return `${f} (${n}) ${l}`;
  }
  if (f && n && !l) {
    return `${f} (${n})`;
  }
  if (!f && n && l) {
    return `(${n}) ${l}`;
  }
  if (f && l && !n) {
    return `${f} ${l}`;
  }
  if (n) {
    return `(${n})`;
  }
  if (f) {
    return f;
  }
  return fallback || 'Skautský vedoucí';
}

interface AuthContextType {
  currentUser: ScoutUser | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string, unitName?: string) => Promise<void>;
  fastScoutLogin: (nickname: string, email: string, unitName?: string) => Promise<void>;
  updateUserProfile: (profile: {
    firstName?: string;
    nickname?: string;
    lastName?: string;
    unitName?: string;
    centerName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_CUSTOM_USER_KEY = 'skautska_programovna_custom_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<ScoutUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to load profile from Firestore or local storage
  const loadExtendedProfile = async (uid: string, baseUser: Partial<ScoutUser>): Promise<ScoutUser> => {
    let extended: any = {};
    const localProfileKey = `scout_ext_profile_${uid}`;
    try {
      const localSaved = localStorage.getItem(localProfileKey);
      if (localSaved) {
        extended = JSON.parse(localSaved);
      }
    } catch (e) {}

    // Global profile fallback so unit, center, nickname are never lost across sessions
    try {
      const globalSaved = localStorage.getItem('scout_global_profile');
      if (globalSaved) {
        const parsedGlobal = JSON.parse(globalSaved);
        extended = { ...parsedGlobal, ...extended };
      }
    } catch (e) {}

    try {
      const userDocRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        extended = { ...extended, ...data };
      }
    } catch (e) {
      // offline or no permissions yet
    }

    const firstName = extended.firstName || baseUser.firstName || '';
    const nickname = extended.nickname || baseUser.nickname || '';
    const lastName = extended.lastName || baseUser.lastName || '';
    const unitName = extended.unitName || baseUser.unitName || '';
    const centerName = extended.centerName || baseUser.centerName || '';

    const formattedName = formatScoutName(firstName, nickname, lastName, baseUser.displayName);

    return {
      uid,
      email: baseUser.email || null,
      displayName: formattedName,
      firstName,
      nickname,
      lastName,
      unitName,
      centerName,
      photoURL: baseUser.photoURL || null,
      isGuest: baseUser.isGuest || false
    };
  };

  useEffect(() => {
    const savedCustomUser = localStorage.getItem(LOCAL_STORAGE_CUSTOM_USER_KEY);
    let localUserObj: ScoutUser | null = null;
    if (savedCustomUser) {
      try {
        localUserObj = JSON.parse(savedCustomUser);
      } catch (e) {
        console.error('Failed to parse saved scout user', e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Try parsing first/last name from google displayName if available
        let defaultFirst = '';
        let defaultLast = '';
        if (firebaseUser.displayName) {
          const parts = firebaseUser.displayName.split(' ');
          if (parts.length > 1) {
            defaultFirst = parts[0];
            defaultLast = parts.slice(1).join(' ');
          } else {
            defaultFirst = firebaseUser.displayName;
          }
        }

        const resolvedUser = await loadExtendedProfile(firebaseUser.uid, {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Skautský vedoucí',
          photoURL: firebaseUser.photoURL,
          isGuest: firebaseUser.isAnonymous,
          firstName: defaultFirst,
          lastName: defaultLast,
          unitName: localUserObj?.unitName,
          centerName: localUserObj?.centerName
        });
        setCurrentUser(resolvedUser);
      } else if (localUserObj) {
        const resolvedUser = await loadExtendedProfile(localUserObj.uid, localUserObj);
        setCurrentUser(resolvedUser);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const loginWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      localStorage.removeItem(LOCAL_STORAGE_CUSTOM_USER_KEY);
    } catch (err: any) {
      console.error('Google Sign-in failed', err);
      setError(err?.message || 'Přihlášení přes Google se nezdařilo.');
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      localStorage.removeItem(LOCAL_STORAGE_CUSTOM_USER_KEY);
    } catch (err: any) {
      console.warn('Email sign-in via Firebase Auth returned:', err.code);
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/configuration-not-found') {
        const nickname = email.split('@')[0];
        await fastScoutLogin(nickname, email);
        return;
      }
      setError(
        err.code === 'auth/user-not-found'
          ? 'Účet s tímto e-mailem nebyl nalezen. Zvolte prosím novou registraci.'
          : err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
          ? 'Nesprávné heslo nebo e-mail.'
          : err.message || 'Přihlášení se nezdařilo.'
      );
      throw err;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string, unitName?: string) => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });
      const userObj: ScoutUser = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name,
        unitName: unitName || ''
      };
      setCurrentUser(userObj);
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_USER_KEY, JSON.stringify(userObj));
    } catch (err: any) {
      console.warn('Email register via Firebase Auth returned:', err.code);
      if (err.code === 'auth/operation-not-allowed' || err.code === 'auth/configuration-not-found') {
        await fastScoutLogin(name, email, unitName);
        return;
      }
      setError(
        err.code === 'auth/email-already-in-use'
          ? 'Tento e-mail je již zaregistrován. Zkuste se přihlásit.'
          : err.code === 'auth/weak-password'
          ? 'Heslo musí mít alespoň 6 znaků.'
          : err.message || 'Registrace se nezdařila.'
      );
      throw err;
    }
  };

  const fastScoutLogin = async (nickname: string, email: string, unitName?: string) => {
    setError(null);
    try {
      let uid = 'scout_' + Math.random().toString(36).substring(2, 10);
      try {
        const anon = await signInAnonymously(auth);
        uid = anon.user.uid;
      } catch (e) {}

      const formatted = nickname.trim();
      const scoutUser: ScoutUser = {
        uid,
        email: email.trim().toLowerCase(),
        displayName: formatted,
        nickname: formatted,
        unitName: unitName?.trim() || '',
        centerName: '',
        isGuest: false
      };
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_USER_KEY, JSON.stringify(scoutUser));
      setCurrentUser(scoutUser);
    } catch (err: any) {
      console.error('Fast scout login error:', err);
      setError('Nepodařilo se přihlásit.');
    }
  };

  const updateUserProfile = async (profile: {
    firstName?: string;
    nickname?: string;
    lastName?: string;
    unitName?: string;
    centerName?: string;
  }) => {
    if (!currentUser) return;

    const firstName = profile.firstName?.trim() || '';
    const nickname = profile.nickname?.trim() || '';
    const lastName = profile.lastName?.trim() || '';
    const unitName = profile.unitName?.trim() || '';
    const centerName = profile.centerName?.trim() || '';

    const newDisplayName = formatScoutName(firstName, nickname, lastName, currentUser.displayName);

    const updatedUser: ScoutUser = {
      ...currentUser,
      displayName: newDisplayName,
      firstName,
      nickname,
      lastName,
      unitName,
      centerName
    };

    setCurrentUser(updatedUser);

    // Save locally
    const localProfileKey = `scout_ext_profile_${currentUser.uid}`;
    localStorage.setItem(localProfileKey, JSON.stringify(profile));
    localStorage.setItem('scout_global_profile', JSON.stringify({
      firstName,
      nickname,
      lastName,
      unitName,
      centerName,
      displayName: newDisplayName
    }));

    const savedCustomUser = localStorage.getItem(LOCAL_STORAGE_CUSTOM_USER_KEY);
    if (savedCustomUser) {
      localStorage.setItem(LOCAL_STORAGE_CUSTOM_USER_KEY, JSON.stringify(updatedUser));
    }

    // Update in Firebase Auth if available
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: newDisplayName });
      } catch (e) {}

      // Update in Firestore /users/{uid}
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(userDocRef, {
          email: currentUser.email || '',
          displayName: newDisplayName,
          firstName,
          nickname,
          lastName,
          unitName,
          centerName,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.warn('Could not sync user profile to firestore:', e);
      }
    }

    // Also update all programs authored by this user
    try {
      await updateAuthorInfoOnExistingPrograms(
        currentUser.uid, 
        newDisplayName, 
        unitName, 
        centerName,
        currentUser.email
      );
    } catch (e) {
      console.warn('Could not sync author info to existing programs:', e);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_CUSTOM_USER_KEY);
      await signOut(auth);
      setCurrentUser(null);
    } catch (err: any) {
      console.error('Logout error:', err);
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        fastScoutLogin,
        updateUserProfile,
        logout,
        error,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
