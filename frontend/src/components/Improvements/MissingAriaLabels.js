import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

const MissingAriaLabels = ({ data }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleData = showAll ? data : data.slice(0, 2);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Missing ARIA Labels
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        This section highlights elements missing ARIA labels for better accessibility.
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: showAll ? 300 : 150, // Fixed height for scrolling
          overflow: 'auto',
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Details</TableCell>
              <TableCell>HTML Selector</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleData.map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {row.details}
                </TableCell>
                <TableCell>{row.htmlSelector}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        onClick={() => setShowAll(!showAll)}
        sx={{ marginTop: 2 }}
      >
        {showAll ? 'Show Less' : 'Show More'}
      </Button>
    </Box>
  );
};

export default MissingAriaLabels;
