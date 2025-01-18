import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  Paper,
} from '@mui/material';

const AccessibilityScoreCard = ({ data }) => {
  const [showAll, setShowAll] = useState(false);
  const details = data.violations;
  const visibleData = showAll ? details : details.slice(0, 2);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Accessibility Score Card
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Provides the overall accessibility score, total issues, and detailed violations.
      </Typography>

      <Box sx={{ marginBottom: 2 }}>
        <Typography variant="h6">Accessibility Score: {data.score}</Typography>
        <Typography variant="body2" color="textSecondary">
          Total Issues: {data.totalIssues}
        </Typography>
      </Box>

      <Paper sx={{ maxHeight: showAll ? 300 : 150, overflow: 'auto' }}>
        <List>
          {visibleData.map((violation, index) => (
            <ListItem key={index}>
              <Typography variant="body2">{`${index + 1}. ${violation.details}`}</Typography>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Button
        variant="contained"
        onClick={() => setShowAll(!showAll)}
        sx={{ marginTop: 2 }}
      >
        {showAll ? 'Show Less' : 'Show More'}
      </Button>
    </Box>
  );
};

export default AccessibilityScoreCard;
