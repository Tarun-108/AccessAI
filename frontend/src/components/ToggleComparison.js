import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  TextareaAutosize,
  Page,
} from "@mui/material";

const ToggleComparison = ({ oldCode, newCode }) => {
  const [showCode, setShowCode] = useState(false);

  return (
    <Box sx={{ height: "100%" }}>
      {/* Old Version */}
      <Box
        sx={{
          // border: "1px solid green",
          borderRadius: 2,
          overflow: "hidden",
          height: "50%",
          display: "relative",
          border: "1px solid black",
        }}
      >
        <Box
          sx={{
            display: "absolute",
            width: "max-content",
            height: "max-content",
            color: "black",
            top: "0",
            right: "0",
          }}
        >
          Old Version
          <Button onClick={() => setShowCode(!showCode)}>
            {" "}
            {showCode ? "Show page" : "Show code"}{" "}
          </Button>
        </Box>
        {showCode ? (
          <TextareaAutosize
            minRows={6}
            value={oldCode}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontFamily: "monospace",
            }}
          />
        ) : (
          <iframe
            srcDoc={oldCode}
            title="Old Webpage"
            style={{ width: "100%", height: "100%", border: "1px solid black" }}
          ></iframe>
        )}
      </Box>
      {/* <Box
          sx={{
            backgroundColor: "#f5f5f5",
            padding: 2,
            borderRadius: 2,
            border: "1px solid #ccc",
          }}
        >
          <TextareaAutosize
            minRows={6}
            value={oldCode}
            onChange={handleOldCodeChange}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontFamily: "monospace",
            }}
          />
        </Box>
      )} */}

      {/* New Version */}
      {/* New Webpage */}
      <Box
        sx={{
          // border: "1px solid green",
          borderRadius: 2,
          overflow: "hidden",
          height: "50%",
        }}
      >
        <Box
          component={"span"}
          sx={{
            display: "absolute",
            width: "max-content",
            height: "max-content",
            color: "black",
            top: "0",
            right: "0",
            border: "1px solid black",
          }}
        >
          New Version
        </Box>
        {showCode ? (
          <TextareaAutosize
            minRows={6}
            value={newCode}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              fontFamily: "monospace",
            }}
          />
        ) : (
          <iframe
            srcDoc={newCode}
            title="Old Webpage"
            style={{ width: "100%", height: "100%", border: "1px solid black" }}
          ></iframe>
        )}
      </Box>
      {/* View/Hide Code Button */}
      {/* <Box textAlign="center" sx={{ marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowNewCode(!showNewCode)}
          >
            {showNewCode ? "Hide Code" : "View Code"}
          </Button>
        </Box> */}
      {/* New Code View and Editor */}
      {/* {showNewCode && (
          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              padding: 2,
              borderRadius: 2,
              border: "1px solid #ccc",
            }}
          >
            <TextareaAutosize
              minRows={6}
              value={newCode}
              onChange={handleNewCodeChange}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                fontFamily: "monospace",
              }}
            />
          </Box>
        )} */}
    </Box>
  );
};

export default ToggleComparison;
