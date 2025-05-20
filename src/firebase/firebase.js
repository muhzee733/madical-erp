import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGi2bl9yAPB_vfcgrWx2j7qme54CudcnQ",
  authDomain: "madical-c6fba.firebaseapp.com",
  projectId: "madical-c6fba",
  storageBucket: "madical-c6fba.appspot.com",
  messagingSenderId: "914321237715",
  appId: "1:914321237715:web:3d571947b8383f42f15626",
  measurementId: "G-LK6K6BKW8R"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { auth, db };
