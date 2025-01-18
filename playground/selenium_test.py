from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()
    url = "https://www.iana.org/help/example-domains"
    page.goto(url)
    elements = page.query_selector_all("*")
    for element in elements:
        tag_name = element.evaluate("el => el.tagName")
        attributes = element.evaluate(
            """
            el => {
                const attrs = {};
                for (const attr of el.attributes) {
                    attrs[attr.name] = attr.value;
                }
                return attrs;
            }
            """
        )

        print(f"Tag: {tag_name}, Attributes: {attributes}")
    browser.close()
