document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    const header = document.querySelector('.header');
    let lastScroll = 0;

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            if (navLinks) navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger) hamburger.classList.remove('active');
            if (navLinks) navLinks.classList.remove('active');
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            if (header) header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && header && !header.classList.contains('scroll-down')) {
            // Scroll down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header && header.classList.contains('scroll-down')) {
            // Scroll up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });


    // Sample product data - in a real app, this would come from an API
    const products = [
        {
            id: 1,
            name: 'VR Development Kit',
            category: 'vr',
            description: 'Complete VR development kit with all the tools needed to create immersive virtual reality experiences.',
            price: 1999.99,
            originalPrice: 2499.99,
            image: 'content/3d_assets.png',
            badge: 'sale',
            stock: 15
        },
        {
            id: 2,
            name: 'AR Glasses Pro',
            category: 'ar',
            description: 'Next-generation augmented reality glasses with high-resolution displays and advanced tracking.',
            price: 1299.99,
            image: 'content/web_design.png',
            badge: 'new',
            stock: 8
        },
        {
            id: 3,
            name: 'Mixed Reality Headset',
            category: 'mr',
            description: 'Experience the best of both worlds with our premium mixed reality headset.',
            price: 1799.99,
            originalPrice: 1999.99,
            image: 'content/vr_and_sim.png',
            badge: 'sale',
            stock: 5
        },
        {
            id: 4,
            name: 'WebXR Starter Kit',
            category: 'webxr',
            description: 'Everything you need to start building WebXR experiences right in the browser.',
            price: 499.99,
            image: 'content/rapid_prototyping.png',
            badge: null,
            stock: 20
        },
        {
            id: 5,
            name: '360° Camera Pro',
            category: 'vr',
            description: 'Professional 360° camera for capturing immersive VR content with stunning quality.',
            price: 899.99,
            originalPrice: 1099.99,
            image: 'content/product_visualization.png',
            badge: 'sale',
            stock: 12
        },
        {
            id: 6,
            name: 'Haptic Feedback Gloves',
            category: 'vr',
            description: 'Experience true touch feedback in virtual reality with our advanced haptic gloves.',
            price: 599.99,
            image: 'content/3d_assets.png',
            badge: 'new',
            stock: 10
        }
    ];

    // Shopping cart
    let cart = [];

    // DOM Elements
    const productsGrid = document.querySelector('.products-grid');
    const cartItems = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const subtotalEl = document.querySelector('.subtotal-amount');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartBtn = document.querySelector('.close-cart');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const categoryFilter = document.getElementById('category-filter');
    const sortBy = document.getElementById('sort-by');
    const searchInput = document.querySelector('.search-box input');
    const cartIcon = document.querySelector('.cart-icon');

    // Initialize the page
    function init() {
        renderProducts(products);
        updateCartCount();
        setupEventListeners();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Cart toggle
        cartIcon.addEventListener('click', toggleCart);
        closeCartBtn.addEventListener('click', toggleCart);
        cartOverlay.addEventListener('click', closeCart);

        // Checkout
        checkoutBtn.addEventListener('click', handleCheckout);

        // Filters
        categoryFilter.addEventListener('change', filterProducts);
        sortBy.addEventListener('change', sortProducts);
        searchInput.addEventListener('input', filterProducts);

        // Close cart when clicking outside
        document.addEventListener('click', (e) => {
            if (!cartSidebar.contains(e.target) && !cartIcon.contains(e.target)) {
                closeCart();
            }
        });
    }

    // Render products to the page
    function renderProducts(productsToRender) {
        productsGrid.innerHTML = '';
        
        if (productsToRender.length === 0) {
            productsGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        productsToRender.forEach((product, index) => {
            const productEl = document.createElement('div');
            productEl.className = 'product-card';
            productEl.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge === 'sale' ? 'Sale' : 'New'}</span>` : ''}
                </div>
                <div class="product-info">
                    <span class="product-category">${getCategoryName(product.category)}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <span class="current-price">$${product.price.toFixed(2)}</span>
                        ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="product-actions">
                        <button class="add-to-cart" data-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-${product.stock === 0 ? 'times' : 'shopping-cart'}"></i>
                            ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button class="wishlist-btn" data-id="${product.id}">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Add event listeners to the new elements
            const addToCartBtn = productEl.querySelector('.add-to-cart');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', () => addToCart(product.id));
            }
            
            const wishlistBtn = productEl.querySelector('.wishlist-btn');
            if (wishlistBtn) {
                wishlistBtn.addEventListener('click', toggleWishlist);
            }
            
            productsGrid.appendChild(productEl);
        });
    }

    // Add item to cart
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity += 1;
            } else {
                showNotification('Maximum stock reached for this item', 'error');
                return;
            }
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        updateCart();
        showNotification(`${product.name} added to cart`, 'success');
        openCart();
    }

    // Update cart UI
    function updateCart() {
        // Update cart items
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            checkoutBtn.disabled = true;
        } else {
            cartItems.innerHTML = '';
            cart.forEach(item => {
                const cartItemEl = document.createElement('div');
                cartItemEl.className = 'cart-item';
                cartItemEl.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" data-id="${item.id}">
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                // Add event listeners to quantity controls
                const minusBtn = cartItemEl.querySelector('.minus');
                const plusBtn = cartItemEl.querySelector('.plus');
                const quantityInput = cartItemEl.querySelector('.quantity-input');
                const removeBtn = cartItemEl.querySelector('.remove-item');
                
                minusBtn.addEventListener('click', () => updateQuantity(item.id, -1));
                plusBtn.addEventListener('click', () => updateQuantity(item.id, 1));
                quantityInput.addEventListener('change', (e) => updateQuantity(item.id, 0, parseInt(e.target.value)));
                removeBtn.addEventListener('click', () => removeFromCart(item.id));
                
                cartItems.appendChild(cartItemEl);
            });
            
            checkoutBtn.disabled = false;
        }
        
        // Update cart count
        updateCartCount();
        
        // Update subtotal
        updateSubtotal();
        
        // Save cart to localStorage
        saveCart();
    }

    // Update item quantity in cart
    function updateQuantity(productId, change, newQuantity = null) {
        const item = cart.find(item => item.id === productId);
        if (!item) return;
        
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        if (newQuantity !== null) {
            if (newQuantity >= 1 && newQuantity <= 10) {
                item.quantity = newQuantity;
            }
        } else {
            const newQty = item.quantity + change;
            if (newQty >= 1 && newQty <= 10) {
                item.quantity = newQty;
            } else if (newQty > 10) {
                showNotification('Maximum quantity per item is 10', 'error');
                return;
            } else {
                // If quantity would be less than 1, remove the item
                removeFromCart(productId);
                return;
            }
        }
        
        updateCart();
    }

    // Remove item from cart
    function removeFromCart(productId) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            cart.splice(itemIndex, 1);
            updateCart();
            showNotification('Item removed from cart', 'info');
        }
    }

    // Update cart count in header
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = count;
        cartCount.style.display = count > 0 ? 'flex' : 'none';
    }

    // Update subtotal
    function updateSubtotal() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    }

    // Toggle cart sidebar
    function toggleCart() {
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('open');
        document.body.style.overflow = cartSidebar.classList.contains('open') ? 'hidden' : '';
    }

    function openCart() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Handle checkout
    function handleCheckout() {
        if (cart.length === 0) return;
        
        // In a real app, this would redirect to a checkout page
        showNotification('Proceeding to checkout...', 'success');
        console.log('Checkout:', cart);
        
        // For demo purposes, just clear the cart after a delay
        setTimeout(() => {
            cart = [];
            updateCart();
            closeCart();
            showNotification('Order placed successfully!', 'success');
        }, 1500);
    }

    // Filter products by category
    function filterProducts() {
        const category = categoryFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        let filteredProducts = [...products];
        
        // Filter by category
        if (category !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === category);
        }
        
        // Filter by search term
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product => 
                product.name.toLowerCase().includes(searchTerm) || 
                product.description.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply current sort
        sortProducts(filteredProducts);
    }

    // Sort products
    function sortProducts(productsToSort = null) {
        const sortValue = sortBy.value;
        let sortedProducts = productsToSort ? [...productsToSort] : [...products];
        
        switch (sortValue) {
            case 'price-low':
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                // In a real app, you would sort by date added or similar
                sortedProducts.reverse();
                break;
            default: // 'featured'
                // Keep original order
                break;
        }
        
        renderProducts(sortedProducts);
    }

    // Toggle wishlist
    function toggleWishlist(e) {
        const btn = e.currentTarget;
        btn.classList.toggle('active');
        const icon = btn.querySelector('i');
        
        if (btn.classList.contains('active')) {
            icon.classList.remove('far', 'fa-heart');
            icon.classList.add('fas', 'fa-heart');
            showNotification('Added to wishlist', 'success');
        } else {
            icon.classList.remove('fas', 'fa-heart');
            icon.classList.add('far', 'fa-heart');
            showNotification('Removed from wishlist', 'info');
        }
    }

    // Show notification
    function showNotification(message, type = 'info') {
        // In a real app, you might want to use a more sophisticated notification system
        console.log(`${type.toUpperCase()}: ${message}`);
        
        // For demo purposes, we'll use a simple alert
        alert(message);
    }

    // Get category name from slug
    function getCategoryName(slug) {
        const categories = {
            'ar': 'Augmented Reality',
            'vr': 'Virtual Reality',
            'mr': 'Mixed Reality',
            'webxr': 'WebXR'
        };
        return categories[slug] || slug;
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('virtucore_cart', JSON.stringify(cart));
    }

    // Load cart from localStorage
    function loadCart() {
        const savedCart = localStorage.getItem('virtucore_cart');
        if (savedCart) {
            try {
                cart = JSON.parse(savedCart);
                updateCart();
            } catch (e) {
                console.error('Error loading cart:', e);
                cart = [];
            }
        }
    }

    // Initialize the app
    loadCart();
    init();
});
