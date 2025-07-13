// BruCare Dashboard JavaScript

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeInteractions();
    initializeAnimations();
    updateCurrentTime();
});



// Interactive elements
function initializeInteractions() {
    // Pet card interactions
    const petCards = document.querySelectorAll('.pet-card');
    petCards.forEach(card => {
        card.addEventListener('click', function() {
            showNotification('Opening pet profile...');
        });
    });
    
    // Add pet card interaction
    const addPetCard = document.querySelector('.add-pet-card');
    if (addPetCard) {
        addPetCard.addEventListener('click', function() {
            showNotification('Opening add pet form...');
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    }
    
    // Quick access items
    const quickAccessItems = document.querySelectorAll('.quick-access-item');
    quickAccessItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            showNotification(`Opening ${title} section...`);
            
            // Add ripple effect
            createRippleEffect(this, event);
        });
    });
    
    // Reminder items
    const reminderItems = document.querySelectorAll('.reminder-item');
    reminderItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            showNotification(`Managing reminder: ${title}`);
        });
    });
    
    // Button interactions
    const buttons = document.querySelectorAll('.btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            showNotification('Opening detailed view...');
            
            // Button press animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Animation effects
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.pet-card, .reminder-item, .quick-access-item');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Trigger animations after a short delay
    setTimeout(() => {
        animatedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 300);
}

// Utility functions
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #2C5C45 0%, #3A7A5A 100%)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(44, 92, 69, 0.3)',
        zIndex: '1000',
        fontSize: '0.9rem',
        fontWeight: '500',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backdropFilter: 'blur(10px)'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function createRippleEffect(element, event) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    Object.assign(ripple.style, {
        position: 'absolute',
        width: size + 'px',
        height: size + 'px',
        left: x + 'px',
        top: y + 'px',
        background: 'rgba(44, 92, 69, 0.3)',
        borderRadius: '50%',
        transform: 'scale(0)',
        animation: 'ripple 0.6s ease-out',
        pointerEvents: 'none'
    });
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Update time-sensitive content
function updateCurrentTime() {
    const now = new Date();
    const currentHour = now.getHours();
    
    // Update greeting based on time
    const greetingElement = document.querySelector('.greeting h1');
    if (greetingElement) {
        let greeting = 'Welcome back!';
        if (currentHour < 12) {
            greeting = 'Good morning!';
        } else if (currentHour < 17) {
            greeting = 'Good afternoon!';
        } else {
            greeting = 'Good evening!';
        }
        greetingElement.textContent = greeting + ' 👋';
    }
    
    // Update reminder times (demo purposes)
    updateReminderTimes();
}

function updateReminderTimes() {
    const now = new Date();
    const walkTime = new Date();
    walkTime.setHours(17, 0, 0, 0); // 5:00 PM
    
    const timeDiff = walkTime - now;
    const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    const walkBadge = document.querySelector('.reminder-item.urgent .time-badge');
    if (walkBadge && timeDiff > 0) {
        if (hoursLeft > 0) {
            walkBadge.textContent = `In ${hoursLeft}h ${minutesLeft}m`;
        } else if (minutesLeft > 0) {
            walkBadge.textContent = `In ${minutesLeft} minutes`;
        } else {
            walkBadge.textContent = 'Now!';
            walkBadge.style.background = 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)';
        }
    }
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .notification {
        font-family: 'Inter', sans-serif;
    }
`;
document.head.appendChild(style);

// Update time every minute
setInterval(updateReminderTimes, 60000);

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Console welcome message
console.log('%c🐾 BruCare Dashboard Loaded Successfully!', 'color: #2C5C45; font-size: 16px; font-weight: bold;');
console.log('%cBuilt with ❤️ for pet lovers', 'color: #5A8A6B; font-size: 12px;');
