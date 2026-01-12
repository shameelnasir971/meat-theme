// Improved Intersection Observer with better performance
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initScrollAnimations();
  initMobileMenu();
  initFAQAccordion();
  initSmoothScroll();
  initCounterAnimation();
  initLazyLoading();
  initFormValidation();
  initCartFunctionality();
});

// Enhanced Scroll Animations with throttling
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // Add delay for staggered animations
        const delay = entry.target.dataset.delay || '0';
        entry.target.style.animationDelay = `${delay}ms`;
        
        // Stop observing after animation
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animation elements
  document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
    el.dataset.delay = index * 100;
    observer.observe(el);
  });
}

// Enhanced Mobile Menu with better UX
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const body = document.body;
  
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mainNav.classList.toggle('active');
      mobileToggle.classList.toggle('active');
      body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.main-nav') && !e.target.closest('.mobile-menu-toggle')) {
        mainNav.classList.remove('active');
        mobileToggle.classList.remove('active');
        body.classList.remove('menu-open');
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        mainNav.classList.remove('active');
        mobileToggle.classList.remove('active');
        body.classList.remove('menu-open');
      }
    });
  }
}

// Enhanced FAQ Accordion
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const icon = question.querySelector('.faq-icon');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-icon').textContent = '+';
      });
      
      // Open clicked item if it wasn't active
      if (!isActive) {
        item.classList.add('active');
        icon.textContent = '−';
      }
    });
  });
}

// Enhanced Smooth Scroll
function initSmoothScroll() {
  const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0;
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href === '#' || href === '#!') return;
      
      e.preventDefault();
      const targetElement = document.querySelector(href);
      
      if (targetElement) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = targetPosition - headerHeight - 20;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without page reload
        history.pushState(null, null, href);
      }
    });
  });
}

// Counter Animation for Stats
function initCounterAnimation() {
  const counters = document.querySelectorAll('.counter');
  
  if (!counters.length) return;
  
  const observerOptions = {
    threshold: 0.5
  };
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.target);
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          counter.textContent = Math.floor(current);
        }, 16);
        
        counterObserver.unobserve(counter);
      }
    });
  }, observerOptions);
  
  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

// Lazy Loading for Images
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Form Validation
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = this.querySelector('input[type="email"]');
      const phone = this.querySelector('input[type="tel"]');
      let isValid = true;
      
      // Email validation
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
          showError(email, 'Please enter a valid email address');
          isValid = false;
        } else {
          clearError(email);
        }
      }
      
      // Phone validation
      if (phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phone.value.replace(/[\s\-\(\)]/g, ''))) {
          showError(phone, 'Please enter a valid phone number');
          isValid = false;
        } else {
          clearError(phone);
        }
      }
      
      if (isValid) {
        // Submit form (in real implementation, this would be AJAX)
        showNotification('Form submitted successfully!', 'success');
        this.reset();
      }
    });
  });
}

function showError(input, message) {
  const formGroup = input.closest('.form-group') || input.parentElement;
  const errorDiv = formGroup.querySelector('.error-message') || document.createElement('div');
  
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  errorDiv.style.color = 'var(--primary-color)';
  errorDiv.style.fontSize = '0.875rem';
  errorDiv.style.marginTop = '0.25rem';
  
  if (!formGroup.querySelector('.error-message')) {
    formGroup.appendChild(errorDiv);
  }
  
  input.style.borderColor = 'var(--primary-color)';
}

function clearError(input) {
  const formGroup = input.closest('.form-group') || input.parentElement;
  const errorDiv = formGroup.querySelector('.error-message');
  
  if (errorDiv) {
    errorDiv.remove();
  }
  
  input.style.borderColor = '';
}

// Cart Functionality
function initCartFunctionality() {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const productId = this.dataset.productId;
      const productName = this.dataset.productName || 'Product';
      
      // Add to cart logic (simulated)
      addToCart(productId, 1);
      showNotification(`${productName} added to cart!`, 'success');
      
      // Animate button
      this.classList.add('added');
      setTimeout(() => {
        this.classList.remove('added');
      }, 2000);
    });
  });
}

function addToCart(productId, quantity) {
  // In real implementation, use Shopify Cart API
  console.log(`Adding product ${productId} to cart`);
  
  // Update cart count
  updateCartCount();
}

function updateCartCount() {
  const cartCount = document.querySelector('.cart-count');
  if (cartCount) {
    let count = parseInt(cartCount.textContent) || 0;
    count++;
    cartCount.textContent = count;
    cartCount.classList.add('updated');
    setTimeout(() => cartCount.classList.remove('updated'), 300);
  }
}

// Enhanced Notification System
function showNotification(message, type = 'success') {
  // Remove existing notifications
  document.querySelectorAll('.notification').forEach(n => n.remove());
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close" aria-label="Close notification">
      <i class="fas fa-times"></i>
    </button>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    max-width: 400px;
    animation: slideInRight 0.3s ease forwards;
  `;
  
  // Add close functionality
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => notification.remove(), 300);
  });
  
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .notification-close {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0.25rem;
    opacity: 0.7;
    transition: opacity 0.2s ease;
  }
  
  .notification-close:hover {
    opacity: 1;
  }
  
  .cart-count {
    transition: transform 0.3s ease;
  }
  
  .cart-count.updated {
    transform: scale(1.5);
  }
  
  .add-to-cart.added {
    background: #4CAF50 !important;
  }
`;
document.head.appendChild(notificationStyles);

// Performance Optimization: Debounce and Throttle
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Window resize handler with debounce
window.addEventListener('resize', debounce(() => {
  // Handle responsive adjustments
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}, 250));

// Scroll handler with throttle
window.addEventListener('scroll', throttle(() => {
  const header = document.querySelector('.main-header');
  if (window.scrollY > 100) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
}, 100));

// Load fonts with Font Face Observer (optional)
if (typeof FontFaceObserver !== 'undefined') {
  const inter = new FontFaceObserver('Inter');
  const playfair = new FontFaceObserver('Playfair Display');
  
  Promise.all([inter.load(), playfair.load()]).then(() => {
    document.documentElement.classList.add('fonts-loaded');
  });
}