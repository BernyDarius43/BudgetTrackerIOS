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
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, { FirebaseAuthTypes, signInWithEmailAndPassword } from '@react-native-firebase/auth';
import { signUpUser, signOutUser } from '@/services/firebase/firebaseAuth';
import { router } from 'expo-router';
import api from '@/services/api';

export type AuthContextType = {
  userLoggedIn: boolean;
  isEmailUser: boolean;
  currentUser: FirebaseAuthTypes.User | null;
  setCurrentUser: (user: FirebaseAuthTypes.User | null) => void;
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
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string, confirmPassword: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  errorMessage: string;
  clearErrorMessage: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [authMongoUser, setAuthMongoUserState] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const isRegisteringRef = useRef(false);

  // ✅ Listen to Firebase auth state changes (no initialization issues!)
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
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
    const syncMongoUser = async () => {
      if (!currentUser) return;

      if (isRegisteringRef.current) {
        console.log('[Mongo] Skipping refresh during registration');
        return;
      }

      try {
        const response = await api.post('/auth/refresh');

        if (response.status === 200) {
          await setAuthMongoUser(response.data.user);
          console.log('[Mongo] Refreshed user on app start');
        }
      } catch (err: any) {
        const status = err?.response?.status;

        if (status === 404) {
          console.log('[Mongo] User not found yet (expected during onboarding)');
          return;
        }

        console.error('[Mongo] Refresh failed:', err?.message);
        await setAuthMongoUser(null);
        setErrorMessage('Failed to sync user data. Please log in again.');
      }
    };

    if (currentUser) {
      syncMongoUser();
    }
  }, [currentUser, setAuthMongoUser]);

  const loginUser = async (email: string, password: string) => {
    setErrorMessage('');
    setLoading(true);
    try {
      if (!email || !password) {
        setErrorMessage('Email and password are required.');
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth(), email, password);
      const firebaseUser = userCredential.user;
      console.log('🟢 Frontend: Firebase user logged in:', firebaseUser.uid);

      await firebaseUser.getIdToken(true);

      const res = await api.post('/auth/login');

      if (res.status === 200) {
        const mongoUser = res.data.user;
        await setAuthMongoUser(mongoUser);
        console.log('✅ Login successful');
      }
    } catch (err: any) {
      console.error('[Login] failed:', err?.message);
      setErrorMessage(err?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (email: string, password: string, confirmPassword: string) => {
    setErrorMessage('');

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password || !confirmPassword) {
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
      await signUpUser(trimmedEmail, password);

      const user = auth().currentUser;
      if (!user) {
        throw new Error('Firebase user is not available after sign up.');
      }

      await user.getIdToken(true);

      const res = await api.post('/auth/register');

      if (!res?.data?.user) {
        throw new Error('MongoDB user not returned by /auth/register.');
      }

      await setAuthMongoUser(res.data.user);
      console.log('✅ Registration successful');
    } catch (error: any) {
      const backendMsg =
        error?.response?.data?.error ||
        error?.response?.data?.detail ||
        error?.message;
      setErrorMessage(backendMsg || 'Sign up failed.');
    } finally {
      setLoading(false);
      isRegisteringRef.current = false;
    }
  };

  const logoutUser = async () => {
  setLoading(true);
  try {
    // Step 1 — hit backend logout endpoint while token is still valid
    try {
      await api.post('/auth/logout');
      console.log('[Logout] Backend logout successful');
    } catch (error) {
      // Non-critical — backend session expiry is acceptable
      console.warn('[Logout] Backend logout failed (non-critical):', error);
    }

    // Step 2 — sign out of Firebase (single call, guarded)
    if (auth().currentUser) {
      await auth().signOut();
      console.log('[Logout] Firebase logout successful');
    }

    // Step 3 — clear Mongo user from state + AsyncStorage
    await setAuthMongoUser(null);
    console.log('[Logout] Logout complete');

  } catch (error: any) {
    console.error('[Logout] Error:', error);
    setErrorMessage('Error while logging out. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const updateUserProfile = useCallback(
    async ({
      uid,
      displayName,
      email,
      photoURL,
      phoneNumber,
    }: {
      uid: string;
      displayName: string;
      email: string;
      photoURL?: string;
      phoneNumber?: string;
    }) => {
      const user = auth().currentUser;
      if (!user) return;

      // Update Firebase
      if (displayName || photoURL) {
        await user.updateProfile({
          displayName,
          photoURL,
        });
      }

      if (email && user.email !== email) {
        await user.updateEmail(email);
      }

      // Sync Mongo
      const res = await api.patch('/user/me', {
        displayName,
        photoURL,
        phoneNumber,
      });

      if (res?.data?.user) {
        await setAuthMongoUser(res.data.user);
      }
    },
    [setAuthMongoUser]
  );

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
      loginUser,
      registerUser,
      logoutUser,
      errorMessage,
      clearErrorMessage,
    }),
    [
      currentUser,
      authMongoUser,
      setAuthMongoUser,
      updateUserProfile,
      loading,
      errorMessage,
      clearErrorMessage,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};