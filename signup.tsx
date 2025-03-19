import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Link, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);

      // Send email verification
      await sendEmailVerification(userCredential.user);

      setSuccess('Signup successful! Please check your email for verification.');
      setIsLoading(false);

      // Redirect user to login page after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Failed to sign up. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={8} sx={{ padding: 4, borderRadius: 3, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h4" align="center" gutterBottom color="#D32F2F">
          Sign Up
        </Typography>

        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="primary" align="center" gutterBottom>
            {success}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={userData.email}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
            color="error"
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={userData.password}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
            color="error"
            sx={{ marginBottom: '16px' }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={userData.confirmPassword}
            onChange={handleChange}
            required
            margin="normal"
            variant="outlined"
            color="error"
            sx={{ marginBottom: '16px' }}
          />

          <Box mt={2}>
            <Button
              variant="contained"
              color="error"
              type="submit"
              fullWidth
              disabled={isLoading}
              sx={{
                padding: '14px',
                fontWeight: 600,
                fontSize: '16px',
                textTransform: 'none',
                borderRadius: 30,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: '#D32F2F',
                },
              }}
            >
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </Box>
          
          <Box mt={2} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
            <Link
              component="button"
              onClick={() => navigate('/login')}
              variant="body2"
              color="primary"
              sx={{
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Already have an account? Login
            </Link>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Signup;
