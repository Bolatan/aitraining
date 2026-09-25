import os
import subprocess
from PIL import Image

def rasterize_svg(svg_path, output_png_path, width, height):
    # Using google-chrome headless to render SVG to exact PNG size
    html_content = f"""<!DOCTYPE html>
<html>
<head>
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  body, html {{ width: {width}px; height: {height}px; overflow: hidden; background: transparent; }}
  img {{ width: {width}px; height: {height}px; display: block; }}
</style>
</head>
<body>
  <img src="file://{os.path.abspath(svg_path)}" />
</body>
</html>
"""
    temp_html = f"/tmp/render_{width}x{height}.html"
    with open(temp_html, "w") as f:
        f.write(html_content)

    cmd = [
        "google-chrome",
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        f"--window-size={width},{height}",
        f"--screenshot={output_png_path}",
        temp_html
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if os.path.exists(temp_html):
        os.remove(temp_html)

    # Convert to RGBA using Pillow to guarantee 32-bit RGBA PNG
    img = Image.open(output_png_path).convert("RGBA")
    img.save(output_png_path, "PNG")

def main():
    svg_path = "src/app/icon.svg"
    sizes = [16, 32, 48, 180, 512]
    tmp_pngs = {}

    for size in sizes:
        png_path = f"/tmp/icon_{size}x{size}.png"
        print(f"Rasterizing {size}x{size}...")
        rasterize_svg(svg_path, png_path, size, size)
        tmp_pngs[size] = png_path

    # Generate ICO file using Pillow with 16x16, 32x32, 48x48
    ico_imgs = [Image.open(tmp_pngs[s]).convert("RGBA") for s in [16, 32, 48]]
    ico_imgs[0].save("src/app/favicon.ico", format="ICO", append_images=ico_imgs[1:], sizes=[(16,16), (32,32), (48,48)])
    ico_imgs[0].save("public/favicon.ico", format="ICO", append_images=ico_imgs[1:], sizes=[(16,16), (32,32), (48,48)])

    # Generate PNG app icons
    Image.open(tmp_pngs[512]).convert("RGBA").save("src/app/icon.png", "PNG")
    Image.open(tmp_pngs[512]).convert("RGBA").save("public/icon.png", "PNG")
    Image.open(tmp_pngs[180]).convert("RGBA").save("src/app/apple-icon.png", "PNG")
    Image.open(tmp_pngs[180]).convert("RGBA").save("public/apple-touch-icon.png", "PNG")

    print("Favicon generation complete!")

if __name__ == "__main__":
    main()
