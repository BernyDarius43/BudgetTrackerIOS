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
import {
  onAuthStateChanged,
  updateEmail,
  updateProfile,
  User,
  signOut,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { signUpUser, signInUser, signOutUser } from '@/services/firebase/firebaseAuth';
import { router } from 'expo-router';
import api, { updateMe } from '@/services/api';
import { getAuth } from 'firebase/auth';
import { app } from '@/services/firebase/firebaseConfig';

// ✅ Safe auth initialization with hot reload support
let _authInstance: ReturnType<typeof getAuth> | null = null;

function getAuthSafe() {
  if (!_authInstance) {
    _authInstance = getAuth(app);
  }
  return _authInstance;
}

// 1. Define the type for the auth context.
export type AuthContextType = {
  userLoggedIn: boolean;
  isEmailUser: boolean;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  authMongoUser: any;
  setAuthMongoUser: (user: any) => Promise<void>;
  updateUserProfile: (data: { uid: string; displayName: string; email: string, photoURL: string; phoneNumber: string }) => Promise<void>;
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string, confirmPassword:string) => Promise<void>;
  logoutUser: () =>Promise<void>;
  errorMessage: string;
  clearErrorMessage: () => void;
};

// 2. Create and export the context.
export const AuthContext = createContext<AuthContextType | null>(null);


