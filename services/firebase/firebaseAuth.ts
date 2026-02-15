// services/firebase/firebaseAuth.ts
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  User,
  getAuth 
} from 'firebase/auth';
import { app } from '@/services/firebase/firebaseConfig';

// ✅ Lazy auth initialization - don't call getAuth at module load
let _auth: ReturnType<typeof getAuth> | null = null;

function getAuthInstance() {
  if (!_auth) {
    try {
      _auth = getAuth(app);
      console.log('✅ [firebaseAuth] Auth initialized lazily');
    } catch (e) {
      console.warn('[firebaseAuth] Auth init warning, retrying...', e);
      _auth = getAuth(app);
    }
  }
  return _auth;
}

export const signUpUser = async (
  email: string,
  password: string,
  displayName?: string
): Promise<User> => {
  const auth = getAuthInstance(); // ✅ Get auth lazily
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  if (displayName) {
    await updateProfile(user, { displayName });
  }

  return user;
};

export const signInUser = async (
  email: string,
  password: string
): Promise<User> => {
  const auth = getAuthInstance(); // ✅ Get auth lazily
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signOutUser = async (): Promise<void> => {
  const auth = getAuthInstance(); // ✅ Get auth lazily
  await signOut(auth);
};