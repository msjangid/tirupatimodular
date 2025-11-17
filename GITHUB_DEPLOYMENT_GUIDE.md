# Image Gallery Fix - GitHub Pages Deployment Guide

## Problem
On GitHub Pages, the gallery was only showing the "album" category with 102 images, while other categories (Bedroom, Ceiling, Dining, Drawing, Kitchen, Misc) showed no images.

## Root Cause
GitHub Pages doesn't support PHP execution. The original solution relied on a PHP backend (`get-images.php`) which doesn't work on static hosting.

## Solution
Created a static JSON manifest file (`images-manifest.json`) that contains all image paths for every category.

### Files to Commit to GitHub:

1. **album.html** - Updated with fallback logic
2. **images-manifest.json** - NEW - Contains all image paths  
3. **get-images.php** - Optional (for server environments)

### How It Works

The JavaScript now:
1. First tries PHP endpoint (for local/server environments)
2. Falls back to `images-manifest.json` (for GitHub Pages)
3. Dynamically generates category buttons with image counts
4. Loads images on demand when switching categories

### Manifest Structure
```json
{
  "album": ["main/album/Page1.jpg", "main/album/Page2.jpg", ...],
  "Bedroom": ["main/Bedroom/Page31.jpg", ...],
  "ceilling": [...],
  "dining": [...],
  "Drawingroom": [...],
  "Kitchen": [...],
  "misc": [...]
}
```

### Category Image Counts
- Album: 102 images
- Bedroom: 17 images  
- Ceiling: 13 images
- Dining: 4 images
- Drawing: 21 images
- Kitchen: 11 images
- Misc: 36 images

### Deployment Steps

1. Commit `images-manifest.json` to GitHub
2. Push changes to GitHub repository
3. Navigate to `https://github.io/yourusername/tirupatimodular/album.html`
4. All categories should now display with slideshow support

### Testing Locally
- Visit `http://localhost/tirupati/album.html`
- All categories should load with their respective images
- Slideshow and navigation should work for all categories
- Images are protected with watermarks

### Important Notes
- Relative image paths work consistently on both local and GitHub Pages
- Images are dynamically loaded only when category is selected
- Manifest auto-updates if new images are added (use the generation script)
- PHP endpoint still available for local environments
