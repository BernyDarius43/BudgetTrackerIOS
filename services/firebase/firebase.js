// firebase/firebase.js
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
  apiKey: "AIzaSyDi8kTDTkeUI5_YkQmM14jfk6jP8ZLXea8",
  authDomain: "budgettracker-8f9d7.firebaseapp.com",
  projectId: "budgettracker-8f9d7",
  storageBucket: "budgettracker-8f9d7.appspot.com",
  messagingSenderId: "7301608252",
  appId: "1:7301608252:web:089ba748ad4e1934c96439",
  measurementId: "G-J7KJR0B88J"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, auth };
