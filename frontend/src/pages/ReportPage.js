import React, { useEffect, useState } from 'react';
import { Box, Container } from '@mui/material';
import GradientBackground from '../components/GradientBackground';
import ScoreCard from '../components/ScoreCard';
import ToggleComparison from '../components/ToggleComparison';
import KeyboardNavigation from '../components/Improvements/KeyboardNavigation';
import ImagesNoAltText from '../components/Improvements/ImagesNoAltText';
import IncorrectHeadingHierarchy from '../components/Improvements/IncorrectHeadingHierarchy';
import WrongContrast from '../components/Improvements/WrongContrast';
import MissingAriaLabels from '../components/Improvements/MissingAriaLabels';
import AccessibilityScoreCard from '../components/Improvements/AccesibilityScore';

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

  const keyboardNavigationData = [
    {
      current: 'document.addEventListener("keydown", handler);',
      suggested: 'document.addEventListener("keydown", handleKeyPress);',
      // selector: 'ab'
    },
    {
      current: 'inputElement.focus({ preventScroll: true });',
      suggested: 'inputElement.focus();',
      // selector: 'cd'
    },
    {
      current: 'if (event.keyCode === 13) { submit(); }',
      suggested: 'if (event.key === "Enter") { submit(); }',
      // selector: 'abcd'
    },
  ];

  const imagesNoAltTextData = [
    {
      imageSrc: 'https://via.placeholder.com/150',
      suggestedCaption: 'Placeholder image for example content.',
      htmlId: '#image1',
    },
    {
      imageSrc: 'https://via.placeholder.com/150/0000FF',
      suggestedCaption: 'A blue square as a placeholder.',
      htmlId: '#image2',
    },
    {
      imageSrc: 'https://via.placeholder.com/150/FF0000',
      suggestedCaption: 'A red square as a placeholder.',
      htmlId: '#image3',
    },
  ];

  const incorrectHeadingHierarchyData = [
    {
      warning: 'Heading level skipped from H2 to H4.',
      htmlSelector: '#section1-heading',
    },
    {
      warning: 'Multiple H1 tags on the page.',
      htmlSelector: '#main-header',
    },
    {
      warning: 'H3 used without a preceding H2.',
      htmlSelector: '#subsection-title',
    },
  ];
  const contrastData = [
    {
      currentTextColor: '#FF0000', // Current text color
      suggestedTextColor: '#333333', // Suggested text color
      htmlSelector: '#header', // Selector for the element
    },
    {
      currentTextColor: '#FFFFFF',
      suggestedTextColor: '#000000',
      htmlSelector: '.footer',
    },
    // Add more entries as needed
  ];
  const ariaData = [
    {
      details: 'Missing ARIA label for the button in the header.',
      htmlSelector: '#header-button',
    },
    {
      details: 'Input field lacks ARIA label for accessibility.',
      htmlSelector: '.form-input',
    },
    {
      details: 'Image missing alt text and ARIA label.',
      htmlSelector: '.hero-image',
    },
  ];

  const scoreData = {
    score: '85%', // Overall accessibility score
    totalIssues: 10, // Total number of accessibility issues
    violations: [
      { details: 'Missing ARIA labels in some buttons.' },
      { details: 'Incorrect contrast between text and background.' },
      { details: 'No alt text for images.' },
      { details: 'Improper heading hierarchy.' },
      // Add more violations as needed
    ],
  };
  
  

  return (
    // <GradientBackground>
    <Container maxWidth="lg">
      <AccessibilityScoreCard data={scoreData}/>
      <ToggleComparison
        oldCode={oldCode}
        newCode={newCode}
        oldPage={oldPage}
        newPage={newPage}
      />
      <KeyboardNavigation data= {keyboardNavigationData}/>
      <ImagesNoAltText data={imagesNoAltTextData}/>
      <IncorrectHeadingHierarchy data={incorrectHeadingHierarchyData}/>
      <WrongContrast data = {contrastData}/>
      <MissingAriaLabels data = {ariaData}/>
      

    </Container>
    // </GradientBackground>
  );
};

export default ReportPage;
