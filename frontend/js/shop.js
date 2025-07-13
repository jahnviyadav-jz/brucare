// Shop Page JavaScript

// Global cart state
let cart = [];
let cartCount = 0;

document.addEventListener('DOMContentLoaded', function() {
    initializeShopPage();
});

function initializeShopPage() {
    // Initialize search functionality
    initializeSearch();
    
    // Initialize category filters
    initializeCategoryFilters();
    
    // Initialize sort functionality
    initializeSort();
    
    // Initialize cart functionality
    initializeCart();
    
    // Initialize product actions
    initializeProductActions();
    
    // Initialize category cards
    initializeCategoryCards();
    
    console.log('%c🛒 Shop Page Loaded Successfully!', 'color: #2C5C45; font-size: 14px; font-weight: bold;');
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('productSearch');
    const productCards = document.querySelectorAll('.product-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            productCards.forEach(card => {
                const productName = card.querySelector('h3').textContent.toLowerCase();
                const productDescription = card.querySelector('.product-description').textContent.toLowerCase();
                
                const isMatch = productName.includes(searchTerm) || 
                               productDescription.includes(searchTerm);
                
                if (isMatch || searchTerm === '') {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
            
            showNoResultsMessage();
        });
    }
}

// Category Filter Functionality
function initializeCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active category button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            productCards.forEach(card => {
                if (category === 'all') {
                    card.style.display = 'block';
                } else {
                    const cardCategory = card.getAttribute('data-category');
                    card.style.display = cardCategory === category ? 'block' : 'none';
                }
                
                // Add animation
                if (card.style.display === 'block') {
                    card.style.animation = 'fadeIn 0.3s ease';
                }
            });
            
            showNoResultsMessage();
        });
    });
}

// Sort Functionality
function initializeSort() {
    const sortSelect = document.getElementById('sortProducts');
    const productsGrid = document.querySelector('.products-grid');
    
    if (sortSelect && productsGrid) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const productCards = Array.from(document.querySelectorAll('.product-card'));
            
            productCards.sort((a, b) => {
                switch (sortValue) {
                    case 'price-low':
                        const priceA = parseFloat(a.querySelector('.current-price').textContent.replace('$', ''));
                        const priceB = parseFloat(b.querySelector('.current-price').textContent.replace('$', ''));
                        return priceA - priceB;
                    
                    case 'price-high':
                        const priceHighA = parseFloat(a.querySelector('.current-price').textContent.replace('$', ''));
                        const priceHighB = parseFloat(b.querySelector('.current-price').textContent.replace('$', ''));
                        return priceHighB - priceHighA;
                    
                    case 'rating':
                        const ratingA = parseFloat(a.querySelector('.rating-text').textContent.match(/(\d+\.?\d*)/)?.[1] || 0);
                        const ratingB = parseFloat(b.querySelector('.rating-text').textContent.match(/(\d+\.?\d*)/)?.[1] || 0);
                        return ratingB - ratingA;
                    
                    case 'newest':
                        // Prioritize products with "new" badge
                        const isNewA = a.querySelector('.product-badge.new') ? 1 : 0;
                        const isNewB = b.querySelector('.product-badge.new') ? 1 : 0;
                        return isNewB - isNewA;
                    
                    case 'featured':
                    default:
                        // Prioritize bestsellers, then new, then others
                        const priorityA = a.querySelector('.product-badge.bestseller') ? 3 : 
                                         (a.querySelector('.product-badge.new') ? 2 : 1);
                        const priorityB = b.querySelector('.product-badge.bestseller') ? 3 : 
                                         (b.querySelector('.product-badge.new') ? 2 : 1);
                        return priorityB - priorityA;
                }
            });
            
            // Re-append sorted cards
            productCards.forEach(card => {
                productsGrid.appendChild(card);
                card.style.animation = 'slideInUp 0.3s ease';
            });
        });
    }
}

