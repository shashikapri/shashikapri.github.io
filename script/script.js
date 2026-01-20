// Main JavaScript for Project Management Guidebook

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const tocLinks = document.querySelectorAll('.toc-list a');
    const backToTopBtn = document.querySelector('.back-to-top');
    
    // Function to update active navigation link based on scroll position
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
        
        // Update navigation links
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
        
        // Update table of content links
        tocLinks.forEach(link => {
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const targetTop = targetSection.offsetTop;
                const targetHeight = targetSection.clientHeight;
                
                // Check if the target section is in view
                if (scrollPosition >= targetTop && scrollPosition < targetTop + targetHeight) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            }
        });
        
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
                    
                    // Close mobile menu if open
                    const mobileMenu = document.querySelector('.mobile-menu');
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenu.classList.remove('active');
                    }
                }
            });
        });
    }
    
    // Function to highlight table of content links when clicked
    function setupTocLinkHighlights() {
        tocLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Remove active class from all TOC links
                tocLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
            });
        });
    }
    
    // Function to add interactive elements
    function addInteractivity() {
        // Add click effect to cards
        const cards = document.querySelectorAll('.toc-card, .methodology-card, .phase, .principle-card, .scrum-element, .tool-card, .management-card, .quality-tool, .risk-step, .feature, .cert-card');
        
        cards.forEach(card => {
            card.addEventListener('click', function() {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
        
        // Add progress indicator for each section
        const contentSections = document.querySelectorAll('.content-section');
        contentSections.forEach(section => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(section);
        });
    }
    
    // Initialize all functionality
    function init() {
        // Set up smooth scrolling
        setupSmoothScrolling();
        
        // Set up table of content link highlights
        setupTocLinkHighlights();
        
        // Add interactivity to elements
        addInteractivity();
        
        // Add scroll event listener for active link updates
        window.addEventListener('scroll', updateActiveLink);
        
        // Initial call to set correct active links on page load
        updateActiveLink();
        
        // Add click event to back to top button
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        
        // Add keyboard navigation support
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
        });
        
        // Print guidebook button functionality
        const printBtn = document.createElement('button');
        printBtn.innerHTML = '<i class="fas fa-print"></i> Print Guide';
        printBtn.className = 'print-btn';
        printBtn.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 30px;
            background: #2c3e50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            z-index: 99;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        `;
        
        printBtn.addEventListener('click', function() {
            window.print();
        });
        
        document.body.appendChild(printBtn);
    }
    
    // Initialize the application
    init();
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .content-section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .content-section.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        @media print {
            nav, .back-to-top, .print-btn {
                display: none !important;
            }
            
            section {
                min-height: auto;
                padding: 20px 0;
                page-break-inside: avoid;
            }
            
            .section-content {
                box-shadow: none;
                background: white;
            }
            
            .toc-card, .methodology-card, .phase, .principle-card, 
            .scrum-element, .tool-card, .management-card, 
            .quality-tool, .risk-step, .feature, .cert-card {
                box-shadow: none;
                border: 1px solid #ddd;
            }
        }
    `;
    document.head.appendChild(style);
});