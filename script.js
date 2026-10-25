/**
 * SURBHI CONSTRUCTIONS PVT. LTD.
 * Interactive Frontend Controller & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. STICKY HEADER & ACTIVE SECTION HIGHLIGHTING
     ========================================================================== */
  const header = document.getElementById('mainHeader');
  const sections = document.querySelectorAll('section[id], header[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav .mobile-nav-link');

  const handleHeaderScroll = () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Determine current active section
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      desktopNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });

      mobileNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ==========================================================================
     2. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (mobileMenuToggle && mobileNav) {
    const toggleMobileNav = () => {
      const isOpen = mobileNav.classList.toggle('open');
      mobileMenuToggle.classList.toggle('active', isOpen);
      mobileMenuToggle.setAttribute('aria-expanded', isOpen.toString());
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileMenuToggle.addEventListener('click', toggleMobileNav);

    // Close mobile nav when clicking any link inside
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileNav.classList.contains('open')) {
          toggleMobileNav();
        }
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        toggleMobileNav();
      }
    });
  }

  /* ==========================================================================
     3. DYNAMIC STATISTICS COUNTER ANIMATION
     ========================================================================== */
  const statCards = document.querySelectorAll('.stat-card');
  let hasCountersRun = false;

  const animateCounters = () => {
    statCards.forEach(card => {
      const target = parseInt(card.getAttribute('data-counter'), 10) || 0;
      const suffix = card.getAttribute('data-suffix') || '';
      const numberElement = card.querySelector('.stat-number');
      if (!numberElement) return;

      const duration = 2000; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Ease-out cubic animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * target);

        numberElement.textContent = `${currentVal}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          numberElement.textContent = `${target}${suffix}`;
        }
      };

      requestAnimationFrame(updateCount);
    });
  };

  if (statCards.length > 0) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasCountersRun) {
          hasCountersRun = true;
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.25 });

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
      statsObserver.observe(statsBar);
    }
  }

  /* ==========================================================================
     4. GALLERY & PROJECT FILTERING MECHANISM
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card, .project-card');

  if (filterBtns.length > 0 && galleryCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button style
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        galleryCards.forEach(card => {
          const category = card.getAttribute('data-category') || '';
          
          if (filterValue === 'all' || category.includes(filterValue)) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            setTimeout(() => {
              card.style.transition = 'all 0.35s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 30);
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ==========================================================================
     5. BEFORE / AFTER INTERACTIVE COMPARISON SLIDER
     ========================================================================== */
  const beforeAfterContainer = document.getElementById('beforeAfterSlider');
  const beforeImageWrapper = document.getElementById('beforeImageWrapper');
  const baHandle = document.getElementById('baHandle');
  const baRangeInput = document.getElementById('baRangeInput');

  if (beforeAfterContainer && beforeImageWrapper && baHandle && baRangeInput) {
    const updateSliderPosition = (percentage) => {
      const clampedPercent = Math.max(0, Math.min(100, percentage));
      beforeImageWrapper.style.clipPath = `inset(0 ${100 - clampedPercent}% 0 0)`;
      beforeImageWrapper.style.webkitClipPath = `inset(0 ${100 - clampedPercent}% 0 0)`;
      baHandle.style.left = `${clampedPercent}%`;
      baRangeInput.value = clampedPercent;
    };

    // Range input change
    baRangeInput.addEventListener('input', (e) => {
      updateSliderPosition(parseFloat(e.target.value));
    });

    // Touch & Mouse drag support
    let isDragging = false;

    const calculatePositionFromEvent = (e) => {
      const rect = beforeAfterContainer.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const offsetX = clientX - rect.left;
      const percentage = (offsetX / rect.width) * 100;
      updateSliderPosition(percentage);
    };

    beforeAfterContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      calculatePositionFromEvent(e);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      calculatePositionFromEvent(e);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    beforeAfterContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      calculatePositionFromEvent(e);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      calculatePositionFromEvent(e);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    // Initial 50% setting
    updateSliderPosition(50);
  }

  /* ==========================================================================
     6. TESTIMONIALS CAROUSEL
     ========================================================================== */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.indicator-dot');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const carouselContainer = document.getElementById('testimonialCarousel');

  let currentSlide = 0;
  let carouselInterval = null;

  const showSlide = (index) => {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;

    if (slides[currentSlide]) slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  };

  const nextSlide = () => showSlide(currentSlide + 1);
  const prevSlide = () => showSlide(currentSlide - 1);

  if (slides.length > 0) {
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetIndex = parseInt(dot.getAttribute('data-index'), 10) || 0;
        showSlide(targetIndex);
      });
    });

    const startCarouselAutoPlay = () => {
      if (carouselInterval) clearInterval(carouselInterval);
      carouselInterval = setInterval(nextSlide, 6000);
    };

    const stopCarouselAutoPlay = () => {
      if (carouselInterval) clearInterval(carouselInterval);
    };

    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', stopCarouselAutoPlay);
      carouselContainer.addEventListener('mouseleave', startCarouselAutoPlay);
      carouselContainer.addEventListener('touchstart', stopCarouselAutoPlay, { passive: true });
      carouselContainer.addEventListener('touchend', startCarouselAutoPlay);
    }

    startCarouselAutoPlay();
  }

  /* ==========================================================================
     7. INTERACTIVE FAQ ACCORDION
     ========================================================================== */
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(headerBtn => {
    headerBtn.addEventListener('click', () => {
      const item = headerBtn.parentElement;
      const content = headerBtn.nextElementSibling;
      const isExpanded = headerBtn.getAttribute('aria-expanded') === 'true';

      // Close all other accordion items for clean accordion UX
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherHeader = otherItem.querySelector('.accordion-header');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isExpanded) {
        item.classList.remove('active');
        headerBtn.setAttribute('aria-expanded', 'false');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        headerBtn.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 30 + 'px';
      }
    });
  });

  /* ==========================================================================
     8. TOAST NOTIFICATION UTILITY
     ========================================================================== */
  const toastContainer = document.getElementById('toastContainer');

  const showToast = (message, icon = 'fa-circle-check', duration = 4000) => {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icon} text-accent"></i> <span>${message}</span>`;
    
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-20px)';
      setTimeout(() => toast.remove(), 400);
    }, duration);
  };

  /* ==========================================================================
     9. CONTACT FORM VALIDATION & HANDLING
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const nameInput = document.getElementById('fullName');
      const phoneInput = document.getElementById('phone');
      const emailInput = document.getElementById('email');
      const projectTypeInput = document.getElementById('projectType');
      const messageInput = document.getElementById('message');

      // Helper function to set error
      const validateField = (input, condition) => {
        const formGroup = input.closest('.form-group');
        if (!condition) {
          formGroup?.classList.add('has-error');
          isValid = false;
        } else {
          formGroup?.classList.remove('has-error');
        }
      };

      // Validations
      validateField(nameInput, nameInput.value.trim().length >= 2);
      
      const phoneRegex = /^[0-9+\s\-()]{8,16}$/;
      validateField(phoneInput, phoneRegex.test(phoneInput.value.trim()));

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      validateField(emailInput, emailRegex.test(emailInput.value.trim()));

      validateField(projectTypeInput, projectTypeInput.value !== '');
      validateField(messageInput, messageInput.value.trim().length >= 5);

      if (isValid) {
        const submitBtn = document.getElementById('submitFormBtn');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Request...';
        }

        // Simulate secure API dispatch
        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Request for Estimate';
          }
          
          contactForm.reset();
          if (formSuccessAlert) {
            formSuccessAlert.style.display = 'flex';
            setTimeout(() => {
              formSuccessAlert.style.display = 'none';
            }, 8000);
          }

          showToast('Estimation request received! Our engineering desk will call you within 24h.');
        }, 1000);
      }
    });

    // Remove errors on input change
    contactForm.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('input', () => {
        input.closest('.form-group')?.classList.remove('has-error');
      });
    });
  }

  /* ==========================================================================
     10. ESTIMATION QUOTE MODAL CONTROLLER
     ========================================================================== */
  const quoteModal = document.getElementById('quoteModal');
  const closeQuoteModalBtn = document.getElementById('closeQuoteModal');
  const openQuoteButtons = document.querySelectorAll('.open-quote-modal');
  const modalQuoteForm = document.getElementById('modalQuoteForm');
  const modalSuccessAlert = document.getElementById('modalSuccessAlert');
  const modalServiceSelect = document.getElementById('modalService');

  const openQuoteModal = () => {
    if (quoteModal) quoteModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeQuoteModal = () => {
    if (quoteModal) quoteModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openQuoteButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openQuoteModal();
    });
  });

  if (closeQuoteModalBtn) closeQuoteModalBtn.addEventListener('click', closeQuoteModal);

  if (quoteModal) {
    quoteModal.addEventListener('click', (e) => {
      if (e.target === quoteModal) closeQuoteModal();
    });
  }

  if (modalQuoteForm) {
    modalQuoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = modalQuoteForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Estimation Request';
        }
        modalQuoteForm.reset();
        if (modalSuccessAlert) modalSuccessAlert.style.display = 'flex';
        showToast('Estimate request received! Our engineers will review your site plan.');
        setTimeout(() => {
          if (modalSuccessAlert) modalSuccessAlert.style.display = 'none';
          closeQuoteModal();
        }, 2500);
      }, 900);
    });
  }

  // Global helper to prefill service from service card button
  window.prefillService = (serviceName) => {
    openQuoteModal();
    if (modalServiceSelect) {
      modalServiceSelect.value = serviceName;
    }
  };

  /* ==========================================================================
     11. LEGAL / PRIVACY POLICY MODAL
     ========================================================================== */
  const legalModal = document.getElementById('legalModal');
  const closeLegalModalBtn = document.getElementById('closeLegalModal');
  const openPrivacyButtons = document.querySelectorAll('.open-privacy-modal, .open-terms-modal');

  const openLegalModal = () => {
    if (legalModal) legalModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLegalModal = () => {
    if (legalModal) legalModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openPrivacyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openLegalModal();
    });
  });

  if (closeLegalModalBtn) closeLegalModalBtn.addEventListener('click', closeLegalModal);

  if (legalModal) {
    legalModal.addEventListener('click', (e) => {
      if (e.target === legalModal) closeLegalModal();
    });
  }

  /* ==========================================================================
     12. BROCHURE DOWNLOAD SIMULATION
     ========================================================================== */
  const brochureButtons = document.querySelectorAll('.download-brochure-btn');

  brochureButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // Generate a downloadable text/document representation of company dossier
      const brochureContent = `
============================================================
SURBHI CONSTRUCTIONS PVT. LTD. - CORPORATE PROFILE & DOSSIER
"Building Quality. Creating Trust."
============================================================

Corporate Identification:
- Name: SURBHI CONSTRUCTION
- Specialization: Luxury Villas, Modern Residences, Architectural Turnkey Contracts
- Head Office: KMC Complex, In Front of Pangal School, Solapur, Maharashtra
- Contact Mobile: +91 91759 42589
- Email Address: surbhiconstruction555@gmail.com
- Instagram Profile: @surbhiconstruction555

CORE DISCIPLINES:
1. Residential Civil Construction (Luxury Villas, Multi-Storey Apartments)
2. Commercial Hubs & IT Complexes (LEED Certified High-Rise Towers)
3. Industrial PEB & Warehouse Hubs (Laser Screed FM2 Heavy Flooring)
4. Seismic Retrofitting & Heritage Renovation
5. Deep Foundation Piling & Highway Pavements
6. High-Grade RCC Superstructures & Structural Steel Erection
7. Turnkey MEP, Fire Safety & Interior Architectural Fit-outs
8. Project Management Consultancy (PMC) with ISO QA/QC Framework

TRACK RECORD:
- Completed Landmark Projects: 250+
- Active Ongoing Developments: 18
- Total Built-Up Execution: Over 8.5 Million Square Feet
- Safety Benchmark: Zero Lost-Time Injury (LTI) Rating

Thank you for choosing SURBHI CONSTRUCTIONS PVT. LTD.
============================================================
      `.trim();

      const blob = new Blob([brochureContent], { type: 'text/plain;charset=utf-8' });
      const downloadUrl = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = downloadUrl;
      tempLink.download = 'Surbhi_Constructions_Corporate_Brochure.txt';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(downloadUrl);

      showToast('Corporate brochure downloaded successfully!', 'fa-file-arrow-down');
    });
  });

  /* ==========================================================================
     13. BACK TO TOP BUTTON
     ========================================================================== */
  const backToTopBtn = document.getElementById('backToTopBtn');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     14. SCROLL-TRIGGERED REVEAL ANIMATIONS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-item');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // Update dynamic year in footer
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     15. GALLERY IMAGE LIGHTBOX VIEWER WITH PREV/NEXT & KEYBOARD NAVIGATION
     ========================================================================== */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const closeLightboxModal = document.getElementById('closeLightboxModal');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');

  if (lightboxModal && lightboxImg) {
    const allCards = Array.from(document.querySelectorAll('.gallery-card, .project-card'));
    let currentGalleryIndex = 0;

    const getVisibleCards = () => {
      const visible = allCards.filter(card => window.getComputedStyle(card).display !== 'none');
      return visible.length > 0 ? visible : allCards;
    };

    const updateLightbox = (index) => {
      const visible = getVisibleCards();
      if (visible.length === 0) return;

      if (index < 0) currentGalleryIndex = visible.length - 1;
      else if (index >= visible.length) currentGalleryIndex = 0;
      else currentGalleryIndex = index;

      const card = visible[currentGalleryIndex];
      const img = card.querySelector('.gallery-img, .project-image, .project-img');
      const title = card.querySelector('.gallery-item-title, .project-name')?.textContent || 'Project View';
      const desc = card.querySelector('.gallery-item-desc, .project-desc')?.textContent || '';
      const stakeholders = card.querySelector('.gallery-stakeholders, .project-stakeholders')?.innerHTML || '';
      const badge = card.querySelector('.gallery-category-pill, .badge-type')?.textContent || '';

      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = title;
      }

      if (lightboxCounter) {
        lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${visible.length}`;
      }

      if (lightboxCaption) {
        lightboxCaption.innerHTML = `
          <h4>${title} ${badge ? `<span class="gallery-category-pill">${badge}</span>` : ''}</h4>
          <p>${desc}</p>
          ${stakeholders ? `<div class="lightbox-stakeholders">${stakeholders}</div>` : ''}
        `;
      }
    };

    const openLightbox = (card) => {
      const visible = getVisibleCards();
      const idx = visible.indexOf(card);
      currentGalleryIndex = idx !== -1 ? idx : 0;
      updateLightbox(currentGalleryIndex);
      lightboxModal.style.display = 'flex';
      requestAnimationFrame(() => {
        lightboxModal.classList.add('active');
        document.body.classList.add('modal-open');
      });
    };

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.classList.remove('modal-open');
      setTimeout(() => {
        lightboxModal.style.display = 'none';
      }, 300);
    };

    allCards.forEach(card => {
      const media = card.querySelector('.gallery-media, .project-media');
      const zoomBtn = card.querySelector('.gallery-zoom-btn, .view-btn');
      
      const handleOpen = (e) => {
        e.preventDefault();
        openLightbox(card);
      };

      if (media) {
        media.style.cursor = 'pointer';
        media.addEventListener('click', handleOpen);
      }
      if (zoomBtn) {
        zoomBtn.addEventListener('click', handleOpen);
      }
    });

    if (closeLightboxModal) {
      closeLightboxModal.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
      });
    }

    if (lightboxPrevBtn) {
      lightboxPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateLightbox(currentGalleryIndex - 1);
      });
    }

    if (lightboxNextBtn) {
      lightboxNextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateLightbox(currentGalleryIndex + 1);
      });
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });

    // Keyboard support: Esc, ArrowLeft, ArrowRight
    window.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('active')) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        updateLightbox(currentGalleryIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateLightbox(currentGalleryIndex + 1);
      }
    });
  }
});
