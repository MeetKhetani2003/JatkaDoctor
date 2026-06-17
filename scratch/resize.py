import os
from PIL import Image

def resize_logo():
    logo_path = r"c:\Users\meetk\OneDrive\Desktop\jatka\public\Dr.Jhatka.png"
    out_192 = r"c:\Users\meetk\OneDrive\Desktop\jatka\public\icon-192.png"
    out_512 = r"c:\Users\meetk\OneDrive\Desktop\jatka\public\icon-512.png"
    
    if not os.path.exists(logo_path):
        print(f"Error: Logo file not found at {logo_path}")
        return
        
    try:
        img = Image.open(logo_path)
        
        # We need a square icon. Let's crop to square from center if not already square
        w, h = img.size
        min_dim = min(w, h)
        left = (w - min_dim) / 2
        top = (h - min_dim) / 2
        right = (w + min_dim) / 2
        bottom = (h + min_dim) / 2
        
        square_img = img.crop((left, top, right, bottom))
        
        # Resize
        img_192 = square_img.resize((192, 192), Image.Resampling.LANCZOS)
        img_192.save(out_192, "PNG")
        print(f"Saved 192x192 icon to {out_192}")
        
        img_512 = square_img.resize((512, 512), Image.Resampling.LANCZOS)
        img_512.save(out_512, "PNG")
        print(f"Saved 512x512 icon to {out_512}")
        
    except Exception as e:
        print(f"Failed to resize image: {e}")

if __name__ == "__main__":
    resize_logo()
