import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import uploadCourses from './uploadCourses'; // Import the upload function

const Index = () => {
  useEffect(() => {
    const uploadCoursesOnce = async () => {
      try {
        // Check if the courses have already been uploaded in this session
        const coursesExist = sessionStorage.getItem('coursesUploaded');
        if (!coursesExist) {
          await uploadCourses(); // Upload the courses only once
          sessionStorage.setItem('coursesUploaded', 'true');
        }
      } catch (error) {
        console.error('Error uploading courses:', error);
      }
    };

    uploadCoursesOnce();
  }, []); // Empty dependency array means it runs once when the component mounts

  return <App />;
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <Index /> {/* The Index component now includes the useEffect */}
    </React.StrictMode>
  );
} else {
  console.error("Root element not found");
}

// Register service worker
serviceWorkerRegistration.register();

// Report web vitals
reportWebVitals(console.log);
