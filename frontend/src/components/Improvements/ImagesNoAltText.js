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

const ImagesNoAltText = ({ data }) => {
  const [showAll, setShowAll] = useState(false);

  const visibleData = showAll ? data : data.slice(0, 2);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Images with No Alt Text
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Displays images missing alt text along with their suggested captions and HTML IDs.
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
              <TableCell>Image</TableCell>
              <TableCell>Suggested Caption</TableCell>
              <TableCell>HTML Selector</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <img
                    src={row.imageSrc}
                    alt="Preview"
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: 4,
                    }}
                  />
                </TableCell>
                <TableCell>{row.suggestedCaption}</TableCell>
                <TableCell>{row.htmlId}</TableCell>
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

export default ImagesNoAltText;
