import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth } from "firebase/auth";

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
// Check if a real key is provided
const isConfigured = Boolean(
  apiKey &&
  apiKey !== "your_firebase_api_key_here" &&
  apiKey.trim().length > 10
);

const firebaseConfig = {
  apiKey: apiKey || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } catch (err) {
    console.warn("Firebase initialization skipped or failed:", err);
  }
}

let analytics: any = null;
if (typeof window !== "undefined" && app && firebaseConfig.measurementId) {
  isSupported().then((supported) => {
    if (supported && app) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Ignore analytics init failure
  });
}

export const loginWithGoogle = async () => {
  if (!auth || !googleProvider) {
    console.info("Using simulated login because Firebase credentials are not configured.");
    return {
      displayName: "Citizen User",
      email: "citizen@example.gov.in",
      phoneNumber: "+91 9876543210"
    };
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error("Error signing in with Google:", error);
    if (error?.code === 'auth/unauthorized-domain') {
      const err = new Error(
        `Firebase Error: '${window.location.hostname}' is not in your Firebase Authorized Domains. Add it in Firebase Console > Authentication > Settings > Authorized domains.`
      );
      (err as any).code = 'auth/unauthorized-domain';
      throw err;
    }
    throw error;
  }
};

export const logout = async () => {
  if (auth) {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }
};

export { app, analytics, auth };
