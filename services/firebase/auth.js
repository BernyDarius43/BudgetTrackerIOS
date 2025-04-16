// firebase/auth.js
import { 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail, 
    signInWithEmailAndPassword, 
    // signInWithPopup,  <-- not supported in React Native
    signOut, 
    updatePassword 
  } from 'firebase/auth';
  import { auth } from './firebase';
  
  // For React Native, you’ll need to implement a native-compatible Google Sign-In flow.
  // For now, we remove signInWithPopup.
  export const createUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = userCredential.user.getIdToken();
      return { user: userCredential.user, token };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };
  
  export const signInUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = userCredential.user.getIdToken();
      return { user: userCredential.user, token };
    } catch (error) {
      console.error('Error signing in user:', error);
      throw error;
    }
  };
  
  export const signOutUser = async () => {
    try {
      return await signOut(auth);
    } catch (error) {
      console.error('Error signing out user:', error);
      throw error;
    }
  };
  
  export const passwordReset = async (email) => {
    try {
      return await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };
  
  export const passwordUpdate = async (password) => {
    try {
      return await updatePassword(auth.currentUser, password);
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };
  
  // If using email verification, consider adjusting deep-link URLs for mobile.
  export const sendEmailVerification = async () => {
    try {
      // Replace window.location.origin with an appropriate deep link or remove it.
      return await sendEmailVerification(auth.currentUser, {
        url: 'yourapp://home',
      });
    } catch (error) {
      console.error('Error sending email verification:', error);
      throw error;
    }
  };
  