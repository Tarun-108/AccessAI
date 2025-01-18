import React from 'react';
import { Box } from '@mui/material';

const GradientBackground = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5', // A light grey background for a clean, modern look
        padding: 1,
      }}
    >
      {children}
    </Box>
  );
};

export default GradientBackground;
