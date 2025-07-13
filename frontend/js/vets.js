// Vets Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeVetsPage();
});

function initializeVetsPage() {
    // Initialize search functionality
    initializeSearch();
    
    // Initialize filter functionality
    initializeFilters();
    
    // Initialize sort functionality
    initializeSort();
    
    // Initialize modal functionality
    initializeModal();
    
    // Initialize action buttons
    initializeActionButtons();
    
    console.log('%c🏥 Vets Page Loaded Successfully!', 'color: #2C5C45; font-size: 14px; font-weight: bold;');
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('vetSearch');
    const vetCards = document.querySelectorAll('.vet-card');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            vetCards.forEach(card => {
                const vetName = card.querySelector('h3').textContent.toLowerCase();
                const vetSpecialty = card.querySelector('.vet-specialty').textContent.toLowerCase();
                const vetAddress = card.querySelector('.detail-item span').textContent.toLowerCase();
                
                const isMatch = vetName.includes(searchTerm) || 
                               vetSpecialty.includes(searchTerm) || 
                               vetAddress.includes(searchTerm);
                
                if (isMatch || searchTerm === '') {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Show no results message if needed
            showNoResultsMessage();
        });
    }
}

// Filter Functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const vetCards = document.querySelectorAll('.vet-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            vetCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                } else if (filterValue === 'emergency') {
                    card.style.display = card.classList.contains('emergency') ? 'block' : 'none';
                } else if (filterValue === 'specialist') {
                    card.style.display = card.getAttribute('data-category') === 'specialist' ? 'block' : 'none';
                } else if (filterValue === 'nearby') {
                    // Show vets within 2km (you can adjust this logic)
                    const distance = parseFloat(card.querySelector('.detail-item span').textContent.match(/(\d+\.?\d*)\s*km/)?.[1] || 0);
                    card.style.display = distance <= 2 ? 'block' : 'none';
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
    const sortSelect = document.getElementById('sortVets');
    const vetsGrid = document.querySelector('.vets-grid');
    
    if (sortSelect && vetsGrid) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const vetCards = Array.from(document.querySelectorAll('.vet-card'));
            
            vetCards.sort((a, b) => {
                switch (sortValue) {
                    case 'distance':
                        const distanceA = parseFloat(a.querySelector('.detail-item span').textContent.match(/(\d+\.?\d*)\s*km/)?.[1] || 0);
                        const distanceB = parseFloat(b.querySelector('.detail-item span').textContent.match(/(\d+\.?\d*)\s*km/)?.[1] || 0);
                        return distanceA - distanceB;
                    
                    case 'rating':
                        const ratingA = parseFloat(a.querySelector('.rating-text').textContent.match(/(\d+\.?\d*)/)?.[1] || 0);
                        const ratingB = parseFloat(b.querySelector('.rating-text').textContent.match(/(\d+\.?\d*)/)?.[1] || 0);
                        return ratingB - ratingA; // Descending order
                    
                    case 'name':
                        const nameA = a.querySelector('h3').textContent.toLowerCase();
                        const nameB = b.querySelector('h3').textContent.toLowerCase();
                        return nameA.localeCompare(nameB);
                    
                    case 'availability':
                        // Prioritize emergency and available vets
                        const priorityA = a.classList.contains('emergency') ? 3 : (a.querySelector('.vet-badge.available') ? 2 : 1);
                        const priorityB = b.classList.contains('emergency') ? 3 : (b.querySelector('.vet-badge.available') ? 2 : 1);
                        return priorityB - priorityA;
                    
                    default:
                        return 0;
                }
            });
            
            // Re-append sorted cards
            vetCards.forEach(card => {
                vetsGrid.appendChild(card);
                card.style.animation = 'slideInUp 0.3s ease';
            });
        });
    }
}

// Modal Functionality
function initializeModal() {
    const addVetBtn = document.getElementById('addVetBtn');
    const modal = document.getElementById('addVetModal');
    const closeBtn = document.getElementById('closeAddVetModal');
    const cancelBtn = document.getElementById('cancelAddVet');
    const form = document.getElementById('addVetForm');
    
    // Open modal
    if (addVetBtn && modal) {
        addVetBtn.addEventListener('click', function() {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Close modal
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            if (form) form.reset();
        }
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
    
    // Close on overlay click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    // Handle form submission
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleAddVet();
        });
    }
}

