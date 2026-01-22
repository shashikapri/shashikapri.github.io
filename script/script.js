// Main JavaScript for Project Management Guidebook

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const sections = document.querySelectorAll('section');
    const backToTopBtn = document.querySelector('.back-to-top');
    
    // Sidebar Elements
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const closeMainSidebar = document.getElementById('close-main-sidebar');
    const mainSidebar = document.getElementById('main-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const chapterHeaders = document.querySelectorAll('.chapter-header');
    const sidebarTopics = document.querySelectorAll('.sidebar-topic');
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Search Elements
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchContainer = document.querySelector('.search-container');
    
    // Language Selector Elements
    const languageBtn = document.getElementById('language-btn');
    const languageDropdown = document.getElementById('language-dropdown');
    const languageOptions = document.querySelectorAll('.language-dropdown a');
    
    // Quick links buttons
    const printGuideBtn = document.getElementById('print-guide-btn');
    const downloadPdfBtn = document.getElementById('download-pdf-btn');
    const contactBtn = document.getElementById('contact-btn');
    
    // Define searchable content
    const searchContent = [
        { id: 'waterfall', title: 'Waterfall Methodology', chapter: 'Chapter 1', icon: 'fas fa-water' },
        { id: 'agile', title: 'Agile & Lean Management', chapter: 'Chapter 1', icon: 'fas fa-sync-alt' },
        { id: 'scrum', title: 'Introduction to Scrum', chapter: 'Chapter 1', icon: 'fas fa-users' },
        { id: 'wbs-gantt', title: 'WBS & Gantt Charts', chapter: 'Chapter 2', icon: 'fas fa-sitemap' },
        { id: 'scope-management', title: 'Scope Management', chapter: 'Chapter 2', icon: 'fas fa-bullseye' },
        { id: 'quality-tools', title: 'Quality Tools & Techniques', chapter: 'Chapter 2', icon: 'fas fa-check-square' },
        { id: 'risk-management', title: 'Risk Management', chapter: 'Chapter 3', icon: 'fas fa-exclamation-triangle' },
        { id: 'quality-management', title: 'Quality Management', chapter: 'Chapter 3', icon: 'fas fa-award' },
        { id: 'pm-software', title: 'Project Management Software', chapter: 'Chapter 3', icon: 'fas fa-laptop' }
    ];
    
    // Current language
    let currentLanguage = 'en';
    
    // Function to toggle sidebar
    function toggleSidebar() {
        mainSidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        document.body.style.overflow = mainSidebar.classList.contains('active') ? 'hidden' : '';
    }
    
    // Function to close sidebar
    function closeSidebarFunc() {
        mainSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Function to toggle chapter topics
    function toggleChapterTopics(chapterNumber) {
        const chapterGroup = document.querySelector(`.chapter-header[data-chapter="${chapterNumber}"]`).parentElement;
        
        // Close other chapters
        document.querySelectorAll('.chapter-group').forEach(group => {
            if (group !== chapterGroup) {
                group.classList.remove('active');
            }
        });
        
        // Toggle current chapter
        chapterGroup.classList.toggle('active');
    }
    
    // Function to update active sidebar items
    function updateActiveSidebarItems() {
        let currentSection = '';
        const navHeight = document.querySelector('nav').offsetHeight;
        const scrollPosition = window.scrollY + navHeight + 50;
        
        // Determine which section is currently in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update menu items
        menuItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href && href.substring(1) === currentSection) {
                item.classList.add('active');
            }
        });
        
        // Update sidebar topics
        sidebarTopics.forEach(topic => {
            topic.classList.remove('active');
            if (topic.getAttribute('href').substring(1) === currentSection) {
                topic.classList.add('active');
                
                // Open the parent chapter
                const topicId = topic.getAttribute('href').substring(1);
                const content = searchContent.find(item => item.id === topicId);
                if (content) {
                    const chapterNum = content.chapter.split(' ')[1];
                    const chapterGroup = document.querySelector(`.chapter-header[data-chapter="${chapterNum}"]`).parentElement;
                    if (chapterGroup) {
                        chapterGroup.classList.add('active');
                    }
                }
            }
        });
    }
    
    // Function to handle search
    function performSearch(query) {
        if (!query.trim()) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            return;
        }
        
        const searchTerm = query.toLowerCase();
        const results = searchContent.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            item.chapter.toLowerCase().includes(searchTerm) ||
            item.id.toLowerCase().includes(searchTerm)
        );
        
        displaySearchResults(results);
    }
    
    // Function to display search results
    function displaySearchResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'search-result-item';
            noResults.innerHTML = '<i class="fas fa-search"></i> No results found';
            searchResults.appendChild(noResults);
        } else {
            results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <i class="${result.icon}"></i>
                    <div>
                        <div class="result-title">${result.title}</div>
                        <div class="result-chapter">${result.chapter}</div>
                    </div>
                `;
                
                resultItem.addEventListener('click', () => {
                    const targetElement = document.getElementById(result.id);
                    if (targetElement) {
                        const navHeight = document.querySelector('nav').offsetHeight;
                        const targetPosition = targetElement.offsetTop - navHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Update active sidebar items
                        updateActiveSidebarItems();
                        
                        // Close sidebar if open
                        closeSidebarFunc();
                        
                        // Clear search
                        searchInput.value = '';
                        searchResults.style.display = 'none';
                    }
                });
                
                searchResults.appendChild(resultItem);
            });
        }
        
        searchResults.style.display = 'block';
    }
    
    // Function to update active navigation based on scroll position
    function updateActiveLink() {
        let currentSection = '';
        const navHeight = document.querySelector('nav').offsetHeight;
        const scrollPosition = window.scrollY + navHeight + 50;
        
        // Determine which section is currently in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update sidebar items
        updateActiveSidebarItems();
        
        // Show/hide back to top button
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    // Function to handle smooth scrolling for internal links
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Calculate offset for fixed navigation
                    const navHeight = document.querySelector('nav').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight;
                    
                    // Smooth scroll to target
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page reload
                    if (targetId !== '#home') {
                        history.pushState(null, null, targetId);
                    }
                    
                    // Close sidebar if open
                    closeSidebarFunc();
                    
                    // Close search results
                    searchResults.style.display = 'none';
                }
            });
        });
    }
    
   
     // Function to handle language selection
    function setupLanguageSelector() {
        languageBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
        });
        
        languageOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                const langText = this.textContent;
                
                // Update current language
                currentLanguage = lang;
                
                // Update button text
                languageBtn.innerHTML = `
                    <i class="fas fa-globe"></i> 
                    <span>${langText}</span>
                    <i class="fas fa-chevron-down"></i>
                `;
                
                // Close dropdown
                languageDropdown.classList.remove('show');
                
                // Show language change message
                showLanguageChangeMessage(langText);
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
                languageDropdown.classList.remove('show');
            }
        });
    }
    
    // Function to show language change message
    function showLanguageChangeMessage(language) {
        const message = document.createElement('div');
        message.className = 'language-change-message';
        message.innerHTML = `
            <div class="message-content">
                <i class="fas fa-language"></i>
                <span>Switched to ${language}. Translation would be implemented here.</span>
            </div>
        `;
        
        // Add styles
        message.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: #3498db;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            message.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (message.parentNode) {
                    message.parentNode.removeChild(message);
                }
            }, 300);
        }, 3000);
    }
    // Function to setup sidebar functionality
    function setupSidebar() {
        // Open sidebar when clicking toggle button
        sidebarToggle.addEventListener('click', toggleSidebar);
        
        // Close sidebar when clicking close button
        closeMainSidebar.addEventListener('click', closeSidebarFunc);
        
        // Close sidebar when clicking overlay
        sidebarOverlay.addEventListener('click', closeSidebarFunc);
        
        // Toggle chapter topics
        chapterHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const chapterNumber = header.getAttribute('data-chapter');
                toggleChapterTopics(chapterNumber);
            });
        });
        
        // Handle sidebar topic clicks
        sidebarTopics.forEach(topic => {
            topic.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navHeight = document.querySelector('nav').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close sidebar
                    closeSidebarFunc();
                    
                    // Update active class
                    sidebarTopics.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
        
        // Handle menu item clicks
        menuItems.forEach(item => {
            item.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        const navHeight = document.querySelector('nav').offsetHeight;
                        const targetPosition = targetElement.offsetTop - navHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Close sidebar
                        closeSidebarFunc();
                        
                        // Update active class
                        menuItems.forEach(i => i.classList.remove('active'));
                        this.classList.add('active');
                    }
                }
            });
        });
        
        // Handle quick links
        if (printGuideBtn) {
            printGuideBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.print();
            });
        }
        
        if (downloadPdfBtn) {
            downloadPdfBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Simulate PDF download
                const message = document.createElement('div');
                message.className = 'pdf-download-message';
                message.innerHTML = `
                    <div class="message-content">
                        <i class="fas fa-file-pdf"></i>
                        <span>PDF download would be implemented here.</span>
                    </div>
                `;
                
                message.style.cssText = `
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: #2c3e50;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1001;
                    animation: slideIn 0.3s ease;
                `;
                
                document.body.appendChild(message);
                
                setTimeout(() => {
                    message.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => {
                        if (message.parentNode) {
                            message.parentNode.removeChild(message);
                        }
                    }, 300);
                }, 3000);
            });
        }
        
        if (contactBtn) {
            contactBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Simulate contact action
                const message = document.createElement('div');
                message.className = 'contact-message';
                message.innerHTML = `
                    <div class="message-content">
                        <i class="fas fa-envelope"></i>
                        <span>Contact form would open here.</span>
                    </div>
                `;
                
                message.style.cssText = `
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: #27ae60;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1001;
                    animation: slideIn 0.3s ease;
                `;
                
                document.body.appendChild(message);
                
                setTimeout(() => {
                    message.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => {
                        if (message.parentNode) {
                            message.parentNode.removeChild(message);
                        }
                    }, 300);
                }, 3000);
            });
        }
        
        // Open Chapter 1 by default
        const firstChapter = document.querySelector('.chapter-header[data-chapter="1"]');
        if (firstChapter) {
            firstChapter.parentElement.classList.add('active');
        }
    }
    
    // Function to setup search functionality
    function setupSearch() {
        searchInput.addEventListener('input', function() {
            performSearch(this.value);
        });
        
        searchInput.addEventListener('focus', function() {
            if (this.value.trim()) {
                performSearch(this.value);
            }
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchContainer.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
        
        // Clear search on escape key
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                searchResults.style.display = 'none';
            }
        });
    }
    
    // Function to add animation to content sections
    function setupContentAnimations() {
        const contentSections = document.querySelectorAll('.content-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        contentSections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // Function to add keyboard navigation
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // Home key - scroll to top
            if (e.key === 'Home') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            // End key - scroll to bottom
            if (e.key === 'End') {
                e.preventDefault();
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
            
            // Escape key - close sidebar and search
            if (e.key === 'Escape') {
                closeSidebarFunc();
                searchResults.style.display = 'none';
                languageDropdown.classList.remove('show');
            }
            
            // Ctrl + F - focus search
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                searchInput.focus();
            }
            
            // Ctrl + B - toggle sidebar
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                toggleSidebar();
            }
        });
    }
    
    // Function to setup back to top button
    function setupBackToTop() {
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    // Function to add CSS animations
    function addCSSAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .language-change-message,
            .pdf-download-message,
            .contact-message {
                animation: slideIn 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Initialize all functionality
    function init() {
        // Set up smooth scrolling
        setupSmoothScrolling();
        
        // Set up sidebar functionality
        setupSidebar();
        
        // Set up search functionality
        setupSearch();
        
        // Set up language selector
        setupLanguageSelector();
        
        // Set up content animations
        setupContentAnimations();
        
        // Set up keyboard navigation
        setupKeyboardNavigation();
        
        // Set up back to top button
        setupBackToTop();
        
        // Add CSS animations
        addCSSAnimations();
        
        // Add scroll event listener for active link updates
        window.addEventListener('scroll', updateActiveLink);
        
        // Initial call to set correct active links on page load
        updateActiveLink();
        
        // Add click effect to cards
        const cards = document.querySelectorAll('.methodology-card, .phase, .principle-card, .scrum-element, .tool-card, .management-card, .quality-tool, .risk-step, .feature, .cert-card');
        
        cards.forEach(card => {
            card.addEventListener('click', function() {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
    }
    
    // Initialize the application
    init();
    
    // Add print button to navbar for better UX
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '<i class="fas fa-print"></i>';
    printBtn.className = 'print-btn-nav';
    printBtn.title = 'Print Guide';
    
    printBtn.style.cssText = `
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    `;
    
    printBtn.addEventListener('mouseenter', function() {
        this.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    printBtn.addEventListener('mouseleave', function() {
        this.style.background = 'rgba(255, 255, 255, 0.1)';
    });
    
    printBtn.addEventListener('click', function() {
        window.print();
    });
    
    // Add print button to navbar
    const navRight = document.querySelector('.nav-right');
    if (navRight) {
        navRight.insertBefore(printBtn, navRight.firstChild);
    }
});