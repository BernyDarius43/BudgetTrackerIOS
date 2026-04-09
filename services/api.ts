// services/api.ts
import axios, { AxiosHeaders } from 'axios';
import { auth } from '@/services/firebase/firebaseConfig';
import { getIdToken } from 'firebase/auth';

const BaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  'https://budgettrackerapi-muxo.onrender.com';

// ✅ Export this so pingServer.ts can use the ROOT url (not /api/v1)
export const normalizedBaseUrl = BaseUrl.replace(/\/$/, '');

const baseURL = normalizedBaseUrl.endsWith('/api/v1')
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api/v1`;

const api = axios.create({
  baseURL,
  timeout: 60000, // ✅ Increased from 15s to 60s to survive Render cold start
});

console.log('🌐 API baseURL:', baseURL);

api.interceptors.request.use(async (config) => {
  try {
    const user = auth.currentUser;

    if (user) {
      const token = await getIdToken(user, false); // ✅ Use cached token for better performance

      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }

      config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
  } catch (error) {
    console.error('Error attaching token:', error);
    return config;
  }
});

export default api;