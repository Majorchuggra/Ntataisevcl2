import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        textAlign: 'center',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="h3" gutterBottom>
        Welcome to NTATAISE
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Your guide to career growth and opportunities. Start your journey today!
      </Typography>

      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          sx={{ m: 1, px: 4, py: 1.5 }}
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </Button>
        <Button
          variant="outlined"
          color="primary"
          sx={{ m: 1, px: 4, py: 1.5 }}
          onClick={() => navigate('/login')}
        >
          Log In
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;
