import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const WebpageView = ({ oldPage, newPage }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Webpage Comparison
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Old Webpage */}
        <Paper sx={{ flex: 1, overflow: 'hidden', height: '400px' }}>
          <Typography variant="h6" sx={{ padding: 2 }}>
            Old Webpage
          </Typography>
          <iframe
            srcDoc={oldPage}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Old Webpage"
          />
        </Paper>

        {/* New Webpage */}
        <Paper sx={{ flex: 1, overflow: 'hidden', height: '400px' }}>
          <Typography variant="h6" sx={{ padding: 2 }}>
            New Webpage
          </Typography>
          <iframe
            srcDoc={newPage}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="New Webpage"
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default WebpageView;
