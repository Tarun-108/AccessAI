import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const Comparison = () => {
  const [oldCodeUrl, setOldCodeUrl] = useState(null);
  const [newCodeUrl, setNewCodeUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch old code from localStorage
        const oldCode = localStorage.getItem('oldCode');
        if (oldCode) {
          const oldCodeBlob = new Blob([oldCode], { type: 'text/html' });
          const oldCodeBlobUrl = URL.createObjectURL(oldCodeBlob);
          setOldCodeUrl(oldCodeBlobUrl);
        }

        // Fetch new code from the backend
        const response = await fetch('/api/newCode'); // Replace with actual API endpoint
        if (response.ok) {
          const newCode = await response.text();
          const newCodeBlob = new Blob([newCode], { type: 'text/html' });
          const newCodeBlobUrl = URL.createObjectURL(newCodeBlob);
          setNewCodeUrl(newCodeBlobUrl);
        } else {
          console.error('Failed to fetch new code from backend');
        }
      } catch (error) {
        console.error('Error fetching code:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 4,
        flexWrap: 'wrap', // Makes it responsive
        marginTop: 4,
      }}
    >
      {/* Old Webpage */}
      <Box
        sx={{
          flex: 1,
          maxWidth: '100%',
          position: 'relative',
          aspectRatio: '16/10', // Aspect ratio for desktop websites
          overflow: 'hidden',
          border: '1px solid #ccc',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 1 }}>
          Old Webpage
        </Typography>
        {oldCodeUrl ? (
          <iframe
            src={oldCodeUrl}
            title="Old Webpage"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              transform: 'scale(1)', // Ensures it scales correctly
              transformOrigin: 'top left', // Keeps the scaling anchored to the top-left
            }}
          />
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            Old code not available.
          </Typography>
        )}
      </Box>

      {/* New Webpage */}
      <Box
        sx={{
          flex: 1,
          maxWidth: '100%',
          position: 'relative',
          aspectRatio: '16/10', // Aspect ratio for desktop websites
          overflow: 'hidden',
          border: '1px solid #ccc',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 1 }}>
          New Webpage
        </Typography>
        {newCodeUrl ? (
          <iframe
            src={newCodeUrl}
            title="New Webpage"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              transform: 'scale(1)', // Ensures it scales correctly
              transformOrigin: 'top left', // Keeps the scaling anchored to the top-left
            }}
          />
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            New code not available.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Comparison;
