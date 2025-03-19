import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import coursesData from "./cleaned_courses.json"; // Ensure the path is correct

// Firebase config
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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to upload courses
const uploadCourses = async () => {
  const coursesRef = collection(db, "courses");

  try {
    for (const course of coursesData) {
      await addDoc(coursesRef, {
        title: course.title,
        summary: course.summary,
        course_type: course.course_type,
        level: course.Level,
        subject: course.subject,
        price: course.price,
        course_url: course.course_url,
      });
    }
    console.log("✅ Course data uploaded successfully!");
  } catch (error) {
    console.error("❌ Error uploading courses: ", error);
  }
};

// Export the function without calling it
export default uploadCourses;
