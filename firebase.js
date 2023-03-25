import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAwPhAdN4jKYYBHskCZdf9WOC4hHxmBArU",
  authDomain: "twitter-mitosis.firebaseapp.com",
  projectId: "twitter-mitosis",
  storageBucket: "twitter-mitosis.appspot.com",
  messagingSenderId: "35772466114",
  appId: "1:35772466114:web:514b6534d20ef4f0d8cc5b",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage };