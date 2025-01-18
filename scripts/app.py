from flask import Flask, request, jsonify
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from playground.tag_improver import generate_caption, generate_aria_label, check_for_label
from playground.utils import get_selector
from playground.keyboard_navigation_checker import check_dynamic_tab_order

from playground.heading_improver import heading_improver
from improve_contrast import improve_text_contrast

app = Flask(__name__)


def improve_img_tag(img_tag, changes):
    """Add alt text to img tags if not present."""
    if not img_tag.get("alt"):
        img_url = img_tag.get("src", None)
        if img_url is not None:
            captions = generate_caption(img_url)
            img_tag["alt"] = captions[0]
            changes.append({
                "type": "add_alt_text", 
                "success": True,
                "details": "image alt text added",
                "selector": get_selector(img_tag),
                "suggestions": captions,
            })
        else:
            img_tag["alt"] = "Image not found"
            changes.append({
                "type": "add_alt_text", 
                "success": False,
                "details": "image url is none",
                "selector": get_selector(img_tag),
                "suggestions": "Image change failed",
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
    form, changed = generate_aria_label(form)
    if changed:
        if form["aria-label"] is not None:
            changes.append({
                "type": "add_aria_label", 
                "success": True,
                "details": "form aria-label changed",
                "selector": get_selector(form),
                "suggestions": form["aria-label"],
            })
        else:
            changes.append({
                "type": "add_aria_label", 
                "success": False,
                "details": "form aria-label not found",
                "selector": get_selector(form),
                "suggestions": form["aria-label"]
            })
    child_elements = form.find_all(["input", "select", "textarea"])
    for element in child_elements:
        element, changed = generate_aria_label(element)
        element_selector = get_selector(element)
        label_found = check_for_label(form, element)
        if not label_found:
            changes.append({
                "type": "add_label",
                "success": False,
                "details": f"element {element_selector} label not found",
                "selector": element_selector,
                "suggestions": f"add label for {element_selector}"
            })
        if changed:
            changes.append({
                "type": "add_aria_label", 
                "success": True,
                "details": f"element {element_selector} aria-label changed",
                "selector": element_selector,
                "suggestions": element["aria-label"],
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
        
        try:
            for img_tag in soup.find_all("img"):
                improve_img_tag(img_tag, changes)
            
            for form in soup.find_all("form"):
                improve_form_tag(form, changes)

            # Improve contrast
            improve_text_contrast(page, changes)

            # Improve p tags
            for p_tag in soup.find_all("p"):
                improve_para_element(p_tag, changes)
            
            focusable, discrepancies = check_dynamic_tab_order(page)

            heading_warnings = heading_improver(soup)

        except Exception as e:
            print("error in process_dom: ", e)

        browser.close()
        return str(soup), changes, focusable, discrepancies, heading_warnings

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
        updated_dom, changes, focusable, discrepancies, heading_warnings = process_dom(content, is_url)
    except Exception as e:
        print("error: ", e)
        return jsonify({"error": str(e)}), 500
    

    return jsonify(
            {
                "updated_dom": updated_dom, 
                "changes": changes,
                "tab":{
                    "focusable_elements": focusable,
                    "discrepancies": discrepancies
                },
                "heading_warnings": heading_warnings
            }
        )

if __name__ == "__main__":
    app.run(debug=True)
