import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage, deleteToken } from "firebase/messaging";
import { initializeApp } from "firebase/app";

const apiKey = import.meta.env.VITE_apiKey;
const authDomain = import.meta.env.VITE_authDomain;
const projectId = import.meta.env.VITE_projectId;
const storageBucket = import.meta.env.VITE_storageBucket;
const messagingSenderId = import.meta.env.VITE_messagingSenderId;
const appId = import.meta.env.VITE_appId;
const measurementId = import.meta.env.VITE_measurementId;

const firebaseConfig = {
  apiKey:apiKey,
  authDomain:authDomain,
  projectId:projectId,
  storageBucket:storageBucket,
  messagingSenderId:messagingSenderId,
  appId:appId,
  measurementId:measurementId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const messaging = getMessaging(app);


export { auth, messaging, getToken, onMessage, deleteToken };
