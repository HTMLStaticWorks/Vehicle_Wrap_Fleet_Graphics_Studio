/**
 * PREMIUM VEHICLE WRAP & FLEET GRAPHICS STUDIO
 * Interactive Interface Enhancements & Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initRtlToggle();
  initHeaderScroll();
  initMobileMenu();
  initStatsCounter();
  initBeforeAfterSlider();
  initPortfolioFilterAndLightbox();
  initFaqAccordion();
  initQuoteWizard();
  initContactForm();
  initDropdownMenu();
  initScrollTop();
});

/* ==========================================================================
   1. THEME TOGGLE (LIGHT / DARK MODE)
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  // Check saved choice or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Smooth transition toggle effect
    themeToggle.style.transform = 'scale(0.8)';
    setTimeout(() => {
      themeToggle.style.transform = 'scale(1)';
    }, 150);
  });
}

/* ==========================================================================
   2. STICKY HEADER & SCROLL ANIMATIONS
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  };

  window.addEventListener('scroll', handleScroll);
  // Initial check
  handleScroll();
}

/* ==========================================================================
   3. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent scrolling when mobile menu is open
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking a nav link
  const navLinks = navMenu.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================================================
   4. STATS COUNTER ANIMATION
   ========================================================================== */
function initStatsCounter() {
  const statsSection = document.getElementById('stats');
  const statNumbers = document.querySelectorAll('.stat-number');
  
  if (!statsSection || statNumbers.length === 0) return;

  let animated = false;

  const startCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const suffix = stat.getAttribute('data-suffix') || '';
      let current = 0;
      const duration = 1800; // ms
      const stepTime = Math.max(Math.floor(duration / target), 15);
      
      const timer = setInterval(() => {
        current += Math.ceil(target / (duration / stepTime));
        if (current >= target) {
          stat.textContent = target + suffix;
          clearInterval(timer);
        } else {
          stat.textContent = current + suffix;
        }
      }, stepTime);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        startCounters();
        animated = true;
        observer.unobserve(statsSection);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(statsSection);
}

/* ==========================================================================
   5. INTERACTIVE BEFORE & AFTER SLIDER
   ========================================================================== */
function initBeforeAfterSlider() {
  const wrapper = document.querySelector('.comparison-slider-wrapper');
  if (!wrapper) return;

  const handle = wrapper.querySelector('.slider-handle');
  const afterImg = wrapper.querySelector('.slider-after');
  
  if (!handle || !afterImg) return;

  let isDragging = false;

  const moveSlider = (clientX) => {
    const rect = wrapper.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    
    // Clamp between 0% and 100%
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;

    handle.style.left = `${percentage}%`;
    afterImg.style.width = `${percentage}%`;
  };

  // Mouse Events
  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    moveSlider(e.clientX);
  });

  // Touch Events (Mobile)
  handle.addEventListener('touchstart', (e) => {
    isDragging = true;
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      moveSlider(e.touches[0].clientX);
    }
  });

  // Click on container moves slider too
  wrapper.addEventListener('click', (e) => {
    if (e.target === handle || handle.contains(e.target)) return;
    moveSlider(e.clientX);
  });
}

/* ==========================================================================
   6. PORTFOLIO FILTER & LIGHTBOX MODAL
   ========================================================================== */
