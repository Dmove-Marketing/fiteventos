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
    // No mobile agora é imagem única (1 slide) — só o desktop rotaciona.
    var rotateMobile = mSlides.length > 1;
    loadSlide(1); // pré-carrega o próximo slide

    setInterval(function () {
      dSlides[current].classList.remove('active');
      if (rotateMobile) mSlides[current].classList.remove('active');
      current = (current + 1) % total;
      dSlides[current].classList.add('active');
      if (rotateMobile) mSlides[current].classList.add('active');
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

  // ── Scroll reveal (à prova de falha: o conteúdo nasce com opacity:0 no HTML,
  // então NUNCA pode depender só do observer. Anima ao entrar na viewport, mas
  // garante a revelação de qualquer jeito — sem IO, elemento já visível no load,
  // ou rede de segurança por timeout.)
  (function () {
    var targets = document.querySelectorAll(
      '.sobre-content, .estrutura-header, .gastronomia-header, .diferenciais-header, .depoimentos, .contato-info, .contato-form-wrap, .galeria-header'
    );
    if (!targets.length) return;

    function reveal(el) {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }

    targets.forEach(function (el) {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });

    // Fallback total: sem IntersectionObserver, revela tudo já.
    if (!('IntersectionObserver' in window)) {
      targets.forEach(reveal);
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 80px 0px' });

    targets.forEach(function (el) {
      // Já visível no carregamento? Revela na hora (evita ficar preso invisível).
      if (el.getBoundingClientRect().top < window.innerHeight) {
        reveal(el);
      } else {
        observer.observe(el);
      }
    });

    // Rede de segurança: se o observer não disparar por qualquer motivo
    // (timing/layout/re-render), garante que nada permaneça invisível.
    setTimeout(function () { targets.forEach(reveal); }, 1600);
  })();

  // ── Slideshow gastronomia (crossfade — só no desktop, onde o layout v2 aparece)
  (function () {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    var slides = document.querySelectorAll('.gastro-img .gastro-slide');
    if (slides.length < 2) return;
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 3000);
  })();

  // ── "Prefere falar agora?" e o "Enviar WhatsApp" da faixa de orçamento abrem o
  //    popup conversacional do WhatsApp (não vão direto pro wa.me)
  (function () {
    document.querySelectorAll('.contato-wpp, [data-open-wa]').forEach(function (wpp) {
      wpp.addEventListener('click', function (e) {
        var toggle = document.getElementById('wa-toggle');
        if (!toggle) return; // sem widget: mantém o href como fallback
        e.preventDefault();
        // impede o clique de subir até o document, senão o listener de "clique fora"
        // do widget fecha o popup no mesmo instante em que ele abre
        e.stopPropagation();
        toggle.click();
      });
    });
  })();

})();

// Seção "Sobre" (v5): vídeo do YouTube como vídeo de fundo. O player é criado logo
// após o carregamento da página (sem esperar a seção aparecer) e fica rodando mudo
// em loop — assim, quando a pessoa chega na seção, o vídeo já está tocando.
// Até o player estar tocando, a caixa mostra a capa do vídeo (só aparece se a
// pessoa chegar na seção nos primeiros segundos).
(function () {
  var box = document.querySelector('.sobre-yt[data-yt-id]');
  if (!box) return;
  var id = box.getAttribute('data-yt-id');
  var iframe = null;
  var revealTimer = null;

  function send(msg) {
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(JSON.stringify(msg), '*');
    }
  }
  function cmd(func) { send({ event: 'command', func: func, args: [] }); }

  function onState(state) {
    // Depois que o vídeo apareceu uma vez, a capa não volta mais (o navegador
    // pausa vídeo mudo fora da tela e retoma ao voltar — sem capa nesse retorno)
    if (box.classList.contains('is-playing')) return;
    // 1 = tocando; qualquer outro (carregando, pausado, fim) = mantém a capa
    if (state === 1) {
      if (!revealTimer) {
        revealTimer = setTimeout(function () {
          revealTimer = null;
          box.classList.add('is-playing');
        }, 2000);
      }
    } else {
      clearTimeout(revealTimer);
      revealTimer = null;
    }
  }

  // O player manda o estado em 3 formatos: "initialDelivery" (logo após o
  // handshake — se o vídeo já estava tocando, o "tocando" só vem aqui),
  // "onStateChange" e "infoDelivery". Além disso, currentTime avançando = tocando.
  var gotReply = false;
  var lastTime = -1;
  window.addEventListener('message', function (e) {
    if (!iframe || e.source !== iframe.contentWindow) return;
    var data;
    try { data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data; } catch (err) { return; }
    if (!data || !data.event) return;
    gotReply = true;
    // Player pronto: força mudo + play (alguns navegadores ignoram o autoplay=1
    // do iframe) — só se a seção estiver visível
    if (data.event === 'onReady') {
      cmd('mute');
      cmd('playVideo');
      return;
    }
    if (data.event === 'onStateChange' && typeof data.info === 'number') {
      onState(data.info);
      return;
    }
    var info = data.info;
    if (!info || typeof info !== 'object') return;
    if (typeof info.playerState === 'number') onState(info.playerState);
    if (typeof info.currentTime === 'number') {
      if (lastTime >= 0 && info.currentTime > lastTime) onState(1);
      lastTime = info.currentTime;
    }
  });

  function create() {
    iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id +
      '?autoplay=1&mute=1&loop=1&playlist=' + id +
      '&controls=0&disablekb=1&fs=0&rel=0&iv_load_policy=3&playsinline=1&modestbranding=1&enablejsapi=1' +
      '&origin=' + encodeURIComponent(location.origin);
    iframe.title = box.getAttribute('aria-label') || '';
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
    iframe.setAttribute('tabindex', '-1');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.addEventListener('load', function () {
      // "listening" faz o player passar a enviar os eventos de estado. O player
      // pode ainda não estar pronto no "load": repete até ele responder.
      var tries = 0;
      (function handshake() {
        if (gotReply || tries++ > 40) return;
        send({ event: 'listening', id: 'sobre-yt' });
        send({ event: 'command', func: 'addEventListener', args: ['onStateChange'] });
        setTimeout(handshake, 250);
      })();
    });
    box.appendChild(iframe);
  }

  // Cria o player assim que a página termina de carregar (não disputa banda com
  // o hero/LCP), sem esperar a seção entrar na tela
  function start() { if (!iframe) create(); }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
