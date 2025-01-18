import React from 'react';
import { Paper } from '@mui/material';
import GradientBackground from '../components/GradientBackground';
import Header from '../components/Header';
import UrlInputForm from '../components/UrlInputForm';

const HomePage = () => {
  return (
    <GradientBackground>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 600,
          width: '100%',
          textAlign: 'center',
          backgroundColor: '#ffffff',
          borderRadius: 2,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Header />
        <UrlInputForm />
      </Paper>
    </GradientBackground>
  );
};

export default HomePage;
