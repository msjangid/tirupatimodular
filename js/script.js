// Utility: Load image before showing
const loadImage = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

// =====================
// 🎠 Carousel Class
// =====================
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

        if (this.prevBtn && this.nextBtn) {
            [this.prevBtn, this.nextBtn].forEach(btn =>
                btn.classList.add('carousel-button')
            );
        }

        this.images = [
            'Assets/images/carousel1.jpg',
            'Assets/images/carousel2.JPG',
            'Assets/images/carousel3.JPG',
            'Assets/images/carousel4.jpg',
            'Assets/images/carousel5.JPG'
        ];

        this.init();
    }

    async init() {
        try {
            console.log('Initializing carousel...');
            console.log('Carousel images:', this.images);
            this.showLoading();
            await this.loadImages();
            console.log('All carousel images loaded successfully');
            this.initCarousel();
            this.bindEvents();
            this.startAutoPlay();
            console.log('Carousel initialization completed');
        } catch (error) {
            console.error('Carousel initialization failed:', error);
            this.showErrorMessage();
        } finally {
            this.hideLoading();
        }
    }

    async loadImages() {
        await Promise.all(this.images.map(src => loadImage(src)));
    }

    showLoading() {
        const loader = document.createElement('div');
        loader.className =
            'loading-spinner absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
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
        this.addProgressIndicators();
    }

    addProgressIndicators() {
        const indicators = document.createElement('div');
        indicators.className =
            'absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2';
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
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.navigate(-1));
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.navigate(1));

        // Pause autoplay on hover
        this.carousel.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.carousel.addEventListener('mouseleave', () => this.startAutoPlay());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.navigate(-1);
            if (e.key === 'ArrowRight') this.navigate(1);
        });

        // Swipe support
        let touchStartX = 0;
        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });
        this.carousel.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) diff > 0 ? this.navigate(1) : this.navigate(-1);
        });
    }

    async navigate(direction) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const images = this.carousel.querySelectorAll('img');
        images[this.currentIndex].style.opacity = '0';
        this.currentIndex = (this.currentIndex + direction + this.images.length) % this.images.length;
        images[this.currentIndex].style.opacity = '1';
        this.updateProgressIndicators();

        await new Promise(res => setTimeout(res, 500));
        this.isTransitioning = false;
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        const diff = index - this.currentIndex;
        this.navigate(diff);
    }

    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => this.navigate(1), 5000);
    }

    pauseAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
}

// =====================
// 🛋️ Product Grid Class
// =====================
class ProductGrid {
    constructor() {
        this.grid = document.getElementById('productGrid');
        this.products = [
            { name: 'Bed Room', image: 'Assets/images/bd1.jpg', price: 'Custom' },
            { name: 'Bed Room', image: 'Assets/images/Page36.JPG', price: 'Custom' },
            { name: 'Bed Room', image: 'Assets/images/bd3.jpg', price: 'Custom' },
            { name: 'Bed Room', image: 'Assets/images/Page43.jpg', price: 'Custom' },
            { name: 'Dining Table', image: 'Assets/images/D1.JPG', price: 'Custom' },
            { name: 'Dining Table', image: 'Assets/images/D2.jpg', price: 'Custom' },
            { name: 'Kitchen', image: 'Assets/images/Page19.jpg', price: 'Custom' },
            { name: 'Kitchen', image: 'Assets/images/k2.jpg', price: 'Custom' },
            { name: 'Kitchen', image: 'Assets/images/Page51.jpg', price: 'Custom' },
            { name: 'Living Room', image: 'Assets/images/l1.JPG', price: 'Custom' }
        ];
        this.init();
    }

