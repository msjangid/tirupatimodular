// Utility functions
const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

// Carousel Class
class Carousel {
    constructor() {
        this.carousel = document.getElementById('carousel');
        if (!this.carousel) {
            console.error('Carousel element not found');
            return;
        }

        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentIndex = 0;
        this.isTransitioning = false;
        
        // Add carousel button styles
        if (this.prevBtn && this.nextBtn) {
            [this.prevBtn, this.nextBtn].forEach(btn => {
                btn.classList.add('carousel-button');
            });
        }

        // Test with one image first to verify loading
        this.images = [
            'assets/images/carousel1.jpg',
            'assets/images/carousel2.jpg',
            'assets/images/carousel3.jpg',
            'assets/images/carousel4.jpg',
            'assets/images/carousel5.jpg'
        ];

        this.init();
    }

    async init() {
        try {
            console.log('Initializing carousel...');
            this.showLoading();
            await this.loadImages();
            this.initCarousel();
            this.bindEvents();
            this.startAutoPlay();
        } catch (error) {
            console.error('Carousel initialization failed:', error);
            this.showErrorMessage();
        } finally {
            this.hideLoading();
        }
    }

    async loadImages() {
        try {
            await Promise.all(this.images.map(src => {
                console.log('Loading image:', src);
                return loadImage(src);
            }));
        } catch (error) {
            console.error('Image loading failed:', error);
            throw error;
        }
    }

    showLoading() {
        const loader = document.createElement('div');
        loader.className = 'loading-spinner absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
        this.carousel.appendChild(loader);
    }

    hideLoading() {
        const loader = this.carousel.querySelector('.loading-spinner');
        if (loader) loader.remove();
    }

    showErrorMessage() {
        this.carousel.innerHTML = `
            <div class="absolute inset-0 flex items-center justify-center">
                <p class="text-red-500">Failed to load images. Please try again later.</p>
            </div>
        `;
    }

    initCarousel() {
        // Clear any existing content
        this.carousel.innerHTML = '';
        
        this.images.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Carousel Image ${index + 1}`;
            img.classList.add(
                'absolute', 
                'w-full', 
                'h-full', 
                'object-cover', 
                'transition-opacity', 
                'duration-500'
            );
            img.style.opacity = index === 0 ? '1' : '0';
            this.carousel.appendChild(img);
        });

        // Add progress indicators
        this.addProgressIndicators();
    }

    addProgressIndicators() {
        const indicators = document.createElement('div');
        indicators.className = 'absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2';
        
        this.images.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${
                index === this.currentIndex ? 'bg-white scale-125' : 'bg-white/50'
            }`;
            dot.addEventListener('click', () => this.goToSlide(index));
            indicators.appendChild(dot);
        });

        this.carousel.appendChild(indicators);
    }

    updateProgressIndicators() {
        const dots = this.carousel.querySelectorAll('.absolute.bottom-4 button');
        dots.forEach((dot, index) => {
            dot.className = `w-2 h-2 rounded-full transition-all duration-300 ${
                index === this.currentIndex ? 'bg-white scale-125' : 'bg-white/50'
            }`;
        });
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.navigate(-1));
        this.nextBtn.addEventListener('click', () => this.navigate(1));
        
        // Pause autoplay on hover
        this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.navigate(-1);
            if (e.key === 'ArrowRight') this.navigate(1);
        });

        // Touch events for swipe
        let touchStartX = 0;
        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        this.carousel.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) this.navigate(1); // Swipe left
                else this.navigate(-1); // Swipe right
            }
        });
    }

    async navigate(direction) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const images = this.carousel.querySelectorAll('img');
        images[this.currentIndex].style.opacity = '0';
        
        this.currentIndex = (this.currentIndex + direction + this.images.length) % this.images.length;
        images[this.currentIndex].style.opacity = '1';

        // Update progress indicators
        this.updateProgressIndicators();

        // Wait for transition to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        this.isTransitioning = false;
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        const direction = index > this.currentIndex ? 1 : -1;
        this.navigate(direction * Math.abs(index - this.currentIndex));
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.navigate(1), 5000);
    }

    pauseAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
}

