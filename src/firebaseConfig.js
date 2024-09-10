import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD3BowOCwKYeULrH5lHBra8zFFIqO59B4k",
  authDomain: "cinematch-23c74.firebaseapp.com",
  projectId: "cinematch-23c74",
  storageBucket: "cinematch-23c74.appspot.com",
  messagingSenderId: "183013453699",
  appId: "1:183013453699:web:2bef42f81b3a7b2d6950b6",
  measurementId: "G-2L1C7RY4WY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

