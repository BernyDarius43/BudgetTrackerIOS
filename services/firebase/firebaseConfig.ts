// services/firebase/firebaseConfig.ts  
import { getApp, getApps, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize app
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// ✅ Don't import auth here at all!
export { app };

// ✅ Each file that needs auth should import it directly from firebase/auth
// import { getAuth } from 'firebase/auth';
// import { app } from './firebaseConfig';
// const auth = getAuth(app);