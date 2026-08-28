/* Scripts debutantes — form migrado para LeadForm/forms.ts */

(function () {
  window.dataLayer = window.dataLayer || [];

  // ── Hero carousel (carregamento sob demanda dos slides 2-6)
  (function () {
    var dSlides = document.querySelectorAll('#hero-slides .hero-d');
    var mSlides = document.querySelectorAll('#hero-slides .hero-m');
    if (!dSlides.length || !mSlides.length) return;

    // Carrega a imagem de um slide — só se visível (pula os display:none do outro
    // viewport, p/ não baixar a versão desktop no mobile e vice-versa).
    function loadSlide(idx) {
      [dSlides[idx], mSlides[idx]].forEach(function (slide) {
        if (!slide || slide.offsetParent === null) return;
        var img = slide.querySelector('img[data-src]');
        if (img) { img.src = img.getAttribute('data-src'); img.removeAttribute('data-src'); }
      });
    }

    var current = 0;
    var total = dSlides.length;
    loadSlide(1); // pré-carrega o próximo slide

    setInterval(function () {
      dSlides[current].classList.remove('active');
      mSlides[current].classList.remove('active');
      current = (current + 1) % total;
      dSlides[current].classList.add('active');
      mSlides[current].classList.add('active');
      loadSlide((current + 1) % total); // pré-carrega o seguinte
    }, 4500);
  })();

  // ── Navbar scroll
  var navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // ── Hamburger menu
  var hamburger = document.getElementById('hamburgerBtn');
  var mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    var mobileLinks = mobileMenu.querySelectorAll('a');
    var hamburgerSpans = hamburger.querySelectorAll('span');
    var menuOpen = false;

    function toggleMenu() {
      menuOpen = !menuOpen;
      if (menuOpen) {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
        hamburger.setAttribute('aria-label', 'Fechar menu');
        hamburgerSpans[0].style.transform = 'rotate(45deg) translate(4px,4px)';
        hamburgerSpans[1].style.opacity = '0';
        hamburgerSpans[2].style.transform = 'rotate(-45deg) translate(4px,-4px)';
      } else {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-label', 'Abrir menu');
        hamburgerSpans[0].style.transform = '';
        hamburgerSpans[1].style.opacity = '1';
        hamburgerSpans[2].style.transform = '';
      }
    }

    hamburger.addEventListener('click', toggleMenu);

    var mobileClose = document.getElementById('mobileClose');
    if (mobileClose) mobileClose.addEventListener('click', toggleMenu);

    mobileLinks.forEach(function (l) {
      l.addEventListener('click', function () {
        if (menuOpen) setTimeout(toggleMenu, 100);
      });
    });
  }

  // ── Carrossel depoimentos
  (function () {
    var track = document.getElementById('depTrack');
    var prevBtn = document.getElementById('depPrev');
    var nextBtn = document.getElementById('depNext');
    if (!track || !prevBtn || !nextBtn) return;

    function moveNext() {
      var item = track.querySelector('.dep-card');
      if (!item) return;
      var w = item.offsetWidth + 20;
      if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: w, behavior: 'smooth' });
      }
    }

    function movePrev() {
      var item = track.querySelector('.dep-card');
      if (!item) return;
      var w = item.offsetWidth + 20;
      track.scrollBy({ left: -w, behavior: 'smooth' });
    }

    nextBtn.addEventListener('click', moveNext);
    prevBtn.addEventListener('click', movePrev);

    var autoInterval = setInterval(moveNext, 5000);
    track.addEventListener('mouseenter', function () { clearInterval(autoInterval); });
    track.addEventListener('mouseleave', function () { autoInterval = setInterval(moveNext, 5000); });
    track.addEventListener('touchstart', function () { clearInterval(autoInterval); }, { passive: true });
    track.addEventListener('touchend', function () { autoInterval = setInterval(moveNext, 5000); });
  })();

  // ── Scroll reveal
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 80px 0px' });

  document.querySelectorAll(
    '.sobre-content, .estrutura-header, .gastro-content, .diferenciais-header, .depoimentos, .contato-info, .contato-form-wrap, .galeria-header'
  ).forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(el);
  });

  // ── Slideshow gastronomia
  (function () {
    var slides = document.querySelectorAll('.gastro-img .gastro-slide');
    if (slides.length < 2) return;
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 3000);
  })();

  // ── "Prefere falar agora?" abre o popup conversacional do WhatsApp (não vai direto pro wa.me)
  (function () {
    var wpp = document.querySelector('.contato-wpp');
    if (!wpp) return;
    wpp.addEventListener('click', function (e) {
      var toggle = document.getElementById('wa-toggle');
      if (!toggle) return; // sem widget: mantém o href como fallback
      e.preventDefault();
      // impede o clique de subir até o document, senão o listener de "clique fora"
      // do widget fecha o popup no mesmo instante em que ele abre
      e.stopPropagation();
      toggle.click();
    });
  })();

})();
