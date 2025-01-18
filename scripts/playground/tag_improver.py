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
    print(f"kya yaha aya")
    raw_image = Image.open(requests.get(img_url, stream=True).raw).convert("RGB")
    if prompts is None:
        prompts = ["a photograph of", "an image of", ""]
    captions = []
    print(f"yahaa aya")
    start = time()
    for text in prompts:
        inputs = processor(raw_image, text, return_tensors="pt").to(device, torch.float16)
        out = model.generate(**inputs)
        captions.append(processor.decode(out[0], skip_special_tokens=True))
    elapsed = time() - start
    return captions, elapsed

def generate_label(tag):
    changed = True
    if tag.get("label"):
        changed = False
    elif tag.get("id"):
        tag["label"] = tag["id"]
    elif tag.get("name"):
        tag["label"] = tag["name"]
    elif tag.get("class"):
        classes = " ".join(tag["class"])
        tag["label"] = classes
    elif tag.get("type"):
        tag["label"] = tag["type"]
    else:
        tag["label"] = None
    return tag, changed