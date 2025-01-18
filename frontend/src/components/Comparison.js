import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Divider } from '@mui/material';
import Prism from 'prismjs'; // For syntax highlighting
import 'prismjs/themes/prism-tomorrow.css'; // Import a PrismJS theme

const Comparison = () => {
  const [oldCode, setOldCode] = useState(null);
  const [newCode, setNewCode] = useState(null);
  const [oldCodeUrl, setOldCodeUrl] = useState(null);
  const [newCodeUrl, setNewCodeUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch old code from localStorage
        const oldCodeFromStorage = localStorage.getItem('oldCode');
        if (oldCodeFromStorage) {
          setOldCode(oldCodeFromStorage);
          const oldCodeBlob = new Blob([oldCodeFromStorage], { type: 'text/html' });
          const oldCodeBlobUrl = URL.createObjectURL(oldCodeBlob);
          setOldCodeUrl(oldCodeBlobUrl);
        }

        // Fetch new code from the backend
        const response = await fetch('/api/newCode'); // Replace with actual API endpoint
        if (response.ok) {
          const newCodeFromBackend = await response.text();
          setNewCode(newCodeFromBackend);
          const newCodeBlob = new Blob([newCodeFromBackend], { type: 'text/html' });
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

  useEffect(() => {
    Prism.highlightAll(); // Apply syntax highlighting to code blocks
  }, [oldCode, newCode]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', gap: 2 }}>
      {/* Old Version */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          Old Version
        </Typography>
        <Box
          sx={{
            flex: 1,
            border: '1px solid #ccc',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {oldCodeUrl ? (
            <iframe
              src={oldCodeUrl}
              title="Old Webpage"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', padding: 2 }}>
              Old code not available.
            </Typography>
          )}
        </Box>
        <Box sx={{ flex: 1, border: '1px solid #ccc', borderRadius: 2, overflow: 'hidden', padding: 2 }}>
          {oldCode ? (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              <code className="language-html">{oldCode}</code>
            </pre>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              Old code not available.
            </Typography>
          )}
        </Box>
      </Box>

      {/* Divider */}
      <Divider orientation="vertical" flexItem />

      {/* New Version */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          New Version
        </Typography>
        <Box
          sx={{
            flex: 1,
            border: '1px solid #ccc',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {newCodeUrl ? (
            <iframe
              src={newCodeUrl}
              title="New Webpage"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center', padding: 2 }}>
              New code not available.
            </Typography>
          )}
        </Box>
        <Box sx={{ flex: 1, border: '1px solid #ccc', borderRadius: 2, overflow: 'hidden', padding: 2 }}>
          {newCode ? (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
              <code className="language-html">{newCode}</code>
            </pre>
          ) : (
            <Typography variant="body1" sx={{ textAlign: 'center' }}>
              New code not available.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Comparison;