    async init() {
        try {
            console.log('Loading products...');
            this.loadProducts();
            this.addScrollAnimation();
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    }

    loadProducts() {
        this.products.forEach((product, index) => {
            const container = document.createElement('div');
            container.className =
                'product-container bg-white rounded-lg shadow-md overflow-hidden opacity-0 transition-opacity duration-700 cursor-pointer';
            container.style.transitionDelay = `${index * 100}ms`;

            container.innerHTML = `
                <div class="relative overflow-hidden group">
                    <img src="${product.image}" alt="${product.name}"
                         class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110">
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <span class="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">Click to view</span>
                    </div>
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                    <p class="text-gray-600 mt-1">${product.price}</p>
                </div>
            `;
            
            // Add click event to open zoom modal
            container.addEventListener('click', () => {
                this.openZoomModal(product.image, product.name);
            });
            
            this.grid.appendChild(container);
        });
    }

    openZoomModal(imageSrc, description) {
        console.log('Opening zoom modal for:', imageSrc);
        const zoomModal = document.getElementById('zoomModal');
        const zoomImage = document.getElementById('zoomImage');
        const zoomDescription = document.getElementById('zoomDescription');
        const zoomResult = document.getElementById('zoomResult');
        
        if (zoomModal && zoomImage && zoomDescription && zoomResult) {
            // Preload image before showing modal
            const img = new Image();
            img.onload = () => {
                zoomImage.src = imageSrc;
                zoomDescription.textContent = description || 'Product Image';
                zoomResult.style.backgroundImage = `url(${imageSrc})`;
                zoomModal.classList.remove('hidden');
                
                // Setup magnifier effect
                this.setupMagnifier(zoomImage, zoomResult);
                console.log('Zoom modal opened successfully');
            };
            img.onerror = () => {
                console.error('Failed to load image for modal:', imageSrc);
            };
            img.src = imageSrc;
        } else {
            console.error('Modal elements not found');
        }
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

    setupMagnifier(img, result) {
        const lens = document.getElementById('lens');
        if (!lens) return;

        const magnifyLevel = 2;
        
        img.addEventListener('mousemove', (e) => {
            const rect = img.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Position lens
            lens.style.left = (x - lens.offsetWidth / 2) + 'px';
            lens.style.top = (y - lens.offsetHeight / 2) + 'px';
            lens.style.display = 'block';
            
            // Calculate zoom position
            const fx = (x / img.offsetWidth) * 100;
            const fy = (y / img.offsetHeight) * 100;
            
            result.style.backgroundPosition = `${fx}% ${fy}%`;
            result.style.backgroundSize = `${img.offsetWidth * magnifyLevel}px ${img.offsetHeight * magnifyLevel}px`;
        });
        
        img.addEventListener('mouseleave', () => {
            lens.style.display = 'none';
        });
    }
}

// =====================
// �️ Modal Functions
// =====================
function closeModal() {
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.classList.add('hidden');
    }
}

function closeZoomModal() {
    const zoomModal = document.getElementById('zoomModal');
    if (zoomModal) {
        zoomModal.classList.add('hidden');
    }
}

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    const zoomModal = document.getElementById('zoomModal');
    const imageModal = document.getElementById('imageModal');
    
    if (e.target === zoomModal) {
        closeZoomModal();
    }
    if (e.target === imageModal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeZoomModal();
    }
});

// =====================
//  Enhanced Mobile Menu Toggle
// =====================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    let isMenuOpen = false;
    
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
    });
    
    function toggleMobileMenu() {
        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
    
    function openMobileMenu() {
        isMenuOpen = true;
        mobileMenuBtn.classList.add('active');
        mobileMenu.classList.remove('hidden');
        
        // Trigger animation after element is visible
        setTimeout(() => {
            mobileMenu.classList.add('show');
        }, 10);
        
        // Add smooth slide-in animation to menu items
        const menuItems = mobileMenu.querySelectorAll('.mobile-menu-item');
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 100 + (index * 50));
        });
    }
    
    function closeMobileMenu() {
        isMenuOpen = false;
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('show');
        
        setTimeout(() => {
            mobileMenu.classList.add('hidden');
        }, 300);
    }
}

// =====================
// 🚀 Initialize All Components
// =====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing components...');
    new Carousel();
    new ProductGrid();
    
    // Setup modal close buttons
    const closeZoomBtn = document.getElementById('closeZoomModal');
    if (closeZoomBtn) {
        closeZoomBtn.addEventListener('click', closeZoomModal);
    }
});
