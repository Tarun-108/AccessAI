import React, { useState } from 'react';
import { Box, Button, Typography, Grid } from '@mui/material';
import CodeView from './CodeView';
import WebpageView from './WebpageView';

const ToggleComparison = ({ oldCode, newCode, oldPage, newPage }) => {
  const [view, setView] = useState('webpage'); // 'webpage' or 'code'

  return (
    <Box>
      {/* Toggle Button */}
      <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
        <Button
          variant="contained"
          color={view === 'webpage' ? 'primary' : 'secondary'}
          onClick={() => setView('webpage')}
          sx={{ marginRight: 2 }}
        >
          Webpage View
        </Button>
        <Button
          variant="contained"
          color={view === 'code' ? 'primary' : 'secondary'}
          onClick={() => setView('code')}
        >
          Code View
        </Button>
      </Box>

      {/* Display View */}
      {view === 'webpage' ? (
        <WebpageView oldPage={oldPage} newPage={newPage} />
      ) : (
        <CodeView oldCode={oldCode} newCode={newCode} />
      )}
    </Box>
  );
};

export default ToggleComparison;
