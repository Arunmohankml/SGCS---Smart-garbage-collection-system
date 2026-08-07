import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function requires(userFacingName: string, value?: string): void {
  if (!value) {
    throw new Error(
      `Firebase ${userFacingName} missing. Copy .env.example to .env.local (NEXT_PUBLIC_FIREBASE_*).`
    );
  }
}

export function getFirebaseApp() {
  requires("config", firebaseConfig.apiKey);
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Lazy getMessaging (messaging must run client-side only — FCM service worker).
export function getFirebaseMessaging() {
  const { getMessaging } = require("firebase/messaging");
  return getMessaging(getFirebaseApp());
}