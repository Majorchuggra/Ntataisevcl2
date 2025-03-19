import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, MenuItem, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { updateProfile } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const db = getFirestore();

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [profile, setProfile] = useState({
    email: user?.email || '',
    firstName: '',
    lastName: '',
    dob: '',
    gender: '',
    education: '',
    skills: '',
    interests: '',
    careerGoals: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile((prev) => ({ ...prev, ...docSnap.data() }));
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Check if the required fields (firstName and lastName) are filled
    const requiredFields = ['firstName', 'lastName'];
    const isComplete = requiredFields.every((field) => profile[field as keyof typeof profile]);
    setIsProfileComplete(isComplete);

    if (!isComplete) {
      setIsLoading(false);
      return;
    }

    try {
      if (user) {
        // Update Firebase Authentication profile (display name)
        await updateProfile(user, { displayName: `${profile.firstName} ${profile.lastName}` });

        // Update additional data in Firestore
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, profile, { merge: true });

        // Set success message
        setSuccess('Profile updated successfully!');
        setIsLoading(false);

        // Wait for a moment before navigating to the dashboard
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      setIsLoading(false);
      setError('Failed to update profile. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Edit Profile
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      {!isProfileComplete && (
        <Alert severity="warning">Please complete all required fields before saving your profile.</Alert>
      )}

      <form onSubmit={handleSave}>
        <TextField
          fullWidth
          label="Email Address"
          name="email"
          value={profile.email}
          disabled
          margin="normal"
        />

        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          value={profile.firstName}
          onChange={handleChange}
          required
          margin="normal"
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          value={profile.lastName}
          onChange={handleChange}
          required
          margin="normal"
        />

        <TextField
          fullWidth
          label="Date of Birth"
          name="dob"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={profile.dob}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Gender"
          name="gender"
          select
          value={profile.gender}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
          <MenuItem value="No selection">No selection</MenuItem>
        </TextField>

        <TextField
          fullWidth
          label="Educational Background"
          name="education"
          value={profile.education}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Skills (Comma separated)"
          name="skills"
          value={profile.skills}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Interests and Hobbies"
          name="interests"
          value={profile.interests}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Career Goals"
          name="careerGoals"
          multiline
          rows={3}
          value={profile.careerGoals}
          onChange={handleChange}
          margin="normal"
        />

        <Box mt={2}>
          <Button
            variant="contained"
            color="error" // Red color
            type="submit"
            fullWidth
            disabled={isLoading || !isProfileComplete}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>

        <Box mt={2}>
          <Button
            variant="outlined"
            color="error" // Red color
            onClick={() => navigate('/dashboard')}
            fullWidth
          >
            Go to Dashboard
          </Button>
        </Box>

        <Box mt={2}>
          <Button
            variant="outlined"
            color="error" // Red color
            onClick={() => navigate('/')}
            fullWidth
          >
            Go Home
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default EditProfile;
