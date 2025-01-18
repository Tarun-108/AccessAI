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

const WrongContrast = ({ data }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleData = showAll ? data : data.slice(0, 2);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Wrong Contrast Between Background and Text
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Highlights areas where the text color contrast is insufficient, along with suggested fixes.
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
              <TableCell>Current Text Color</TableCell>
              <TableCell>Suggested Text Color</TableCell>
              <TableCell>HTML Selector</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleData.map((row, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    color: row.currentTextColor,
                    textDecoration: 'underline', // Underlines the text color
                    fontWeight: 'bold',
                  }}
                >
                  {row.currentTextColor}
                </TableCell>
                <TableCell
                  sx={{
                    color: row.suggestedTextColor,
                    fontWeight: 'bold',
                  }}
                >
                  {row.suggestedTextColor}
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

export default WrongContrast;
