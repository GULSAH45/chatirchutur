// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAWmXpzUfpD30r-pdxKsl8iYTw7nQk4rn0",
  authDomain: "lastone-43e64.firebaseapp.com",
  projectId: "lastone-43e64",
  storageBucket: "lastone-43e64.appspot.com", // <-- DÜZELTİLDİ
  messagingSenderId: "465302364666",
  appId: "1:465302364666:web:fc640b5846a83277108443"
};
// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Auth ve Firestore'u export et
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;