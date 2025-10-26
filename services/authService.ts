import { auth } from '../firebaseConfig';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { User } from '../types';

export const signUpWithEmailPassword = async (email: string, password: string): Promise<void> => {
  if (!auth) {
    console.error("Firebase Auth is not initialized.");
    throw new Error("Authentication service is not available.");
  }
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export const signInWithEmailPassword = async (email: string, password: string): Promise<void> => {
  if (!auth) {
    console.error("Firebase Auth is not initialized.");
    throw new Error("Authentication service is not available.");
  }
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};


export const signOutUser = async (): Promise<void> => {
  if (!auth) {
    console.error("Firebase Auth is not initialized.");
    return;
  }
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    console.error("Firebase Auth is not initialized.");
    callback(null);
    return () => {}; // Return an empty unsubscribe function
  }
  return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const user: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
      };
      callback(user);
    } else {
      callback(null);
    }
  });
};