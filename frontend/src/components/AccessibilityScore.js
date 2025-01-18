import React from 'react';
import { Typography, Box } from '@mui/material';

const AccessibilityScore = ({ score }) => {
  return (
    <Box
      sx={{
        textAlign: 'center',
        marginBottom: 4,
        padding: 2,
        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: 'bold', color: '#ffffff', marginBottom: 1 }}
      >
        Accessibility Score
      </Typography>
      <Typography
        variant="h2"
        sx={{ fontWeight: 'bold', color: '#ffffff' }}
      >
        {score}%
      </Typography>
    </Box>
  );
};

export default AccessibilityScore;
