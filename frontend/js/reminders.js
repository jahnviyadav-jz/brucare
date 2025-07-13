// Reminders Page JavaScript

// DOM Elements
let addReminderBtn, closeModalBtn, cancelBtn, reminderForm, modal, searchInput, filterBtns, sortSelect;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    initializeEventListeners();
    initializeFilters();
    updateTimeDisplays();
    animateCards();
});

function initializeElements() {
    addReminderBtn = document.getElementById('addReminderBtn');
    closeModalBtn = document.getElementById('closeModal');
    cancelBtn = document.getElementById('cancelBtn');
    reminderForm = document.getElementById('reminderForm');
    modal = document.getElementById('addReminderModal');
    searchInput = document.getElementById('searchInput');
    filterBtns = document.querySelectorAll('.filter-btn');
    sortSelect = document.getElementById('sortSelect');
}

function initializeEventListeners() {
    // Modal controls
    addReminderBtn?.addEventListener('click', openModal);
    closeModalBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
    });

    // Form submission
    reminderForm?.addEventListener('submit', handleFormSubmit);

    // Search functionality
    searchInput?.addEventListener('input', handleSearch);

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilter);
    });

    // Sort functionality
    sortSelect?.addEventListener('change', handleSort);

    // Reminder card actions
    initializeReminderActions();

    // Navigation
    initializeNavigation();
}

function openModal() {
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('reminderDate');
    if (dateInput) dateInput.value = today;
}

function closeModal() {
    modal?.classList.remove('active');
    document.body.style.overflow = '';
    reminderForm?.reset();
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(reminderForm);
    const reminderData = {
        title: document.getElementById('reminderTitle').value,
        pet: document.getElementById('reminderPet').value,
        type: document.getElementById('reminderType').value,
        description: document.getElementById('reminderDescription').value,
        date: document.getElementById('reminderDate').value,
        time: document.getElementById('reminderTime').value,
        priority: document.getElementById('reminderPriority').value,
        repeat: document.getElementById('reminderRepeat').value
    };

    // Validate form
    if (!reminderData.title || !reminderData.pet || !reminderData.type || !reminderData.date || !reminderData.time) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Add reminder (in a real app, this would save to database)
    addNewReminder(reminderData);
    closeModal();
    showNotification('Reminder added successfully! 🎉');
}

function addNewReminder(data) {
    // Create new reminder card
    const reminderCard = createReminderCard(data);
    
    // Determine which group to add to based on date
    const reminderDate = new Date(data.date + 'T' + data.time);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const cardDate = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
    
    let targetGroup;
    if (cardDate < today) {
        targetGroup = document.querySelector('.reminder-group .group-title.urgent')?.parentElement;
    } else if (cardDate.getTime() === today.getTime()) {
        targetGroup = document.querySelector('.reminder-group .group-title.today')?.parentElement;
    } else {
        targetGroup = document.querySelector('.reminder-group .group-title.upcoming')?.parentElement;
    }
    
    if (targetGroup) {
        const reminderList = targetGroup.querySelector('.reminder-list');
        reminderList.appendChild(reminderCard);
        
        // Animate in
        reminderCard.style.opacity = '0';
        reminderCard.style.transform = 'translateY(20px)';
        setTimeout(() => {
            reminderCard.style.transition = 'all 0.3s ease';
            reminderCard.style.opacity = '1';
            reminderCard.style.transform = 'translateY(0)';
        }, 100);
    }
    
    updateStats();
}

