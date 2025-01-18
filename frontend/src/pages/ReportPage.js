import React, { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import GradientBackground from '../components/GradientBackground';
import ScoreCard from '../components/ScoreCard';
import ToggleComparison from '../components/ToggleComparison';

const ReportPage = () => {
  const [oldCode, setOldCode] = useState('<h1 ">Old Page</h1>');
  const [newCode, setNewCode] = useState('<h1 style="color: green;">New Page</h1>');
  const oldPage = '<h1 style="color: red;">Old Page</h1>';
  const newPage = '<h1 style="color: green;">New Page</h1>';

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        // Retrieve oldCode from localStorage
        const localOldCode = localStorage.getItem('oldCode');
        if (localOldCode) {
          setOldCode(localOldCode);
        } else {
          // If not in localStorage, fetch from the backend
          const oldCodeResponse = await fetch('/api/oldCode'); // Replace with actual API endpoint
          if (oldCodeResponse.ok) {
            const oldCodeFromBackend = await oldCodeResponse.text();
            setOldCode(oldCodeFromBackend);
          } else {
            console.error('Failed to fetch oldCode from the backend');
          }
        }

        // Always fetch newCode from the backend
        const newCodeResponse = await fetch('/api/newCode'); // Replace with actual API endpoint
        if (newCodeResponse.ok) {
          const newCodeFromBackend = await newCodeResponse.text();
          setNewCode(newCodeFromBackend);
        } else {
          console.error('Failed to fetch newCode from the backend');
        }
      } catch (error) {
        console.error('Error fetching codes:', error);
      }
    };

    fetchCodes();
    console.log('oldCode'+oldCode );
  }, []);

  return (
    // <GradientBackground>
    <Container maxWidth="lg">
      <ScoreCard />
      <ToggleComparison
        oldCode={oldCode}
        newCode={newCode}
        oldPage={oldPage}
        newPage={newPage}
      />
    </Container>
    // </GradientBackground>
  );
};

export default ReportPage;
