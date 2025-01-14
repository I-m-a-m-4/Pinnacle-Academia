// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAZXD4vB8amVCVy6o-EQ1Rtf_8n2Xkiic",
  authDomain: "pinnacle-academia.firebaseapp.com",
  projectId: "pinnacle-academia",
  storageBucket: "pinnacle-academia.firebasestorage.app",
  messagingSenderId: "706381555175",
  appId: "1:706381555175:web:0753a717f0e17950aa0942",
  measurementId: "G-CN6RBP5BM8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };