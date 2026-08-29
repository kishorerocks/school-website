/**
 * ==========================================================================
 * ST. ANDREWS INTERNATIONAL ACADEMY — JAVASCRIPT & JQUERY CONTROLLER
 * Fully responsive, accessible, modular script for school website
 * ==========================================================================
 */

$(document).ready(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     1. STICKY NAVBAR SCROLL EFFECT
     ------------------------------------------------------------------------ */
  const $mainNavbar = $('#mainNavbar');
  const $backToTop = $('#backToTop');

  function handleScroll() {
    const scrollPos = $(window).scrollTop();

    if (scrollPos > 60) {
      $mainNavbar.addClass('scrolled');
      $backToTop.addClass('visible');
    } else {
      $mainNavbar.removeClass('scrolled');
      $backToTop.removeClass('visible');
    }
  }

  $(window).on('scroll', handleScroll);
  handleScroll(); // Initial check

  /* ------------------------------------------------------------------------
     2. BACK TO TOP BUTTON
     ------------------------------------------------------------------------ */
  $backToTop.on('click', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 500);
  });

  /* ------------------------------------------------------------------------
     3. MOBILE OFFCANVAS AUTO-CLOSE ON ANCHOR CLICK
     ------------------------------------------------------------------------ */
  $('.mobile-offcanvas .mobile-nav-link:not([data-bs-toggle])').on('click', function () {
    const offcanvasEl = document.getElementById('mobileNavOffcanvas');
    if (offcanvasEl) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
    }
  });

  $('.mobile-submenu a').on('click', function () {
    const offcanvasEl = document.getElementById('mobileNavOffcanvas');
    if (offcanvasEl) {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
      if (bsOffcanvas) {
        bsOffcanvas.hide();
      }
    }
  });

  /* ------------------------------------------------------------------------
     4. HERO CAROUSEL SETTINGS
     ------------------------------------------------------------------------ */
  const heroCarouselEl = document.querySelector('#heroCarousel');
  if (heroCarouselEl) {
    new bootstrap.Carousel(heroCarouselEl, {
      interval: 5500,
      pause: 'hover',
      ride: 'carousel',
      wrap: true
    });
  }

  /* ------------------------------------------------------------------------
     5. SCROLL REVEAL ANIMATIONS (Intersection Observer)
     ------------------------------------------------------------------------ */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    $('.reveal').addClass('revealed');
  }

  /* ------------------------------------------------------------------------
     6. ANIMATED STATISTICS COUNTER
     ------------------------------------------------------------------------ */
  let countersAnimated = false;
  const $achievementsSection = $('#achievementsSection');

  function runCounters() {
    if (countersAnimated) return;

    $('.stat-counter-value').each(function () {
      const $this = $(this);
      const target = parseInt($this.attr('data-target'), 10);
      const suffix = $this.attr('data-suffix') || '';

      $({ countNum: 0 }).animate(
        { countNum: target },
        {
          duration: 2200,
          easing: 'swing',
          step: function () {
            $this.text(Math.floor(this.countNum) + suffix);
          },
          complete: function () {
            $this.text(this.countNum + suffix);
          }
        }
      );
    });

    countersAnimated = true;
  }

  if ($achievementsSection.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            runCounters();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );
    counterObserver.observe($achievementsSection[0]);
  } else {
    runCounters();
  }

  /* ------------------------------------------------------------------------
     7. GALLERY FILTERING (jQuery)
     ------------------------------------------------------------------------ */
  $('.gallery-filter-btn').on('click', function () {
    $('.gallery-filter-btn').removeClass('active');
    $(this).addClass('active');

    const filterValue = $(this).attr('data-filter');

    if (filterValue === 'all') {
      $('.gallery-item-wrap').fadeIn(350);
    } else {
      $('.gallery-item-wrap').hide();
      $('.gallery-item-wrap[data-category="' + filterValue + '"]').fadeIn(350);
    }
  });

  /* ------------------------------------------------------------------------
     8. GALLERY LIGHTBOX MODAL
     ------------------------------------------------------------------------ */
  let currentGalleryIndex = 0;
  const galleryItems = [];

  $('.gallery-item').each(function (index) {
    const src = $(this).find('img').attr('src');
    const title = $(this).find('.gallery-title').text() || 'School Activity';
    const category = $(this).find('.gallery-cat').text() || 'Campus';
    galleryItems.push({ src, title, category });

    $(this).on('click', function () {
      currentGalleryIndex = index;
      updateLightbox(currentGalleryIndex);
      const lightboxModal = new bootstrap.Modal(document.getElementById('galleryLightboxModal'));
      lightboxModal.show();
    });
  });

  function updateLightbox(index) {
    if (galleryItems.length === 0) return;
    const item = galleryItems[index];
    $('#lightboxImg').attr('src', item.src);
    $('#lightboxTitle').text(item.title);
    $('#lightboxCategory').text(item.category);
    $('#lightboxIndex').text((index + 1) + ' / ' + galleryItems.length);
  }

  $('#lightboxNext').on('click', function () {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    updateLightbox(currentGalleryIndex);
  });

  $('#lightboxPrev').on('click', function () {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightbox(currentGalleryIndex);
  });

  // Keyboard navigation for Lightbox
  $(document).on('keydown', function (e) {
    if ($('#galleryLightboxModal').hasClass('show')) {
      if (e.key === 'ArrowRight') $('#lightboxNext').click();
      if (e.key === 'ArrowLeft') $('#lightboxPrev').click();
      if (e.key === 'Escape') {
        const modal = bootstrap.Modal.getInstance(document.getElementById('galleryLightboxModal'));
        if (modal) modal.hide();
      }
    }
  });

  /* ------------------------------------------------------------------------
     9. CONTACT & ENQUIRY FORM CLIENT-SIDE VALIDATION
     ------------------------------------------------------------------------ */
  $('#admissionEnquiryForm').on('submit', function (e) {
    e.preventDefault();

    const form = this;
    if (!form.checkValidity()) {
      e.stopPropagation();
      $(form).addClass('was-validated');
      return;
    }

    $(form).addClass('was-validated');

    // Simulate submission state
    const $submitBtn = $(form).find('button[type="submit"]');
    const originalText = $submitBtn.html();

    $submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing...');

    setTimeout(function () {
      $submitBtn.prop('disabled', false).html(originalText);
      form.reset();
      $(form).removeClass('was-validated');

      // Show Success Modal
      const successModal = new bootstrap.Modal(document.getElementById('formSuccessModal'));
      successModal.show();
    }, 1200);
  });

  // Quick Newsletter Subscription Form
  $('#newsletterForm').on('submit', function (e) {
    e.preventDefault();
    const email = $('#newsletterEmail').val();
    if (email) {
      $('#newsletterFeedback').removeClass('d-none').hide().fadeIn(300);
      $('#newsletterEmail').val('');
      setTimeout(function () {
        $('#newsletterFeedback').fadeOut(300);
      }, 4000);
    }
  });

  /* ------------------------------------------------------------------------
     10. LIVE SEARCH OVERLAY
     ------------------------------------------------------------------------ */
  const searchableContent = [
    { title: 'Admissions Process 2026-27', category: 'Admissions', link: '#admissions' },
    { title: 'Fee Structure & Scholarships', category: 'Admissions', link: '#admissions' },
    { title: 'Pre-Primary & Early Learning', category: 'Academics', link: '#academics' },
    { title: 'High School & Senior Secondary', category: 'Academics', link: '#academics' },
    { title: 'Robotics & STEM Labs', category: 'Campus & Facilities', link: '#facilities' },
    { title: 'Olympic Size Swimming Pool & Sports Arena', category: 'Facilities', link: '#facilities' },
    { title: 'Smart Classrooms with Interactive Displays', category: 'Facilities', link: '#facilities' },
    { title: 'Principal Message by Dr. Radhika Sharma', category: 'About Us', link: '#principal' },
    { title: 'Annual Sports Extravaganza 2026', category: 'Events', link: '#events' },
    { title: 'School Calendar & Examination Schedule', category: 'News', link: '#news' },
    { title: 'Download Official School Prospectus', category: 'Admissions', link: '#admissions' }
  ];

  $('#searchInput').on('input', function () {
    const query = $(this).val().toLowerCase().trim();
    const $resultsContainer = $('#searchResults');
    $resultsContainer.empty();

    if (query.length < 2) {
      $resultsContainer.html('<p class="text-muted text-center my-4">Type at least 2 characters to search programs, facilities, and circulars...</p>');
      return;
    }

    const filtered = searchableContent.filter(item =>
      item.title.toLowerCase().includes(query) || item.category.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      $resultsContainer.html('<p class="text-muted text-center my-4"><i class="bi bi-info-circle me-2"></i>No matches found for "' + query + '". Please try another term.</p>');
      return;
    }

    let html = '<div class="list-group list-group-flush">';
    filtered.forEach(item => {
      html += `
        <a href="${item.link}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 search-result-item" data-bs-dismiss="modal">
          <div>
            <h6 class="mb-1 text-primary-navy fw-bold">${item.title}</h6>
            <small class="text-muted"><i class="bi bi-tag me-1"></i>${item.category}</small>
          </div>
          <i class="bi bi-chevron-right text-secondary-teal"></i>
        </a>
      `;
    });
    html += '</div>';

    $resultsContainer.html(html);
  });

  // Focus input when modal opens
  $('#searchModal').on('shown.bs.modal', function () {
    $('#searchInput').focus();
  });

  /* ------------------------------------------------------------------------
     11. TESTIMONIAL CAROUSEL AUTOPLAY
     ------------------------------------------------------------------------ */
  const testimonialCarouselEl = document.querySelector('#testimonialCarousel');
  if (testimonialCarouselEl) {
    new bootstrap.Carousel(testimonialCarouselEl, {
      interval: 6000,
      pause: 'hover',
      ride: 'carousel'
    });
  }

  console.log('St. Andrews Academy frontend initialized successfully.');
});
