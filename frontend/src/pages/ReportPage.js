import React, { useEffect, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import GradientBackground from "../components/GradientBackground";
import ScoreCard from "../components/ScoreCard";
import CircularProgress from "@mui/material/CircularProgress";
import ToggleComparison from "../components/ToggleComparison";
import { useLocation, useNavigate } from "react-router-dom";
import { LOCAL_STORAGE_KEY } from "./HomePage";
import axios from "../utils/axios";

import AccessibilityScoreCard from "../components/Improvements/AccesibilityScore";
import ImagesNoAltText from "../components/Improvements/ImagesNoAltText";
import IncorrectHeadingHierarchy from "../components/Improvements/IncorrectHeadingHierarchy";
import KeyboardNavigation from "../components/Improvements/KeyboardNavigation";
import MissingAriaLabels from "../components/Improvements/MissingAriaLabels";
import WrongContrast from "../components/Improvements/WrongContrast";

// data

const keyboardNavigationData = [
  {
    current: 'document.addEventListener("keydown", handler);',
    suggested: 'document.addEventListener("keydown", handleKeyPress);',
    selector: "ab",
  },
  {
    current: "inputElement.focus({ preventScroll: true });",
    suggested: "inputElement.focus();",
    selector: "cd",
  },
  {
    current: "if (event.keyCode === 13) { submit(); }",
    suggested: 'if (event.key === "Enter") { submit(); }',
    selector: "abcd",
  },
];

const imagesNoAltTextData = [
  {
    imageSrc: "https://via.placeholder.com/150",
    suggestedCaption: "Placeholder image for example content.",
    htmlId: "#image1",
  },
  {
    imageSrc: "https://via.placeholder.com/150/0000FF",
    suggestedCaption: "A blue square as a placeholder.",
    htmlId: "#image2",
  },
  {
    imageSrc: "https://via.placeholder.com/150/FF0000",
    suggestedCaption: "A red square as a placeholder.",
    htmlId: "#image3",
  },
];

const incorrectHeadingHierarchyData = [
  {
    warning: "Heading level skipped from H2 to H4.",
    htmlSelector: "#section1-heading",
  },
  {
    warning: "Multiple H1 tags on the page.",
    htmlSelector: "#main-header",
  },
  {
    warning: "H3 used without a preceding H2.",
    htmlSelector: "#subsection-title",
  },
];
const contrastData = [
  {
    currentTextColor: "#FF0000", // Current text color
    suggestedTextColor: "#333333", // Suggested text color
    htmlSelector: "#header", // Selector for the element
  },
  {
    currentTextColor: "#FFFFFF",
    suggestedTextColor: "#000000",
    htmlSelector: ".footer",
  },
  // Add more entries as needed
];
const ariaData = [
  {
    details: "Missing ARIA label for the button in the header.",
    htmlSelector: "#header-button",
  },
  {
    details: "Input field lacks ARIA label for accessibility.",
    htmlSelector: ".form-input",
  },
  {
    details: "Image missing alt text and ARIA label.",
    htmlSelector: ".hero-image",
  },
];

const scoreData = {
  score: "85%", // Overall accessibility score
  totalIssues: 10, // Total number of accessibility issues
  violations: [
    { details: "Missing ARIA labels in some buttons." },
    { details: "Incorrect contrast between text and background." },
    { details: "No alt text for images." },
    { details: "Improper heading hierarchy." },
    // Add more violations as needed
  ],
};

const ReportPage = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [oldCode, setOldCode] = useState("");
  const [newCode, setNewCode] = useState("");
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
      try {
        const { data } = await axios.post("/analyze", reqBody);
        console.log("server data: ", data);
        setSuggestions(data);
        setNewCode(data.updated_dom);

        setLoading(false);
      } catch (e) {
        console.log("error in facing data: ", e);
        setLoading(false);
      }
    };
    analyzeHTML();
  }, []);

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
      <Container sx={{ width: "50%", height: "100vh", overflow: "scroll" }}>
        {/* IMPROVEMENTS SECTION */}
        <Typography variant="h3">Improvements: </Typography>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        )}
        <AccessibilityScoreCard data={scoreData} />
        <KeyboardNavigation data={keyboardNavigationData} />
        <ImagesNoAltText data={imagesNoAltTextData} />
        <IncorrectHeadingHierarchy data={incorrectHeadingHierarchyData} />
        <WrongContrast data={contrastData} />
        <MissingAriaLabels data={ariaData} />
      </Container>
      <Box sx={{ width: "50%", height: "100vh" }}>
        <ToggleComparison oldCode={oldCode} newCode={newCode} />
      </Box>
    </Box>
    // </GradientBackground>
  );
};

export default ReportPage;
