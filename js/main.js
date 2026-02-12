/* ==========================================================================
   SNC (SEVILLAS NEW CONSTRUCTION) — Main JavaScript (Multi-Page)
   Navigation, scroll animations, form handling, portfolio, testimonials
   ========================================================================== */

(function () {
  'use strict';

  // ---------- DOM References ----------
  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var navMenu = document.getElementById('navMenu');
  var navLinks = document.querySelectorAll('.navbar__link');
  var backToTop = document.getElementById('backToTop');
  var heroSection = document.querySelector('.hero');
  var yearSpan = document.getElementById('currentYear');

  // Page-specific elements (may be null on pages that don't have them)
  var bidForm = document.getElementById('bidForm');
  var formSuccess = document.getElementById('formSuccess');
  var formError = document.getElementById('formError');
  var testimonialTrack = document.getElementById('testimonialTrack');
  var testimonialDots = document.getElementById('testimonialDots');
  var prevBtn = document.getElementById('prevTestimonial');
  var nextBtn = document.getElementById('nextTestimonial');
  var portfolioFilters = document.querySelectorAll('.portfolio__filter');
  var portfolioItems = document.querySelectorAll('.portfolio__item');
  var lightbox = document.getElementById('lightbox');

  // ---------- Set Current Year ----------
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ---------- Mobile Navigation ----------
  var navOverlay = null;

  function createNavOverlay() {
    if (navOverlay) return;
    navOverlay = document.createElement('div');
    navOverlay.classList.add('nav-overlay');
    document.body.appendChild(navOverlay);
    navOverlay.addEventListener('click', closeMenu);
  }

  function openMenu() {
    if (!hamburger || !navMenu) return;
    createNavOverlay();
    hamburger.classList.add('navbar__hamburger--active');
    hamburger.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('open');
    if (navOverlay) navOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!hamburger || !navMenu) return;
    hamburger.classList.remove('navbar__hamburger--active');
    hamburger.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('visible');
    document.body.style.overflow = '';

    // Also close any open dropdown submenus when closing mobile menu
    var openDropdowns = navMenu.querySelectorAll('.navbar__dropdown.open');
    openDropdowns.forEach(function (dropdown) {
      dropdown.classList.remove('open');
    });
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = navMenu.classList.contains('open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  // Close menu when a nav link is clicked (but not dropdown toggles on mobile)
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      // Only close if this is not a dropdown parent toggle on mobile
      if (!this.closest('.navbar__dropdown') || window.innerWidth > 991) {
        closeMenu();
      }
    });
  });

  // ---------- Mobile Dropdown Toggle ----------
  // Clicking a parent item that has a submenu (e.g., "Services") should
  // toggle its dropdown open/closed on mobile instead of navigating.
  var dropdownParents = document.querySelectorAll('.navbar__dropdown > .navbar__link');

  dropdownParents.forEach(function (parentLink) {
    parentLink.addEventListener('click', function (e) {
      // Only intercept on mobile (when hamburger menu is visible)
      if (window.innerWidth <= 991) {
        e.preventDefault();
        var dropdown = this.closest('.navbar__dropdown');
        if (dropdown) {
          // Close other open dropdowns at the same level
          var siblings = dropdown.parentElement.querySelectorAll('.navbar__dropdown.open');
          siblings.forEach(function (sib) {
            if (sib !== dropdown) {
              sib.classList.remove('open');
            }
          });
          dropdown.classList.toggle('open');
        }
      }
    });
  });

  // ---------- Sticky Navbar ----------
  // On inner pages (no .hero section), the navbar should always appear scrolled.
  var isInnerPage = !heroSection;

  if (isInnerPage && navbar) {
    navbar.classList.add('navbar--scrolled');
  }

  function handleScroll() {
    var scrollY = window.scrollY;

    // Navbar background — only toggle on pages with a hero section
    if (navbar && !isInnerPage) {
      if (scrollY > 50) {
        navbar.classList.add('navbar--scrolled');
      } else {
        navbar.classList.remove('navbar--scrolled');
      }
    }

    // Back to top button
    if (backToTop) {
      if (scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial call

  // ---------- Back to Top ----------
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ---------- Scroll Animations ----------
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var el = entry.target;
              var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
              setTimeout(function () {
                el.classList.add('animated');
              }, delay);
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );

      elements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: show everything
      elements.forEach(function (el) {
        el.classList.add('animated');
      });
    }
  }

  initScrollAnimations();

  // ---------- Counter Animation ----------
  function animateCounters() {
    var counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var el = entry.target;
              var target = parseInt(el.getAttribute('data-count'), 10);
              var duration = 2000;
              var startTime = null;

              function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                // Ease out cubic
                var eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) {
                  requestAnimationFrame(step);
                } else {
                  el.textContent = target;
                }
              }

              requestAnimationFrame(step);
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach(function (counter) {
        observer.observe(counter);
      });
    }
  }

  animateCounters();

  // ---------- Portfolio Filter ----------
  if (portfolioFilters.length && portfolioItems.length) {
    portfolioFilters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = this.getAttribute('data-filter');

        // Update active state
        portfolioFilters.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        // Filter items
        portfolioItems.forEach(function (item) {
          var category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  // ---------- Portfolio Lightbox ----------
  var projectData = {
    1: {
      category: 'Kitchen Remodel',
      title: 'Modern Minimalist Kitchen',
      desc: 'This complete kitchen gut renovation transformed a cramped 1970s galley kitchen into a stunning open-concept space. Features include custom Italian cabinetry in matte white, Calacatta quartz countertops, a 48-inch professional range, and integrated smart home lighting. The project included structural wall removal, new electrical and plumbing, and custom herringbone tile backsplash.',
    },
    2: {
      category: 'Bathroom Renovation',
      title: 'Luxury Spa Bathroom',
      desc: 'A master bathroom transformation featuring a freestanding soaking tub, walk-in rainfall shower with frameless glass enclosure, heated Carrara marble floors, custom double vanity with vessel sinks, and ambient LED lighting. The space doubled in size by reclaiming an adjacent closet.',
    },
    3: {
      category: 'Home Addition',
      title: 'Second Story Addition',
      desc: 'Added a complete 1,200 sq ft second floor to a single-story Cape Cod, including a master suite with walk-in closet, two additional bedrooms, a full bathroom, and a laundry room. The exterior was seamlessly blended with the existing architecture using matching siding and roofline design.',
    },
    4: {
      category: 'Commercial Construction',
      title: 'Upscale Restaurant Build-Out',
      desc: 'Complete build-out of a 4,500 sq ft restaurant space including a commercial-grade kitchen, walk-in cooler, dining room for 80 guests, custom bar with draft system, and a 30-seat outdoor patio. The project included all mechanical, electrical, plumbing, fire suppression, and ADA compliance work.',
    },
    5: {
      category: 'Kitchen Remodel',
      title: 'Industrial Loft Kitchen',
      desc: 'An industrial-chic kitchen renovation in a converted warehouse loft. Features exposed brick walls, custom steel and reclaimed wood shelving, concrete countertops, matte black fixtures, and a 10-foot kitchen island. Preserved original architectural elements while adding modern functionality.',
    },
    6: {
      category: 'Bathroom Renovation',
      title: 'Master Bath Overhaul',
      desc: 'A dated master bathroom reborn as a modern retreat. Features a double vanity with soft-close drawers, frameless glass shower enclosure with niche shelving, large-format porcelain tile throughout, and a custom linen closet. The project included new plumbing, waterproofing, and radiant floor heating.',
    },
  };

  // Open lightbox — only bind if lightbox exists on the page
  if (lightbox) {
    document.querySelectorAll('.portfolio__view-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var projectId = this.getAttribute('data-project');
        var project = projectData[projectId];
        if (!project) return;

        var lightboxCategory = document.getElementById('lightboxCategory');
        var lightboxTitle = document.getElementById('lightboxTitle');
        var lightboxDesc = document.getElementById('lightboxDesc');

        if (lightboxCategory) lightboxCategory.textContent = project.category;
        if (lightboxTitle) lightboxTitle.textContent = project.title;
        if (lightboxDesc) lightboxDesc.textContent = project.desc;

        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';

        // Trap focus
        var closeBtn = lightbox.querySelector('.lightbox__close');
        if (closeBtn) {
          setTimeout(function () {
            closeBtn.focus();
          }, 100);
        }
      });
    });

    // Close lightbox
    function closeLightbox() {
      if (!lightbox) return;
      lightbox.hidden = true;
      document.body.style.overflow = '';
    }

    var lightboxCloseBtn = lightbox.querySelector('.lightbox__close');
    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener('click', closeLightbox);
    }

    var lightboxOverlay = lightbox.querySelector('.lightbox__overlay');
    if (lightboxOverlay) {
      lightboxOverlay.addEventListener('click', closeLightbox);
    }

    var lightboxCta = document.getElementById('lightboxCta');
    if (lightboxCta) {
      lightboxCta.addEventListener('click', function () {
        closeLightbox();
      });
    }

    // Keyboard accessibility for portfolio view buttons
    document.querySelectorAll('.portfolio__view-btn').forEach(function (btn) {
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  }

  // ---------- Escape Key Handler ----------
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (lightbox && !lightbox.hidden) {
        lightbox.hidden = true;
        document.body.style.overflow = '';
      }
      if (navMenu && navMenu.classList.contains('open')) {
        closeMenu();
      }
    }
  });

  // ---------- Testimonials Carousel ----------
  if (testimonialTrack && testimonialDots && prevBtn && nextBtn) {
    var testimonials = testimonialTrack.children;
    var totalTestimonials = testimonials.length;
    var currentTestimonial = 0;

    // Create dots
    for (var i = 0; i < totalTestimonials; i++) {
      var dot = document.createElement('button');
      dot.classList.add('testimonials__dot');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', function () {
        goToTestimonial(parseInt(this.getAttribute('data-index'), 10));
      });
      testimonialDots.appendChild(dot);
    }

    function goToTestimonial(index) {
      if (index < 0) index = totalTestimonials - 1;
      if (index >= totalTestimonials) index = 0;
      currentTestimonial = index;

      testimonialTrack.style.transform = 'translateX(-' + (index * 100) + '%)';

      var dots = testimonialDots.querySelectorAll('.testimonials__dot');
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === index);
        d.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
    }

    prevBtn.addEventListener('click', function () {
      goToTestimonial(currentTestimonial - 1);
    });

    nextBtn.addEventListener('click', function () {
      goToTestimonial(currentTestimonial + 1);
    });

    // Auto-advance testimonials every 6 seconds
    var autoAdvance = setInterval(function () {
      goToTestimonial(currentTestimonial + 1);
    }, 6000);

    // Pause auto-advance on hover
    var carouselEl = document.querySelector('.testimonials__carousel');
    if (carouselEl) {
      carouselEl.addEventListener('mouseenter', function () {
        clearInterval(autoAdvance);
      });
      carouselEl.addEventListener('mouseleave', function () {
        autoAdvance = setInterval(function () {
          goToTestimonial(currentTestimonial + 1);
        }, 6000);
      });
    }

    // Touch swipe support for testimonials
    var touchStartX = 0;
    var touchEndX = 0;

    testimonialTrack.addEventListener(
      'touchstart',
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    testimonialTrack.addEventListener(
      'touchend',
      function (e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            goToTestimonial(currentTestimonial + 1);
          } else {
            goToTestimonial(currentTestimonial - 1);
          }
        }
      },
      { passive: true }
    );
  }

  // ---------- Form Validation & Submission ----------
  if (bidForm) {
    var validators = {
      name: function (value) {
        if (!value.trim()) return 'Full name is required.';
        if (value.trim().length < 2) return 'Please enter a valid name.';
        return '';
      },
      email: function (value) {
        if (!value.trim()) return 'Email address is required.';
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address.';
        return '';
      },
      phone: function (value) {
        if (!value.trim()) return 'Phone number is required.';
        var digits = value.replace(/\D/g, '');
        if (digits.length < 10) return 'Please enter a valid phone number.';
        return '';
      },
      projectType: function (value) {
        if (!value) return 'Please select a project type.';
        return '';
      },
      description: function (value) {
        if (!value.trim()) return 'Please describe your project.';
        if (value.trim().length < 20) return 'Please provide more detail (at least 20 characters).';
        return '';
      },
    };

    function validateField(input) {
      var name = input.name;
      var value = input.value;
      var validator = validators[name];
      if (!validator) return true;

      var error = validator(value);
      var errorEl = input.parentElement.querySelector('.bid-form__error');

      if (error) {
        input.classList.add('error');
        if (errorEl) errorEl.textContent = error;
        return false;
      } else {
        input.classList.remove('error');
        if (errorEl) errorEl.textContent = '';
        return true;
      }
    }

    // Real-time validation on blur
    var formInputs = bidForm.querySelectorAll('.bid-form__input');
    formInputs.forEach(function (input) {
      input.addEventListener('blur', function () {
        validateField(this);
      });

      // Clear error on input
      input.addEventListener('input', function () {
        if (this.classList.contains('error')) {
          validateField(this);
        }
      });
    });

    // Phone number formatting
    var phoneInput = document.getElementById('bidPhone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function () {
        var digits = this.value.replace(/\D/g, '');
        if (digits.length >= 10) {
          digits = digits.substring(0, 10);
          this.value = '(' + digits.substring(0, 3) + ') ' + digits.substring(3, 6) + '-' + digits.substring(6);
        }
      });
    }

    // Form submission
    bidForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Hide previous messages
      if (formSuccess) formSuccess.hidden = true;
      if (formError) formError.hidden = true;

      // Validate all required fields
      var isValid = true;
      var fieldsToValidate = ['name', 'email', 'phone', 'projectType', 'description'];

      fieldsToValidate.forEach(function (fieldName) {
        var input = bidForm.querySelector('[name="' + fieldName + '"]');
        if (input && !validateField(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        // Focus first error field
        var firstError = bidForm.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      // Collect form data
      var contactMethodInput = bidForm.querySelector('[name="contactMethod"]:checked');
      var formData = {
        name: bidForm.querySelector('[name="name"]').value.trim(),
        email: bidForm.querySelector('[name="email"]').value.trim(),
        phone: bidForm.querySelector('[name="phone"]').value.trim(),
        address: bidForm.querySelector('[name="address"]').value.trim(),
        projectType: bidForm.querySelector('[name="projectType"]').value,
        budget: bidForm.querySelector('[name="budget"]').value,
        description: bidForm.querySelector('[name="description"]').value.trim(),
        contactMethod: contactMethodInput ? contactMethodInput.value : '',
        submittedAt: new Date().toISOString(),
      };

      // Show loading state
      var submitBtn = document.getElementById('bidSubmit');
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }

      // Simulate form submission (replace with actual endpoint)
      setTimeout(function () {
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }

        // Save to localStorage as a simple persistence mechanism
        try {
          var submissions = JSON.parse(localStorage.getItem('snc_bid_submissions') || '[]');
          submissions.push(formData);
          localStorage.setItem('snc_bid_submissions', JSON.stringify(submissions));
        } catch (err) {
          // localStorage might not be available
        }

        // Log to console (for development)
        console.log('Bid submission:', formData);

        // Show success message
        if (formSuccess) {
          formSuccess.hidden = false;
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

          // Hide success message after 10 seconds
          setTimeout(function () {
            formSuccess.hidden = true;
          }, 10000);
        }

        // Reset form
        bidForm.reset();
      }, 1500);
    });
  }

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;

      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---------- Lazy Load Images ----------
  if ('IntersectionObserver' in window) {
    var lazyImages = document.querySelectorAll('img[data-src]');
    if (lazyImages.length) {
      var imageObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(function (img) {
        imageObserver.observe(img);
      });
    }
  }
})();
