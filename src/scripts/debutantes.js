/* Scripts extraídos de debutantes.html */

(function () {
            window.dataLayer = window.dataLayer || [];

            var navbar = document.getElementById('navbar');
            window.addEventListener('scroll', function () {
                navbar.classList.toggle('scrolled', window.scrollY > 60);
            });

            var hamburger = document.getElementById('hamburgerBtn');
            var mobileMenu = document.getElementById('mobileMenu');
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

            mobileLinks.forEach(function (l) {
                l.addEventListener('click', function () {
                    if (menuOpen) setTimeout(toggleMenu, 100);
                });
            });

            (function () {
                var track = document.getElementById('depTrack');
                var prevBtn = document.getElementById('depPrev');
                var nextBtn = document.getElementById('depNext');
                var autoInterval;

                function moveNext() {
                    var item = track.querySelector('.dep-card');
                    var w = item.offsetWidth + 20;
                    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 10) {
                        track.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        track.scrollBy({ left: w, behavior: 'smooth' });
                    }
                }

                function movePrev() {
                    var w = track.querySelector('.dep-card').offsetWidth + 20;
                    track.scrollBy({ left: -w, behavior: 'smooth' });
                }

                nextBtn.addEventListener('click', moveNext);
                prevBtn.addEventListener('click', movePrev);

                function startAuto() { autoInterval = setInterval(moveNext, 5000); }
                function stopAuto() { clearInterval(autoInterval); }

                startAuto();
                track.addEventListener('mouseenter', stopAuto);
                track.addEventListener('mouseleave', startAuto);
                track.addEventListener('touchstart', stopAuto, { passive: true });
                track.addEventListener('touchend', startAuto);
            })();

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll(
                '.sobre-content, .estrutura-header, .gastro-content, .diferenciais-header, .depoimentos, .contato-info, .contato-form-wrap, .galeria-header'
            ).forEach(function (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(24px)';
                el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                observer.observe(el);
            });

            (function () {
                var iframe = document.getElementById('mapIframe');
                var fallback = document.getElementById('mapaFallback');
                if (!iframe) return;
                iframe.addEventListener('error', function () {
                    iframe.parentElement.style.display = 'none';
                    fallback.style.display = 'flex';
                });
                setTimeout(function () {
                    try {
                        if (iframe.contentDocument === null) {
                            iframe.parentElement.style.display = 'none';
                            fallback.style.display = 'flex';
                        }
                    } catch (e) { }
                }, 5000);
            })();

        })();
