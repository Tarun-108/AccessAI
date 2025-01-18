import React from 'react';
import { Typography } from '@mui/material';

const Header = () => {
  return (
    <>
      {/* Heading */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: 'bold', color: '#333' }}
      >
        Accessibility Enhancement Tool
      </Typography>

      {/* Subtext */}
      <Typography
        variant="body1"
        gutterBottom
        sx={{ color: '#555', marginBottom: 3 }}
      >
        Analyze your website for accessibility issues and improve its inclusivity!
      </Typography>
    </>
  );
};

export default Header;
