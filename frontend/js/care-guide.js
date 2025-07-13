// Care Guide Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeCareGuidePage();
});

function initializeCareGuidePage() {
    // Initialize search functionality
    initializeSearch();
    
    // Initialize category filters
    initializeCategoryFilters();
    
    // Initialize difficulty filter
    initializeDifficultyFilter();
    
    // Initialize bookmark functionality
    initializeBookmarks();
    
    // Initialize article interactions
    initializeArticleInteractions();
    
    // Initialize category cards
    initializeCategoryCards();
    
    // Initialize featured articles
    initializeFeaturedArticles();
    
    console.log('%c📚 Care Guide Page Loaded Successfully!', 'color: #2C5C45; font-size: 14px; font-weight: bold;');
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.getElementById('guideSearch');
    const articleCards = document.querySelectorAll('.article-card');
    const featuredArticles = document.querySelectorAll('.featured-article');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            // Search in regular articles
            articleCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const category = card.querySelector('.category').textContent.toLowerCase();
                
                const isMatch = title.includes(searchTerm) || 
                               description.includes(searchTerm) || 
                               category.includes(searchTerm);
                
                if (isMatch || searchTerm === '') {
                    card.style.display = 'flex';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Search in featured articles
            featuredArticles.forEach(article => {
                const title = article.querySelector('h3').textContent.toLowerCase();
                const description = article.querySelector('p').textContent.toLowerCase();
                const category = article.querySelector('.category').textContent.toLowerCase();
                
                const isMatch = title.includes(searchTerm) || 
                               description.includes(searchTerm) || 
                               category.includes(searchTerm);
                
                if (isMatch || searchTerm === '') {
                    article.style.display = 'block';
                    article.style.animation = 'fadeIn 0.3s ease';
                } else {
                    article.style.display = 'none';
                }
            });
            
            showNoResultsMessage();
        });
    }
}

// Category Filter Functionality
function initializeCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const articleCards = document.querySelectorAll('.article-card');
    const featuredArticles = document.querySelectorAll('.featured-article');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active category button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Filter regular articles
            articleCards.forEach(card => {
                if (category === 'all') {
                    card.style.display = 'flex';
                } else {
                    const cardCategory = card.getAttribute('data-category');
                    card.style.display = cardCategory === category ? 'flex' : 'none';
                }
                
                if (card.style.display === 'flex') {
                    card.style.animation = 'slideInUp 0.3s ease';
                }
            });
            
            // Filter featured articles
            featuredArticles.forEach(article => {
                if (category === 'all') {
                    article.style.display = 'block';
                } else {
                    const articleCategory = article.getAttribute('data-category');
                    article.style.display = articleCategory === category ? 'block' : 'none';
                }
                
                if (article.style.display === 'block') {
                    article.style.animation = 'slideInUp 0.3s ease';
                }
            });
            
            showNoResultsMessage();
        });
    });
}

// Difficulty Filter Functionality
function initializeDifficultyFilter() {
    const difficultySelect = document.getElementById('difficultyFilter');
    const articleCards = document.querySelectorAll('.article-card');
    
    if (difficultySelect) {
        difficultySelect.addEventListener('change', function() {
            const difficulty = this.value;
            
            articleCards.forEach(card => {
                if (difficulty === 'all') {
                    card.style.display = 'flex';
                } else {
                    const cardDifficulty = card.getAttribute('data-difficulty');
                    card.style.display = cardDifficulty === difficulty ? 'flex' : 'none';
                }
                
                if (card.style.display === 'flex') {
                    card.style.animation = 'slideInUp 0.3s ease';
                }
            });
            
            showNoResultsMessage();
        });
    }
}

