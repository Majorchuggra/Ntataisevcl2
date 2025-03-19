import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Link, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const db = getFirestore();

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);

      if (!userCredential.user.emailVerified) {
        setError('Please verify your email first.');
        setIsLoading(false);
        return;
      }

      // Fetch the user profile from Firestore
      const docRef = doc(db, 'users', userCredential.user.uid);
      const docSnap = await getDoc(docRef);
      const userProfile = docSnap.exists() ? docSnap.data() : null;

      if (userProfile) {
        setIsLoading(false);
        // Check if profile is incomplete
        if (!userProfile.firstName || !userProfile.lastName || !userProfile.skills) {
          alert('Your profile is incomplete. Please update your profile.');
        }
      }

      setIsLoading(false);
      navigate('/dashboard');
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'Failed to log in. Please try again.');
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(auth, loginData.email);
      setError('A password reset link has been sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={8} sx={{ padding: 4, borderRadius: 3, backgroundColor: '#f9f9f9' }}>
        <Typography variant="h4" align="center" gutterBottom color="#D32F2F">
          Login
        </Typography>

        {error && (
          <Typography color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          {!isForgotPassword ? (
            <>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={loginData.email}
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
                value={loginData.password}
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
                  {isLoading ? 'Logging In...' : 'Login'}
                </Button>
              </Box>

              <Box mt={2} display="flex" justifyContent="center" flexDirection="column" alignItems="center">
                <Link
                  component="button"
                  onClick={() => setIsForgotPassword(true)}
                  variant="body2"
                  color="error"
                  sx={{
                    fontWeight: 600,
                    textDecoration: 'none',
                    marginBottom: '8px',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Forgot Password?
                </Link>
                <Link
                  component="button"
                  onClick={() => navigate('/signup')}
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
                  Don’t have an account? Sign Up
                </Link>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h6" gutterBottom align="center" color="error">
                Reset Your Password
              </Typography>
              <TextField
                fullWidth
                label="Enter your email address"
                name="email"
                type="email"
                value={loginData.email}
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
                  onClick={handleForgotPassword}
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
                  {isLoading ? 'Sending Reset Link...' : 'Send Reset Link'}
                </Button>
              </Box>
              <Box mt={2} display="flex" justifyContent="center">
                <Link
                  component="button"
                  onClick={() => setIsForgotPassword(false)}
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
                  Back to Login
                </Link>
              </Box>
            </>
          )}
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
