import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCUq3EB2RdW_fYadrGbv3UQSg4Ncl5uS84",
  authDomain: "julius-caesar-27ea0.firebaseapp.com",
  projectId: "julius-caesar-27ea0",
  storageBucket: "julius-caesar-27ea0.appspot.com",
  messagingSenderId: "360150621061",
  appId: "1:360150621061:web:a95dbc2a88c07d252ec2ec",
};

// Check if the essential Firebase config value is present.
// This allows the app to still show the setup guide if the config is removed later.
export const isFirebaseConfigured = !!firebaseConfig.apiKey;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Initialize Firebase only if the configuration is provided
if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (e) {
    console.error("Firebase initialization failed. Please check your configuration values.", e);
  }
} else {
  console.warn("Firebase configuration is missing. Please add your Firebase project credentials to enable authentication and database features.");
}

export { app, auth, db };