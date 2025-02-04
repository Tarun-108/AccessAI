import React from "react";
import { TextField, Button } from "@mui/material";

const UrlInputForm = ({ analyzeData }) => {
  const [url, setUrl] = React.useState("");
  return (
    <>
      {/* URL Input */}
      <TextField
        value={url}
        label="Website URL"
        variant="outlined"
        onChange={(e) => setUrl(e.target.value)}
        fullWidth
        sx={{
          marginBottom: 2,
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "#1976d2",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1976d2",
            },
          },
        }}
      />

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        size="large"
        fullWidth
        sx={{
          textTransform: "none",
          fontSize: "1rem",
          padding: "10px 20px",
          backgroundColor: "#1976d2",
          "&:hover": {
            backgroundColor: "#115293",
          },
        }}
        onClick={() => analyzeData("url", url)}
      >
        Analyze Website
      </Button>
    </>
  );
};

export default UrlInputForm;