function createReminderCard(data) {
    const card = document.createElement('div');
    card.className = `reminder-card ${getPriorityClass(data.priority)}`;
    card.setAttribute('data-pet', data.pet);
    card.setAttribute('data-type', data.type);
    
    const typeIcons = {
        feeding: 'fas fa-bone',
        walk: 'fas fa-walking',
        medication: 'fas fa-pills',
        grooming: 'fas fa-cut',
        vet: 'fas fa-stethoscope',
        training: 'fas fa-graduation-cap',
        other: 'fas fa-clipboard'
    };
    
    const petEmojis = {
        maggi: '🐕'
    };
    
    card.innerHTML = `
        <div class="reminder-priority">
            <div class="priority-indicator ${data.priority}"></div>
        </div>
        <div class="reminder-icon">
            <i class="${typeIcons[data.type] || 'fas fa-clipboard'}"></i>
        </div>
        <div class="reminder-content">
            <div class="reminder-header">
                <h4>${data.title}</h4>
                <span class="pet-tag">${petEmojis[data.pet] || '🐾'} ${data.pet.charAt(0).toUpperCase() + data.pet.slice(1)}</span>
            </div>
            <p class="reminder-description">${data.description}</p>
            <div class="reminder-meta">
                <span class="time-info">
                    <i class="fas fa-clock"></i>
                    ${formatDateTime(data.date, data.time)}
                </span>
                <span class="repeat-info">
                    <i class="fas fa-repeat"></i>
                    ${data.repeat === 'none' ? 'No Repeat' : data.repeat.charAt(0).toUpperCase() + data.repeat.slice(1)}
                </span>
            </div>
        </div>
        <div class="reminder-actions">
            <button class="action-btn complete" title="Mark Complete">
                <i class="fas fa-check"></i>
            </button>
            <button class="action-btn snooze" title="Snooze">
                <i class="fas fa-clock"></i>
            </button>
            <button class="action-btn edit" title="Edit">
                <i class="fas fa-edit"></i>
            </button>
        </div>
    `;
    
    // Add event listeners to action buttons
    const completeBtn = card.querySelector('.action-btn.complete');
    const snoozeBtn = card.querySelector('.action-btn.snooze');
    const editBtn = card.querySelector('.action-btn.edit');
    
    completeBtn.addEventListener('click', (e) => handleComplete(e, card));
    snoozeBtn.addEventListener('click', (e) => handleSnooze(e, card));
    editBtn.addEventListener('click', (e) => handleEdit(e, card));
    
    return card;
}

function getPriorityClass(priority) {
    const priorityMap = {
        urgent: 'urgent',
        high: 'today',
        medium: 'upcoming',
        low: 'upcoming'
    };
    return priorityMap[priority] || 'upcoming';
}

function formatDateTime(date, time) {
    const reminderDate = new Date(date + 'T' + time);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const cardDate = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
    
    const timeStr = reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (cardDate.getTime() === today.getTime()) {
        return `Today ${timeStr}`;
    } else if (cardDate < today) {
        const daysDiff = Math.floor((today - cardDate) / (1000 * 60 * 60 * 24));
        return daysDiff === 1 ? `Yesterday ${timeStr}` : `${daysDiff} days ago`;
    } else {
        const daysDiff = Math.floor((cardDate - today) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
            return `Tomorrow ${timeStr}`;
        } else if (daysDiff <= 7) {
            return `In ${daysDiff} days - ${reminderDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
        } else {
            return `${reminderDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
        }
    }
}

function initializeReminderActions() {
    document.querySelectorAll('.action-btn.complete').forEach(btn => {
        btn.addEventListener('click', (e) => handleComplete(e, btn.closest('.reminder-card')));
    });
    
    document.querySelectorAll('.action-btn.snooze').forEach(btn => {
        btn.addEventListener('click', (e) => handleSnooze(e, btn.closest('.reminder-card')));
    });
    
    document.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', (e) => handleEdit(e, btn.closest('.reminder-card')));
    });
}

function handleComplete(e, card) {
    e.stopPropagation();
    
    // Add completion animation
    card.style.transform = 'scale(0.95)';
    card.style.opacity = '0.7';
    
    setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.transform = 'translateX(100%)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            card.remove();
            updateStats();
            showNotification('Reminder completed! ✅');
        }, 500);
    }, 200);
}

