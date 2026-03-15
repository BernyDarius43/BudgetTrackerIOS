// services/firebase/firebaseAuth.ts
import {
  FirebaseAuthTypes,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';

export const signUpUser = async (
  email: string,
  password: string,
  displayName?: string
): Promise<FirebaseAuthTypes.User> => {
  const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
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
  const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
  return userCredential.user;
};

export const signOutUser = async (): Promise<void> => {
  await signOut(getAuth());
};
