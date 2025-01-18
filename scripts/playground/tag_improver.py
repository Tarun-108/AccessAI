import requests
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import torch
from time import time 


processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained(
    "Salesforce/blip-image-captioning-base"
)
device = "cuda" if torch.cuda.is_available() else "cpu"

def generate_caption(img_url, prompts=None):
    try:
        img = requests.get(img_url, stream=True)
    except:
        return None
    raw_image = Image.open(img.raw).convert("RGB")
    if prompts is None:
        prompts = ["a photograph of", "an image of", ""]
    captions = []
    start = time()
    for text in prompts:
        inputs = processor(raw_image, text, return_tensors="pt").to(device, torch.float16)
        out = model.generate(**inputs)
        captions.append(processor.decode(out[0], skip_special_tokens=True))
    elapsed = time() - start
    print(elapsed)
    return captions

def generate_aria_label(tag):
    changed = True
    if tag.get("aria-label"):
        changed = False
    elif tag.get("id"):
        tag["aria-label"] = tag["id"]
    elif tag.get("name"):
        tag["aria-label"] = tag["name"]
    elif tag.get("class"):
        classes = " ".join(tag["class"])
        tag["aria-label"] = classes
    elif tag.get("type"):
        tag["aria-label"] = tag["type"]
    else:
        tag["aria-label"] = tag.name
    return tag, changed

def check_for_label(parent, tag):
    id = tag.get("id", None)
    if id is None:
        return False
    label = parent.find_all("label", {"for": id})
    if len(label) == 0 or label[0] is None or label[0].decode_contents() == "":
        return False 
    return True