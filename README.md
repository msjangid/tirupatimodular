# Tirupati Furniture Showcase Website

## Issues Fixed

### 1. Carousel Not Working
**Problem**: Images were not loading due to case sensitivity issues between JavaScript file references and actual file extensions.

**Solution**: Updated the image paths in `js/script.js` to match the actual file extensions:
- `carousel2.jpg` → `carousel2.JPG`
- `carousel3.jpg` → `carousel3.JPG` 
- `carousel5.jpg` → `carousel5.JPG`
- `d1.jpg` → `D1.JPG`
- `l1.jpg` → `l1.JPG`
- `bd2.jpg` → `bd2.JPG`

### 2. Image Modal Not Opening
**Problem**: Product images had no click handlers to open in modal view.

**Solution**: 
- Added click event listeners to all product containers
- Implemented zoom modal functionality with magnifier effect
- Added proper modal close functionality (Escape key, click outside, close button)
- Added hover effects and visual feedback

### 3. Enhanced Features Added
- **Loading states**: Added loading spinners for carousel initialization
- **Error handling**: Better error messages and console logging
- **Image preloading**: Ensures images are loaded before display
- **Magnifier effect**: Added zoom functionality to modal images
- **Keyboard navigation**: Arrow keys for carousel, Escape to close modals
- **Touch/swipe support**: Mobile-friendly carousel navigation
- **Auto-play**: Carousel automatically advances every 5 seconds
- **Responsive design**: Proper mobile and tablet support

## How to Run

### Method 1: Using Python HTTP Server (Recommended for testing)
```bash
cd "C:\Users\dell\Desktop\Tirupati"
python -m http.server 8000
```
Then open: http://localhost:8000

### Method 2: Using Node.js Server (For full functionality)
```bash
cd "C:\Users\dell\Desktop\Tirupati"
npm install
npm start
```
Then open: http://localhost:3000

## File Structure
```
├── index.html          # Main homepage
├── css/
│   └── styles.css      # Custom styles and animations
├── js/
│   └── script.js       # Carousel and modal functionality
├── assets/images/      # All product and carousel images
├── server.js          # Node.js server (optional)
└── package.json       # Dependencies
```

## Features
- ✅ Working image carousel with auto-advance
- ✅ Clickable product images with zoom modal
- ✅ Magnifier effect on hover in modal
- ✅ Mobile-responsive design
- ✅ Keyboard and touch navigation
- ✅ Loading states and error handling

## Browser Compatibility
- Chrome/Edge/Safari: Full support
- Firefox: Full support
- Mobile browsers: Full support with touch gestures