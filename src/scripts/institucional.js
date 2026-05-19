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
    origSlides.forEach(function (s) { track.appendChild(s.cloneNode(true)); });
    var current = 0, busy = false, timer;
    function getW() { return origSlides[0].offsetWidth; }
    function go(dir) {
      if (busy) return;
      busy = true;
      if (dir === -1 && current === 0) {
        track.style.transition = 'none';
        track.style.transform = 'translateX(-' + (total * getW()) + 'px)';
        track.offsetHeight;
        current = total - 1;
        track.style.transition = 'transform 0.65s ease';
        track.style.transform = 'translateX(-' + (current * getW()) + 'px)';
        setTimeout(function () { busy = false; }, 700);
      } else {
        current += dir;
        track.style.transition = 'transform 0.65s ease';
        track.style.transform = 'translateX(-' + (current * getW()) + 'px)';
        setTimeout(function () {
          if (current >= total) {
            track.style.transition = 'none';
            current -= total;
            track.style.transform = 'translateX(-' + (current * getW()) + 'px)';
          }
          busy = false;
        }, 700);
      }
    }
    function resetTimer() { clearInterval(timer); timer = setInterval(function () { go(1); }, 4000); }
    var prev = carousel.querySelector('.carousel-prev');
    var next = carousel.querySelector('.carousel-next');
    if (prev) prev.addEventListener('click', function () { go(-1); resetTimer(); });
    if (next) next.addEventListener('click', function () { go(1); resetTimer(); });
    resetTimer();
  })();

  // ── Carrossel corporativo
  (function () {
    var carousel = document.querySelector('.mosaic-corp-carousel');
    var track = carousel && carousel.querySelector('.mosaic-corp-carousel-track');
    if (!track) return;
    var origSlides = Array.from(track.querySelectorAll('.mosaic-corp-carousel-slide'));
    var total = origSlides.length;
    if (total < 2) return;
    origSlides.forEach(function (s) { track.appendChild(s.cloneNode(true)); });
    var current = 0, busy = false, timer;
    function getW() { return origSlides[0].offsetWidth; }
    function go(dir) {
      if (busy) return;
      busy = true;
      if (dir === -1 && current === 0) {
        track.style.transition = 'none';
        track.style.transform = 'translateX(-' + (total * getW()) + 'px)';
        track.offsetHeight;
        current = total - 1;
        track.style.transition = 'transform 0.65s ease';
        track.style.transform = 'translateX(-' + (current * getW()) + 'px)';
        setTimeout(function () { busy = false; }, 700);
      } else {
        current += dir;
        track.style.transition = 'transform 0.65s ease';
        track.style.transform = 'translateX(-' + (current * getW()) + 'px)';
        setTimeout(function () {
          if (current >= total) {
            track.style.transition = 'none';
            current -= total;
            track.style.transform = 'translateX(-' + (current * getW()) + 'px)';
          }
          busy = false;
        }, 700);
      }
    }
    function resetTimer() { clearInterval(timer); timer = setInterval(function () { go(1); }, 4000); }
    var prev = carousel.querySelector('.carousel-prev');
    var next = carousel.querySelector('.carousel-next');
    if (prev) prev.addEventListener('click', function () { go(-1); resetTimer(); });
    if (next) next.addEventListener('click', function () { go(1); resetTimer(); });
    resetTimer();
  })();

  // ── Carrossel galeria mobile
  (function () {
    var carousel = document.querySelector('.galeria-mobile-carousel');
    var track = carousel && carousel.querySelector('.galeria-mobile-carousel-track');
    if (!track) return;
    var origSlides = Array.from(track.querySelectorAll('.galeria-mobile-carousel-slide'));
    var total = origSlides.length;
    if (total < 2) return;
    origSlides.forEach(function (s) { track.appendChild(s.cloneNode(true)); });
    var current = 0, busy = false, timer;
    function getW() { return carousel.offsetWidth; }
    function go(dir) {
      if (busy) return;
      busy = true;
      if (dir === -1 && current === 0) {
        track.style.transition = 'none';
        track.style.transform = 'translateX(-' + (total * getW()) + 'px)';
        track.offsetHeight;
        current = total - 1;
        track.style.transition = 'transform 0.65s ease';
        track.style.transform = 'translateX(-' + (current * getW()) + 'px)';
        setTimeout(function () { busy = false; }, 700);
      } else {
        current += dir;
        track.style.transition = 'transform 0.65s ease';
        track.style.transform = 'translateX(-' + (current * getW()) + 'px)';
        setTimeout(function () {
          if (current >= total) {
            track.style.transition = 'none';
            current -= total;
            track.style.transform = 'translateX(-' + (current * getW()) + 'px)';
          }
          busy = false;
        }, 700);
      }
    }
    function resetTimer() { clearInterval(timer); timer = setInterval(function () { go(1); }, 4000); }
    var prev = carousel.querySelector('.carousel-prev');
    var next = carousel.querySelector('.carousel-next');
    if (prev) prev.addEventListener('click', function () { go(-1); resetTimer(); });
    if (next) next.addEventListener('click', function () { go(1); resetTimer(); });
    resetTimer();
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