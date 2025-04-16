import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  onAuthStateChanged,
  updateEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import { auth } from '@/services/firebase/firebase';
import { createUser, signInUser } from '@/services/firebase/auth';
import { router } from 'expo-router';
// 1. Define the type for the auth context.
export type AuthContextType = {
  userLoggedIn: boolean;
  isEmailUser: boolean;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  authMongoUser: any;
  setAuthMongoUser: (user: any) => Promise<void>;
  updateUserProfile: (data: { uid: string; displayName: string; email: string }) => Promise<void>;
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string, confirmPassword:string) => Promise<void>;
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
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [isEmailUser, setIsEmailUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSigningIn, setIsSigningIn] = useState<boolean>(true);
  const [isRegistering, setIsRegistering] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setUserLoggedIn(!!user);
      setIsEmailUser(!!user?.email);
      setLoading(false);
      console.log('Auth state updated:', user, 'loading:', loading);
    });
    return () => unsubscribe();
  }, []);

  // Persist Mongo user state in AsyncStorage.
  const setAuthMongoUser = useCallback(async (userData: any): Promise<void> => {
    try {
      if (userData) {
        await AsyncStorage.setItem('budgettracker-mongo-user', JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem('budgettracker-mongo-user');
      }
      setAuthMongoUserState(userData);
    } catch (error) {
      console.error('Error saving Mongo user:', error);
    }
  }, []);

const loginUser = async (email: string, password: string) => {
  setErrorMessage('');
  setLoading(true); 
  try {
    if (!isSigningIn) {
      setIsSigningIn(true);
      if (!email || !password) {
        setErrorMessage('Email and password are required.');
        return;
      }
      const mongoUserCred = await signInUser(email, password);
      if (mongoUserCred) {
        setAuthMongoUser(mongoUserCred);
        setUserLoggedIn(true);
        router.replace('/(tabs)/home-user');
      } else {
        console.error("Login failed:", errorMessage);
        throw new Error('MongoDB user is undefined');
      }
      setIsSigningIn(false);
    }
  } catch (err) {
    setIsSigningIn(false);
    setErrorMessage('Login failed. Please check your credentials.');
    console.error('Login failed:', err);
  } finally {
    setIsSigningIn(false)
    setLoading(false);
  }
}

const registerUser  = async (email: string, password: string,confirmPassword: string) => {
    setErrorMessage('');
    setLoading(true); 
    if (!email || !password || !confirmPassword) {
          setErrorMessage('Please fill out all fields');
          return;
        }
    
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match');
          return;
        }
    
        try {
          setIsRegistering(true);
          if (!authMongoUser) {
            await createUser(email, password);
          router.replace('/(tabs)/home-user'); 
          }
        } catch (error) {
          setErrorMessage('An unexpected error occurred');
        } finally {
          setIsRegistering(false);
          setLoading(false)
        }
}

  // Update Firebase user profile and local state.
  const updateUserProfile = useCallback(
    async ({ uid, displayName, email }: { uid: string; displayName: string; email: string }): Promise<void> => {
      if (!auth.currentUser) return;
      if (displayName) await updateProfile(auth.currentUser, { displayName });
      if (email && auth.currentUser.email !== email) await updateEmail(auth.currentUser, email);
      setCurrentUser((prev) => (prev ? { ...prev, displayName, email } as User : null));
    },
    []
  );

  const value = useMemo(
    () => ({
      userLoggedIn,
      isEmailUser,
      currentUser,
      setCurrentUser,
      authMongoUser,
      setAuthMongoUser,
      updateUserProfile,
      loading,
      loginUser,
      registerUser
    }),
    [userLoggedIn, isEmailUser, currentUser, authMongoUser, setAuthMongoUser, updateUserProfile, loading,loginUser,registerUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

