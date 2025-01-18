from playwright.sync_api import sync_playwright


def luminance(color):
    """Calculate the luminance of a color in RGB format."""
    r, g, b = [x / 255 for x in color]
    
    def adjust(value):
        return value / 12.92 if value <= 0.03928 else ((value + 0.055) / 1.055) ** 2.4

    return 0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b)

def contrast_ratio(color1, color2):
    """Calculate the contrast ratio between two RGB colors."""
    lum1 = luminance(color1)
    lum2 = luminance(color2)
    return (max(lum1, lum2) + 0.05) / (min(lum1, lum2) + 0.05)

def hex_to_rgb(hex_color):
    """Convert a hex color code to RGB."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def improve_text_contrast(page, changes):
    """Extract all elements containing text, their computed styles, and CSS selectors, and improve contrast."""
    # page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
    elements_with_text = page.evaluate("""
    () => {
        const elements = [];
        function getElementSelector(element) {
            const tag = element.tagName.toLowerCase();
            const id = element.id ? `#${element.id}` : '';
            const classes = element.classList.length > 0 ? `.${Array.from(element.classList).join('.')}` : '';
            const name = element.name ? `[name="${element.name}"]` : '';
            const type = element.type ? `[type="${element.type}"]` : '';
            const href = element.href ? `[href="${element.href}"]` : '';
            const src = element.src ? `[src="${element.src}"]` : '';

            const selectorParts = [tag, id, classes, name, type, href, src].filter(Boolean);

            if (selectorParts.length === 0) {
                return tag;
            }

            return selectorParts.join('');
        }
        function getEffectiveBackgroundColor(rgbColor) {
            if (
                rgbColor[0] == 0 &&
                rgbColor[1] == 0 &&
                rgbColor[2] == 0 &&
                rgbColor[3] == 0
            ) {
                return [255, 255, 255, 1];
            }
            return rgbColor;
        }
        function parseColor(color) {
            const rgbaRegex =
                /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d*\.?\d+))?\s*\)$/;

            const match = color.match(rgbaRegex);

            if (!match) {
                throw new Error(
                "Invalid color format. Expected rgb(r, g, b) or rgba(r, g, b, a)."
                );
            }

            const red = parseInt(match[1], 10);
            const green = parseInt(match[2], 10);
            const blue = parseInt(match[3], 10);
            const alpha = match[4] !== undefined ? parseFloat(match[4]) : 1; // Default alpha to 1 if not provided

            return [red, green, blue, alpha];
        }
        function luminance(r, g, b) {
            var a = [r, g, b].map(function (v) {
                v /= 255;
                return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
            });
            return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        }
        document.querySelectorAll("*").forEach((el) => {
            const parentText = Array.from(el.childNodes)
                .filter(node => node.nodeType === Node.TEXT_NODE)  // Only text nodes
                .map(node => node.nodeValue.trim())  // Trim the text content
                .filter(text => text.length > 0)    // Ignore empty text
                .join(" ");                         // Join multiple text nodes (if any)

            if (parentText) {
                const styles = window.getComputedStyle(el);
                console.log(el.tagName.toLowerCase());
                console.log("text: ", parentText);
                const textColor = styles.color;
                const backgroundColor = styles.backgroundColor;
                let clrTxt = parseColor(textColor), clrBG = parseColor(backgroundColor);
                clrBG = getEffectiveBackgroundColor(clrBG);
                const color1luminance = luminance(...clrTxt);
                const color2luminance = luminance(...clrBG);

                let contrastRatio =
                    color1luminance > color2luminance
                    ? (color2luminance + 0.05) / (color1luminance + 0.05)
                    : (color1luminance + 0.05) / (color2luminance + 0.05);

                
                console.log("textColor, back: ", textColor, backgroundColor)

                // WCAG minimum contrast ratios: 4.5:1 for normal text and 3:1 for large text
                const minimumContrast = el.innerText.trim().length > 40 ? 3 : 4.5;

                // If contrast is insufficient, adjust text color (for simplicity)
                if (contrastRatio < minimumContrast) {
                    let [adjustedR, adjustedG, adjustedB] = clrTxt;
                    let lighten = contrastRatio < 1; // Lighten if text is darker than background

                    while (contrastRatio < 4.5) {
                        if (lighten) {
                            adjustedR = Math.min(255, adjustedR + 10);
                            adjustedG = Math.min(255, adjustedG + 10);
                            adjustedB = Math.min(255, adjustedB + 10);
                        } else {
                            adjustedR = Math.max(0, adjustedR - 10);
                            adjustedG = Math.max(0, adjustedG - 10);
                            adjustedB = Math.max(0, adjustedB - 10);
                        }

                        const newLuminance = luminance(adjustedR, adjustedG, adjustedB);
                        contrastRatio =
                            (Math.max(newLuminance, color2luminance) + 0.05) /
                            (Math.min(newLuminance, color2luminance) + 0.05);

                        // Break if neither lightening nor darkening can improve contrast
                        if (
                            adjustedR === 255 &&
                            adjustedG === 255 &&
                            adjustedB === 255 &&
                            lighten
                        ) {
                            lighten = false; // Switch to darkening
                        } else if (
                            adjustedR === 0 &&
                            adjustedG === 0 &&
                            adjustedB === 0 &&
                            !lighten
                        ) {
                            break;
                        }
                    }
                    const updatedColor = `rgb(${adjustedR}, ${adjustedG}, ${adjustedB})`;
                    el.style.color = updatedColor;
                    elements.push({
                        tag: el.tagName.toLowerCase(),
                        text_color: textColor,
                        new_text_color: updatedColor,
                        selector: getElementSelector(el)
                    });
                }
            }
        });

        return elements;
    }
    """)

    for element in elements_with_text :
        changes.append({
            "type": "improve_contrast",
            "selector": element["selector"],
            "success": True,
            "details": f"Updated text color from {element['text_color']} to {element['new_text_color']}."
        })

    return elements_with_text

if __name__ == "__main__":
    html_content = """
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<html>
    <div style="color: aliceblue;">With bad contrast</div>
    <img src="https://picsum.photos/200/300"> 
    <form>
        <label for="name"></label>
        <input name="name" id="name">  
        <label for="email"></label>
        <input type="email" id="email">
        <input type="text" id="cat">
    </form>
</body>
</html>
    """
    # res = improve_text_contrast(html_content)
    # print("changes: ", res)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.set_content(html_content)
        changes = []
        elements = improve_text_contrast(page, changes)
        print("changes length: ", len(elements))
        print("changes: ", elements)
        print("updated html: ", page.content())

