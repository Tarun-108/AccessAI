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
