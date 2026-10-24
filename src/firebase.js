import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyqdgTHOA7WV-S1ucfTMS-ihmTqA2u6ds",
  authDomain: "trackugc.firebaseapp.com",
  projectId: "trackugc",
  storageBucket: "trackugc.firebasestorage.app",
  messagingSenderId: "499937130942",
  appId: "1:499937130942:web:cd3744cf107fb4d09d61ef"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
