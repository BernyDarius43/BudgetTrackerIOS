// context/authContext/authContext.tsx

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '@/services/firebase/firebaseConfig';
import {
  User,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getIdToken,
} from 'firebase/auth';
import { signUpUser } from '@/services/firebase/firebaseAuth';
import api from '@/services/api';
import { pingUntilAlive, resetPingSingleton } from '@/services/pingServer';

export type AuthContextType = {
  userLoggedIn: boolean;
  isEmailUser: boolean;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  authMongoUser: any;
  setAuthMongoUser: (user: any) => Promise<void>;
  updateUserProfile: (data: {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;
    phoneNumber?: string;
  }) => Promise<void>;
  loading: boolean;
  serverWaking: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string, confirmPassword: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  errorMessage: string;
  clearErrorMessage: () => void;
  themePreference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
};

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMongoUser, setAuthMongoUserState] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [serverWaking, setServerWaking] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const isRegisteringRef = useRef(false);

  // ✅ Guard lives OUTSIDE the async function so it is checked synchronously
  // before any await, closing the race-condition window entirely.
  const hasSyncedRef = useRef(false);
  const prevUidRef = useRef<string | null>(null);

  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(
    Appearance.getColorScheme() === 'dark' ? 'dark' : 'light'
  );

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log('[AUTH] state changed, uid:', user?.uid, 'prevUid:', prevUidRef.current);
      // When signed out, we can stop loading immediately.
      if (!user) {
        prevUidRef.current = null;
        hasSyncedRef.current = false;
        setAuthMongoUserState(null);
        setServerWaking(false);
        setLoading(false);
        return;
      }

      if (user.uid !== prevUidRef.current) {
      prevUidRef.current = user.uid;
      hasSyncedRef.current = false;
      setLoading(true);
    }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme === 'dark' ? 'dark' : 'light');
    });
    return () => subscription.remove();
  }, []);

  const clearErrorMessage = useCallback(() => setErrorMessage(''), []);

  const setAuthMongoUser = useCallback(async (userData: any): Promise<void> => {
    try {
      if (userData) {
        await AsyncStorage.setItem('mongo-user', JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem('mongo-user');
      }
      setAuthMongoUserState(userData);
    } catch (error) {
      console.error('Error saving Mongo user:', error);
    }
  }, []);

  useEffect(() => {
    const preference = authMongoUser?.preferences?.theme;
    if (preference === 'light' || preference === 'dark' || preference === 'system') {
      setThemePreferenceState(preference);
    } else {
      setThemePreferenceState('system');
    }
  }, [authMongoUser?.preferences?.theme]);

  const setThemePreference = useCallback(
    async (preference: ThemePreference): Promise<void> => {
      setThemePreferenceState(preference);

      if (authMongoUser) {
        const optimisticUser = {
          ...authMongoUser,
          preferences: { ...(authMongoUser.preferences || {}), theme: preference },
        };
        await setAuthMongoUser(optimisticUser);
      }

      try {
        const res = await api.patch('/user/me', { preferences: { theme: preference } });
        if (res?.data?.user) await setAuthMongoUser(res.data.user);
      } catch (error) {
        console.warn('[Theme] Failed to persist preference:', error);
      }
    },
    [authMongoUser, setAuthMongoUser]
  );

  // 🔄 Sync Mongo user — ping guard is SYNCHRONOUS to prevent race conditions.
  // pingUntilAlive() is also a singleton so repeated calls are harmless.
  useEffect(() => {
    // ── Synchronous guards ──────────────────────────────────────────────────
    // Checked BEFORE any async work so that even if this effect fires
    // multiple times (token refresh, StrictMode, etc.) only one sync runs.
    if (!currentUser) return;
    if (isRegisteringRef.current) return;
    if (hasSyncedRef.current) return;

    hasSyncedRef.current = true; // ← set synchronously, before first await

    const syncMongoUser = async () => {
      try {
        // Keep the LoadingGate skeleton up while we wake the server + hydrate
        setLoading(true);
        setServerWaking(true);
        const isAlive = await pingUntilAlive(6, 8000);
        setServerWaking(false);

        if (!isAlive) {
          setErrorMessage('Server is unavailable. Please try again later.');
          return;
        }

        const response = await api.post('/auth/refresh');
        if (response.status === 200) {
          await setAuthMongoUser(response.data.user);
        }
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404) return; // expected during onboarding
        await setAuthMongoUser(null);
        setErrorMessage('Failed to sync user data. Please log in again.');
      } finally {
        setServerWaking(false);
        // Whatever happened, unblock the UI after the initial refresh attempt.
        setLoading(false);
      }
    };

    syncMongoUser();
  }, [currentUser?.uid, setAuthMongoUser]);

  const loginUser = async (email: string, password: string) => {
    setErrorMessage('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      await getIdToken(firebaseUser, false);

      let res = await api.post('/auth/login');
      if (res.status === 404) {
        await api.post('/auth/register');
        res = await api.post('/auth/login');
      }
      if (res.status === 200) await setAuthMongoUser(res.data.user);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (email: string, password: string, confirmPassword: string) => {
    setErrorMessage('');

    if (!email || !password || !confirmPassword) {
      setErrorMessage('Please fill out all fields');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    isRegisteringRef.current = true;

    try {
      const user = await signUpUser(email, password);
      await getIdToken(user, false);
      const res = await api.post('/auth/register');
      if (!res?.data?.user) throw new Error('MongoDB user not returned.');
      await setAuthMongoUser(res.data.user);
    } catch (error: any) {
      setErrorMessage(error?.message || 'Sign up failed.');
    } finally {
      setLoading(false);
      isRegisteringRef.current = false;
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      try { 
      await api.post('/auth/logout'); 
    } catch (logoutErr) {
      // Server may be asleep — this is safe to ignore but log for debugging
      console.warn('[Logout] Backend logout call failed (safe to ignore):');
    }
      if (auth.currentUser) await signOut(auth);
      await setAuthMongoUser(null);
      resetPingSingleton();          // allow re-ping on next login
    } catch {
      setErrorMessage('Error while logging out.');
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = useCallback(
    async ({ displayName, photoURL }: any) => {
      const user = auth.currentUser;
      if (!user) return;
      const res = await api.patch('/user/me', { displayName, photoURL });
      if (res?.data?.user) await setAuthMongoUser(res.data.user);
    },
    [setAuthMongoUser]
  );

  const resolvedTheme: ResolvedTheme =
    themePreference === 'system' ? systemTheme : themePreference;

  const value = useMemo(
    () => ({
      userLoggedIn: !!currentUser,
      isEmailUser: !!currentUser?.email,
      currentUser,
      setCurrentUser,
      authMongoUser,
      setAuthMongoUser,
      updateUserProfile,
      loading,
      serverWaking,
      loginUser,
      registerUser,
      logoutUser,
      errorMessage,
      clearErrorMessage,
      themePreference,
      resolvedTheme,
      setThemePreference,
    }),
    [
      currentUser,
      authMongoUser,
      setAuthMongoUser,
      updateUserProfile,
      loading,
      serverWaking,
      errorMessage,
      clearErrorMessage,
      themePreference,
      resolvedTheme,
      setThemePreference,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
