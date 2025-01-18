from bs4 import BeautifulSoup

# Static checks
def is_focusable(element):
    """Check if an element is focusable."""
    focusable_tags = {"a", "button", "input", "select", "textarea"}
    has_tabindex = element.has_attr("tabindex")
    is_hidden = "hidden" in element.get("style", "") or element.get("aria-hidden") == "true"
    return (
        element.name in focusable_tags or has_tabindex
    ) and not is_hidden

def check_tab_order(soup):
    """Check if tab order is logical."""
    focusable_elements = [
        el for el in soup.find_all() if is_focusable(el)
    ]
    tabindex_values = [el.get("tabindex", "0") for el in focusable_elements]
    tabindex_values = [
        int(value) for value in tabindex_values if value.isdigit()
    ]
    return sorted(tabindex_values) == tabindex_values

def check_skip_links(soup):
    """Check for skip links."""
    skip_links = soup.find_all("a", href=True, string=lambda s: s and "skip" in s.lower())
    return len(skip_links) > 0

def check_static_keyboard_navigation(html_content):
    """Static analysis of keyboard navigation."""
    soup = BeautifulSoup(html_content, "html.parser")

    # Check focusable elements
    focusable_elements = [el for el in soup.find_all() if is_focusable(el)]
    focusable_elements_count = len(focusable_elements)

    # Check tab order
    is_tab_order_valid = check_tab_order(soup)

    # Check skip links
    has_skip_links = check_skip_links(soup)

    return {
        "focusable_elements_count": focusable_elements_count,
        "is_tab_order_valid": is_tab_order_valid,
        "has_skip_links": has_skip_links,
    }

# Dynamic checks
def get_focusable_elements(page):
    """Retrieve selectors for all focusable elements dynamically using JavaScript."""
    return page.evaluate("""
        () => {
            const focusableSelectors = [
                'a[href]',
                'button',
                'input',
                'select',
                'textarea',
                '[tabindex]:not([tabindex="-1"])'
            ];

            const getSelectorForElement = (element) => {
                if (!element) return null;

                // If the element has an ID, return it directly
                if (element.id) return `#${element.id}`;

                // Otherwise, build a selector using tag and classes
                let selector = element.tagName.toLowerCase();
                if (element.classList.length > 0) {
                    selector += `.${Array.from(element.classList).join('.')}`;
                }

                // Add attributes like name or type if they exist
                const attributes = ['name', 'type', 'placeholder'];
                attributes.forEach(attr => {
                    if (element.hasAttribute(attr)) {
                        selector += `[${attr}="${element.getAttribute(attr)}"]`;
                    }
                });

                // Add nth-child for unique identification if necessary
                const parent = element.parentElement;
                if (parent) {
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(element) + 1; // nth-child is 1-based
                    selector += `:nth-child(${index})`;
                }

                return selector;
            };

            return Array.from(document.querySelectorAll(focusableSelectors.join(',')))
                .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null)
                .map(el => getSelectorForElement(el));
        }
    """)


def get_active_element_selector(page):
    """Get the CSS selector for document.activeElement."""
    return page.evaluate("""
        () => {
            const getSelectorForElement = (element) => {
                if (!element) return null;

                // If the element has an ID, return it directly
                if (element.id) return `#${element.id}`;

                // Otherwise, build a selector using tag and classes
                let selector = element.tagName.toLowerCase();
                if (element.classList.length > 0) {
                    selector += `.${Array.from(element.classList).join('.')}`;
                }

                // Add attributes like name or type if they exist
                const attributes = ['name', 'type', 'placeholder'];
                attributes.forEach(attr => {
                    if (element.hasAttribute(attr)) {
                        selector += `[${attr}="${element.getAttribute(attr)}"]`;
                    }
                });

                // Add nth-child for unique identification if necessary
                const parent = element.parentElement;
                if (parent) {
                    const siblings = Array.from(parent.children);
                    const index = siblings.indexOf(element) + 1; // nth-child is 1-based
                    selector += `:nth-child(${index})`;
                }

                return selector;
            };

            return getSelectorForElement(document.activeElement);
        }
    """)



def check_dynamic_tab_order(page):
    """Dynamically checks keyboard accessibility by simulating Tab key presses."""
    # Focusable elements in DOM order
    dom_focusable_elements = get_focusable_elements(page)

    # Observed focus order
    observed_focus_order = []
    page.keyboard.press("Tab")  # Start focusing the first element

    # Simulate Tab key presses and collect focused elements
    while True:
        focused_element = get_active_element_selector(page)
        if focused_element in observed_focus_order:  # Stop if we loop back
            break
        observed_focus_order.append(focused_element)
        page.keyboard.press("Tab")

    # Compare DOM order and observed order
    discrepancies = [
        {
            "tab_order": (i + 1),
            "expected": dom,
            "observed": obs
        }
        for i, (dom, obs) in enumerate(zip(dom_focusable_elements, observed_focus_order))
        if dom != obs
    ]

    return dom_focusable_elements, discrepancies