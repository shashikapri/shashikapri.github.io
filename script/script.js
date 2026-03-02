// DOM Elements
const sidebar = document.getElementById('main-sidebar');
const toggleBtn = document.getElementById('sidebar-toggle');
const closeBtn = document.getElementById('close-main-sidebar');
const dynamicBody = document.getElementById('dynamic-body');
const backBtn = document.getElementById('backToTop');
const langBtn = document.getElementById('language-btn');
const langDropdown = document.getElementById('language-dropdown');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing application');
    
    // Set up event listeners
    initializeSidebar();
    initializeChapterDropdowns(); // This sets up all chapter dropdowns
    initializeNavigation();
    initializeLanguageSelector();
    initializeSearch();
    initializeBackToTop();
    
    // Load home page by default
    loadPage('home.html');
});

function initializeSidebar() {
    // Toggle sidebar open
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.remove('collapsed');
        });
    }
    
    // Close sidebar
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            sidebar.classList.add('collapsed');
        });
    }
}

function initializeChapterDropdowns() {
    console.log('Initializing chapter dropdowns');
    
    // Get all chapter headers
    const chapterHeaders = document.querySelectorAll('.chapter-header');
    console.log('Found', chapterHeaders.length, 'chapter headers');
    
    chapterHeaders.forEach(header => {
        // Remove any existing listeners to prevent duplicates
        header.removeEventListener('click', handleChapterClick);
        header.addEventListener('click', handleChapterClick);
    });
    
    // Open first chapter by default (optional)
    const firstChapter = document.querySelector('.chapter-header[data-chapter="1"]');
    if (firstChapter) {
        const chapterId = firstChapter.dataset.chapter;
        const topics = document.getElementById(`chapter-${chapterId}-topics`);
        if (topics && !topics.classList.contains('active')) {
            topics.classList.add('active');
            const icon = firstChapter.querySelector('.fa-chevron-down');
            if (icon) {
                icon.style.transform = 'rotate(180deg)';
            }
        }
    }
}

// Separate handler function for chapter clicks
function handleChapterClick(e) {
    // Prevent clicking on links inside the header from triggering the header
    if (e.target.tagName === 'A' || e.target.closest('a')) {
        return;
    }
    
    const header = e.currentTarget;
    const chapter = header.dataset.chapter;
    const topics = document.getElementById(`chapter-${chapter}-topics`);
    const icon = header.querySelector('.fa-chevron-down');
    
    if (topics) {
        // Toggle active class
        topics.classList.toggle('active');
        
        // Rotate icon
        if (icon) {
            if (topics.classList.contains('active')) {
                icon.style.transform = 'rotate(180deg)';
            } else {
                icon.style.transform = 'rotate(0deg)';
            }
        }
        
        console.log(`Chapter ${chapter} toggled:`, topics.classList.contains('active'));
    }
}

function initializeNavigation() {
    // Sidebar links - load external pages
    document.querySelectorAll('.load-page').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            if (page) {
                console.log('Loading page:', page);
                loadPage(page);
                
                // Optional: close sidebar on mobile
                if (window.innerWidth < 768) {
                    sidebar.classList.add('collapsed');
                }
            }
        });
    });

    // Nav links (Home, Guide Contents)
    const homeLink = document.querySelector('[data-nav="home"]');
    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('home.html');
        });
    }
    
    const tocLink = document.querySelector('[data-nav="toc"]');
    if (tocLink) {
        tocLink.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage('toc.html');
        });
    }

   
}

// Function to load external HTML pages
function loadPage(pageUrl) {
    // Show loading indicator
    dynamicBody.innerHTML = `
        <div class="section-card text-center p-5">
            <i class="fas fa-spinner fa-spin fa-3x" style="color: #1d4468;"></i>
            <p class="mt-3">Loading ${pageUrl}...</p>
        </div>
    `;
    
    // Fetch the external HTML file
    fetch(pageUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // Wrap the content in a section-card for consistent styling
            dynamicBody.innerHTML = `<div class="section-card">${html}</div>`;
            
            // Update URL hash to reflect current page
            window.location.hash = pageUrl;
            
            // Scroll to top of content
            dynamicBody.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Re-initialize any components that might be needed for the loaded content
            initializeLoadedContent();
        })
        .catch(error => {
            console.error('Error loading page:', error);
            dynamicBody.innerHTML = `
                <div class="section-card">
                    <div class="alert alert-danger">
                        <h4><i class="fas fa-exclamation-triangle"></i> Error Loading Page</h4>
                        <p>Could not load <strong>${pageUrl}</strong>. Please make sure the file exists.</p>
                        <p>Error details: ${error.message}</p>
                        <hr>
                        <p class="mb-0">
                            <a href="#" onclick="loadPage('home.html'); return false;" class="btn btn-primary">
                                <i class="fas fa-home"></i> Go to Home
                            </a>
                        </p>
                    </div>
                </div>
            `;
        });
}

function initializeLoadedContent() {
    // Re-attach any event listeners to links inside the loaded content
    document.querySelectorAll('.load-page').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            if (page) loadPage(page);
        });
    });
    
    // Re-initialize any other components
    initializeBackToTop();
}

function initializeLanguageSelector() {
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.style.display = langDropdown.style.display === 'block' ? 'none' : 'block';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.style.display = 'none';
            }
        });

        // Language selection
        langDropdown.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = link.dataset.lang;
                console.log('Language selected:', lang);
                // Update button text
                const langBtnText = langBtn.innerHTML;
                langBtn.innerHTML = `<i class="fas fa-globe"></i> ${link.textContent} <i class="fas fa-chevron-down"></i>`;
                langDropdown.style.display = 'none';
                
                // Here you would implement actual language switching logic
                alert(`Language switched to ${link.textContent}. Translation would happen here.`);
            });
        });
    }
}

function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            if (searchTerm.length > 2) {
                console.log('Searching for:', searchTerm);
                // Implement search functionality here
                // You could filter chapters, show results, etc.
            }
        });
        
        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = e.target.value.toLowerCase();
                if (searchTerm.length > 0) {
                    console.log('Executing search for:', searchTerm);
                    alert(`Searching for: ${searchTerm}\nFull search functionality would be implemented here.`);
                }
            }
        });
    }
}

function initializeBackToTop() {
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            dynamicBody.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Show/hide back to top button based on scroll position
        dynamicBody.addEventListener('scroll', () => {
            if (dynamicBody.scrollTop > 300) {
                backBtn.style.display = 'flex';
            } else {
                backBtn.style.display = 'flex'; // Always show, but you can change this
            }
        });
    }
}

// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
    if (window.location.hash) {
        const page = window.location.hash.substring(1); // Remove the #
        if (page) loadPage(page);
    } else {
        loadPage('home.html');
    }
});

// Re-initialize dropdowns if sidebar content changes (useful for dynamic loading)
function refreshDropdowns() {
    initializeChapterDropdowns();
}

// Make functions available globally if needed
window.loadPage = loadPage;
window.refreshDropdowns = refreshDropdowns;