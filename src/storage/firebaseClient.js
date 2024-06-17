import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDCSC56Rv87sCkOzh2of-hMDyqcbwaRWVA",
  authDomain: "kanbosphere-files.firebaseapp.com",
  projectId: "kanbosphere-files",
  storageBucket: "kanbosphere-files.appspot.com",
  messagingSenderId: "629989007247",
  appId: "1:629989007247:web:7ffa658f94f59662aeb5fa",
  measurementId: "G-TMZH7G0VD1",
};

let firebase_app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(firebase_app);

export { storage };
