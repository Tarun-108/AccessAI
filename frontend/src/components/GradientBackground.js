import React from 'react';
import { Box } from '@mui/material';

const GradientBackground = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5', // A light grey background for a clean, modern look
        padding: 2,
      }}
    >
      {children}
    </Box>
  );
};

export default GradientBackground;
