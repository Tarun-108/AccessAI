from playwright.sync_api import sync_playwright


def extract_styles(page):
    elements = page.query_selector_all("*")  # Select all elements
    styles = []

    for element in elements:
        # Get the tag name
        tag_name = element.evaluate("el => el.tagName")

        # Get inline styles
        inline_styles = element.evaluate("el => el.style.cssText")

        # Get computed styles (color and background-color)
        computed_styles = element.evaluate(
            """
            el => {
                const styles = window.getComputedStyle(el);
                return {
                    color: styles.color,
                    backgroundColor: styles.backgroundColor
                };
            }
            """
        )

        styles.append(
            {
                "tag": tag_name,
                "inline_styles": inline_styles,
                "computed_styles": computed_styles,
            }
        )

    return styles


# Start Playwright
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)  # Set headless=False for debugging
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the target URL
    url = "https://www.iana.org/help/example-domains"  # Replace with your target URL
    page.goto(url)

    # Extract styles
    styles = extract_styles(page)

    # Print extracted styles
    for style in styles:
        tag = style["tag"]
        inline = style["inline_styles"]
        computed = style["computed_styles"]
        print(f"Tag: {tag}")
        print(f"Inline Styles: {inline}")
        print(f"Computed Styles: {computed}")
        print("-" * 50)

    # Close the browser
    browser.close()
