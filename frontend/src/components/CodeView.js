import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const CodeView = ({ oldCode, newCode }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Code Comparison
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        {/* Old Code */}
        <Paper sx={{ padding: 2, flex: 1, backgroundColor: '#f9f9f9' }}>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            Old Code
          </Typography>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {oldCode}
          </pre>
        </Paper>

        {/* New Code */}
        <Paper sx={{ padding: 2, flex: 1, backgroundColor: '#f9f9f9' }}>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            New Code
          </Typography>
          <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
            {newCode}
          </pre>
        </Paper>
      </Box>
    </Box>
  );
};

export default CodeView;
