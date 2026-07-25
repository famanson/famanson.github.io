/* ==========================================================================
   Son "Sean" Pham — behaviour for the static rebuild.

   Reproduces the three interactive pieces of the original Squarespace
   template: the mobile menu, the gallery collections (masonry thumbnails
   <-> fitted slideshow) and the lightbox on in-page gallery blocks.
   ========================================================================== */
(function () {
  'use strict';

  var MOBILE_BREAKPOINT = 800;
  var GUTTER = 10;          // px between masonry columns and rows
  var TARGET_COLUMN = 500;  // container width per column, matching the original

  function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
  }

  function on(el, type, fn) {
    if (el) el.addEventListener(type, fn);
  }

  /* ------------------------------------------------------------------------
     Mobile menu
     ---------------------------------------------------------------------- */
  function initMobileMenu() {
    var link = document.querySelector('#mobileMenuLink a');
    var nav = document.getElementById('mobileNav');
    if (!link || !nav) return;

    var wrapper = nav.querySelector('.wrapper');
    var open = false;

    function close() {
      open = false;
      nav.style.height = '0px';
      link.parentNode.classList.remove('active-link');
    }

    on(link, 'click', function (e) {
      e.preventDefault();
      open = !open;
      nav.style.height = open ? wrapper.offsetHeight + 'px' : '0px';
      link.parentNode.classList.toggle('active-link', open);
    });

    on(window, 'resize', function () {
      if (open && !isMobile()) close();
      else if (open) nav.style.height = wrapper.offsetHeight + 'px';
    });
  }

  /* ------------------------------------------------------------------------
     Gallery collections
     ---------------------------------------------------------------------- */
  function initGallery() {
    var wrapper = document.getElementById('galleryWrapper');
    if (!wrapper) return;

    var base = wrapper.getAttribute('data-gallery-base') || '/';
    var thumbsEl = document.getElementById('thumbnails');
    var slideshow = document.getElementById('slideshow');
    if (!thumbsEl || !slideshow) return;

    var thumbs = [].slice.call(thumbsEl.querySelectorAll('.thumb'));
    var slides = [].slice.call(slideshow.querySelectorAll('.slide'));
    var metaSlides = [].slice.call(document.querySelectorAll('#imageData .slide'));
    var toggles = [].slice.call(document.querySelectorAll('.thumbnail-toggle'));
    var current = 0;

    /* --- masonry ------------------------------------------------------- */
    function layout() {
      if (isMobile()) {
        thumbsEl.style.height = '';
        thumbs.forEach(function (t) {
          t.style.top = t.style.left = t.style.width = t.style.height = '';
        });
        return;
      }
      var width = thumbsEl.clientWidth;
      if (!width) return;

      var columns = Math.max(1, Math.floor(width / TARGET_COLUMN));
      var colWidth = Math.floor((width - GUTTER * (columns - 1)) / columns);
      var heights = [];
      var i;
      for (i = 0; i < columns; i++) heights.push(0);

      thumbs.forEach(function (thumb) {
        var w = parseInt(thumb.getAttribute('data-w'), 10) || 1;
        var h = parseInt(thumb.getAttribute('data-h'), 10) || 1;
        var height = Math.floor(colWidth * h / w);

        var shortest = 0;
        for (var c = 1; c < columns; c++) {
          if (heights[c] < heights[shortest]) shortest = c;
        }
        thumb.style.width = colWidth + 'px';
        thumb.style.height = height + 'px';
        thumb.style.left = shortest * (colWidth + GUTTER) + 'px';
        thumb.style.top = heights[shortest] + 'px';
        heights[shortest] += height + GUTTER;
      });

      thumbsEl.style.height = (Math.max.apply(null, heights) - GUTTER) + 'px';
    }

    /* --- image hydration -----------------------------------------------
       Slides carry their source in data-* so the browser doesn't fetch
       every full-size frame up front. Desktop hydrates the visible slide
       and its neighbours; the mobile stack shows them all, so hydrate the
       lot and let native lazy-loading pace the downloads. */
    function hydrate(slide) {
      if (!slide) return;
      var img = slide.querySelector('img');
      if (!img || img.getAttribute('src')) return;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.src = img.dataset.src;
    }

    function hydrateAll() {
      slides.forEach(hydrate);
    }

    function preload(index) {
      [index - 1, index, index + 1].forEach(function (i) {
        hydrate(slides[(i + slides.length) % slides.length]);
      });
    }

    function showSlide(index, push) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('sqs-active-slide', i === current); });
      thumbs.forEach(function (t, i) { t.classList.toggle('sqs-active-slide', i === current); });
      metaSlides.forEach(function (s, i) { s.classList.toggle('sqs-active-slide', i === current); });
      preload(current);

      if (push !== false) {
        var slug = slides[current].getAttribute('data-slide-url');
        if (slug) setUrl(base + slug);
      }
    }

    function setUrl(path) {
      if (window.history && history.replaceState) {
        try { history.replaceState(null, '', path); } catch (e) { /* file:// */ }
      }
    }

    function showThumbnails(push) {
      document.body.classList.add('thumbnail-view');
      if (push !== false) setUrl(base);
    }

    function showSlideshow(index) {
      document.body.classList.remove('thumbnail-view');
      showSlide(index, true);
      window.scrollTo(0, 0);
    }

    /* --- wiring -------------------------------------------------------- */
    thumbs.forEach(function (thumb, i) {
      on(thumb, 'click', function () {
        if (isMobile()) return;
        showSlideshow(i);
      });
    });

    on(document.querySelector('.overlay-controls.left-control'), 'click', function () { showSlide(current - 1); });
    on(document.querySelector('.overlay-controls.right-control'), 'click', function () { showSlide(current + 1); });
    on(document.querySelector('.overlay-controls.center-control'), 'click', function () { showThumbnails(); });

    on(document.querySelector('#simpleControls .prev-slide'), 'click', function () { showSlide(current - 1); });
    on(document.querySelector('#simpleControls .next-slide'), 'click', function () { showSlide(current + 1); });

    toggles.forEach(function (t) {
      if (t.classList.contains('overlay-controls')) return;
      on(t, 'click', function () { showThumbnails(); });
    });

    on(document, 'keydown', function (e) {
      if (document.body.classList.contains('lightbox-open')) return;
      if (document.body.classList.contains('thumbnail-view')) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); showSlide(current - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); showSlide(current + 1); }
      else if (e.key === 'Escape') { showThumbnails(); }
    });

    var resizeTimer;
    on(window, 'resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        layout();
        if (isMobile()) hydrateAll();
      }, 60);
    });

    /* --- initial state -------------------------------------------------
       Deep links arrive either as /<gallery>/<image-slug> (rewritten to a
       hash by 404.html, since GitHub Pages can't route them) or already as
       a hash. Either way, open that slide and restore the pretty URL. */
    var deepLink = (location.hash || '').replace(/^#/, '');
    var startIndex = -1;
    if (deepLink) {
      slides.forEach(function (s, i) {
        if (s.getAttribute('data-slide-url') === deepLink) startIndex = i;
      });
    }

    layout();
    if (isMobile()) {
      hydrateAll();
      showThumbnails(false);
      if (deepLink) setUrl(base);
    } else if (startIndex >= 0) {
      showSlideshow(startIndex);
    } else {
      showThumbnails(false);
    }

    // Images finish loading after layout; re-run once everything settles.
    on(window, 'load', layout);
  }

  /* ------------------------------------------------------------------------
     Lightbox for in-page gallery blocks
     ---------------------------------------------------------------------- */
  function initLightbox() {
    var groups = [].slice.call(document.querySelectorAll('.sqs-gallery-block-grid'));
    var singles = [].slice.call(document.querySelectorAll('.sqs-block-image-button.lightbox'));
    if (!groups.length && !singles.length) return;

    var box, boxImg, counter, items = [], index = 0;

    function build() {
      box = document.createElement('div');
      box.className = 'sqs-lightbox';
      box.innerHTML =
        '<button class="sqs-lightbox-close" aria-label="Close">&times;</button>' +
        '<button class="sqs-lightbox-prev" aria-label="Previous">&#8249;</button>' +
        '<img alt="">' +
        '<button class="sqs-lightbox-next" aria-label="Next">&#8250;</button>' +
        '<div class="sqs-lightbox-counter"></div>';
      document.body.appendChild(box);
      boxImg = box.querySelector('img');
      counter = box.querySelector('.sqs-lightbox-counter');

      on(box.querySelector('.sqs-lightbox-close'), 'click', close);
      on(box.querySelector('.sqs-lightbox-prev'), 'click', function (e) { e.stopPropagation(); go(index - 1); });
      on(box.querySelector('.sqs-lightbox-next'), 'click', function (e) { e.stopPropagation(); go(index + 1); });
      on(box, 'click', function (e) { if (e.target === box || e.target === boxImg) close(); });
    }

    function go(i) {
      index = (i + items.length) % items.length;
      boxImg.src = items[index].href;
      boxImg.alt = items[index].alt || '';
      counter.textContent = items.length > 1 ? (index + 1) + ' / ' + items.length : '';
      box.querySelector('.sqs-lightbox-prev').style.display = items.length > 1 ? '' : 'none';
      box.querySelector('.sqs-lightbox-next').style.display = items.length > 1 ? '' : 'none';
    }

    function open(list, i) {
      if (!box) build();
      items = list;
      go(i);
      document.body.classList.add('lightbox-open');
      box.style.display = 'flex';
      requestAnimationFrame(function () { box.classList.add('is-open'); });
    }

    function close() {
      if (!box) return;
      box.classList.remove('is-open');
      document.body.classList.remove('lightbox-open');
      setTimeout(function () { box.style.display = 'none'; }, 180);
    }

    groups.forEach(function (group) {
      var anchors = [].slice.call(group.querySelectorAll('a.image-slide-anchor[href]'));
      var list = anchors.map(function (a) {
        return { href: a.getAttribute('href'), alt: (a.querySelector('img') || {}).alt };
      });
      anchors.forEach(function (a, i) {
        on(a, 'click', function (e) {
          e.preventDefault();
          open(list, i);
        });
      });
    });

    singles.forEach(function (button) {
      var img = button.querySelector('img');
      if (!img) return;
      on(button, 'click', function (e) {
        e.preventDefault();
        open([{ href: img.getAttribute('src'), alt: img.alt }], 0);
      });
    });

    on(document, 'keydown', function (e) {
      if (!document.body.classList.contains('lightbox-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') go(index - 1);
      else if (e.key === 'ArrowRight') go(index + 1);
    });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    initMobileMenu();
    initGallery();
    initLightbox();
  });
})();
