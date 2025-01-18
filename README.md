<div>
  <h1>AccesAI - AI-Powered Accessibility Enhancement</h1>

  <p><strong>Team Name</strong>: Cache Me If You Can</p>
  <p><strong>Team Code</strong>: AG02</p>
  <p><strong>Team Leader</strong>: Anurag Mishra</p>

  <hr>

  <div>
    <h2>About AccesAI</h2>
    <p>AccesAI is an AI-driven tool designed to enhance web accessibility, ensuring a more inclusive digital experience for individuals with disabilities. Our solution focuses on the detection and remediation of common accessibility issues, adhering to WCAG standards.</p>
  </div>

  <hr>

  <div>
    <h2>Features</h2>
    <ul>
      <li><strong>Alt Text Detection and Generation</strong>: Automatically identifies images without descriptive alt texts and generates meaningful replacements.</li>
      <li><strong>Keyboard Navigation Checker</strong>: Ensures all interactive elements are accessible via keyboard navigation.</li>
      <li><strong>Contrast Analysis</strong>: Detects poor color contrast and suggests WCAG-compliant adjustments.</li>
      <li><strong>Unclear Labels Detection</strong>: Identifies and enhances unclear or missing labels for form and interactive elements.</li>
      <li><strong>ARIA Attributes Integration</strong>: Validates and improves ARIA roles and properties for better assistive technology support.</li>
    </ul>
  </div>

  <hr>

  <div>
    <h2>Technical Approach</h2>
    <p><strong>Frontend:</strong> React</p>
    <p><strong>Backend:</strong> Flask</p>
    <p><strong>Languages:</strong> Python, JavaScript</p>
    <p><strong>Modules/Tools:</strong> Hugging Face, BeautifulSoup, Playwright, OpenCV</p>
    <ol>
      <li><strong>Web Scraping and Parsing</strong>:
        <ul>
          <li>Tools: BeautifulSoup, Playwright</li>
          <li>Extracted and evaluated HTML/CSS structures.</li>
        </ul>
      </li>
      <li><strong>Feature Implementation</strong>:
        <ul>
          <li>Hugging Face Model: Analyzed images and detected missing alt texts.</li>
          <li>Text Analysis: Assessed labels and content clarity.</li>
          <li>Contrast Ratio Calculations: Ensured WCAG compliance.</li>
          <li>Keyboard Navigation Analysis: Verified tab order and focus-ability, and improved the same.</li>
          <li>ARIA Checker: Detected missing or misused ARIA attributes.</li>
        </ul>
      </li>
      <li><strong>Validation</strong>:
        <ul>
          <li>Utilized OpenCV for screenshot comparisons.</li>
        </ul>
      </li>
    </ol>
  </div>

  <hr>

  <div>
    <h2>How It Works</h2>
    <ol>
      <li>Input the website URL into the AccesAI interface.</li>
      <li>The system scrapes and analyzes the website’s structure and content.</li>
      <li>Accessibility issues are identified, categorized, and displayed in a user-friendly dashboard.</li>
      <li>Suggestions and automated fixes are applied, generating improved code.</li>
      <li>Visual validation ensures the changes enhance accessibility without compromising design.</li>
      Below is the high level design diagram depicting the flow<br>
      ![System Architecture Diagram](https://github.com/user-attachments/assets/878b289c-bbdd-4cd8-bfe2-5ca5fad6f6d2)
    </ol>
  </div>

  <hr>
</div>
