import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ScoreCard = ({ score }) => {
  const theme = useTheme();

  return (
    <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
      <Typography variant="h4" gutterBottom>
        Score: {score}%
      </Typography>
      <Box sx={{ width: '100%', marginBottom: 2 }}>
        <LinearProgress
          variant="determinate"
          value={score}
          sx={{
            height: 20,
            borderRadius: 5,
            backgroundColor: theme.palette.grey[300], // Light grey background for the progress bar
            '& .MuiLinearProgress-bar': {
              backgroundColor: theme.palette.primary.main, // Customize progress color
            },
          }}
        />
      </Box>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        {score}%
      </Typography>
    </Box>
  );
};

export default ScoreCard;
