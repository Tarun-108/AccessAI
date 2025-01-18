import React, { useState } from 'react';
import { Box, Button, Typography, Grid, TextareaAutosize } from '@mui/material';

const ToggleComparison = ({ oldCode: initialOldCode, newCode: initialNewCode }) => {
  const [oldCode, setOldCode] = useState(initialOldCode);
  const [newCode, setNewCode] = useState(initialNewCode);
  const [showOldCode, setShowOldCode] = useState(false);
  const [showNewCode, setShowNewCode] = useState(false);
//   console.log(oldCode);
  const oldCodeStored = localStorage.getItem('oldCode');
//   if(oldCodeStored){
//     setOldCode(oldCodeStored);
//   } 
//   else{} 
  const handleOldCodeChange = (event) => {
    setOldCode(event.target.value);
  };

  const handleNewCodeChange = (event) => {
    setNewCode(event.target.value);
  };

  return (
    <Grid container spacing={4}>
      {/* Old Version */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" textAlign="center" sx={{ marginBottom: 2 }}>
          Old Version
        </Typography>
        {/* Old Webpage */}
        <Box
          sx={{
            border: '1px solid #ccc',
            borderRadius: 2,
            overflow: 'hidden',
            height: 300,
            marginBottom: 2,
          }}
        >
          <iframe
            srcDoc={oldCode}
            title="Old Webpage"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </Box>
        {/* View/Hide Code Button */}
        <Box textAlign="center" sx={{ marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowOldCode(!showOldCode)}
          >
            {showOldCode ? 'Hide Code' : 'View Code'}
          </Button>
        </Box>
        {/* Old Code View and Editor */}
        {showOldCode && (
          <Box
            sx={{
              backgroundColor: '#f5f5f5',
              padding: 2,
              borderRadius: 2,
              border: '1px solid #ccc',
            }}
          >
            <TextareaAutosize
              minRows={6}
              value={oldCode}
              onChange={handleOldCodeChange}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontFamily: 'monospace',
              }}
            />
          </Box>
        )}
      </Grid>

      {/* New Version */}
      <Grid item xs={12} md={6}>
        <Typography variant="h6" textAlign="center" sx={{ marginBottom: 2 }}>
          New Version
        </Typography>
        {/* New Webpage */}
        <Box
          sx={{
            border: '1px solid #ccc',
            borderRadius: 2,
            overflow: 'hidden',
            height: 300,
            marginBottom: 2,
          }}
        >
          <iframe
            srcDoc={newCode}
            title="New Webpage"
            style={{ width: '100%', height: '100%', border: 'none' }}
          />
        </Box>
        {/* View/Hide Code Button */}
        <Box textAlign="center" sx={{ marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowNewCode(!showNewCode)}
          >
            {showNewCode ? 'Hide Code' : 'View Code'}
          </Button>
        </Box>
        {/* New Code View and Editor */}
        {showNewCode && (
          <Box
            sx={{
              backgroundColor: '#f5f5f5',
              padding: 2,
              borderRadius: 2,
              border: '1px solid #ccc',
            }}
          >
            <TextareaAutosize
              minRows={6}
              value={newCode}
              onChange={handleNewCodeChange}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontFamily: 'monospace',
              }}
            />
          </Box>
        )}
      </Grid>
    </Grid>
  );
};

export default ToggleComparison;
