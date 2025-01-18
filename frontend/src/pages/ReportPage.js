import React, { useEffect, useState } from 'react';
import { Container, Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // For back navigation
import ScoreCard from '../components/ScoreCard';
import Comparison from '../components/Comparison';
import Recommendations from '../components/Recommendations';

const ReportPage = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Fetch recommendations from backend
    const fetchRecommendations = async () => {
      const response = await fetch('/api/recommendations'); // Replace with your API endpoint
      const data = await response.json();
      setRecommendations(data);
    };

    fetchRecommendations();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Accessibility Analysis Report
      </Typography>

      <ScoreCard score={75} />

      <Comparison oldCode="<html>...</html>" newCode="<html>...</html>" />

      {/* Include Recommendations */}
      {recommendations.length > 0 ? (
        <Recommendations recommendations={recommendations} />
      ) : (
        <Typography>Loading recommendations...</Typography>
      )}

      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Button variant="outlined" onClick={() => navigate('/')}>
          Back
        </Button>
      </Box>
    </Container>
  );
};

export default ReportPage;