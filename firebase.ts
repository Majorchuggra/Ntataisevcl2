// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmJN9ShK9n1dBskehDt9y-2j4rJaZqqpE",
  authDomain: "ntataisevcl.firebaseapp.com",
  projectId: "ntataisevcl",
  storageBucket: "ntataisevcl.firebasestorage.app",
  messagingSenderId: "Y1062551857983",
  appId: "1:1062551857983:web:6b8a3083ed38a96fb1818a",
  measurementId: "G-2N6WMQJQT3"
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

// Function to update user profile in Firestore
const updateUserProfileInFirestore = async (userId: string, profileData: object) => {
  try {
    await setDoc(doc(db, "users", userId), profileData, { merge: true });
  } catch (error) {
    console.error("Error updating profile in Firestore: ", error);
  }
};

// Function to get user profile from Firestore
const getUserProfileFromFirestore = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No profile data found");
      return null;
    }
  } catch (error) {
    console.error("Error getting profile data: ", error);
    return null;
  }
};

// Export necessary functions
export { 
  auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  updateUserProfileInFirestore, 
  getUserProfileFromFirestore 
};
