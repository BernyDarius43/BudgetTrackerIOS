import axios, { AxiosHeaders } from 'axios';
import { getAuth, getIdToken } from 'firebase/auth';
import Constants from 'expo-constants';
import { app } from '@/services/firebase/firebaseConfig';

// Get auth when the module loads (after app is initialized)
const auth = (() => {
  try {
    return getAuth(app);
  } catch (e) {
    console.warn('[api.ts] Auth init warning, retrying...', e);
    return getAuth(app);
  }
})();

const baseURL = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE_URL 
  || 'http://192.168.2.23:5000/api/v1';

const api = axios.create({
  baseURL,
  timeout: 15000,
});

// 🔐 Attach Firebase ID token to every request
api.interceptors.request.use(async (config) => {
// If caller already set Authorization, keep it
    const existingAuth =
      (config.headers instanceof AxiosHeaders && config.headers.get('Authorization')) ||
      (! (config.headers instanceof AxiosHeaders) && (config.headers as any)?.Authorization);

    if (existingAuth) return config;

    const user = auth.currentUser;
    if (!user) {
      throw new Error('Not authenticated: Firebase user is missing (blocked API request).');
    }

    const idToken = await user.getIdToken();

    // ✅ Axios v1-safe header set
    if (config.headers instanceof AxiosHeaders) {
      config.headers.set('Authorization', `Bearer ${idToken}`);
    } else {
      // In some environments headers may be a plain object
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

// ----------------------------
// User endpoints
// ----------------------------
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