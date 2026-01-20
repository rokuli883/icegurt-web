from PIL import Image

def remove_bg_floodfill(input_path, output_path, threshold=50):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    # Smart seed selection: Check all border pixels
    border_pixels = []
    # Top and Bottom rows
    for x in range(width):
        border_pixels.append(pixels[x, 0][:3])
        border_pixels.append(pixels[x, height-1][:3])
    # Left and Right cols
    for y in range(height):
        border_pixels.append(pixels[0, y][:3])
        border_pixels.append(pixels[width-1, y][:3])
        
    from collections import Counter
    most_common_bg = Counter(border_pixels).most_common(1)[0][0]
    ref_color = most_common_bg
    print(f"Detected background color: {ref_color}")
    
    # Initialize queue with all border pixels that match the common color
    queue = []
    visited = set()
    
    # Add all matching border pixels to queue
    for x in range(width):
        for y in [0, height-1]:
            color = pixels[x, y][:3]
            if sum([abs(color[i] - ref_color[i]) for i in range(3)]) < threshold:
                queue.append((x, y))
                visited.add((x, y))
                
    for y in range(height):
        for x in [0, width-1]:
            if (x, y) not in visited:
                color = pixels[x, y][:3]
                if sum([abs(color[i] - ref_color[i]) for i in range(3)]) < threshold:
                    queue.append((x, y))
                    visited.add((x, y))

    # Directions: Up, Down, Left, Right
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    while queue:
        x, y = queue.pop(0)
        
        # Make transparent
        r, g, b, a = pixels[x, y]
        pixels[x, y] = (r, g, b, 0)
        
        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            
            if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                neighbor_color = pixels[nx, ny][:3]
                # Compare with REFERENCE color to avoid drifting too far
                # Or compare with current pixel to allow gradient? 
                # Calculating diff against the seed (ref_color) is safer to prevent bleeding
                diff = sum([abs(neighbor_color[i] - ref_color[i]) for i in range(3)])
                
                if diff < threshold:
                    queue.append((nx, ny))
                    visited.add((nx, ny))

    img.save(output_path, "PNG")
    print(f"Saved to {output_path}")

remove_bg_floodfill("product_musly.png", "product_musly.png", threshold=65)
