import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// Build firebase config from environment variables. Vite exposes env vars via import.meta.env
// The variables should be defined in a `.env` file at the project root and must be prefixed with VITE_
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Quick runtime validation (helps catch missing envs during development)
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missing = requiredKeys.filter((k) => !firebaseConfig[k]);
if (missing.length) {
  // Only warn (don't throw) because some environments (like certain CI steps) may load envs differently
  // This will help developers notice missing config when running locally.
  console.warn('Firebase config missing required keys:', missing.join(', '));
}

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore();

// Listen for auth state changes
export const onAuthStateChangedListener = (store) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Retrieve user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};

        // Commit user data to Vuex store
        store.commit('login', { 
          uid: user.uid, 
          isAdmin: userData.isAdmin,
          email: userData.email,  
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        store.commit('logout');
      }
    } else {
      store.commit('logout');
    }
  });
};

  
export default { db , auth } 