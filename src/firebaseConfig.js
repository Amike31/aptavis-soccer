import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDw41QT7x0oJiFOdSRLLordYgh-msinK3Y",
  authDomain: "soccer-aptavis.firebaseapp.com",
  projectId: "soccer-aptavis",
  storageBucket: "soccer-aptavis.appspot.com",
  messagingSenderId: "853517779185",
  appId: "1:853517779185:web:a122a8fa4ed1c0f675e950",
};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export { firestore };
