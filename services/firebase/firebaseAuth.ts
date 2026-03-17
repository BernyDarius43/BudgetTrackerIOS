// services/firebase/firebaseAuth.ts
import auth, {
  FirebaseAuthTypes,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';

export const signUpUser = async (
  email: string,
  password: string,
  displayName?: string
): Promise<FirebaseAuthTypes.User> => {
  const userCredential = await createUserWithEmailAndPassword(auth(), email, password);
  const user = userCredential.user;

  if (displayName) {
    await user.updateProfile({ displayName });
  }

  return user;
};

export const signInUser = async (
  email: string,
  password: string
): Promise<FirebaseAuthTypes.User> => {
  const userCredential = await signInWithEmailAndPassword(auth(), email, password);
  return userCredential.user;
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth());
};
