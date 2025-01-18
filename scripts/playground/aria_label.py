

def detect_detailed_aria_issues(soup):
    issues = []

    # Check for landmark roles
    landmarks = ['banner', 'main', 'navigation', 'contentinfo']
    for element in soup.find_all():
        if 'role' in element.attrs and element['role'] in landmarks:
            continue
        elif element.name in ['header', 'footer', 'nav'] and 'role' not in element.attrs:
            issues.append({
                "element": str(element),
                "issue": f"Missing landmark role for {element.name}. Suggested role: {landmarks}"
            })

    # Check for interactive elements without proper ARIA roles
    for element in soup.find_all():
        if element.name == 'div' and element.has_attr('onclick') and 'role' not in element.attrs:
            issues.append({
                "element": str(element),
                "issue": "Interactive div missing role attribute. Suggested role: 'button'."
            })

    # Check for aria-live issues
    for live_region in soup.find_all(attrs={'aria-live': True}):
        if live_region['aria-live'] not in ['polite', 'assertive']:
            issues.append({
                "element": str(live_region),
                "issue": f"Invalid aria-live value: {live_region['aria-live']}. Use 'polite' or 'assertive'."
            })

    return issues
