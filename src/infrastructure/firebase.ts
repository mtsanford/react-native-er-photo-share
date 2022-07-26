import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  limit,
  DocumentSnapshot,
  Timestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPwNgAee5ywYuGdRV3okEUA4mONg8qPP0",
  authDomain: "er-react-native.firebaseapp.com",
  projectId: "er-react-native",
  storageBucket: "er-react-native.appspot.com",
  messagingSenderId: "837080953025",
  appId: "1:837080953025:web:af175092042898ad72e440",
  measurementId: "G-F394ZLCVT0",
};

export async function getUserWithUsername(username: string) {
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("username", "==", username), limit(1));
  const qs = await getDocs(q);
  const userDoc = qs.docs[0];
  return userDoc;
}

export function postToJSON(doc: DocumentSnapshot) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  };
}

export const fromMillis = Timestamp.fromMillis;

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const firestore = getFirestore();
export const storage = getStorage();
