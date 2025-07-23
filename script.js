// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = navMenu.classList.contains('active') ? 'rotate(45deg) translateY(8px)' : '';
    spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navMenu.classList.contains('active') ? 'rotate(-45deg) translateY(-8px)' : '';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
    });
});

// Sticky Header with Hide/Show on Scroll
let lastScroll = 0;
const header = document.querySelector('.header');
header.style.transition = 'transform 0.3s ease-in-out';

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    // Add shadow on scroll
    if (currentScroll > 10) {
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
    
    lastScroll = currentScroll;
});

// Search Functionality
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const retreatCards = document.querySelectorAll('.retreat-card');

searchBtn.addEventListener('click', performSearch);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
    // Live search
    if (searchInput.value.length > 2) {
        performSearch();
    }
    // Show all if search is cleared
    if (searchInput.value === '') {
        retreatCards.forEach(card => {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.6s ease-out';
        });
    }
});

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    let hasResults = false;
    
    retreatCards.forEach(card => {
        const cardText = card.textContent.toLowerCase();
        if (cardText.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.6s ease-out';
            hasResults = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show no results message if needed
    if (!hasResults && searchTerm !== '') {
        showNoResults();
    } else {
        hideNoResults();
    }
}

function showNoResults() {
    const existingMsg = document.querySelector('.no-results');
    if (!existingMsg) {
        const noResultsMsg = document.createElement('div');
        noResultsMsg.className = 'no-results';
        noResultsMsg.textContent = 'No retreats found. Try a different search term.';
        noResultsMsg.style.cssText = 'text-align: center; padding: 2rem; color: #666;';
        document.querySelector('.retreats-grid').appendChild(noResultsMsg);
    }
}

function hideNoResults() {
    const noResultsMsg = document.querySelector('.no-results');
    if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput.value;
    
    if (isValidEmail(email)) {
        // Show success message
        showMessage('Thank you for subscribing! Check your email for confirmation.', 'success');
        
        // Here you would normally send the email to your server
        console.log('Newsletter subscription:', email);
        
        // Clear the form
        e.target.reset();
    } else {
        showMessage('Please enter a valid email address.', 'error');
    }
});

// Email Validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show Message Function
function showMessage(message, type) {
    const existingMsg = document.querySelector('.message-popup');
    if (existingMsg) existingMsg.remove();
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message-popup';
    msgDiv.textContent = message;
    msgDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(msgDiv);
    
    setTimeout(() => {
        msgDiv.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => msgDiv.remove(), 300);
    }, 3000);
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Retreat Card Click Events
const retreatButtons = document.querySelectorAll('.retreat-card .btn-primary');

retreatButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.retreat-card');
        const retreatName = card.querySelector('h3').textContent;
        const price = card.querySelector('.price').textContent;
        const location = card.querySelector('.location').textContent;
        
        // Create modal or redirect to detail page
        showRetreatDetails({
            name: retreatName,
            price: price,
            location: location
        });
    });
});

// Show Retreat Details Modal
function showRetreatDetails(retreat) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${retreat.name}</h2>
            <p><strong>Location:</strong> ${retreat.location}</p>
            <p><strong>Price:</strong> ${retreat.price}</p>
            <p>For more information and booking, please contact us at info@aadiadvaitsansthan.org</p>
            <button class="btn-primary" onclick="window.location.href='#contact'">Contact Us</button>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
        position: relative;
        animation: fadeInUp 0.3s ease-out;
    `;
    
    const closeBtn = modal.querySelector('.close');
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 2rem;
        cursor: pointer;
        color: #999;
    `;
    
    closeBtn.onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
    
    document.body.appendChild(modal);
}

// Smooth Reveal Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections and cards
const elementsToObserve = document.querySelectorAll('section, .retreat-card, .category-card');
elementsToObserve.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease-out';
    observer.observe(element);
});

// Category Cards Click Event
const categoryCards = document.querySelectorAll('.category-card');

categoryCards.forEach(card => {
    card.style.cursor = 'pointer';
    
    card.addEventListener('click', () => {
        const category = card.querySelector('h3').textContent;
        searchInput.value = category;
        performSearch();
        
        // Scroll to retreats section
        document.querySelector('#retreats').scrollIntoView({ behavior: 'smooth' });
    });
    
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px) scale(1.02)';
        card.style.backgroundColor = '#f0f8f0';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.backgroundColor = 'var(--white)';
    });
});

// Dynamic Year in Footer
const currentYear = new Date().getFullYear();
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    footerYear.innerHTML = footerYear.innerHTML.replace('2024', currentYear);
}

// Lazy Loading for Images
const images = document.querySelectorAll('img');

const imageOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px 50px 0px'
};

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '0';
            img.onload = () => {
                img.style.transition = 'opacity 0.5s ease-in-out';
                img.style.opacity = '1';
            };
            imageObserver.unobserve(img);
        }
    });
}, imageOptions);

images.forEach(img => imageObserver.observe(img));

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add Loading State to Buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.classList.contains('loading')) {
            this.classList.add('loading');
            setTimeout(() => {
                this.classList.remove('loading');
            }, 2000);
        }
    });
});

// Initialize on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.querySelectorAll('*').forEach(element => {
            element.style.animation = 'none';
            element.style.transition = 'none';
        });
    }
});

// Keyboard Navigation Support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close any open modals
        const modal = document.querySelector('.modal');
        if (modal) modal.remove();
        
        // Close mobile menu
        navMenu.classList.remove('active');
    }
});

console.log('Aadi Advait Sansthan website loaded successfully!');
// Add to your script.js file

// Mobile Navigation Enhancement
const body = document.body;
const navMenuLinks = document.querySelectorAll('.nav-menu a');

// Close menu when clicking a link
navMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        body.classList.remove('menu-open');
    });
});

// Toggle body scroll when menu opens/closes
hamburger.addEventListener('click', () => {
    body.classList.toggle('menu-open');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar') && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        body.classList.remove('menu-open');
    }
});

// Smooth scroll with offset for fixed header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});