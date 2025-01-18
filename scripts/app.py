from flask import Flask, request, jsonify
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup

from playground.accessibility_score import get_accessibility_score

app = Flask(__name__)

def improve_img_tag(img_tag, changes):
    """Add alt text to img tags if not present."""
    if not img_tag.get("alt"):
        img_tag["alt"] = "Default alt text"
        selector = f"img[src='{img_tag.get('src')}']"
        changes.append({"type": "add_alt_text", "selector": selector, "details": "Added default alt text."})
    return img_tag

def improve_para_element(p_tag, changes):
    """Check contrast of the text and add required styles."""
    styles = p_tag.get("style", "")
    if "color" not in styles or "background-color" not in styles:
        new_styles = f"{styles}; color: black; background-color: white;"
        p_tag["style"] = new_styles
        selector = f"p:contains('{p_tag.text[:15]}')"
        changes.append({
            "type": "improve_contrast",
            "selector": selector,
            "details": "Added default color and background-color for contrast."
        })
    return p_tag

def process_dom(content, is_url):
    """Traverse the DOM and modify img and p elements."""
    changes = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        if is_url:
            page.goto(content)
        else:
            page.set_content(content)

        # Get the page content
        html_content = page.content()
        soup = BeautifulSoup(html_content, "html.parser")

        # Improve img tags
        for img_tag in soup.find_all("img"):
            improve_img_tag(img_tag, changes)

        # Improve p tags
        for p_tag in soup.find_all("p"):
            improve_para_element(p_tag, changes)

        browser.close()
        return (str(soup), changes)
    


@app.route("/analyze", methods=["POST"])
def analyze():
    """Analyze the DOM and return the updated content."""
    data = request.json
    content = data.get("content")
    is_url = data.get("is_url", True)

    print("data received", content, is_url)

    if not content:
        return jsonify({"error": "Content is required"}), 400

    try:
        # initial_score = get_accessibility_score(content, is_url)
        updated_dom, changes = process_dom(content, is_url)
        # updated_score = get_accessibility_score(updated_dom, False)
        # return jsonify({"updated_dom": updated_dom, "changes": changes, "initial_score": initial_score, "updated_score": updated_score})
        return jsonify({"updated_dom": updated_dom, "changes": changes})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
