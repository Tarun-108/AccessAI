from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
# from utils import get_selector

def heading_improver(soup):
   
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
                # selector= get_selector(heading)
                # Exclude warnings where selector is just a single tag
                if '#' in selector or '.' in selector:
                    warnings.append({
                        "warning": f"Heading <{heading.name}> nested inside <{parent_heading.name}>.",
                        "selector": selector,
                        "level": current_level,
                        "parent_level": parent_level
                    })

        # Push the current heading onto the stack
        stack.append({'heading': heading, 'level': current_level})

    return warnings

