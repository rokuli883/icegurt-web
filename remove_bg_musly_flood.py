from PIL import Image

def remove_musly_flood_aggressive(input_path, output_path, threshold=90):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    # Force seed from top-right which seems to be the problematic area color
    seed_x, seed_y = width - 1, 0 
    ref_color = pixels[seed_x, seed_y][:3]
    print(f"Reference color from Top-Right: {ref_color}")
    
    # Initialize queue with corners (standard)
    bg_candidates = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
    queue = []
    visited = set()
    
    for x, y in bg_candidates:
        queue.append((x, y))
        visited.add((x, y))

    # Directions: Up, Down, Left, Right
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    # B: Blue channel is the key discriminator between Pale Yellow Bg and Vivid Mango
    # Bg Blue ~ 170-180. Mango Blue ~ 0-50.
    
    count_removed = 0
    while queue:
        x, y = queue.pop(0)
        
        # Make transparent
        # pixels[x, y] = (255, 255, 255, 0) 
        # Actually set alpha to 0
        r, g, b, a = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        count_removed += 1
        
        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            
            if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                curr_color = pixels[nx, ny][:3]
                
                # Check 1: RGB Distance from Reference
                diff = sum([abs(curr_color[i] - ref_color[i]) for i in range(3)])
                
                # Check 2: Safety Check on Blue Channel (protect Mango)
                # Mango is yellow/orange (low Blue). Bg is pale yellow (med Blue).
                # If Blue < 50, it is definitely fruit -> PROTECT.
                is_fruit = curr_color[2] < 80

                # Check 3: Safety Check for Whites (Ice Cream)
                # Ice cream is bright white. Bg is yellowish.
                # If sum > 720 (avg 240+), it's white -> PROTECT.
                is_white = sum(curr_color) > 720
                
                if diff < threshold and not is_fruit and not is_white:
                    queue.append((nx, ny))
                    visited.add((nx, ny))

    img.save(output_path, "PNG")
    print(f"Saved to {output_path}. Removed {count_removed} pixels.")

remove_musly_flood_aggressive("product_musly.png", "product_musly.png", threshold=55)
