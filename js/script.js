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
            'Assets/images/carousel2.jpg',
            'Assets/images/carousel3.jpg',
            'Assets/images/carousel4.jpg',
            'Assets/images/carousel5.jpg'
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
            { name: 'Bed Room', image: 'Assets/images/bd2.jpg', price: 'Custom' },
            { name: 'Bed Room', image: 'Assets/images/bd3.jpg', price: 'Custom' },
            { name: 'Bed Room', image: 'Assets/images/bd4.jpg', price: 'Custom' },
            { name: 'Dining Table', image: 'Assets/images/d1.jpg', price: 'Custom' },
            { name: 'Dining Table', image: 'Assets/images/d2.jpg', price: 'Custom' },
            { name: 'Kitchen', image: 'Assets/images/k1.jpg', price: 'Custom' },
            { name: 'Kitchen', image: 'Assets/images/k2.jpg', price: 'Custom' },
            { name: 'Kitchen', image: 'Assets/images/k3.jpg', price: 'Custom' },
            { name: 'Living Room', image: 'Assets/images/l1.jpg', price: 'Custom' }
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
                'product-container bg-white rounded-lg shadow-md overflow-hidden opacity-0 transition-opacity duration-700';
            container.style.transitionDelay = `${index * 100}ms`;

            container.innerHTML = `
                <div class="relative overflow-hidden group">
                    <img src="${product.image}" alt="${product.name}"
                         class="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110">
                </div>
                <div class="p-4">
                    <h3 class="text-lg font-semibold text-gray-800">${product.name}</h3>
                    <p class="text-gray-600 mt-1">${product.price}</p>
                </div>
            `;
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

// =====================
// 📱 Mobile Menu Toggle
// =====================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// =====================
// 🚀 Initialize All Components
// =====================
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing components...');
    new Carousel();
    new ProductGrid();
});
