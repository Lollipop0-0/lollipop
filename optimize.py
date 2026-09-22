#!/usr/bin/env python3
"""
Karl Evan Tabunda - Portfolio Asset Optimizer & Production Bundler
Zero-dependency (uses Python standard library + Pillow).
Generates optimized WebP images, minified styles.min.css, and bundled bundle.min.js.
"""

import os
import re
import sys
from PIL import Image, ImageOps

def optimize_images():
    print("[1/3] Optimizing Images...")
    
    # 1. Hero Image
    hero_src = "assets/images/gradpic.jpg"
    hero_dst = "assets/images/gradpic.webp"
    if os.path.exists(hero_src):
        with Image.open(hero_src) as im:
            im = ImageOps.exif_transpose(im)
            w, h = im.size
            new_w = 800
            new_h = int(h * (new_w / w))
            resized = im.resize((new_w, new_h), Image.Resampling.LANCZOS)
            resized.save(hero_dst, "WEBP", quality=85, method=6)
            s_orig = os.path.getsize(hero_src) / 1024
            s_opt = os.path.getsize(hero_dst) / 1024
            print(f"  [OK] Hero: {s_orig:.1f} KB -> {s_opt:.1f} KB ({((s_orig-s_opt)/s_orig)*100:.1f}% reduction)")

    # 2. Project Mockups
    projects = ["cup", "hotel", "inventory", "library", "smartspace", "sneakerhub"]
    for p in projects:
        src = f"assets/images/projects/{p}/preview.jpg"
        dst = f"assets/images/projects/{p}/preview.webp"
        if os.path.exists(src):
            with Image.open(src) as im:
                im.save(dst, "WEBP", quality=80, method=6)
                s_orig = os.path.getsize(src) / 1024
                s_opt = os.path.getsize(dst) / 1024
                print(f"  [OK] Project {p}: {s_orig:.1f} KB -> {s_opt:.1f} KB ({((s_orig-s_opt)/s_orig)*100:.1f}%)")

    # 3. Certificates
    certs = ["cert-cpp", "cert-css", "cert-html", "cert-javascript"]
    for c in certs:
        src = f"assets/images/certificates/{c}.png"
        dst = f"assets/images/certificates/{c}.webp"
        if os.path.exists(src):
            with Image.open(src) as im:
                im.save(dst, "WEBP", quality=82, method=6)
                s_orig = os.path.getsize(src) / 1024
                s_opt = os.path.getsize(dst) / 1024
                print(f"  [OK] Certificate {c}: {s_orig:.1f} KB -> {s_opt:.1f} KB ({((s_orig-s_opt)/s_orig)*100:.1f}%)")

    # 4. OG Preview
    og_src = "assets/images/og-preview.png"
    og_dst = "assets/images/og-preview.webp"
    if os.path.exists(og_src):
        with Image.open(og_src) as im:
            im.save(og_dst, "WEBP", quality=85, method=6)
            s_orig = os.path.getsize(og_src) / 1024
            s_opt = os.path.getsize(og_dst) / 1024
            print(f"  [OK] OG Preview: {s_orig:.1f} KB -> {s_opt:.1f} KB ({((s_orig-s_opt)/s_orig)*100:.1f}%)")

def minify_css():
    print("\n[2/3] Compiling & Minifying CSS...")
    css_files = [
        "assets/css/variables.css",
        "assets/css/base.css",
        "assets/css/components.css",
        "assets/css/sections.css",
        "assets/css/responsive.css"
    ]
    combined_css = ""
    for f in css_files:
        if os.path.exists(f):
            with open(f, "r", encoding="utf-8") as fp:
                combined_css += fp.read() + "\n"

    # Minify CSS
    css = re.sub(r"/\*[\s\S]*?\*/", "", combined_css)
    css = re.sub(r"\s*([\{\}\:\;\,])\s*", r"\1", css)
    css = re.sub(r";\}", "}", css)
    css = re.sub(r"\s+", " ", css).strip()

    out_css = "assets/css/styles.min.css"
    with open(out_css, "w", encoding="utf-8") as fp:
        fp.write(css)

    s_orig = len(combined_css.encode("utf-8")) / 1024
    s_min = len(css.encode("utf-8")) / 1024
    print(f"  [OK] CSS Bundle: {s_orig:.1f} KB -> {s_min:.1f} KB ({((s_orig-s_min)/s_orig)*100:.1f}% reduction)")

def bundle_js():
    print("\n[3/3] Compiling & Bundling JavaScript...")
    js_files = [
        "assets/js/data.js",
        "assets/js/theme.js",
        "assets/js/navigation.js",
        "assets/js/error-state.js",
        "assets/js/modal.js",
        "assets/js/projects.js",
        "assets/js/github.js",
        "assets/js/contact.js",
        "assets/js/search.js",
        "assets/js/components.js",
        "assets/js/visitors.js",
        "assets/js/app.js"
    ]
    combined_js = ""
    for f in js_files:
        if os.path.exists(f):
            with open(f, "r", encoding="utf-8") as fp:
                combined_js += f"\n/* --- {os.path.basename(f)} --- */\n" + fp.read() + "\n;\n"

    # Strip block comments and pure comment lines
    lines = []
    for line in combined_js.splitlines():
        line_s = line.strip()
        if line_s.startswith("//"):
            continue
        lines.append(line)
    js = "\n".join(lines)
    js = re.sub(r"/\*[\s\S]*?\*/", "", js)
    js = re.sub(r"\n\s*\n+", "\n", js).strip()

    out_js = "assets/js/bundle.min.js"
    with open(out_js, "w", encoding="utf-8") as fp:
        fp.write(js)

    s_orig = len(combined_js.encode("utf-8")) / 1024
    s_min = len(js.encode("utf-8")) / 1024
    print(f"  [OK] JS Bundle: {s_orig:.1f} KB -> {s_min:.1f} KB ({((s_orig-s_min)/s_orig)*100:.1f}% reduction)")

if __name__ == "__main__":
    optimize_images()
    minify_css()
    bundle_js()
    print("\n[DONE] All production assets compiled and optimized successfully!")