// Product Grid Class
class ProductGrid {
    constructor() {
        this.grid = document.getElementById('productGrid');
        this.products = [
            { name: 'Bed Room', image: 'assets/images/bd1.jpg', price: 'Custom' },
            { name: 'Bed Room', image: 'assets/images/bd2.jpg',price: 'Custom'},
            { name: 'Bed Room', image: 'assets/images/bd3.jpg', price: 'Custom' },
            { name: 'Bed Room', image: 'assets/images/bd4.jpg', price: 'Custom'},
            { name: 'Dining Table', image: 'assets/images/d1.jpg',price: 'Custom'},
            { name: 'Dining Table', image: 'assets/images/d2.jpg', price: 'Custom' },
            { name: 'Dressing Table', image: 'assets/images/dr1.jpg', price: 'Custom'},
            { name: 'Dressing Table', image: 'assets/images/dr2.jpg', price: 'Custom' },
            { name: 'Dressing Table', image: 'assets/images/dr3.jpg', price: 'Custom' },
            { name: 'Kitchen', image: 'assets/images/k1.jpg', price: 'Custom' },
            { name: 'Kitchen', image: 'assets/images/k2.jpg', price: 'Custom' },
            { name: 'Kitchen', image: 'assets/images/k3.jpg', price: 'Custom' },
            { name: 'Kitchen', image: 'assets/images/k4.jpg', price: 'Custom' },
            { name: 'Kitchen', image: 'assets/images/k5.jpg', price: 'Custom' },
            { name: 'Kitchen', image: 'assets/images/k6.jpg', price: 'Custom' },
            { name: 'Kitchen', image: 'assets/images/k8.jpg', price: 'Custom' },
            { name: 'Kitchen ', image: 'assets/images/k9.jpg', price: 'Custom' },
            { name: 'Kitchen ', image: 'assets/images/k10.jpg', price: 'Custom' },
            { name: 'Living Room', image: 'assets/images/L1.jpg', price: 'Custom' },
            { name: 'Living Room', image: 'assets/images/l3.jpg', price: 'Custom' },
            { name: 'Living Room', image: 'assets/images/l4.jpg', price: 'Custom' },
            { name: 'Living Room', image: 'assets/images/l5.jpg', price: 'Custom' },
            { name: 'Living Room', image: 'assets/images/l6.jpg', price: 'Custom' },
            { name: 'Living Room', image: 'assets/images/l7.jpg', price: 'Custom' },
            { name: 'Living Room ', image: 'assets/images/l8.jpg', price: 'Custom' },
            { name: 'Living Room View', image: 'assets/images/l9.jpg', price: 'Custom' },
            { name: 'Living Room', image: 'assets/images/l10.jpg', price: 'Custom' },
            { name: 'Living Room View', image: 'assets/images/rmv.jpg', price: 'Custom' },
            { name: 'Lift Box Room', image: 'assets/images/l2.jpg', price: 'Custom' },
            { name: 'Bar Counter', image: 'assets/images/msc1.jpg', price: 'Custom' },
            { name: 'Office Reception', image: 'assets/images/msc2.jpg', price: 'Custom' },
            { name: 'Office Reception', image: 'assets/images/msc3.jpg', price: 'Custom' },
            { name: 'Shop', image: 'assets/images/msc4.jpg', price: 'Custom' },
            { name: 'Swiming View', image: 'assets/images/msc5.jpg', price: 'Custom' },
            { name: 'Ancient Table', image: 'assets/images/msc6.jpg', price: 'Custom' },
            { name: 'Pooja Room ', image: 'assets/images/Pooja_Unit.jpg', price: 'Custom' },
            { name: 'Wooden Stair ', image: 'assets/images/stair.jpg', price: 'Custom' },
            { name: 'Studt Table ', image: 'assets/images/study.jpg', price: 'Custom' },
            { name: 'Tv Unit ', image: 'assets/images/Tv_unit.jpg', price: 'Custom' },
            { name: 'Twin Room ', image: 'assets/images/view.jpg', price: 'Custom' },
            { name: 'Washbasin  ', image: 'assets/images/wb1.jpg', price: 'Custom' },
            { name: 'Washbasin ', image: 'assets/images/wb2.jpg', price: 'Custom' },
            { name: 'Washbasin ', image: 'assets/images/wb3.jpg', price: 'Custom' },
            { name: 'Washbasin ', image: 'assets/images/wb4.jpg', price: 'Custom' },
            { name: 'Washbasin ', image: 'assets/images/wb5.jpg', price: 'Custom' },
            { name: 'Wardrobe ', image: 'assets/images/wr.jpg', price: 'Custom' },
            { name: 'Wardrobe ', image: 'assets/images/wr1.jpg', price: 'Custom' },
            { name: 'Wardrobe ', image: 'assets/images/wr3.jpg', price: 'Custom' },
            { name: 'Wardrobe ', image: 'assets/images/wr4.jpg', price: 'Custom' },
            { name: 'Wardrobe ', image: 'assets/images/wr5.jpg', price: 'Custom' },
            { name: 'Wardrobe ', image: 'assets/images/wr6.jpg', price: 'Custom' },
            { name: 'Wardrobe ', image: 'assets/images/wr7.jpg', price: 'Custom' },
            { name: 'Wardrobe inside ', image: 'assets/images/wrin1.jpg', price: 'Custom' },
            { name: 'Wardrobe inside', image: 'assets/images/wrin2.jpg', price: 'Custom' },
            { name: 'Wardrobe inside', image: 'assets/images/wrin3.jpg', price: 'Custom' },
            { name: 'Wardrobe inside', image: 'assets/images/wrin5.jpg', price: 'Custom' }
        ];
        this.init();
    }

