import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore } from 'firebase/firestore';

// Hardcoded fallback config from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyCwSTxWdACrup2elwPyZbFrlfxYY_OnBtY",
  authDomain: "community-hero-32b28.firebaseapp.com",
  projectId: "community-hero-32b28",
  storageBucket: "community-hero-32b28.firebasestorage.app",
  messagingSenderId: "100706668660",
  appId: "1:100706668660:web:3d45e7f1ca8af48b9c0121"
};

const customDatabaseId = "ai-studio-bharatone-777164b4-74d2-4930-947e-57564fb81656";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom databaseId
let db;
try {
  db = getFirestore(app, customDatabaseId);
} catch (e) {
  console.warn("Using default firestore initialization", e);
  db = getFirestore(app);
}

// Initialize Auth
const auth = getAuth(app);

export { app, auth, db };
