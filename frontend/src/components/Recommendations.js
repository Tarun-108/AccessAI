import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, Paper } from '@mui/material';

const Recommendations = ({ recommendations }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // To track the current recommendation

  // Handle navigation between recommendations
  const handleNext = () => {
    if (currentIndex < recommendations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentRecommendation = recommendations[currentIndex]; // Get the current recommendation

  return (
    <Paper
      sx={{
        padding: 4,
        marginTop: 4,
        backgroundColor: '#f9f9f9',
        borderRadius: 2,
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Recommendation {currentIndex + 1} of {recommendations.length}
      </Typography>

      <Grid container spacing={4}>
        {/* Old Code */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            Old Code
          </Typography>
          <Box
            sx={{
              backgroundColor: '#e0f7fa',
              padding: 2,
              borderRadius: 1,
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {currentRecommendation.oldCode}
          </Box>
        </Grid>

        {/* New Code */}
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            New Code
          </Typography>
          <Box
            sx={{
              backgroundColor: '#e8f5e9',
              padding: 2,
              borderRadius: 1,
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {currentRecommendation.newCode}
          </Box>
        </Grid>
      </Grid>

      {/* Navigation Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 4,
        }}
      >
        <Button
          variant="outlined"
          onClick={handleBack}
          disabled={currentIndex === 0}
        >
          Back
        </Button>
        <Button
          variant="outlined"
          onClick={handleNext}
          disabled={currentIndex === recommendations.length - 1}
        >
          Next
        </Button>
      </Box>
    </Paper>
  );
};

export default Recommendations;
