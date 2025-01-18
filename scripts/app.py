from flask import Flask, request, jsonify
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from flask_cors import CORS
from playground.tag_improver import generate_caption, generate_aria_label, check_for_label
from playground.utils import get_selector, decode_image
from playground.keyboard_navigation_checker import check_dynamic_tab_order
import os
import base64
import cv2
from skimage.metrics import structural_similarity as ssim
from improve_contrast import improve_text_contrast

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


def improve_img_tag(img_tag, changes):
    """Add alt text to img tags if not present."""
    if not img_tag.get("alt"):
        img_url = img_tag.get("src", None)
        if img_url is not None:
            captions = generate_caption(img_url)
            if captions is not None:
                img_tag["alt"] = captions[0]
                changes.append({
                    "type": "add_alt_text", 
                    "success": True,
                    "details": "image alt text added",
                    "selector": get_selector(img_tag),
                    "suggestions": captions,
                })
            else:
                changes.append({
                "type": "add_alt_text", 
                "success": False,
                "details": "image url is invalid",
                "selector": get_selector(img_tag),
                "suggestions": "Image change failed",
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
        except Exception as e:
            print("error in process_dom: ", e)

        browser.close()
        return str(soup), changes, focusable, discrepancies

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
        updated_dom, changes, focusable, discrepancies = process_dom(content, is_url)
    except Exception as e:
        print("error: ", e)
        return jsonify({"error": str(e)}), 500
    return jsonify(
            {
                "updated_dom": updated_dom, 
                "changes": changes,
                "focusable_elements": focusable,
                "discrepancies": discrepancies
            }
        )
    
@app.route("/screen-capture", methods=["POST"])
def take_screenshot():
    """Capture a screenshot of the provided HTML content."""
    data = request.json
    html_content = data.get("content")
    print(f"/screen-capture {html_content}")

    if not html_content:
        return jsonify({"error": "HTML content is required"}), 400

    try:
        temp_file = "temp.html"
        with open(temp_file, "w", encoding="utf-8") as file:
            file.write(html_content)

        with sync_playwright() as p:
            browser = p.chromium.launch()
            page = browser.new_page()
            page.set_content(html_content)  
            screenshot_path = "screenshot.png"
            page.screenshot(path=screenshot_path)
            browser.close()
        with open(screenshot_path, "rb") as img_file:
            screenshot_base64 = base64.b64encode(img_file.read()).decode("utf-8")

        os.remove(temp_file)
        os.remove(screenshot_path)

        return jsonify({"screenshot": screenshot_base64}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/compare", methods=["POST"])
def compare_screenshots():
    data = request.json
    new_img = data.get("new_img", None)
    old_img = data.get("old_img", None)
    
    if new_img is None or old_img is None:
        return jsonify({"error": "both images required"})
    
    # Decode the base64 images
    try:
        new_img_array = decode_image(new_img)
        old_img_array = decode_image(old_img)
    except Exception as e:
        return jsonify({"error": f"Image decoding failed: {str(e)}"}), 400

    # Ensure the images are the same size
    if new_img_array.shape != old_img_array.shape:
        return jsonify({"error": "Images must have the same dimensions for comparison."}), 400

    # Convert the images to grayscale for SSIM comparison
    new_img_gray = cv2.cvtColor(new_img_array, cv2.COLOR_BGR2GRAY)
    old_img_gray = cv2.cvtColor(old_img_array, cv2.COLOR_BGR2GRAY)

    # Calculate SSIM (Structural Similarity Index)
    score, diff = ssim(new_img_gray, old_img_gray, full=True)
    diff = (diff * 255).astype("uint8")  # Scale the difference image to 255

    # You can return the SSIM score and the diff image
    _, buffer = cv2.imencode(".png", diff)
    diff_img_base64 = base64.b64encode(buffer).decode("utf-8")

    return jsonify({
        "ssim_score": score,
        "diff_image": diff_img_base64
    })
    

if __name__ == "__main__":
    app.run(debug=True)
