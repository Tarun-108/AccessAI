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