// Cart Functionality
function initializeCart() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.getElementById('cartSidebar');
    const closeCartBtn = document.getElementById('closeCart');
    const qtyButtons = document.querySelectorAll('.qty-btn');
    
    // Open cart
    if (cartIcon && cartSidebar) {
        cartIcon.addEventListener('click', function() {
            cartSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close cart
    function closeCart() {
        if (cartSidebar) {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }
    
    // Close cart on outside click
    if (cartSidebar) {
        cartSidebar.addEventListener('click', function(e) {
            if (e.target === cartSidebar) {
                closeCart();
            }
        });
    }
    
    // Handle quantity changes and cart updates dynamically
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('qty-btn')) {
            const button = e.target;
            const isIncrement = button.textContent === '+';
            const cartItem = button.closest('.cart-item');
            const itemId = cartItem.getAttribute('data-item-id');
            const quantitySpan = cartItem.querySelector('.item-quantity span');
            
            const cartItemData = cart.find(item => item.id === itemId);
            if (cartItemData) {
                if (isIncrement) {
                    cartItemData.quantity++;
                } else if (cartItemData.quantity > 1) {
                    cartItemData.quantity--;
                }
                
                quantitySpan.textContent = cartItemData.quantity;
                updateCartCount();
                updateCartTotal();
                
                // Add animation
                quantitySpan.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    quantitySpan.style.transform = 'scale(1)';
                }, 200);
            }
        }
        
        // Handle remove item
        if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
            const cartItem = e.target.closest('.cart-item');
            const itemId = cartItem.getAttribute('data-item-id');
            removeFromCart(itemId);
        }
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length > 0) {
                showNotification('Redirecting to checkout...', 'info');
                // In a real app, this would redirect to checkout page
                console.log('Checkout items:', cart);
            }
        });
    }
    
    // Continue shopping button
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

// Product Actions
function initializeProductActions() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const buyNowButtons = document.querySelectorAll('.buy-now');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            // Add to cart logic here
            addToCart(productCard);
            
            // Show notification
            showNotification(`${productName} added to cart!`, 'success');
            
            // Add button animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    buyNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            
            showNotification(`Proceeding to checkout for ${productName}...`, 'info');
            
            // Add button animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Category Cards
function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Find and activate corresponding filter button
            const targetButton = Array.from(categoryButtons).find(btn => 
                btn.getAttribute('data-category') === category
            );
            
            if (targetButton) {
                targetButton.click();
                
                // Scroll to products section
                document.querySelector('.products-section').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add to Cart Function
function addToCart(productCard) {
    const productName = productCard.querySelector('h3').textContent;
    const productPriceText = productCard.querySelector('.price').textContent;
    const productPrice = parseFloat(productPriceText.replace('$', ''));
    const productImage = productCard.querySelector('.product-placeholder').textContent;
    const productId = productCard.querySelector('.add-to-cart').getAttribute('data-product');
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    // Update cart UI
    updateCartCount();
    updateCartDisplay();
    updateCartTotal();
}

// Update Cart Count
function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count, #cartCount');
    
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = cartCount;
            
            // Add animation
            element.style.transform = 'scale(1.3)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }
    });
}

// Update Cart Total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cartSubtotal) {
        cartSubtotal.textContent = total.toFixed(2);
    }
    
    if (cartTotal) {
        cartTotal.textContent = total.toFixed(2);
    }
    
    // Enable/disable checkout button
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

// Update Cart Display
function updateCartDisplay() {
    const cartContent = document.getElementById('cartContent');
    if (!cartContent) return;
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <small>Add some products to get started!</small>
            </div>
        `;
    } else {
        cartContent.innerHTML = cart.map(item => `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="item-image">
                    ${item.image}
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <button class="qty-btn">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn">+</button>
                </div>
                <button class="remove-item" title="Remove item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
}

// Remove from Cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartCount();
    updateCartDisplay();
    updateCartTotal();
    showNotification('Item removed from cart', 'info');
}

// Show No Results Message
function showNoResultsMessage() {
    const productsGrid = document.querySelector('.products-grid');
    const visibleCards = Array.from(document.querySelectorAll('.product-card')).filter(card => 
        card.style.display !== 'none'
    );
    
    // Remove existing no results message
    const existingMessage = document.querySelector('.no-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (visibleCards.length === 0) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results-message';
        noResultsDiv.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #5A8A6B;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        productsGrid.appendChild(noResultsDiv);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'info': 'fa-info-circle',
        'warning': 'fa-exclamation-triangle'
    };
    return icons[type] || 'fa-info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#4CAF50',
        'error': '#FF6B6B',
        'info': '#2196F3',
        'warning': '#FF9800'
    };
    return colors[type] || '#2196F3';
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .qty-btn, .cart-count {
        transition: transform 0.2s ease;
    }
`;
document.head.appendChild(style);
