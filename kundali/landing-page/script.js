// KundliCast Website JavaScript

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (icon.classList.contains('fa-bars')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
            
            // Scroll to the target element
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Simple form validation for any form elements
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // Check required fields
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('border-red-500');
                    
                    // Add error message if it doesn't exist
                    let errorMsg = field.nextElementSibling;
                    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                        errorMsg = document.createElement('p');
                        errorMsg.classList.add('error-message', 'text-red-500', 'text-sm', 'mt-1');
                        errorMsg.textContent = 'This field is required';
                        field.parentNode.insertBefore(errorMsg, field.nextSibling);
                    }
                } else {
                    field.classList.remove('border-red-500');
                    
                    // Remove error message if it exists
                    const errorMsg = field.nextElementSibling;
                    if (errorMsg && errorMsg.classList.contains('error-message')) {
                        errorMsg.remove();
                    }
                }
            });
            
            // Email validation for email fields
            const emailFields = form.querySelectorAll('input[type="email"]');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            emailFields.forEach(field => {
                if (field.value.trim() && !emailRegex.test(field.value.trim())) {
                    isValid = false;
                    field.classList.add('border-red-500');
                    
                    // Add error message if it doesn't exist
                    let errorMsg = field.nextElementSibling;
                    if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                        errorMsg = document.createElement('p');
                        errorMsg.classList.add('error-message', 'text-red-500', 'text-sm', 'mt-1');
                        errorMsg.textContent = 'Please enter a valid email address';
                        field.parentNode.insertBefore(errorMsg, field.nextSibling);
                    }
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
    });
    
    // Subtle animations for interactive elements
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    // Simple scroll animation
    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('show');
            }
        });
    }
    
    // Check scroll position on load
    window.addEventListener('load', checkScroll);
    
    // Check scroll position on scroll
    window.addEventListener('scroll', checkScroll);
});

// Add subtle star animation to the hero section
function createStars() {
    const heroSection = document.getElementById('home');
    if (!heroSection) return;
    
    // Only add stars if they don't already exist
    if (document.querySelector('.star')) return;
    
    // Create stars
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.classList.add('star', 'star-twinkle');
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = '2px';
        star.style.backgroundColor = '#FFD700';
        star.style.borderRadius = '50%';
        star.style.opacity = '0.7';
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random animation delay
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        heroSection.appendChild(star);
    }
}

// Call the createStars function on load
window.addEventListener('load', createStars);
