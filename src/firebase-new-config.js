import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

// import { getAnalytics } from "firebase/analytics";


console.log(import.meta.env.PROD);

const isProdMode = import.meta.env.PROD;

console.log(isProdMode);

console.log(import.meta.env.VITE_NO);





const firebaseConfig =
  isProdMode
    ?
    {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY_PROD,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_PROD,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_PROD,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_PROD,
      messagingSenderId: import.meta.env
        .VITE_FIREBASE_MESSAGING_SENDER_ID_PROD,
      appId: import.meta.env.VITE_FIREBASE_APP_ID_PROD,
    }: {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY_DEV,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_DEV,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_DEV,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_DEV,
        messagingSenderId: import.meta.env
          .VITE_FIREBASE_MESSAGING_SENDER_ID_DEV,
        appId: import.meta.env.VITE_FIREBASE_APP_ID_DEV,
      }

console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
