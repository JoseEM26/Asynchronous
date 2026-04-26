from PIL import Image
import sys

def make_transparent(image_path, output_path, target_color):
    img = Image.open(image_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    # Umbral para el color (por si no es puro perfecto)
    threshold = 30 
    
    for item in datas:
        # target_color es (R, G, B)
        dist = sum(abs(item[i] - target_color[i]) for i in range(3))
        if dist < threshold:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")

# Light logo (remover blanco)
make_transparent(
    "/Users/xcode/.gemini/antigravity/brain/32936d70-4b18-4ffc-8193-136f8a6e65d3/geocheck_logo_light_solid_1777217487461.png",
    "/Users/xcode/.gemini/antigravity/brain/32936d70-4b18-4ffc-8193-136f8a6e65d3/logo_light_trans.png",
    (255, 255, 255)
)

# Dark logo (remover negro)
make_transparent(
    "/Users/xcode/.gemini/antigravity/brain/32936d70-4b18-4ffc-8193-136f8a6e65d3/geocheck_logo_dark_solid_1777217509008.png",
    "/Users/xcode/.gemini/antigravity/brain/32936d70-4b18-4ffc-8193-136f8a6e65d3/logo_dark_trans.png",
    (0, 0, 0)
)
