import React, { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const KeyboardNavigation = ({ data }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleData = showAll ? data : data.slice(0, 2);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Keyboard Navigation
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Highlighting current and suggested code for improved keyboard navigation.
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
              <TableCell>Current Code</TableCell>
              <TableCell>Suggested Code</TableCell>
              {/* <TableCell>HTML Selector</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleData.map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    color: 'error.main',
                    bgcolor: 'error.lighter',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {row.current}
                </TableCell>
                <TableCell
                  sx={{
                    color: 'success.main',
                    bgcolor: 'success.lighter',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {row.suggested}
                </TableCell>
                {/* <TableCell
                //   sx={{
                //     color: 'success.main',
                //     // bgcolor: 'success.lighter',
                //     whiteSpace: 'pre-wrap',
                //   }}
                >
                  {/* {row.selector} */}
                {/* </TableCell> */} 
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

export default KeyboardNavigation;