    async init() {
        try {
            console.log('Loading products...');
            await this.loadProducts();
            this.addScrollAnimation();
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }

    async loadProducts() {
        this.products.forEach((product, index) => {
            const container = document.createElement('div');
            container.className = 'product-container bg-white rounded-lg shadow-md overflow-hidden opacity-0';
            container.style.transitionDelay = `${index * 100}ms`;
            
            container.innerHTML = `
                <div class="relative overflow-hidden group">
                    <img src="${product.image}" alt="${product.name}" 
                         class="w-full h-64 object-cover transition-transform duration-300 
                         group-hover:scale-110">
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 
                               transition-all duration-300"></div>
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                    <p class="text-gray-600 mt-1">${product.price}</p>
                    <button class="view-details-btn mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 
                                 transition-colors duration-300">
                        View Details
                    </button>
                </div>
            `;
            
            // Add click event for the View Details button
            const viewDetailsBtn = container.querySelector('.view-details-btn');
            viewDetailsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Extract image filename for description
                const filename = product.image.split(/[\/\\]/).pop();
                const description = imageDescriptions[filename] || 'Custom modular furniture design';
                showZoomModal(product.image, description);
            });
            
            this.grid.appendChild(container);
        });
    }

    addScrollAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.product-container').forEach(container => {
            observer.observe(container);
        });
    }
}

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOM loaded, initializing components...');
        new Carousel();
        new ProductGrid();
    } catch (error) {
        console.error('Initialization failed:', error);
    }
});

// Add these functions at the end of your script.js file

// Image descriptions object
const imageDescriptions = {
    'bd1.jpg': 'This is 8x6 jambo size with soft cosuin and brown laminited',
    'bd2.JPG': 'Contemporary bedroom setup with minimalist design and ample storage',
    'bd3.jpg': 'Luxurious master bedroom with custom wardrobe solutions',
    'bd4.jpg': 'Stylish bedroom interior with integrated lighting and storage',
    // Add descriptions for other images as needed
};

function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalDesc = document.getElementById('modalDescription');
    
    // Extract image filename from path
    const filename = imageSrc.split('/').pop();
    
    modalImg.src = imageSrc;
    modalDesc.textContent = imageDescriptions[filename] || 'Custom modular furniture design';
    modal.classList.remove('hidden');
}

function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.add('hidden');
}

