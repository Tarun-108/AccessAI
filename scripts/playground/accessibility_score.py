from playwright.sync_api import sync_playwright
import requests

def get_accessibility_score(content, is_url):
    """
    Analyze the accessibility of a webpage URL using Playwright and axe-core,
    and return an accessibility index.

    :param url: The URL of the webpage to analyze.
    :return: A dictionary containing the accessibility index and issue details.
    """
    # Load the axe-core script from CDN
    axe_script_url = "https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.7.2/axe.min.js"
    axe_script = requests.get(axe_script_url).text

    with sync_playwright() as p:
        # Launch the browser
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Navigate to the target URL
        if is_url:
            page.goto(content)
        else:
            page.set_content(content)

        # Inject axe-core script
        page.evaluate(axe_script)

        # Run axe-core analysis
        results = page.evaluate("() => axe.run()")

        # Extract violations and calculate accessibility index
        violations = results["violations"]
        total_issues = sum(len(v["nodes"]) for v in violations)
        total_tests = len(results["passes"]) + len(violations)

        # Calculate accessibility index (higher is better, range 0 to 100)
        if total_tests > 0:
            accessibility_index = (1 - (total_issues / total_tests)) * 100
        else:
            accessibility_index = 100  # Perfect score if no tests failed

        # Close the browser
        browser.close()

        return {
            "url": url,
            "accessibility_index": round(accessibility_index, 2),
            "total_issues": total_issues,
            "violations": violations
        }


# Example Usage
if __name__ == "__main__":
    url = "https://google.com"  # Replace with your webpage URL
    result = get_accessibility_score(url, True)
    print(f"Accessibility Index for {url}: {result['accessibility_index']}%")
    print(f"Total Issues Found: {result['total_issues']}")
    print("Violations:")
    for violation in result['violations']:
        print(f"- {violation['id']}: {violation['description']}")
