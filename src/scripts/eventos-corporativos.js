/* Scripts extraídos de eventos-corporativos.html */

(function () {
  var slides = document.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;
  var current = 0;
  setInterval(function () {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 5000);
})();

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

(function () {
  var track = document.querySelector('.galeria-carousel-track');
  if (!track) return;
  var origSlides = Array.from(track.querySelectorAll('.galeria-carousel-slide'));
  if (!origSlides.length) return;

  // duplica os slides para loop infinito
  origSlides.forEach(function (slide) {
    track.appendChild(slide.cloneNode(true));
  });

  var count = origSlides.length;
  var current = 0;

  function advance() {
    current++;
    track.scrollTo({ left: current * track.offsetWidth, behavior: 'smooth' });
    // ao exibir o último clone, reseta silenciosamente para o início
    if (current === count) {
      setTimeout(function () {
        track.scrollLeft = 0;
        current = 0;
      }, 900);
    }
  }

  setInterval(advance, 4500);
})();

(function () {
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var closeBtn = document.getElementById('lightbox-close');
  if (!lightbox) return;

  document.querySelectorAll('.galeria-item img').forEach(function (img) {
    img.parentElement.addEventListener('click', function () {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
})();

const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });

  function toggleNav() {
    const nav = document.getElementById('nav');
    nav.classList.toggle('open');
  }

  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('nav').classList.remove('open');
    });
  });

  function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Solicitação enviada!';
    btn.style.background = 'var(--rose-dark)';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Solicitar orçamento';
      btn.style.background = '';
      btn.disabled = false;
      e.target.reset();
    }, 4000);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.depoimento-card, .diferencial-item, .evento-item, .espaco-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
    observer.observe(el);
  });