(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /** מחירים לפי צילום לוח התפריט — לא לשנות בלי תמונה/אישור */
  var MENU_ITEMS = [
    {
      name: 'שווארמה',
      pitaHalf: 28,
      pitaFull: 35,
      bagHalf: 29,
      bagFull: 39,
      lafa: 43,
      halfSizes: true
    },
    { name: 'מעורב', pitaFull: 35, bagFull: 39, lafa: 43 },
    { name: 'שניצל', pitaFull: 35, bagFull: 39, lafa: 43 },
    { name: 'חזה עוף', pitaFull: 35, bagFull: 39, lafa: 43 },
    { name: 'פרגיות', pitaFull: 35, bagFull: 39, lafa: 43 },
    { name: 'קבב', pitaFull: 35, bagFull: 39, lafa: 43 },
    { name: 'לבבות', pitaFull: 35, bagFull: 39, lafa: 43 },
    { name: 'כבד', pitaFull: 35, bagFull: 39, lafa: 43 },
    { name: 'נקניקיות', pitaFull: 20, bagFull: 28, lafa: 30 },
    { name: 'פלאפל', pitaFull: 17, bagFull: 23, lafa: 25 },
    { name: 'חביתה', pitaFull: 18, bagFull: 22, lafa: 25 },
    { name: 'טונה', pitaFull: 20, bagFull: 25, lafa: 27 }
  ];

  var EXTRAS = [
    { name: "צ'יפס קטן", price: 17 },
    { name: "צ'יפס גדול", price: 22 },
    { name: "מנה בצלחת + צ'יפס + סלטים", price: 70 }
  ];

  var HOURS = [
    { day: 0, label: 'יום ראשון', open: '10:30', close: '01:00', nextDay: true },
    { day: 1, label: 'יום שני', open: '10:30', close: '01:00', nextDay: true },
    { day: 2, label: 'יום שלישי', open: '10:30', close: '01:00', nextDay: true },
    { day: 3, label: 'יום רביעי', open: '10:30', close: '01:00', nextDay: true },
    { day: 4, label: 'יום חמישי', open: '10:30', close: '01:00', nextDay: true },
    { day: 5, label: 'יום שישי', open: '10:30', close: null, short: true },
    { day: 6, label: 'שבת', closed: true }
  ];

  var GALLERY = [
    { src: 'assets/img/gallery/01.jpg', alt: 'שווארמה על השיפוד', label: 'שווארמה על השיפוד' },
    { src: 'assets/img/gallery/02.jpg', alt: 'בגט עם מילוי', label: 'בגט עם מילוי' },
    { src: 'assets/img/gallery/03.jpg', alt: 'פס סלטים וממרחים', label: 'פס סלטים וממרחים' },
    { src: 'assets/img/gallery/04.jpg', alt: 'הפלאנצ\'ה בפעולה', label: 'הפלאנצ\'ה בפעולה' },
    { src: 'assets/img/gallery/05.jpg', alt: 'חזית העסק', label: 'חזית העסק' },
    { src: 'assets/img/gallery/06.jpg', alt: 'אווירה במקום', label: 'אווירה במקום' }
  ];

  var HERO_IMAGE = 'assets/img/hero.webp';
  var MAP_EMBED =
    'https://maps.google.com/maps?q=' +
    encodeURIComponent('Al Hadif 3, Tiberias') +
    '&hl=iw&z=17&output=embed';

  /** קישורי משלוח — להחליף כשמתקבלים מהעסק */
  var DELIVERY_LINKS = {
    tenbis: '#',
    wolt: '#',
    easi: '#'
  };

  /** טלפון לחיוג · וואטסאפ — מספר בינלאומי ללא + (9725XXXXXXXX) */
  var HERO_CONTACT = {
    phone: '046712669',
    whatsapp: ''
  };

  /** קישורי רשתות — להחליף כשמתקבלים מהעסק */
  var SOCIAL_LINKS = {
    instagram: '#',
    facebook: '#'
  };

  function formatPriceTag(n) {
    return '₪' + n;
  }

  function parseTime(str) {
    var p = str.split(':');
    return { h: parseInt(p[0], 10), m: parseInt(p[1], 10) };
  }

  function toMinutes(h, m) {
    return h * 60 + m;
  }

  function isOpenNow(now) {
    var day = now.getDay();
    var mins = toMinutes(now.getHours(), now.getMinutes());
    var today = HOURS[day];
    var previous = HOURS[(day + 6) % 7];

    /* אחרי חצות שייכים לשעות היום הקודם, אם יש שעת סגירה מאומתת. */
    if (previous.nextDay && previous.close) {
      var previousClose = parseTime(previous.close);
      var previousCloseM = toMinutes(previousClose.h, previousClose.m);
      if (mins < previousCloseM) {
        return { open: true, text: 'פתוח עכשיו · עד ' + previous.close };
      }
    }

    if (today.closed) {
      return { open: false, text: 'סגור בשבת · נפתח ביום ראשון ב-10:30' };
    }

    var openT = parseTime(today.open);
    var openM = toMinutes(openT.h, openT.m);

    if (today.short) {
      return { open: null, text: 'יום שישי · מומלץ לבדוק טלפונית' };
    }

    if (today.nextDay) {
      if (mins >= openM) {
        return { open: true, text: 'פתוח עכשיו · עד ' + today.close };
      }
      return { open: false, text: 'סגור · נפתח היום ב-' + today.open };
    }

    var closeT = parseTime(today.close);
    var closeM = toMinutes(closeT.h, closeT.m);
    if (mins >= openM && mins < closeM) {
      return { open: true, text: 'פתוח עכשיו · עד ' + today.close };
    }

    return { open: false, text: 'סגור · נפתח היום ב-' + today.open };
  }

  function priceTag(label, value) {
    var labelHtml = label ? '<span class="price-label">' + label + '</span>' : '';
    return (
      '<div class="price-tag">' + labelHtml + '<span class="price-val">' + value + '</span></div>'
    );
  }

  function menuItemHtml(name, pricesHtml) {
    return (
      '<div class="menu-item">' +
      '<div class="item-name">' + name + '</div>' +
      '<div class="prices">' + pricesHtml + '</div>' +
      '</div>'
    );
  }

  function mainItemPrices(item) {
    var tags = '';
    if (item.halfSizes) {
      tags +=
        priceTag('חצי פיתה', formatPriceTag(item.pitaHalf)) +
        priceTag('פיתה', formatPriceTag(item.pitaFull)) +
        priceTag('חצי באגט', formatPriceTag(item.bagHalf)) +
        priceTag('באגט', formatPriceTag(item.bagFull)) +
        priceTag('לאפה', formatPriceTag(item.lafa));
    } else {
      tags +=
        priceTag('פיתה', formatPriceTag(item.pitaFull)) +
        priceTag('באגט', formatPriceTag(item.bagFull)) +
        priceTag('לאפה', formatPriceTag(item.lafa));
    }
    return tags;
  }

  function renderMenu() {
    var mainGrid = document.getElementById('menu-main-grid');
    if (mainGrid) {
      mainGrid.innerHTML = MENU_ITEMS.map(function (item) {
        return menuItemHtml(item.name, mainItemPrices(item));
      }).join('');
    }

    var extrasGrid = document.getElementById('menu-extras-grid');
    if (extrasGrid) {
      var chipsSmall = EXTRAS[0];
      var chipsLarge = EXTRAS[1];
      var plate = EXTRAS[2];
      extrasGrid.innerHTML =
        menuItemHtml(
          "צ'יפס קטן / גדול",
          priceTag('', formatPriceTag(chipsSmall.price) + ' / ' + formatPriceTag(chipsLarge.price))
        ) +
        menuItemHtml(plate.name, priceTag('', formatPriceTag(plate.price)));
    }
  }

  function renderHours() {
    var list = document.getElementById('hours-list');
    if (!list) return;
    var today = new Date().getDay();
    list.innerHTML = HOURS.map(function (h) {
      var time;
      if (h.closed) time = 'סגור';
      else if (h.short) time = '10:30 – שעות קצרות (לעדכון)';
      else time = h.open + ' – ' + h.close + (h.nextDay ? ' (למחרת)' : '');
      var cls = h.day === today ? ' class="today"' : '';
      return '<li' + cls + '><span>' + h.label + '</span><span>' + time + '</span></li>';
    }).join('');
  }

  function renderGallery() {
    var grid = document.getElementById('gallery-grid');
    if (!grid) return;
    grid.innerHTML = GALLERY.map(function (item) {
      return (
        '<figure class="gallery-item">' +
        '<img src="' + item.src + '" alt="' + item.alt + '" loading="lazy" decoding="async" ' +
        'onerror="this.replaceWith(Object.assign(document.createElement(\'div\'),{className:\'gallery-item placeholder-media\',dataset:{placeholder:\'' +
        item.label.replace(/'/g, "\\'") +
        '\'}}))">' +
        '</figure>'
      );
    }).join('');
  }

  function initLogoAndHero() {
    function wireLogo(img, container) {
      if (!img || !container) return;
      img.addEventListener('load', function () {
        if (img.naturalWidth > 0) {
          container.classList.add('has-logo');
          img.alt = 'באגט ניר';
        }
      });
      img.addEventListener('error', function () {
        img.remove();
      });
      if (img.complete && img.naturalWidth > 0) {
        container.classList.add('has-logo');
        img.alt = 'באגט ניר';
      }
    }

    wireLogo(document.querySelector('.brand-logo-img'), document.getElementById('site-brand'));
    wireLogo(document.querySelector('.hero-logo'), document.getElementById('hero-brand'));

  }

  function updateStatus() {
    var el = document.getElementById('open-status');
    if (!el) return;
    var st = isOpenNow(new Date());
    el.textContent = st.text;
    el.classList.toggle('is-open', st.open === true);
    el.classList.toggle('is-closed', st.open === false);
  }

  function buildWhatsAppHref() {
    var waDigits = String(HERO_CONTACT.whatsapp || '').replace(/\D/g, '');
    if (!waDigits) return '#';
    var waText = encodeURIComponent('שלום, אני רוצה להזמין מבאגט ניר');
    return 'https://wa.me/' + waDigits + '?text=' + waText;
  }

  function initHeaderSocial() {
    var instagram = document.getElementById('header-instagram');
    var whatsapp = document.getElementById('header-whatsapp');
    var facebook = document.getElementById('header-facebook');
    if (instagram) instagram.href = SOCIAL_LINKS.instagram;
    if (facebook) facebook.href = SOCIAL_LINKS.facebook;
    if (whatsapp) whatsapp.href = buildWhatsAppHref();

    [instagram, whatsapp, facebook].forEach(function (link) {
      if (!link) return;
      link.addEventListener('click', function (e) {
        if (link.getAttribute('href') === '#') {
          e.preventDefault();
        }
      });
    });
  }

  function initHeroOrder() {
    var root = document.getElementById('hero-poster-order');
    var toggle = document.getElementById('hero-order-toggle');
    var optionsBefore = document.getElementById('hero-order-options-before');
    var optionsAfter = document.getElementById('hero-order-options-after');
    var media = document.getElementById('hero-poster-media');
    var ctaZone = document.getElementById('hero-poster-cta-zone');
    if (!root || !toggle || !optionsBefore || !optionsAfter) return;

    var desktopOrderMq = window.matchMedia('(min-width: 768px)');

    /** שברי ממדים יחסית לתמונת הדסקטop (1024×576) — מכוון לעיגול הצהוב */
    var DESKTOP_CTA_FRAC = {
      cx: 0.316,
      cy: 0.866,
      w: 0.105,
      h: 0.155
    };

    function desktopCtaHit(clientX, clientY) {
      if (!media) return false;
      var rect = media.getBoundingClientRect();
      if (!rect.width || !rect.height) return false;
      var cx = rect.left + rect.width * DESKTOP_CTA_FRAC.cx;
      var cy = rect.top + rect.height * DESKTOP_CTA_FRAC.cy;
      var hw = rect.width * DESKTOP_CTA_FRAC.w * 0.55;
      var hh = rect.height * DESKTOP_CTA_FRAC.h * 0.55;
      return (
        Math.abs(clientX - cx) <= hw &&
        Math.abs(clientY - cy) <= hh
      );
    }

    function activateHeroOrderFromPointer(e) {
      if (root.classList.contains('is-phone-ready')) {
        window.location.href = 'tel:' + HERO_CONTACT.phone;
        resetOrder();
        return;
      }
      if (!root.classList.contains('is-open')) {
        setOpen(true);
        setPhoneReady(true);
      } else {
        resetOrder();
      }
    }

    var tenbis = document.getElementById('hero-order-tenbis');
    var wolt = document.getElementById('hero-order-wolt');
    var easi = document.getElementById('hero-order-easi');
    var whatsapp = document.getElementById('hero-order-whatsapp');
    if (tenbis) tenbis.href = DELIVERY_LINKS.tenbis;
    if (wolt) wolt.href = DELIVERY_LINKS.wolt;
    if (easi) easi.href = DELIVERY_LINKS.easi;

    if (whatsapp) {
      var waDigits = String(HERO_CONTACT.whatsapp || '').replace(/\D/g, '');
      if (waDigits) {
        var waText = encodeURIComponent('שלום, אני רוצה להזמין מבאגט ניר');
        whatsapp.href = 'https://wa.me/' + waDigits + '?text=' + waText;
      } else {
        whatsapp.href = '#';
        whatsapp.setAttribute('aria-disabled', 'true');
        whatsapp.title = 'מספר WhatsApp יתווסף בקרוב';
      }
    }

    function updateToggleLabel() {
      if (root.classList.contains('is-phone-ready')) {
        toggle.setAttribute(
          'aria-label',
          'חיוג לעסק — לחיצה נוספת לחיוג ל-04-671-2669'
        );
      } else if (root.classList.contains('is-open')) {
        toggle.setAttribute('aria-label', 'להזמנה — ערוצי הזמנה פתוחים');
      } else {
        toggle.setAttribute('aria-label', 'להזמנה — בחירת ערוץ הזמנה');
      }
    }

    function setPhoneReady(ready) {
      root.classList.toggle('is-phone-ready', ready);
      updateToggleLabel();
    }

    function setOpen(open) {
      root.classList.toggle('is-open', open);
      if (ctaZone) {
        ctaZone.classList.toggle('is-expanded', open);
      }
      document.body.classList.toggle('hero-order-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      optionsBefore.hidden = !open;
      optionsAfter.hidden = !open;
      if (!open) {
        setPhoneReady(false);
      } else {
        updateToggleLabel();
      }
    }

    function resetOrder() {
      setOpen(false);
      setPhoneReady(false);
    }

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (root.classList.contains('is-phone-ready')) {
        window.location.href = 'tel:' + HERO_CONTACT.phone;
        resetOrder();
        return;
      }

      if (!root.classList.contains('is-open')) {
        setOpen(true);
        setPhoneReady(true);
        return;
      }

      resetOrder();
    });

    function isInsideOrderUi(target) {
      if (!target) return false;
      if (root.contains(target)) return true;
      if (ctaZone && ctaZone.contains(target)) return true;
      return false;
    }

    if (ctaZone) {
      ctaZone.addEventListener('click', function (e) {
        if (!desktopOrderMq.matches) return;
        if (e.target.closest('.hero-order-circle')) return;
        if (e.target === toggle || toggle.contains(e.target)) return;
        e.preventDefault();
        e.stopPropagation();
        activateHeroOrderFromPointer(e);
      });
    }

    if (media) {
      media.addEventListener(
        'click',
        function (e) {
          if (!desktopOrderMq.matches) return;
          if (isInsideOrderUi(e.target)) return;
          if (!desktopCtaHit(e.clientX, e.clientY)) return;
          e.preventDefault();
          e.stopPropagation();
          activateHeroOrderFromPointer(e);
        },
        true
      );
    }

    document.addEventListener('click', function (e) {
      if (!root.classList.contains('is-open')) return;
      if (isInsideOrderUi(e.target)) return;
      resetOrder();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('is-open')) {
        resetOrder();
        toggle.focus();
      }
    });

    [optionsBefore, optionsAfter].forEach(function (panel) {
      panel.querySelectorAll('a[href="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          e.preventDefault();
        });
      });
    });
  }

  function initMobileBar() {
    var bar = document.getElementById('mobile-bar');
    var primary = document.getElementById('mobile-bar-primary');
    var icon = document.getElementById('mobile-bar-primary-icon');
    var label = document.getElementById('mobile-bar-primary-label');
    var menu = document.getElementById('menu');
    if (!bar || !primary || !icon || !label || !menu) return;

    function setMenuMode() {
      bar.classList.remove('is-past-menu');
      primary.href = '#menu';
      primary.setAttribute('aria-label', 'מעבר לתפריט');
      icon.textContent = '≡';
      label.textContent = 'לתפריט';
    }

    function setCallMode() {
      bar.classList.add('is-past-menu');
      primary.href = 'tel:' + HERO_CONTACT.phone;
      primary.setAttribute('aria-label', 'חיוג לבאגט ניר, 04-671-2669');
      icon.textContent = '☎';
      label.textContent = 'התקשרו';
    }

    function syncFromScroll() {
      var rect = menu.getBoundingClientRect();
      var headerOffset = 72;
      var reachedMenu = rect.top <= headerOffset + 24;
      if (reachedMenu) {
        setCallMode();
      } else {
        setMenuMode();
      }
    }

    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(
        function () {
          syncFromScroll();
        },
        { threshold: [0, 0.01, 0.1], rootMargin: '-72px 0px 0px 0px' }
      );
      obs.observe(menu);
    }

    window.addEventListener('scroll', syncFromScroll, { passive: true });
    window.addEventListener('resize', syncFromScroll);
    syncFromScroll();
  }

  function initPlaceholders() {
    document.querySelectorAll('.placeholder-link').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (a.getAttribute('href') === '#') {
          e.preventDefault();
        }
      });
    });

    var mapBtn = document.getElementById('map-load-btn');
    if (mapBtn) {
      mapBtn.addEventListener('click', function () {
        var box = document.getElementById('map-container');
        if (!box || box.dataset.loaded) return;
        box.dataset.loaded = '1';
        box.hidden = false;
        mapBtn.hidden = true;
        box.innerHTML =
          '<iframe title="מפת באגט ניר, אלחדיף 3 טבריה" loading="lazy" referrerpolicy="no-referrer-when-downgrade" ' +
          'src="' + MAP_EMBED + '" allowfullscreen></iframe>' +
          '<p class="map-hint"><a href="https://www.google.com/maps/search/?api=1&query=Al+Hadif+3+Tiberias" rel="noopener noreferrer">פתיחה ב-Google Maps</a></p>';
      });
    }
  }

  function initLoader() {
    var loader = document.getElementById('site-loader');
    if (!loader) return;

    document.body.classList.add('is-loading');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var minShow = reduceMotion ? 0 : 850;
    var maxWait = reduceMotion ? 100 : 4000;
    var started = Date.now();
    var finished = false;

    function finish() {
      if (finished) return;
      finished = true;
      var delay = Math.max(0, minShow - (Date.now() - started));
      window.setTimeout(function () {
        loader.classList.add('is-done');
        document.body.classList.remove('is-loading');
        window.setTimeout(function () {
          loader.remove();
        }, reduceMotion ? 0 : 650);
      }, delay);
    }

    window.addEventListener('load', finish, { once: true });
    window.setTimeout(finish, maxWait);
  }

  function initReveal() {
    if (!('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-visible');
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.section').forEach(function (s) {
      s.classList.add('reveal');
      obs.observe(s);
    });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  initLoader();
  renderMenu();
  renderHours();
  renderGallery();
  initLogoAndHero();
  initHeaderSocial();
  initHeroOrder();
  initMobileBar();
  updateStatus();
  initPlaceholders();
  initReveal();
  setInterval(updateStatus, 60000);
})();
