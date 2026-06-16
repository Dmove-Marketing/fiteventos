// ── Header scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// ── Mobile nav
const _hb = document.getElementById('hamburger');
const _menu = document.getElementById('mobile-menu');
const _close = document.getElementById('mobile-close');

function openMenu()  { _menu.classList.add('open');    _hb.classList.add('active'); }
function closeMenu() { _menu.classList.remove('open'); _hb.classList.remove('active'); }

if (_hb)    _hb.addEventListener('click', openMenu);
if (_close) _close.addEventListener('click', closeMenu);
_menu.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));

// ── Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setTimeout(() => { entry.target.classList.add('visible'); }, 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Hero background carousel
(function () {
  var slides = document.querySelectorAll('#hero .hero-slide');
  if (slides.length < 2) return;
  var current = 0;
  setInterval(function () {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 5000);
})();

// ── Count-up animado
(function () {
  var els = document.querySelectorAll('.count-up');
  if (!els.length) return;
  var started = false;
  function runCount() {
    if (started) return;
    started = true;
    els.forEach(function (el) {
      var target = parseInt(el.dataset.target, 10);
      var prefix = el.dataset.prefix || '';
      var suffix = el.dataset.suffix || '';
      var duration = 1800;
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.floor(eased * target);
        el.textContent = prefix + current + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = prefix + target + suffix;
      }
      requestAnimationFrame(step);
    });
  }
  var section = document.getElementById('autoridade');
  if (!section) return;
  var io = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) { runCount(); io.disconnect(); }
  }, { threshold: 0.4 });
  io.observe(section);
})();

// ── Galeria mobile carousel
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