function handleSnooze(e, card) {
    e.stopPropagation();
    showNotification('Reminder snoozed for 1 hour ⏰');
    
    // Add snooze animation
    card.style.transform = 'translateX(-10px)';
    setTimeout(() => {
        card.style.transform = '';
    }, 200);
}

function handleEdit(e, card) {
    e.stopPropagation();
    showNotification('Edit functionality coming soon! ✏️');
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const reminderCards = document.querySelectorAll('.reminder-card');
    
    reminderCards.forEach(card => {
        const title = card.querySelector('h4').textContent.toLowerCase();
        const description = card.querySelector('.reminder-description').textContent.toLowerCase();
        const pet = card.querySelector('.pet-tag').textContent.toLowerCase();
        
        const matches = title.includes(searchTerm) || 
                       description.includes(searchTerm) || 
                       pet.includes(searchTerm);
        
        card.style.display = matches ? 'flex' : 'none';
    });
}

function handleFilter(e) {
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    const filter = e.target.getAttribute('data-filter');
    const reminderGroups = document.querySelectorAll('.reminder-group');
    
    if (filter === 'all') {
        reminderGroups.forEach(group => group.style.display = 'block');
    } else {
        reminderGroups.forEach(group => {
            const groupTitle = group.querySelector('.group-title');
            const shouldShow = groupTitle.classList.contains(filter);
            group.style.display = shouldShow ? 'block' : 'none';
        });
    }
    
    showNotification(`Filtered by: ${filter.charAt(0).toUpperCase() + filter.slice(1)}`);
}

function handleSort() {
    const sortBy = sortSelect.value;
    showNotification(`Sorted by: ${sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}`);
    
    // In a real app, this would re-order the reminder cards
    // For demo purposes, we'll just show the notification
}

function updateTimeDisplays() {
    // Update overdue time for walk reminder
    const walkCard = document.querySelector('[data-type="walk"]');
    if (walkCard) {
        const timeInfo = walkCard.querySelector('.time-info');
        if (timeInfo && timeInfo.textContent.includes('5:00 PM')) {
            const now = new Date();
            const yesterday5PM = new Date();
            yesterday5PM.setDate(yesterday5PM.getDate() - 1);
            yesterday5PM.setHours(17, 0, 0, 0);
            
            const timeDiff = now - yesterday5PM;
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            
            timeInfo.innerHTML = `
                <i class="fas fa-clock"></i>
                5:00 PM - Overdue by ${hours}h ${minutes}m
            `;
        }
    }
}

function updateStats() {
    // In a real app, this would calculate actual stats from the data
    // For demo purposes, we'll update the display numbers
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        const currentValue = parseInt(card.querySelector('h3').textContent);
        // Add some animation to the numbers
        animateNumber(card.querySelector('h3'), currentValue, currentValue + 1);
    });
}

function animateNumber(element, start, end) {
    const duration = 500;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function animateCards() {
    const cards = document.querySelectorAll('.reminder-card, .stat-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
    
    // Trigger animations after a short delay
    setTimeout(() => {
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }, 300);
}

function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Don't prevent default for actual page links
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Utility function for notifications (reuse from main script)
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Set colors based on type
    let bgColor = 'linear-gradient(135deg, #2C5C45 0%, #3A7A5A 100%)';
    if (type === 'error') {
        bgColor = 'linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)';
    } else if (type === 'warning') {
        bgColor = 'linear-gradient(135deg, #FFA726 0%, #FF9800 100%)';
    }
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: bgColor,
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(44, 92, 69, 0.3)',
        zIndex: '1001',
        fontSize: '0.9rem',
        fontWeight: '500',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backdropFilter: 'blur(10px)',
        maxWidth: '300px'
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

// Update time displays every minute
setInterval(updateTimeDisplays, 60000);

// Console message
console.log('%c🔔 Reminders Page Loaded Successfully!', 'color: #2C5C45; font-size: 16px; font-weight: bold;');
