from flask import Flask, request, jsonify
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from playground.tag_improver import generate_caption, generate_label
from flask_cors import CORS
from improve_contrast import improve_text_contrast

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def get_selector(tag):
    if tag.get("id"):
        return f"#{tag['id']}"
    elif tag.get("class"):
        classes = ".".join(tag["class"])
        return f"#{tag.name}.{classes}"
    return tag.name

def improve_img_tag(img_tag, changes):
    """Add alt text to img tags if not present."""
    if not img_tag.get("alt"):
        img_url = img_tag.get("src", None)
        if img_url is not None:
            captions, elapsed = generate_caption(img_url)
            img_tag["alt"] = captions[0]
            changes.append({
                "type": "add_alt_text", 
                "success": True,
                "details": "change successful",
                "selector": get_selector(img_tag),
                "captions": captions,
                "time_elapsed": elapsed
            })
        else:
            img_tag["alt"] = "Image not found"
            changes.append({
                "type": "add_alt_text", 
                "success": False,
                "details": "image not found",
                "selector": get_selector(img_tag),
                "captions": captions,
                "time_elapsed": elapsed
            })

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

def improve_form_tag(form, changes):
    form, changed = generate_label(form)
    if changed:
        if form["label"] is not None:
            changes.append({
                "type": "add_label", 
                "success": True,
                "details": "form label changed",
                "selector": get_selector(form),
                "label": form["label"],
            })
        else:
            changes.append({
                "type": "add_label", 
                "success": False,
                "details": "form label not found",
                "selector": get_selector(form),
                "label": form["label"]
            })
    for element in form.elements:
        if changed:
            if element["label"] is not None:
                changes.append({
                    "type": "add_label", 
                    "success": True,
                    "details": "form label changed",
                    "selector": get_selector(element),
                    "label": element["label"],
                })
            else:
                changes.append({
                    "type": "add_label", 
                    "success": False,
                    "details": "form label not found",
                    "selector": get_selector(element),
                    "label": element["label"]
                })

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
            
        for form in soup.find_all("form"):
            improve_form_tag(form, changes)

        # Improve contrast
        improve_text_contrast(page, changes)


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
        updated_dom, changes = process_dom(content, is_url)
        return jsonify({"updated_dom": updated_dom, "changes": changes})
    except Exception as e:
        print("error: ", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
