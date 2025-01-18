import requests
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
import torch
from time import time 
from bs4 import BeautifulSoup

soup = BeautifulSoup()


processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained(
    "Salesforce/blip-image-captioning-base"
)
device = "cuda" if torch.cuda.is_available() else "cpu"

def generate_caption(img):
    raw_image = Image.open(requests.get(img["src"], stream=True).raw).convert("RGB")
    prompts = ["a photograph of", "an image of", ""]
    captions = []
    start = time()
    for text in prompts:
        inputs = processor(raw_image, text, return_tensors="pt").to(device, torch.float16)
        out = model.generate(**inputs)
        captions.append(processor.decode(out[0], skip_special_tokens=True))
    print(f"{time() - start:.2f}")
    return captions
