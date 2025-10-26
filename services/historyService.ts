import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { HistoryItem, ActSceneHistoryItem, CharacterHistoryItem, QuizHistoryItem, DoubtSolverHistoryItem } from '../types';

type NewHistoryItem = Omit<ActSceneHistoryItem, 'id' | 'timestamp'> | Omit<CharacterHistoryItem, 'id' | 'timestamp'> | Omit<QuizHistoryItem, 'id' | 'timestamp'> | Omit<DoubtSolverHistoryItem, 'id' | 'timestamp'>;

const getHistoryRef = (uid: string) => {
    if (!db) throw new Error("Firebase is not configured.");
    return doc(db, 'histories', uid);
};

const getUserRef = (uid: string) => {
    if (!db) throw new Error("Firebase is not configured.");
    return doc(db, 'users', uid);
};


export const getHistory = async (uid: string): Promise<HistoryItem[]> => {
  if (!db) return [];
  try {
    const docSnap = await getDoc(getHistoryRef(uid));
    if (docSnap.exists()) {
      // Firestore stores items, we want to show newest first
      return (docSnap.data().items || []).reverse();
    }
    return [];
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
};

export const saveHistoryItem = async (itemData: NewHistoryItem, uid: string): Promise<void> => {
  if (!db) return;
  const newItem = {
    ...itemData,
    id: `hist-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };

  try {
    const historyRef = getHistoryRef(uid);
    // Use setDoc with merge to create the document if it doesn't exist
    await setDoc(historyRef, { 
      items: arrayUnion(newItem) 
    }, { merge: true });
  } catch (error) {
    console.error("Error saving history item:", error);
  }
};

export const clearHistory = async (uid: string): Promise<void> => {
  if (!db) return;
  try {
    // Overwrite the items array with an empty one
    await setDoc(getHistoryRef(uid), { items: [] });
  } catch (error) {
    console.error("Error clearing history:", error);
  }
};

export const saveLastScore = async (uid: string, score: number, total: number) => {
  if (!db) return;
  try {
    const userRef = getUserRef(uid);
    await setDoc(userRef, {
      lastScore: `${score}/${total}`,
      lastQuizTimestamp: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    console.error("Error saving last score:", error);
  }
};

export const getLastScore = async (uid: string): Promise<string | null> => {
  if (!db) return null;
  try {
    const docSnap = await getDoc(getUserRef(uid));
    if (docSnap.exists()) {
      return docSnap.data().lastScore || null;
    }
    return null;
  } catch (error) {
    console.error("Error fetching last score:", error);
    return null;
  }
};