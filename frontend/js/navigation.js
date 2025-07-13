// Navigation Component Loader

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadNavigationComponent();
});

// Load navigation component from external file
function loadNavigationComponent() {
    const placeholder = document.getElementById('navigation-placeholder');
    if (placeholder) {
        fetch('components/navigation.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Navigation component not found');
                }
                return response.text();
            })
            .then(html => {
                placeholder.innerHTML = html;
                // Initialize navigation after loading
                initializeMobileNavigation();
                setActiveNavItem();
            })
            .catch(error => {
                console.warn('Failed to load navigation component:', error);
                // Fallback to creating navigation directly
                createFallbackNavigation();
            });
    } else {
        console.warn('Navigation placeholder not found');
    }
}

function setActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        const link = item.querySelector('.nav-link');
        if (link) {
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html') ||
                (currentPage === 'reminders.html' && href === 'reminders.html') ||
                (currentPage === 'vets.html' && href === 'vets.html') ||
                (currentPage === 'shop.html' && href === 'shop.html') ||
                (currentPage === 'care-guide.html' && href === 'care-guide.html')) {
                item.classList.add('active');
            }
        }
    });
}

function initializeMobileNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    // Handle both navigation component toggle and mobile header button
    if (mobileMenuToggle && sidebar && mobileOverlay) {
        // Toggle mobile menu from navigation component
        mobileMenuToggle.addEventListener('click', function() {
            toggleMobileMenu();
        });
    }
    
    if (mobileMenuBtn && sidebar && mobileOverlay) {
        // Toggle mobile menu from mobile header
        mobileMenuBtn.addEventListener('click', function() {
            toggleMobileMenu();
        });
        
        // Close menu when overlay is clicked
        mobileOverlay.addEventListener('click', function() {
            closeMobileMenu();
        });
        
        // Close menu when nav link is clicked (mobile) - but don't prevent navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Close mobile menu on mobile devices, but don't prevent navigation
                if (window.innerWidth <= 768) {
                    // Use setTimeout to allow navigation to happen first
                    setTimeout(() => {
                        closeMobileMenu();
                    }, 100);
                }
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                closeMobileMenu();
            }
        });
    }
}

function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    if (sidebar && mobileOverlay && mobileMenuToggle) {
        const isOpen = sidebar.classList.contains('mobile-open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }
}

function openMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    if (sidebar && mobileOverlay && mobileMenuToggle) {
        sidebar.classList.add('mobile-open');
        mobileOverlay.classList.add('active');
        mobileMenuToggle.querySelector('i').classList.replace('fa-bars', 'fa-times');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    
    if (sidebar && mobileOverlay && mobileMenuToggle) {
        sidebar.classList.remove('mobile-open');
        mobileOverlay.classList.remove('active');
        mobileMenuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        document.body.style.overflow = '';
    }
}



function createFallbackNavigation() {
    const placeholder = document.getElementById('navigation-placeholder');
    if (placeholder) {
        placeholder.innerHTML = `
            <aside class="sidebar" id="sidebar">
                <div class="logo">
                    <h2>🐾 BruCare</h2>
                </div>
                
                <nav class="nav-menu">
                    <ul>
                        <li class="nav-item" data-page="index">
                            <a href="index.html" class="nav-link">
                                <i class="fas fa-paw"></i>
                                <span>My Pets</span>
                            </a>
                        </li>
                        <li class="nav-item" data-page="reminders">
                            <a href="reminders.html" class="nav-link">
                                <i class="fas fa-bell"></i>
                                <span>Reminders</span>
                            </a>
                        </li>
                        <li class="nav-item" data-page="vets">
                            <a href="vets.html" class="nav-link">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>Nearby Vets</span>
                            </a>
                        </li>
                        <li class="nav-item" data-page="shop">
                            <a href="shop.html" class="nav-link">
                                <i class="fas fa-shopping-cart"></i>
                                <span>Shop</span>
                            </a>
                        </li>
                        <li class="nav-item" data-page="care-guide">
                            <a href="care-guide.html" class="nav-link">
                                <i class="fas fa-book"></i>
                                <span>Care Guide</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                
                <div class="nav-footer">
                </div>
            </aside>
            <div class="mobile-overlay" id="mobileOverlay"></div>
        `;
        
        // Initialize after creating fallback
        initializeMobileNavigation();
        setActiveNavItem();
    }
}

// Export functions for use in other scripts
window.NavigationComponent = {
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
    setActiveNavItem
};

console.log('%c🧭 Navigation Component Loaded Successfully!', 'color: #2C5C45; font-size: 14px; font-weight: bold;');
