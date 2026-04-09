// services/firebase/firebaseAuth.ts

import { auth } from './firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';

export const signUpUser = async (
  email: string,
  password: string,
  displayName?: string
): Promise<User> => {
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
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};