function initPortfolioFilterAndLightbox() {
  const portfolioGrid = document.getElementById('portfolio-grid');
  const filtersContainer = document.getElementById('portfolio-filters');
  
  if (!portfolioGrid) return;

  const items = portfolioGrid.querySelectorAll('.portfolio-item');
  const filterBtns = filtersContainer ? filtersContainer.querySelectorAll('.filter-btn') : [];

  // Filter functionality
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          item.style.display = 'block';
          // trigger simple fade animation
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox Modal functionality
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxTitle = lightbox.querySelector('.lightbox-title');
  const lightboxDesc = lightbox.querySelector('.lightbox-desc');
  const lightboxTag = lightbox.querySelector('.lightbox-tag');
  const lightboxMetaTime = lightbox.querySelector('.meta-time');
  const lightboxMetaClient = lightbox.querySelector('.meta-client');
  const lightboxClose = lightbox.querySelector('.lightbox-close');

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.portfolio-title').textContent;
      const category = item.getAttribute('data-category');
      
      // Get detailed meta data from custom attributes
      const client = item.getAttribute('data-client') || 'Enterprise Client';
      const time = item.getAttribute('data-time') || '2 Days';
      const desc = item.getAttribute('data-desc') || 'Full corporate wrap solutions designed to build high-visibility awareness for business transit fleets.';

      if (lightboxImg) lightboxImg.src = img.src;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;
      if (lightboxTag) lightboxTag.textContent = category.replace('-', ' ');
      if (lightboxMetaClient) lightboxMetaClient.textContent = client;
      if (lightboxMetaTime) lightboxMetaTime.textContent = time;

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close Lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // ESC key closes lightbox
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   7. FAQ ACCORDION BEHAVIOR & SEARCH
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  const faqSearch = document.getElementById('faq-search');
  
  if (faqItems.length === 0) return;

  // Accordion open/close toggle
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(i => i.classList.remove('active'));
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // FAQ Search filter
  if (faqSearch) {
    faqSearch.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      
      faqItems.forEach(item => {
        const questionText = item.querySelector('.faq-question').textContent.toLowerCase();
        const answerText = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/* ==========================================================================
   8. MULTI-STEP WIZARD FORM (QUOTE REQUEST)
   ========================================================================== */
function initQuoteWizard() {
  const wizard = document.getElementById('quote-wizard');
  if (!wizard) return;

  const panels = wizard.querySelectorAll('.wizard-step-panel');
  const nextBtns = wizard.querySelectorAll('.btn-next');
  const prevBtns = wizard.querySelectorAll('.btn-prev');
  const indicators = wizard.querySelectorAll('.wizard-step-ind');
  const progressBarFill = wizard.querySelector('.wizard-progress-bar-fill');
  
  let currentStep = 0;

  const updateWizard = () => {
    panels.forEach((panel, index) => {
      panel.classList.toggle('active', index === currentStep);
    });

    indicators.forEach((ind, index) => {
      ind.classList.remove('active', 'completed');
      if (index === currentStep) {
        ind.classList.add('active');
      } else if (index < currentStep) {
        ind.classList.add('completed');
      }
    });

    const progressPercent = ((currentStep + 1) / panels.length) * 100;
    if (progressBarFill) {
      progressBarFill.style.width = `${progressPercent}%`;
    }

    // Scroll back to wizard top
    wizard.scrollIntoView({ behavior: 'smooth' });
  };

  const validateStep = (stepIndex) => {
    const currentPanel = panels[stepIndex];
    const inputs = currentPanel.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
      // clear dynamic error message
      removeError(input);

      if (!input.value.trim()) {
        isValid = false;
        showError(input, 'This field is required');
      } else if (input.type === 'email' && !validateEmail(input.value)) {
        isValid = false;
        showError(input, 'Please enter a valid email address');
      } else if (input.type === 'tel' && !validatePhone(input.value)) {
        isValid = false;
        showError(input, 'Please enter a valid phone number');
      }
    });

    return isValid;
  };

  const showError = (input, message) => {
    input.classList.add('is-invalid');
    input.style.borderColor = '#EF4444';
    
    let errorDiv = input.parentNode.querySelector('.invalid-feedback');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'invalid-feedback';
      errorDiv.style.color = '#EF4444';
      errorDiv.style.fontSize = '0.8rem';
      errorDiv.style.marginTop = '0.25rem';
      input.parentNode.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
  };

  const removeError = (input) => {
    input.classList.remove('is-invalid');
    input.style.borderColor = '';
    const errorDiv = input.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
      errorDiv.remove();
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\+?[0-9\s\-()]{7,15}$/.test(phone);
  };

  // Click handler for next buttons
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        currentStep++;
        if (currentStep >= panels.length) {
          // Submitted state
          submitQuoteBrief();
        } else {
          updateWizard();
        }
      }
    });
  });

  // Click handler for back buttons
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentStep--;
      if (currentStep < 0) currentStep = 0;
      updateWizard();
    });
  });

  // Visual checkbox and radio selector toggling
  const choiceBoxes = wizard.querySelectorAll('.choice-box');
  choiceBoxes.forEach(box => {
    const input = box.querySelector('input');
    
    // Initial check
    if (input && input.checked) {
      box.classList.add('selected');
    }

    box.addEventListener('click', () => {
      if (input.type === 'radio') {
        const name = input.name;
        const group = wizard.querySelectorAll(`input[name="${name}"]`);
        group.forEach(grpInput => {
          grpInput.parentNode.classList.remove('selected');
        });
        input.checked = true;
        box.classList.add('selected');
      } else {
        input.checked = !input.checked;
        box.classList.toggle('selected', input.checked);
      }
    });
  });

  // File upload simulation behavior
  initFileDropzone();

  // Final Mock Submission
  const submitQuoteBrief = () => {
    const formPanel = wizard.querySelector('.wizard-form-body');
    const footer = wizard.querySelector('.wizard-footer');
    
    if (formPanel) {
      formPanel.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem;">
          <div style="width: 72px; height: 72px; background: rgba(16, 185, 129, 0.1); color: var(--success); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem auto; font-size: 2.5rem;">
            ✓
          </div>
          <h2 style="margin-bottom: 1rem;">Design Brief Submitted Successfully!</h2>
          <p class="lead-text" style="max-width: 600px; margin: 0 auto 2.5rem auto;">Thank you for requesting a fleet branding proposal. Our design team will review your fleet specification details, logo assets, and layout goals. We will follow up via email within 24 hours.</p>
          <a href="index.html" class="btn btn-primary">Return Home</a>
        </div>
      `;
    }
    if (footer) {
      footer.remove();
    }
  };
}

// File dropzone management
function initFileDropzone() {
  const dropzone = document.getElementById('file-dropzone');
  const fileInput = document.getElementById('brand-guidelines-upload');
  const filesList = document.getElementById('uploaded-files-list');

  if (!dropzone || !fileInput || !filesList) return;

  dropzone.addEventListener('click', () => {
    fileInput.click();
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--accent)';
    dropzone.style.background = 'var(--bg-card)';
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = '';
    dropzone.style.background = '';
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = '';
    dropzone.style.background = '';
    
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  });

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      addFiles(fileInput.files);
    }
  });

  const addFiles = (files) => {
    Array.from(files).forEach(file => {
      const fileId = 'file_' + Math.random().toString(36).substr(2, 9);
      const item = document.createElement('div');
      item.className = 'uploaded-file-item';
      item.id = fileId;
      
      // Format file size
      const sizeKB = (file.size / 1024).toFixed(1);
      
      item.innerHTML = `
        <div class="uploaded-file-name">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
          <span>${file.name} (${sizeKB} KB)</span>
        </div>
        <button class="remove-file-btn" type="button" onclick="document.getElementById('${fileId}').remove()">&times;</button>
      `;
      filesList.appendChild(item);
    });
  };
}

/* ==========================================================================
   9. CONTACT FORM VALIDATION
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Basic validation
    const name = contactForm.querySelector('#contact-name');
    const email = contactForm.querySelector('#contact-email');
    const subject = contactForm.querySelector('#contact-subject');
    const message = contactForm.querySelector('#contact-message');
    
    let isValid = true;
    
    [name, email, subject, message].forEach(input => {
      if (input) {
        input.style.borderColor = '';
        if (!input.value.trim()) {
          input.style.borderColor = '#EF4444';
          isValid = false;
        }
      }
    });

    if (isValid) {
      // Trigger submission visual success state
      const formFields = contactForm.innerHTML;
      contactForm.innerHTML = `
        <div style="text-align: center; padding: 2rem 0; color: var(--success);">
          <div style="font-size: 2.5rem; margin-bottom: 1rem;">✓</div>
          <h3 style="margin-bottom: 0.5rem; color: var(--text-main);">Message Sent!</h3>
          <p style="color: var(--text-muted);">Thank you for contacting our studio. We will get back to you shortly.</p>
        </div>
      `;
    }
  });
}

/* ==========================================================================
   10. RTL DIRECTION TOGGLE
   ========================================================================== */
function initRtlToggle() {
  const rtlToggle = document.getElementById('rtl-toggle');
  if (!rtlToggle) return;

  const applyRtl = (isRtl) => {
    if (isRtl) {
      document.documentElement.setAttribute('dir', 'rtl');
      rtlToggle.textContent = 'LTR';
      localStorage.setItem('rtl', 'true');
    } else {
      document.documentElement.removeAttribute('dir');
      rtlToggle.textContent = 'RTL';
      localStorage.setItem('rtl', 'false');
    }
  };

  // Check storage
  const isRtl = localStorage.getItem('rtl') === 'true';
  applyRtl(isRtl);

  rtlToggle.addEventListener('click', () => {
    const currentRtl = document.documentElement.getAttribute('dir') === 'rtl';
    applyRtl(!currentRtl);
  });
}

/* ==========================================================================
   11. ACCESSIBLE SUBMENU DROPDOWN NAV
   ========================================================================== */
function initDropdownMenu() {
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownParent = document.querySelector('.nav-dropdown');

  if (!dropdownToggle || !dropdownParent) return;

  dropdownToggle.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      dropdownParent.classList.toggle('active');
    }
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!dropdownParent.contains(e.target)) {
      dropdownParent.classList.remove('active');
    }
  });
}

/* ==========================================================================
   12. SCROLL TO TOP BUTTON
   ========================================================================== */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scroll-top');
  if (!scrollTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