// Bookmark Functionality
function initializeBookmarks() {
    const bookmarkBtn = document.getElementById('bookmarkBtn');
    const bookmarksModal = document.getElementById('bookmarksModal');
    const closeBookmarksModal = document.getElementById('closeBookmarksModal');
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    
    // Open bookmarks modal
    if (bookmarkBtn && bookmarksModal) {
        bookmarkBtn.addEventListener('click', function() {
            bookmarksModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            updateBookmarksList();
        });
    }
    
    // Close bookmarks modal
    function closeBookmarks() {
        if (bookmarksModal) {
            bookmarksModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    if (closeBookmarksModal) {
        closeBookmarksModal.addEventListener('click', closeBookmarks);
    }
    
    // Close modal on outside click
    if (bookmarksModal) {
        bookmarksModal.addEventListener('click', function(e) {
            if (e.target === bookmarksModal) {
                closeBookmarks();
            }
        });
    }
    
    // Handle bookmark buttons
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const isBookmarked = this.getAttribute('data-bookmarked') === 'true';
            const articleCard = this.closest('.article-card');
            const articleTitle = articleCard.querySelector('h3').textContent;
            const articleCategory = articleCard.querySelector('.category').textContent;
            const readTime = articleCard.querySelector('.read-time').textContent;
            const articleIcon = articleCard.querySelector('.article-placeholder-small').textContent;
            
            if (isBookmarked) {
                // Remove bookmark
                this.setAttribute('data-bookmarked', 'false');
                this.innerHTML = '<i class="far fa-bookmark"></i>';
                removeBookmark(articleTitle);
                showNotification('Bookmark removed', 'info');
            } else {
                // Add bookmark
                this.setAttribute('data-bookmarked', 'true');
                this.innerHTML = '<i class="fas fa-bookmark"></i>';
                addBookmark({
                    title: articleTitle,
                    category: articleCategory,
                    readTime: readTime,
                    icon: articleIcon
                });
                showNotification('Article bookmarked!', 'success');
            }
            
            // Add animation
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

// Article Interactions
function initializeArticleInteractions() {
    const articleCards = document.querySelectorAll('.article-card');
    const featuredArticles = document.querySelectorAll('.featured-article');
    const actionButtons = document.querySelectorAll('.action-btn');
    
    // Article card clicks
    articleCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on action buttons
            if (e.target.closest('.action-btn') || e.target.closest('.bookmark-btn')) {
                return;
            }
            
            const title = this.querySelector('h3').textContent;
            showNotification(`Opening "${title}"...`, 'info');
            
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Featured article clicks
    featuredArticles.forEach(article => {
        article.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            showNotification(`Opening "${title}"...`, 'info');
            
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Action buttons
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const icon = this.querySelector('i');
            const articleTitle = this.closest('.article-card').querySelector('h3').textContent;
            
            if (icon.classList.contains('fa-share')) {
                showNotification('Share link copied to clipboard!', 'success');
            } else if (icon.classList.contains('fa-heart')) {
                // Toggle like
                const likeCount = this.querySelector('span');
                let count = parseInt(likeCount.textContent);
                
                if (icon.classList.contains('far')) {
                    icon.className = 'fas fa-heart';
                    this.style.color = '#FF6B6B';
                    count++;
                    showNotification('Article liked!', 'success');
                } else {
                    icon.className = 'far fa-heart';
                    this.style.color = '';
                    count--;
                    showNotification('Like removed', 'info');
                }
                
                likeCount.textContent = count;
            }
            
            // Add animation
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
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
                
                // Scroll to articles section
                document.querySelector('.articles-section').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Featured Articles
function initializeFeaturedArticles() {
    const featuredArticles = document.querySelectorAll('.featured-article');
    
    // Add intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.6s ease forwards';
            }
        });
    }, { threshold: 0.1 });
    
    featuredArticles.forEach(article => {
        observer.observe(article);
    });
}

// Bookmark Management
let bookmarks = JSON.parse(localStorage.getItem('careGuideBookmarks')) || [];

function addBookmark(article) {
    if (!bookmarks.find(bookmark => bookmark.title === article.title)) {
        bookmarks.push(article);
        localStorage.setItem('careGuideBookmarks', JSON.stringify(bookmarks));
    }
}

function removeBookmark(title) {
    bookmarks = bookmarks.filter(bookmark => bookmark.title !== title);
    localStorage.setItem('careGuideBookmarks', JSON.stringify(bookmarks));
    updateBookmarksList();
}

function updateBookmarksList() {
    const bookmarksList = document.querySelector('.bookmarks-list');
    const emptyBookmarks = document.querySelector('.empty-bookmarks');
    
    if (!bookmarksList) return;
    
    if (bookmarks.length === 0) {
        bookmarksList.style.display = 'none';
        emptyBookmarks.style.display = 'block';
        return;
    }
    
    bookmarksList.style.display = 'flex';
    emptyBookmarks.style.display = 'none';
    
    bookmarksList.innerHTML = bookmarks.map(bookmark => `
        <div class="bookmark-item">
            <div class="bookmark-icon">${bookmark.icon}</div>
            <div class="bookmark-info">
                <h4>${bookmark.title}</h4>
                <p>${bookmark.category} • ${bookmark.readTime}</p>
            </div>
            <button class="remove-bookmark" onclick="removeBookmarkFromList('${bookmark.title}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function removeBookmarkFromList(title) {
    removeBookmark(title);
    
    // Update the bookmark button in the article
    const articleCards = document.querySelectorAll('.article-card');
    articleCards.forEach(card => {
        const articleTitle = card.querySelector('h3').textContent;
        if (articleTitle === title) {
            const bookmarkBtn = card.querySelector('.bookmark-btn');
            bookmarkBtn.setAttribute('data-bookmarked', 'false');
            bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i>';
        }
    });
    
    showNotification('Bookmark removed', 'info');
}

// Show No Results Message
function showNoResultsMessage() {
    const articlesGrid = document.querySelector('.articles-grid');
    const visibleCards = Array.from(document.querySelectorAll('.article-card')).filter(card => 
        card.style.display !== 'none'
    );
    const visibleFeatured = Array.from(document.querySelectorAll('.featured-article')).filter(article => 
        article.style.display !== 'none'
    );
    
    // Remove existing no results message
    const existingMessage = document.querySelector('.no-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (visibleCards.length === 0 && visibleFeatured.length === 0) {
        const noResultsDiv = document.createElement('div');
        noResultsDiv.className = 'no-results-message';
        noResultsDiv.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #5A8A6B;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No articles found</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        articlesGrid.appendChild(noResultsDiv);
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

// Initialize bookmarks on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial bookmark states
    const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
    bookmarkButtons.forEach(button => {
        const articleCard = button.closest('.article-card');
        const articleTitle = articleCard.querySelector('h3').textContent;
        
        if (bookmarks.find(bookmark => bookmark.title === articleTitle)) {
            button.setAttribute('data-bookmarked', 'true');
            button.innerHTML = '<i class="fas fa-bookmark"></i>';
        }
    });
});

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
    
    .bookmark-btn, .action-btn {
        transition: transform 0.2s ease;
    }
    
    .article-card, .featured-article, .category-card {
        transition: transform 0.2s ease;
    }
`;
document.head.appendChild(style);
