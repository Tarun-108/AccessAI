from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

def heading_improver(content, is_url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Load content (URL or raw HTML)
        if is_url:
            page.goto(content)
        else:
            page.set_content(content)

        # Get the page content
        html_content = page.content()
        soup = BeautifulSoup(html_content, "html.parser")

        # Extract all headings
        headings = soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
        warnings = []

        # Stack to track current hierarchy
        stack = []

        for heading in headings:
            current_level = int(heading.name[1])  # Get the numeric level of the current heading

            # Check if the current heading is improperly nested
            while stack and stack[-1]['level'] >= current_level:
                stack.pop()  # Pop headings that are higher or equal in level

            # If the stack is not empty, check the parent
            if stack and stack[-1]['level'] < current_level:
                parent_heading = stack[-1]['heading']
                parent_level = stack[-1]['level']
                if current_level > parent_level:
                    # Build the CSS selector for the heading
                    selector = heading.name
                    if heading.get('id'):
                        selector += f"#{heading['id']}"  # Append ID
                    if heading.get('class'):
                        selector += ''.join([f".{cls}" for cls in heading['class']])  # Append all classes

                    warnings.append({
                        "warning": f"Heading <{heading.name}> nested inside <{parent_heading.name}>.",
                        "selector": selector,
                        "level": current_level,
                        "parent_level": parent_level
                    })

            # Push the current heading onto the stack
            stack.append({'heading': heading, 'level': current_level})

        browser.close()
        return warnings

if __name__ == "__main__":
    # Example usage: URL input
    output = heading_improver("https://www.highcharts.com/demo", True)
    print(output)
