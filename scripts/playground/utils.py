from PIL import Image
import base64
import os
import base64
import cv2
from skimage.metrics import structural_similarity as ssim
from playwright.sync_api import sync_playwright
import numpy as np


def take_screenshot(html_content):
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
    with Image.open(screenshot_path) as s:
        screenshot = np.array(s)

    os.remove(temp_file)
    os.remove(screenshot_path)
    return screenshot


def compare_screenshots(old_img, new_img):

    if new_img is None or old_img is None:
        raise Exception("Both old and new images required")

    # Ensure the images are the same size
    if new_img.shape != old_img.shape:
        raise Exception("Images must have the same dimensions for comparison.")

    # Convert the images to grayscale for SSIM comparison
    new_img_gray = cv2.cvtColor(new_img, cv2.COLOR_BGR2GRAY)
    old_img_gray = cv2.cvtColor(old_img, cv2.COLOR_BGR2GRAY)

    # Calculate SSIM (Structural Similarity Index)
    score, diff = ssim(new_img_gray, old_img_gray, full=True)
    diff = (diff * 255).astype("uint8")  # Scale the difference image to 255

    # You can return the SSIM score and the diff image
    _, buffer = cv2.imencode(".png", diff)
    diff_img_base64 = base64.b64encode(buffer).decode("utf-8")

    return diff_img_base64, score


def get_selector(tag):
    """Generate a CSS selector for a given element."""
    if not tag:
        return None

    # If the element has an ID, use it
    if tag.get("id"):
        return f"#{tag['id']}"

    # Build the selector using the tag name and classes
    selector = tag.name
    if tag.get("class"):
        classes = ".".join(tag["class"])
        selector += f".{classes}"

    # Add attributes like name, type, or placeholder if they exist
    attributes = ["name", "type", "placeholder"]
    for attr in attributes:
        if tag.get(attr):
            selector += f'[{attr}="{tag[attr]}"]'

    # Add nth-child for unique identification if necessary
    parent = tag.find_parent()
    if parent:
        siblings = parent.find_all(tag.name, recursive=False)
        if len(siblings) > 1:  # Only add nth-child if there are multiple siblings
            index = siblings.index(tag) + 1  # nth-child is 1-based
            selector += f":nth-child({index})"

    return selector
