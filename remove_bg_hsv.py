from PIL import Image
import colorsys

def remove_pink_bg_hsv(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    pixels = img.load()
    width, height = img.size

    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            
            # Convert to HSV
            # colorsys uses 0-1 range
            h, s, v = colorsys.rgb_to_hsv(r/255.0, g/255.0, b/255.0)
            h_deg = h * 360
            
            # Logic:
            # Background is Pink/Red: Hue around 340-360 or 0-10.
            # Ice cream is Yellow/White: Hue around 30-60.
            # Saturation of background is around 0.12 (12%).
            # Saturation of white ice cream is near 0.
            
            # Condition to remove:
            # Hue is "Red-ish/Pink" (wrapped around 0)
            is_pink_hue = (h_deg > 320) or (h_deg < 20)
            
            # And sufficient saturation to distinguish from pure grey/white
            # Using 5% as safe lower bound. If < 5% it's basically grey/white.
            is_saturated_enough = s > 0.05
            
            # Also background is bright (V high)
            is_bright = v > 0.8
            
            if is_pink_hue and is_saturated_enough and is_bright:
                pixels[x, y] = (r, g, b, 0)
                
    img.save(output_path, "PNG")
    print(f"Saved to {output_path}")

remove_pink_bg_hsv("product_brownie_helado.png", "product_brownie_helado.png")
