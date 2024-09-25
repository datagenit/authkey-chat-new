import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDGr-in8FtdNdYXNyMv4vkNJAioFc7WttM",
  authDomain: "authkey-34c7a.firebaseapp.com",
  databaseURL: "https://authkey-34c7a-default-rtdb.firebaseio.com",
  projectId: "authkey-34c7a",
  storageBucket: "authkey-34c7a.appspot.com",
  messagingSenderId: "579740271342",
  appId: "1:579740271342:web:bfc2c14dc9c72dd75469ff"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const realtimeDB = getDatabase(app);
export const db = getFirestore();
export const messaging = getMessaging(app);