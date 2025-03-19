import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, CardActionArea, Box, CircularProgress, Button, Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AccountCircle, Assessment, Dashboard as DashboardIcon } from "@mui/icons-material";
import { db, auth } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<any>({});
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default recommendations to show when profile is incomplete
  const defaultRecommendations = [
    {
      title: "Introduction to Data Science",
      summary: "Learn the basics of data science including data visualization and machine learning.",
      subject: "Data Science",
      level: "Beginner",
      course_type: "Online",
      price: "Free",
      course_url: "https://example.com/data-science",
      rating: 4.5
    },
    {
      title: "Web Development for Beginners",
      summary: "Understand web development fundamentals with hands-on projects.",
      subject: "Web Development",
      level: "Beginner",
      course_type: "Online",
      price: "$50",
      course_url: "https://example.com/web-development",
      rating: 4.0
    },
    {
      title: "Introduction to Machine Learning",
      summary: "Explore machine learning techniques and build your first model.",
      subject: "Machine Learning",
      level: "Intermediate",
      course_type: "Online",
      price: "$75",
      course_url: "https://example.com/machine-learning",
      rating: 5.0
    }
  ];

  // Personalized recommendations to show when profile is complete
  const personalizedRecommendations = [
    {
      title: "Advanced Data Analytics",
      summary: "Dive deeper into data analysis and advanced techniques in Python.",
      subject: "Data Science",
      level: "Advanced",
      course_type: "Online",
      price: "$100",
      course_url: "https://example.com/advanced-data-analytics",
      rating: 4.8
    },
    {
      title: "Full Stack Web Development",
      summary: "Learn how to build full-stack web applications using React, Node, and MongoDB.",
      subject: "Web Development",
      level: "Intermediate",
      course_type: "Online",
      price: "$150",
      course_url: "https://example.com/full-stack-web-dev",
      rating: 4.7
    },
    {
      title: "Deep Learning with TensorFlow",
      summary: "Learn how to build neural networks and deep learning models using TensorFlow.",
      subject: "Machine Learning",
      level: "Advanced",
      course_type: "Online",
      price: "$120",
      course_url: "https://example.com/deep-learning-tensorflow",
      rating: 4.9
    }
  ];

  useEffect(() => {
    const fetchProfileAndRecommendations = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User is not authenticated.");
          setLoading(false);
          return;
        }

        // Fetch the authenticated user's profile from Firestore
        const userProfileRef = doc(db, "users", user.uid);
        const userProfileSnap = await getDoc(userProfileRef);
        if (userProfileSnap.exists()) {
          const profileData = userProfileSnap.data();
          setUserProfile(profileData);

          // Check if profile is complete
          const isProfileComplete = profileData.firstName && profileData.lastName && profileData.skills;

          // Fetch recommendations based on profile completeness
          if (isProfileComplete) {
            setRecommendations(personalizedRecommendations); // Show personalized recommendations if profile is complete
          } else {
            setRecommendations(defaultRecommendations); // Show default recommendations if profile is incomplete
          }
        } else {
          setError("User profile not found.");
        }

        // Fetch recommendations document if it exists
        const recDocRef = doc(db, "recommendations", user.uid);
        const recDocSnap = await getDoc(recDocRef);

        if (!recDocSnap.exists()) {
          setError("Recommendations document not found. Creating new recommendations document.");
          await setDoc(recDocRef, {
            recommended_courses: [] // Create an empty array if the document doesn't exist yet
          });
          setRecommendations(defaultRecommendations); // Default if no recommendation document
        }
      } catch (err: any) {
        console.error("Error fetching profile and recommendations:", err);
        setError("Failed to load profile or recommendations.");
        setRecommendations(defaultRecommendations); // Show default recommendations in case of errors
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndRecommendations();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, bgcolor: "#FBE9E7", minHeight: "100vh", paddingBottom: 4 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#D32F2F", mb: 4 }}>
        NTATAISE Dashboard
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={5} sx={{ bgcolor: "#D32F2F", color: "white", borderRadius: 3, boxShadow: 4, "&:hover": { boxShadow: 8, transform: "scale(1.05)" }, transition: "transform 0.3s ease, box-shadow 0.3s ease" }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="center">
                <DashboardIcon sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: "bold", fontSize: 22 }}>Welcome to NTATAISE</Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 1, fontSize: 16 }}>
                Explore career opportunities and personalized learning.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={3} sx={{ borderRadius: 3, boxShadow: 2, "&:hover": { boxShadow: 8 }, transition: "transform 0.3s ease" }}>
            <CardActionArea onClick={() => navigate("/edit-profile")}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AccountCircle sx={{ fontSize: 40, color: "#D32F2F", mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>Manage Your Profile</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Update your information to get personalized recommendations.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card elevation={3} sx={{ borderRadius: 3, boxShadow: 2, "&:hover": { boxShadow: 8 }, transition: "transform 0.3s ease" }}>
            <CardActionArea onClick={() => navigate("/psychometric-assessment")}>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Assessment sx={{ fontSize: 40, color: "#D32F2F", mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>Career Guidance</Typography>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Take an assessment to discover your best career path.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h5" align="center" sx={{ mt: 4, fontWeight: "bold", color: "#D32F2F" }}>
            Course Recommendations
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
              <CircularProgress sx={{ color: "#D32F2F" }} />
            </Box>
          ) : error ? (
            <Typography variant="body1" color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          ) : (
            <Grid container spacing={4} justifyContent="center">
              {recommendations.map((course, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card elevation={3} sx={{ borderRadius: 3, "&:hover": { boxShadow: 8 }, transition: "transform 0.3s ease" }}>
                    <CardActionArea>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#D32F2F" }}>{course.title}</Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          {course.summary}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          Subject: {course.subject}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          Level: {course.level}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          Course Type: {course.course_type}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                          Price: {course.price}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Rating value={course.rating} readOnly size="small" />
                        </Box>
                        <Button variant="outlined" color="error" sx={{ mt: 2 }} target="_blank" href={course.course_url}>
                          Visit Course
                        </Button>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
