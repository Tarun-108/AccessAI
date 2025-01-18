import React, { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import GradientBackground from "../components/GradientBackground";
import ScoreCard from "../components/ScoreCard";
import CircularProgress from "@mui/material/CircularProgress";
import ToggleComparison from "../components/ToggleComparison";
import { useLocation, useNavigate } from "react-router-dom";
import { LOCAL_STORAGE_KEY } from "./HomePage";
import axios from "../utils/axios";

const ReportPage = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [oldCode, setOldCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const { state } = useLocation();

  useEffect(() => {
    const fetchCodes = async () => {
      console.log("state: ", state);
      if (!state?.method || (!state?.url && state?.method === "url")) {
        setError("Invalid method or URL");
        navigate("/");
        return;
      }
      const { method, url } = state;
      if (method === "url") {
        const response = await fetch(url);
        if (!response.ok) {
          setError("Failed to fetch HTML content");
          return;
        }
        const htmlContent = response.text(); // Get response as text (HTML)
        setOldCode(htmlContent);
      } else {
        const code = localStorage.getItem(LOCAL_STORAGE_KEY);
        setOldCode(JSON.parse(code));
      }
    };
    const analyzeHTML = async () => {
      await fetchCodes();
      const reqBody = {};
      if (state.method === "url") {
        reqBody.is_url = true;
        reqBody.content = state.url;
      } else {
        reqBody.is_url = false;
        const code = localStorage.getItem(LOCAL_STORAGE_KEY);
        reqBody.content = JSON.parse(code);
      }
      console.log("body: ", reqBody);
      const { data } = await axios.post("/analyze", reqBody);
      console.log("server data: ", data);
      setSuggestions(data);
      setNewCode(data.updated_dom);

      setLoading(false);
    };
    analyzeHTML();
  }, []);

  if (loading) {
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>;
  }

  return (
    // <GradientBackground>
    <Box
      sx={{
        maxHeight: "100vh",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {/* <ScoreCard /> */}
      <Container sx={{ width: "50%" }}>
        {/* IMPROVEMENTS SECTION */}
        <Typography variant="h3">Improvements: </Typography>
        {/* {suggestions.map((suggestion) => (
        <Box>
          <h2>{suggestion.title}</h2>
          <ul>
            {suggestion.items.map((item) => (
              <li>{item}</li>
            ))}
          </ul>
        </Box>
      ))} */}
      </Container>
      <Box sx={{ width: "50%", height: "100vh" }}>
        <ToggleComparison oldCode={oldCode} newCode={newCode} />
      </Box>
    </Box>
    // </GradientBackground>
  );
};

export default ReportPage;
