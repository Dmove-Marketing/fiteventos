/* Scripts extraídos de Institucional.html */

// ── Header scroll
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });

  // ── Mobile nav
  function toggleNav() {
    const nav = document.getElementById('nav');
    const hb = document.getElementById('hamburger');
    nav.classList.toggle('open');
    hb.classList.toggle('active');
  }
  document.querySelectorAll('nav a').forEach(l => {
    l.addEventListener('click', () => {
      document.getElementById('nav').classList.remove('open');
      document.getElementById('hamburger').classList.remove('active');
    });
  });

  // ── Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── Card slideshows
  (function () {
    document.querySelectorAll('.espaco-card').forEach(function (card, i) {
      var slides = card.querySelectorAll('.card-slide');
      if (slides.length < 2) return;
      var current = 0;
      setTimeout(function () {
        setInterval(function () {
          slides[current].classList.remove('active');
          current = (current + 1) % slides.length;
          slides[current].classList.add('active');
        }, 4000);
      }, i * 800);
    });
  })();

  // ── Carrossel sociais
  (function () {
    var carousel = document.querySelector('.sociais-carousel');
    var track = carousel && carousel.querySelector('.sociais-carousel-track');
    if (!track) return;

    var origSlides = Array.from(track.querySelectorAll('.sociais-carousel-slide'));
    var total = origSlides.length;
    if (total < 2) return;

    origSlides.forEach(function (slide) {
      track.appendChild(slide.cloneNode(true));
    });

    var current = 0;

    function getSlideWidth() {
      return origSlides[0].offsetWidth;
    }

    function advance() {
      current++;
      track.style.transition = 'transform 0.65s ease';
      track.style.transform = 'translateX(-' + (current * getSlideWidth()) + 'px)';
      if (current >= total) {
        setTimeout(function () {
          track.style.transition = 'none';
          track.style.transform = 'translateX(0)';
          current = 0;
        }, 700);
      }
    }

    setInterval(advance, 4000);
  })();

  // ── Carrossel corporativo
  (function () {
    var carousel = document.querySelector('.mosaic-corp-carousel');
    var track = carousel && carousel.querySelector('.mosaic-corp-carousel-track');
    if (!track) return;

    var origSlides = Array.from(track.querySelectorAll('.mosaic-corp-carousel-slide'));
    var total = origSlides.length;
    if (total < 2) return;

    origSlides.forEach(function (slide) {
      track.appendChild(slide.cloneNode(true));
    });

    var current = 0;

    function getSlideWidth() {
      return origSlides[0].offsetWidth;
    }

    function advance() {
      current++;
      track.style.transition = 'transform 0.65s ease';
      track.style.transform = 'translateX(-' + (current * getSlideWidth()) + 'px)';
      if (current >= total) {
        setTimeout(function () {
          track.style.transition = 'none';
          track.style.transform = 'translateX(0)';
          current = 0;
        }, 700);
      }
    }

    setInterval(advance, 4000);
  })();

  // ── Carrossel galeria mobile (1 slide visível)
  (function () {
    var carousel = document.querySelector('.galeria-mobile-carousel');
    var track = carousel && carousel.querySelector('.galeria-mobile-carousel-track');
    if (!track) return;

    var origSlides = Array.from(track.querySelectorAll('.galeria-mobile-carousel-slide'));
    var total = origSlides.length;
    if (total < 2) return;

    origSlides.forEach(function (slide) {
      track.appendChild(slide.cloneNode(true));
    });

    var current = 0;

    function getSlideWidth() {
      return carousel.offsetWidth;
    }

    function advance() {
      current++;
      track.style.transition = 'transform 0.65s ease';
      track.style.transform = 'translateX(-' + (current * getSlideWidth()) + 'px)';
      if (current >= total) {
        setTimeout(function () {
          track.style.transition = 'none';
          track.style.transform = 'translateX(0)';
          current = 0;
        }, 700);
      }
    }

    setInterval(advance, 4000);
  })();

  // ── Slideshow gastronomia
  (function () {
    var slides = document.querySelectorAll('.gastro-slide');
    if (slides.length < 2) return;
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 3500);
  })();

  // ── Form submit
  function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Solicitação enviada! ✓';
    btn.style.background = 'var(--rose-dark)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.disabled = false;
      e.target.reset();
    }, 4000);
  }