import React from 'react';
import { Box, Container } from '@mui/material';
import GradientBackground from '../components/GradientBackground';
import AccessibilityScore from '../components/AccessibilityScore';
import ToggleComparison from '../components/ToggleComparison';

const ReportPage = () => {
  const oldCode = `<div><h1>Old Webpage</h1></div>`;
  const newCode = `<div><h1>New Webpage</h1><p>Improved Content</p></div>`;
  const oldPage = '<h1 style="color: red;">Old Page</h1>';
  const newPage = '<h1 style="color: green;">New Page</h1>';

  return (
    <GradientBackground>
      <Container maxWidth="lg">
        <AccessibilityScore score={85} />
        <ToggleComparison
          oldCode={oldCode}
          newCode={newCode}
          oldPage={oldPage}
          newPage={newPage}
        />
      </Container>
    </GradientBackground>
  );
};

export default ReportPage;