// Handle Add Vet Form
function handleAddVet() {
    const formData = {
        name: document.getElementById('vetName').value,
        specialty: document.getElementById('vetSpecialty').value,
        address: document.getElementById('vetAddress').value,
        phone: document.getElementById('vetPhone').value,
        hours: document.getElementById('vetHours').value
    };
    
    // Validate form
    if (!formData.name || !formData.specialty || !formData.address || !formData.phone || !formData.hours) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Create new vet card
    createVetCard(formData);
    
    // Close modal and show success message
    document.getElementById('addVetModal').classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('addVetForm').reset();
    
    showNotification('Veterinarian added successfully!', 'success');
}

// Create New Vet Card
function createVetCard(data) {
    const vetsGrid = document.querySelector('.vets-grid');
    const newCard = document.createElement('div');
    newCard.className = 'vet-card';
    newCard.setAttribute('data-category', data.specialty === 'emergency' ? 'emergency' : 'general');
    
    newCard.innerHTML = `
        <div class="vet-badge">
            <i class="fas fa-plus"></i>
            <span>New Addition</span>
        </div>
        <div class="vet-header">
            <div class="vet-avatar">
                <i class="fas fa-user-md"></i>
            </div>
            <div class="vet-info">
                <h3>${data.name}</h3>
                <p class="vet-specialty">${getSpecialtyName(data.specialty)}</p>
                <div class="vet-rating">
                    <div class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="far fa-star"></i>
                    </div>
                    <span class="rating-text">New (0 reviews)</span>
                </div>
            </div>
        </div>
        <div class="vet-details">
            <div class="detail-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${data.address}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-phone"></i>
                <span>${data.phone}</span>
            </div>
            <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span>${data.hours}</span>
            </div>
        </div>
        <div class="vet-actions">
            <button class="btn-secondary">
                <i class="fas fa-directions"></i>
                Directions
            </button>
            <button class="btn-primary">
                <i class="fas fa-calendar"></i>
                Book Appointment
            </button>
        </div>
    `;
    
    vetsGrid.appendChild(newCard);
    newCard.style.animation = 'slideInUp 0.5s ease';
    
    // Initialize action buttons for the new card
    initializeCardActions(newCard);
}

// Get Specialty Display Name
function getSpecialtyName(specialty) {
    const specialties = {
        'general': 'General Practice',
        'emergency': 'Emergency Care',
        'surgery': 'Surgery',
        'dermatology': 'Dermatology',
        'cardiology': 'Cardiology',
        'orthopedic': 'Orthopedic Surgery',
        'exotic': 'Exotic Animals'
    };
    return specialties[specialty] || specialty;
}

// Initialize Action Buttons
function initializeActionButtons() {
    const vetCards = document.querySelectorAll('.vet-card');
    vetCards.forEach(card => {
        initializeCardActions(card);
    });
}

function initializeCardActions(card) {
    const directionsBtn = card.querySelector('.btn-secondary');
    const bookBtn = card.querySelector('.btn-primary');
    const vetName = card.querySelector('h3').textContent;
    
    if (directionsBtn) {
        directionsBtn.addEventListener('click', function() {
            // In a real app, this would open maps
            showNotification(`Opening directions to ${vetName}...`, 'info');
        });
    }
    
    if (bookBtn) {
        bookBtn.addEventListener('click', function() {
            // In a real app, this would open booking system
            showNotification(`Opening booking for ${vetName}...`, 'info');
        });
    }
}

// Show No Results Message
function showNoResultsMessage() {
    const vetsGrid = document.querySelector('.vets-grid');
    const visibleCards = Array.from(document.querySelectorAll('.vet-card')).filter(card => 
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
                <h3>No veterinarians found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        vetsGrid.appendChild(noResultsDiv);
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
`;
document.head.appendChild(style);
