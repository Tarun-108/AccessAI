import React, { useState } from "react";
import { Paper, TextField, Button, Box, Typography, Grid } from "@mui/material";
import GradientBackground from "../components/GradientBackground";
// import Header from '../components/Header';
import UrlInputForm from "../components/UrlInputForm";
import { useNavigate } from "react-router-dom";
import CodeEditor from "../components/Editor";

export const LOCAL_STORAGE_KEY = "htmlcode";
const HomePage = () => {
  const [htmlCode, setHtmlCode] = useState("");
  const navigate = useNavigate();

  const handleCodeChange = (e) => {
    const value = e.target.value;
    setHtmlCode(value);
  };

  const analyzeData = (method, url = "") => {
    if (method === "url") {
      if (url.trim() === "") {
        alert("Please enter a valid URL !");
        return;
      }
      navigate("/report", { state: { method, url } });
    } else {
      if (htmlCode.trim()) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(htmlCode));
        navigate("/report", { state: { method, url } });
      } else {
        alert("Please add the HTML code first !");
      }
    }
  };

  return (
    <GradientBackground>
      <Typography
        variant="h2"
        gutterBottom
        sx={{
          display: "flex",
          wordWrap: "unset",
          fontWeight: "bold",
          color: "#333",
          marginBottom: 2,
        }}
      >
        Access
        <Box>AI</Box>
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        sx={{ color: "#555", marginBottom: 3 }}
      >
        Analyze your website for accessibility issues and improve its
        inclusivity!
      </Typography>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 900,
          width: "100%",
          textAlign: "center",
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          margin: "0 auto",
        }}
      >
        {/* Two Columns with OR in the middle */}
        <Grid container spacing={4} alignItems="center">
          {/* Column 1: URL Input */}
          <Grid item xs={12} md={5}>
            <UrlInputForm analyzeData={analyzeData} />
            {/* <Button
              variant="contained"
              color="primary"
              onClick={handleAnalyzeUrl}
              sx={{
                marginTop: 2,
                width: '100%',
                padding: '10px',
                fontSize: '16px',
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              Analyze URL
            </Button> */}
          </Grid>

          {/* OR Divider */}
          <Grid item xs={12} md={2}>
            <Typography
              variant="h6"
              sx={{
                color: "#555",
                fontWeight: "bold",
                textAlign: "center",
                marginTop: "16px",
              }}
            >
              OR
            </Typography>
          </Grid>

          {/* Column 2: HTML Code Input */}
          <Grid item xs={12} md={5}>
            <CodeEditor code={htmlCode} setCode={handleCodeChange} />
            <Button
              variant="contained"
              color="primary"
              onClick={() => analyzeData("code")}
              sx={{
                marginTop: 2,
                width: "100%",
                padding: "10px",
                fontSize: "16px",
                borderRadius: "8px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            >
              Analyze HTML
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </GradientBackground>
  );
};

export default HomePage;
