import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCcGu0TlPtWwy58ergMiODF6_EU5dpC2E0",
  authDomain: "yummy-a131f.firebaseapp.com",
  projectId: "yummy-a131f",
  storageBucket: "yummy-a131f.firebasestorage.app",
  messagingSenderId: "694920445363",
  appId: "1:694920445363:web:17f6a4373b285038185fc6",
  measurementId: "G-Q987V5X6KQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