// Modify the createProductItem function to open in new window with description
function createProductItem(imageSrc, title) {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-lg shadow-md overflow-hidden';
    
    // Extract image filename from path
    const filename = imageSrc.split(/[\/\\]/).pop();
    const description = imageDescriptions[filename] || 'Custom modular furniture design';
    
    div.innerHTML = `
        <img src="${imageSrc}" alt="${title}" class="w-full h-64 object-cover">
        <div class="p-4">
            <h3 class="text-lg font-semibold">${title}</h3>
            <p class="text-gray-600 mt-2">Custom</p>
            <button onclick="openImageInNewWindow('${imageSrc}', '${description}')" 
                    class="mt-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300">
                View Details
            </button>
        </div>
    `;
    
    return div;
}

// Add this new function to open image in new window with description
// Modify the openImageInNewWindow function
function openImageInNewWindow(imageSrc, description) {
    const encodedDesc = encodeURIComponent(description);
    const url = `imageDetails.html?image=${imageSrc}&description=${encodedDesc}`;
    window.open(url, '_blank');
}

// Amazon-style zoom lens modal logic
function showZoomModal(imageSrc, description) {
    const modal = document.getElementById('zoomModal');
    const zoomImg = document.getElementById('zoomImage');
    const zoomDesc = document.getElementById('zoomDescription');
    const lens = document.getElementById('lens');
    const zoomResult = document.getElementById('zoomResult');

    zoomImg.src = imageSrc;
    zoomDesc.textContent = description;
    zoomResult.style.backgroundImage = `url('${imageSrc}')`;
    modal.classList.remove('hidden');

    lens.style.display = 'block';

    let cx, cy;

    zoomImg.onload = function() {
        // Calculate the ratio between result div and lens
        cx = zoomResult.offsetWidth / lens.offsetWidth;
        cy = zoomResult.offsetHeight / lens.offsetHeight;
        zoomResult.style.backgroundSize = 
            (zoomImg.width * cx) + "px " + (zoomImg.height * cy) + "px";
    };

    function moveLens(e) {
        e.preventDefault();
        const pos = getCursorPos(e);
        let x = pos.x - lens.offsetWidth / 2;
        let y = pos.y - lens.offsetHeight / 2;

        // Prevent lens from going outside the image
        if (x > zoomImg.width - lens.offsetWidth) x = zoomImg.width - lens.offsetWidth;
        if (x < 0) x = 0;
        if (y > zoomImg.height - lens.offsetHeight) y = zoomImg.height - lens.offsetHeight;
        if (y < 0) y = 0;

        lens.style.left = x + "px";
        lens.style.top = y + "px";

        zoomResult.style.backgroundPosition = 
            "-" + (x * cx) + "px -" + (y * cy) + "px";
    }

    function getCursorPos(e) {
        const a = zoomImg.getBoundingClientRect();
        let x = (e.touches ? e.touches[0].clientX : e.clientX) - a.left;
        let y = (e.touches ? e.touches[0].clientY : e.clientY) - a.top;
        x = x / (a.right - a.left) * zoomImg.width;
        y = y / (a.bottom - a.top) * zoomImg.height;
        return { x: x, y: y };
    }

    // Mouse and touch events
    lens.onmousemove = moveLens;
    zoomImg.onmousemove = moveLens;
    lens.ontouchmove = moveLens;
    zoomImg.ontouchmove = moveLens;
    zoomImg.onmouseleave = () => { lens.style.display = 'none'; zoomResult.style.backgroundPosition = 'center'; };
    zoomImg.onmouseenter = () => { lens.style.display = 'block'; };

    // Reset lens and zoomResult when modal closes
    document.getElementById('closeZoomModal').onclick = function() {
        modal.classList.add('hidden');
        lens.style.display = 'none';
        zoomResult.style.backgroundImage = '';
    };
}

// Close modal logic
document.getElementById('closeZoomModal').onclick = function() {
    document.getElementById('zoomModal').classList.add('hidden');
    document.getElementById('lens').style.display = 'none';
};

// Update all "View Details" buttons to use the zoom modal
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.view-details-btn').forEach((btn, idx) => {
        btn.onclick = function(e) {
            e.preventDefault();
            const product = (new ProductGrid()).products[idx];
            // Extract image filename for description
            const filename = product.image.split(/[\/\\]/).pop();
            const description = imageDescriptions[filename] || 'Custom modular furniture design';
            showZoomModal(product.image, description);
        };
    });
});