// 3. Create a safe hook to consume the context.
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 4. AuthProvider component.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMongoUser, setAuthMongoUserState] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const isRegisteringRef = useRef(false);


  useEffect(() => {
    const auth = getAuthSafe(); // ✅ Get auth lazily
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const clearErrorMessage = useCallback(() => setErrorMessage(''), []);

  // Persist Mongo user state in AsyncStorage.
  const setAuthMongoUser = useCallback(async (userData: any): Promise<void> => {
    try {
      if (userData) {
        await AsyncStorage.setItem('mongo-user', JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem('mongo-user');
      }
      setAuthMongoUserState(userData);
    } catch (error) {
      console.error('Error saving Mongo user:', error)
      console.log('User:', JSON.stringify(userData));
    }
  }, []);

  useEffect(() => {
    const syncMongoUser = async () => {
      const auth = getAuthSafe(); // ✅ Get auth lazily
      if (!auth.currentUser) return;

      if (isRegisteringRef.current) {
  console.log('[Mongo] Skipping refresh during registration');
  return;
}

      try {
        console.log('🔥 FETCHING FROM:', process.env.EXPO_PUBLIC_API_BASE_URL);
        
        const response = await api.post('/auth/refresh')

        console.log('[Mongo] Refresh response:', response.status);
        
        if (response.status === 200) {
        await setAuthMongoUser(response.data.user);
        console.log('[Mongo] Refreshed user on app start');
      }
      } catch (err: any) {
       const status = err?.response?.status;

  // ✅ Expected during first signup: Mongo user not created yet
  if (status === 404) {
    console.log('[Mongo] User not found yet (expected during onboarding)');
    return;
  }

  // ✅ Fallback for all other failures (real problems)
  console.error('[Mongo] Refresh failed:', err?.message);
  console.error('[Mongo] Refresh payload:', err?.response?.data);
  console.error('[Mongo] Refresh status:', status);

  // Reset Mongo state because we can't trust it if refresh failed
  await setAuthMongoUser(null);

  // Optional: show a user-facing message only if it’s meaningful
  setErrorMessage('Failed to sync user data. Please log in again.');
      }
    };
  
    if (currentUser) {
      syncMongoUser();
    }
  }, [currentUser]);
  

const loginUser = async (email: string, password: string) => {
  setErrorMessage('');
  setLoading(true);
  try {
      if (!email || !password) {
        setErrorMessage('Email and password are required.');
        return;
      }
      const auth = getAuthSafe(); // ✅ Get auth lazily
      // Sign into firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log('🟢 Frontend: Firebase user logged in:', firebaseUser);

      await firebaseUser.getIdToken(true); // Force refresh

      // Call backend login endpoint (syncs lastLogin in MongoDB)
      const res = await api.post('/auth/login'); // Interceptor adds token

      if (res.status === 200) {
      const mongoUser = res.data.user;
      await setAuthMongoUser(mongoUser);
      console.log('✅ Login successful:', mongoUser);
      console.log('🟢 Frontend: Mongo user logged in:', mongoUser);

    }

/*       const mongoUserCred = await signInUser(email, password);
      if (mongoUserCred) {
        setAuthMongoUser(mongoUserCred);
        console.log('🟢 Frontend: Mongo user logged in:', mongoUserCred);
        
      } else {
        console.error("Login failed:", errorMessage);
        console.log('🟢 Frontend: Mongo user not logged in');
        
        throw new Error('MongoDB user is undefined or not logged in');
    } */
  } catch (err: any) {
    setLoading(false);
   console.error("[Login] failed:", err?.message);
  console.error("[Login] payload:", err?.response?.data);
  console.error("[Login] status:", err?.response?.status);
  setErrorMessage(err?.message || "Login failed.");
  } finally {
    setLoading(false);
  }
}

const registerUser  = async (email: string, password: string,confirmPassword: string) => {
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
            // Ensure Firebase auth state is available
            const auth = getAuthSafe(); // ✅ Get auth lazily
           if (!auth.currentUser) {
            throw new Error('Firebase user is not available after sign up.');
           }
          // 3) Create Mongo user via backend register endpoint
    // NOTE: Authorization will be attached globally by api.ts interceptor (see below).
    // We still force-refresh token once to avoid any stale token edge cases.
    await auth.currentUser.getIdToken(true);

    const res = await api.post('/auth/register');
    console.log("Response:", res);
    
     if (!res?.data?.user) {
        throw new Error('MongoDB user not returned by /auth/register.');
      }
    // Backend returns: { message, user, token }
    const mongoUser = res?.data?.user;
    if (!mongoUser) {
      throw new Error('MongoDB user not returned by /auth/register.');
    }
console.log("Mongo User:", mongoUser);
    await setAuthMongoUser(mongoUser);

    // 4) Navigate only after Mongo user is created and stored
        } catch (error: any) {
              const backendMsg =
      error?.response?.data?.error ||
      error?.response?.data?.detail ||
      error?.message;
          setErrorMessage(backendMsg || 'Sign up failed.');
        } finally {
          setLoading(false)
          isRegisteringRef.current = false;
        }
}

const logoutUser = async () => {
      setLoading(true);
  if (currentUser) {
    try {
      // STEP 1: Call backend to revoke Firebase refresh tokens
      try {
        await signOutUser(); // From your service
          console.log('[Logout] Backend logout successful (tokens revoked)');
      } catch (error) {
        // Non-critical if backend logout fails
        console.warn('[Logout] Backend logout failed (non-critical):', error);
      }
      const auth = getAuthSafe(); // ✅ Get auth lazily

      // STEP 2: Sign out of Firebase
      console.log('[Logout] Step 2: Signing out of Firebase...');
      await signOut(auth);
      console.log('[Logout] Firebase logout successful');

      // STEP 3: Clear MongoDB user from state and AsyncStorage
      try {
      console.log('[Logout] Step 3: Clearing MongoDB user...');
      await setAuthMongoUser(null);
      console.log('[Logout] Logout complete');

    } catch (error: any) {
      console.error('[Logout] Error:', error);
      setErrorMessage('Error while logging out. Please try again.');
    } finally {
      setLoading(false);
    }
    } catch (error: any) {
      console.warn('Error while login out. Please try again.(non-critical)', error);
      setErrorMessage(error)
    } finally {
      setAuthMongoUser(null)
      setLoading(false)
    }
    
  }
}

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
    const auth = getAuthSafe(); // ✅ Get auth lazily
    if (!auth.currentUser) return;

    // 1️⃣ Update Firebase
    if (displayName || photoURL) {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL,
      });
    }

    if (email && auth.currentUser.email !== email) {
      await updateEmail(auth.currentUser, email);
    }

    // 2️⃣ Sync Mongo (token already attached by api.ts)
    const res = await api.patch('/user/me', {
      displayName,
      photoURL,
      phoneNumber,
    });

    // 3️⃣ Update local Mongo state
    if (res?.data?.user) {
      await setAuthMongoUser(res.data.user);
    }
  },
  []
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
    [currentUser, 
      authMongoUser, 
      setAuthMongoUser, 
      updateUserProfile, 
      loading, 
      loginUser, 
      registerUser, 
      errorMessage, 
      logoutUser,
      clearErrorMessage,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};