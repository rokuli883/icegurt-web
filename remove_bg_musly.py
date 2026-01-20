from PIL import Image
import colorsys

def remove_musly_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            
            # Normalize to 0-1
            h, s, v = colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)
            h_deg = h * 360
            
            # Musly Analysis:
            # Background is Pale Yellow: Hue ~40-50, Saturation ~0.3 (30%), Value ~1.0
            # Mango is Vivid Yellow: Hue ~40-50, Saturation > 0.7 (70%)
            # Ice Cream is White: Saturation ~0
            
            # Logic: Remove pixels that are Yellow-ish AND Low Saturation
            
            is_yellow_hue = (30 < h_deg < 60)
            is_pale = (0.1 < s < 0.55) # Targeting the background saturation range (approx 0.3)
            is_bright = (v > 0.8)
            
            # Also catch very white/bright background if any
            is_very_pale_yellow = (h_deg < 70) and (s < 0.2) and (v > 0.9)
            
            if (is_yellow_hue and is_pale and is_bright) or is_very_pale_yellow:
                pixels[x, y] = (r, g, b, 0)

    img.save(output_path, "PNG")
    print(f"Saved to {output_path}")

remove_musly_bg("product_musly.png", "product_musly.png")
