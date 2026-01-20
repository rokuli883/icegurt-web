from PIL import Image

def analyze_edge(image_path, edge='left'):
    img = Image.open(image_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    print(f"Analyzing {edge} edge of {image_path}...")
    
    if edge == 'left':
        for y in range(0, height, 10): # Sample every 10 pixels
            p = pixels[0, y]
            p_inner = pixels[5, y] # 5 pixels in
            print(f"y={y}: Edge={p}, Inner+5={p_inner}")

analyze_edge("product_musly.png")
