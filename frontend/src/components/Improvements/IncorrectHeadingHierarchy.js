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

const IncorrectHeadingHierarchy = ({ data }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleData = showAll ? data : data.slice(0, 2);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Incorrect Heading Hierarchy
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Displays warnings about heading hierarchy issues along with their corresponding HTML selectors.
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
              <TableCell>Warning</TableCell>
              <TableCell>HTML Selector</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.warning}</TableCell>
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

export default IncorrectHeadingHierarchy;
