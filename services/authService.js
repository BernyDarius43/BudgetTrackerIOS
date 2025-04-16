import { createUser, signInUser } from '@/services/firebase/auth';
import instance from './api'; // use the centralized Axios instance
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = '/api/v1/auth';

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInUser(email, password);
    const idToken = await userCredential.user.getIdToken();
    const firebaseUid = userCredential.user.uid;

    await AsyncStorage.setItem('firebaseToken', JSON.stringify(idToken));
    await AsyncStorage.setItem('currentFbUser', JSON.stringify(userCredential.user));

    const response = await instance.post(
      `${BASE_URL}/login`,
      { email: userCredential.user.email, firebaseUid },
      { headers: { Authorization: `Bearer ${idToken}` } }
    );

    if (response.data?.user) {
      await AsyncStorage.setItem('MongoUser', JSON.stringify(response.data.user));
      await AsyncStorage.setItem('mongoToken', JSON.stringify(response.data.token));
      return response.data;
    } else {
      throw new Error('MongoDB login failed: User data not found in response');
    }
  } catch (error) {
    console.error('Error logging in:', error.message);
    throw error;
  }
};

export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUser(email, password);
    const idToken = await userCredential.user.getIdToken();

    const response = await instance.post(
      `${BASE_URL}/register`,
      { firebaseUid: userCredential.user.uid, email: userCredential.user.email },
      { headers: { Authorization: `Bearer ${idToken}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error registering:', error.message);
    throw error;
  }
};
