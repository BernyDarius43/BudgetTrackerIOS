// services/api.ts
import axios, { AxiosHeaders } from 'axios';
import auth, { getAuth, getIdToken } from '@react-native-firebase/auth';
import Constants from 'expo-constants';

const baseURL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE_URL 
  || 'http://192.168.2.23:5000/api/v1';

const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use(
  async (config) => {
    const existingAuth =
      (config.headers instanceof AxiosHeaders && config.headers.get('Authorization')) ||
      (!(config.headers instanceof AxiosHeaders) && (config.headers as any)?.Authorization);

    if (existingAuth) return config;

    // ✅ Modular API — no more auth().currentUser
    const user = getAuth().currentUser;
    if (!user) {
      throw new Error('Not authenticated: Firebase user is missing.');
    }

    // ✅ Modular API — no more user.getIdToken()
    const idToken = await getIdToken(user);

    if (config.headers instanceof AxiosHeaders) {
      config.headers.set('Authorization', `Bearer ${idToken}`);
    } else {
      (config.headers as any) = {
        ...(config.headers as any),
        Authorization: `Bearer ${idToken}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

export type UpdateMePayload = {
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
};

export async function getMe() {
  const res = await api.get(`/user/me`);
  return res.data;
}

export async function updateMe(payload: UpdateMePayload) {
  const res = await api.put(`/user/me`, payload);
  return res.data;
}