import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyA4XVnskXGHIZUhG1c6jqfDBY0am_jYcTA",
  authDomain: "nehme-radiators.firebaseapp.com",
  projectId: "nehme-radiators",
  storageBucket: "nehme-radiators.firebasestorage.app",
  messagingSenderId: "370869402950",
  appId: "1:370869402950:web:60664a02e0de988511b947"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
