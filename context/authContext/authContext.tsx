// context/authContext/authContext.tsx
import { pingUntilAlive } from "@/services/pingServer";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "@/services/firebase/firebaseConfig";
import {
  User,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  getIdToken,
} from "firebase/auth";
import { signUpUser } from "@/services/firebase/firebaseAuth";
import api from "@/services/api";
import { resetPingSingleton } from "@/services/pingServer";
import {
  AuthError,
  createAuthError,
  mapFirebaseError,
} from "@/utils/AuthErrors";

export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

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
  registerUser: (
    email: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  logoutUser: () => Promise<void>;

  error: AuthError | null;
  clearError: () => void;

  themePreference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMongoUser, setAuthMongoUserState] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [serverWaking, setServerWaking] = useState<boolean>(false);
  const [error, setError] = useState<AuthError | null>(null);
const [syncUid, setSyncUid] = useState<string | null>(null);
  const isRegisteringRef = useRef(false);
  const hasSyncedRef = useRef(false);
  const prevUidRef = useRef<string | null>(null);

  const [themePreference, setThemePreferenceState] =
    useState<ThemePreference>("system");

  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(
    Appearance.getColorScheme() === "dark" ? "dark" : "light"
  );

  // ========================
  // AUTH LISTENER
  // ========================
  const setAuthMongoUser = useCallback(async (userData: any) => {
    try {
      if (userData) {
        await AsyncStorage.setItem(
          "mongo-user",
          JSON.stringify(userData)
        );
      } else {
        await AsyncStorage.removeItem("mongo-user");
      }
      setAuthMongoUserState(userData);
    } catch (e) {
      console.error("Mongo user save error:", e);
    }
  }, []);

  // ========================
// EFFECT 1 — AUTH LISTENER (synchronous only)
// ========================
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);

    if (!user) {

      setServerWaking(false);
      setLoading(false); // ← only safe setLoading here
      return;
    }

    if (user.uid !== prevUidRef.current) {
      prevUidRef.current = user.uid;
      hasSyncedRef.current = false;
      setSyncUid(user.uid); // ← this is now the ONLY thing that triggers Effect 2// ← DO NOT call api or setLoading here
      // Effect 2 below will handle this
    }
  });

  return unsubscribe;
}, []);

// ========================
// EFFECT 2 — MONGODB SYNC (async, separate from Firebase listener)
// Triggered only when the uid changes — a stable primitive, never causes loops
// ========================
useEffect(() => {
  if (!syncUid) return;
  if (hasSyncedRef.current) return;

  let cancelled = false;

  const syncMongoUser = async () => {
    setLoading(true);
    hasSyncedRef.current = true;
    try {
      const cached = await AsyncStorage.getItem('mongo-user');
      if (cached && !cancelled) {
        setAuthMongoUserState(JSON.parse(cached));
      }

      setServerWaking(true);
      const isAlive = await pingUntilAlive(6, 8000);
      setServerWaking(false);

      if (!isAlive) {
        console.warn('[AuthContext] Server did not wake — proceeding with cached data');
        return;
      }

      if (cancelled) return;

      const res = await api.post('/auth/login');

      if (!cancelled && res.status === 200 && res.data?.user) {
        await setAuthMongoUser(res.data.user);
      }
    } catch (err) {
      console.error('[AuthContext] syncMongoUser failed:', err);
      hasSyncedRef.current = false; // ← reset on failure so it can retry after explicit re-login
    } finally {
      setServerWaking(false);
      setLoading(false); // ✅ ALWAYS releases — no if(!cancelled) guard here
    }
  };

  void syncMongoUser();

  return () => { cancelled = true; };
}, [syncUid, setAuthMongoUser]); // ✅ syncUid never changes on transient nulls

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemTheme(colorScheme === "dark" ? "dark" : "light");
    });
    return () => sub.remove();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  
  const rollbackFirebaseSession = useCallback(async () => {
    try {
      if (auth.currentUser) await signOut(auth);
    } finally {
      setLoading(false);
      prevUidRef.current = null;
      hasSyncedRef.current = false;
      setServerWaking(false);
      await setAuthMongoUser(null);
    }
  }, [setAuthMongoUser]);

  // ========================
  // LOGIN
  // ========================
  const loginUser = async (email: string, password: string) => {
    setError(null);

    if (!email) {
      setError(createAuthError("Email is required.", "email", "validation"));
      return;
    }

    if (!password) {
      setError(createAuthError("Password is required.", "password", "validation"));
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await getIdToken(cred.user, false);

      /* let res = await api.post("/auth/login");

      if (res.status === 404) {
        await api.post("/auth/register");
        res = await api.post("/auth/login");
      }

      if (res.status === 200) {
        await setAuthMongoUser(res.data.user);
        hasSyncedRef.current = true; // skip redundant sync in listener
      } */
    } catch (err: any) {
      await rollbackFirebaseSession();
      setError(mapFirebaseError(err));
    }
  };

  // ========================
  // REGISTER
  // ========================
  const registerUser = async (
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError(
        createAuthError("Please fill out all fields", "general", "validation")
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        createAuthError(
          "Passwords do not match",
          "confirmPassword",
          "validation"
        )
      );
      return;
    }

    isRegisteringRef.current = true;

    try {
      const user = await signUpUser(email, password);
      await getIdToken(user, false);

      const res = await api.post("/auth/register");

      if (!res?.data?.user) {
        throw new Error("MongoDB user missing");
      }

      await setAuthMongoUser(res.data.user);
    } catch (err: any) {
      await rollbackFirebaseSession();
      setError(mapFirebaseError(err));
    } finally {
      isRegisteringRef.current = false;
    }
  };

  // ========================
  // LOGOUT
  // ========================
  // ✅ CORRECT
const logoutUser = async () => {
  hasSyncedRef.current = false;
  prevUidRef.current = null;
  setSyncUid(null);
  setLoading(true);

  try {
    try { await api.post('/auth/logout'); } catch {}
    if (auth.currentUser) await signOut(auth);
    await setAuthMongoUser(null);
    resetPingSingleton();
  } catch {
    setError(createAuthError('Error while logging out.', 'general', 'network'));
  } finally {
    setLoading(false);
  }
};
  // ========================
  // THEME
  // ========================
  const setThemePreference = useCallback(
    async (pref: ThemePreference) => {
      setThemePreferenceState(pref);

      if (authMongoUser) {
        const optimistic = {
          ...authMongoUser,
          preferences: {
            ...authMongoUser.preferences,
            theme: pref,
          },
        };
        await setAuthMongoUser(optimistic);
      }

      try {
        const res = await api.patch("/user/me", {
          preferences: { theme: pref },
        });

        if (res?.data?.user) {
          await setAuthMongoUser(res.data.user);
        }
      } catch {}
    },
    [authMongoUser, setAuthMongoUser]
  );

  const resolvedTheme: ResolvedTheme =
    themePreference === "system" ? systemTheme : themePreference;

  // ========================
  // VALUE
  // ========================
  const value = useMemo(
    () => ({
      userLoggedIn: !!currentUser,
      isEmailUser: !!currentUser?.email,
      currentUser,
      setCurrentUser,

      authMongoUser,
      setAuthMongoUser,

      updateUserProfile: async () => {},

      loading,
      serverWaking,

      loginUser,
      registerUser,
      logoutUser,

      error,
      clearError,

      themePreference,
      resolvedTheme,
      setThemePreference,
    }),
    [
      currentUser,
      authMongoUser,
      loading,
      serverWaking,
      error,
      themePreference,
      resolvedTheme,
      setThemePreference,
      clearError,
    ]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
