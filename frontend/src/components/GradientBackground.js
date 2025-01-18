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
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        padding: 2,
      }}
    >
      {children}
    </Box>
  );
};

export default GradientBackground;
