/* Scripts extraídos de debutantes.html */
import flatpickr from 'flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt.js';
import 'flatpickr/dist/flatpickr.min.css';

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

            (function () {
                var dataEl = document.getElementById('data');
                if (dataEl) {
                    flatpickr(dataEl, {
                        locale: Portuguese,
                        dateFormat: 'd/m/Y',
                        minDate: 'today',
                        disableMobile: true,
                    });
                }
            })();

            (function () {
                var tel = document.getElementById('telefone');
                if (!tel) return;
                tel.setAttribute('inputmode', 'numeric');
                tel.setAttribute('maxlength', '15');

                function maskPhone(v) {
                    v = v.replace(/\D/g, '').slice(0, 11);
                    if (v.length <= 10) {
                        return v.replace(/^(\d{0,2})(\d{0,4})(\d{0,4})$/, function (_, a, b, c) {
                            if (!a) return '';
                            if (!b) return '(' + a;
                            if (!c) return '(' + a + ') ' + b;
                            return '(' + a + ') ' + b + '-' + c;
                        });
                    }
                    return v.replace(/^(\d{0,2})(\d{0,5})(\d{0,4})$/, function (_, a, b, c) {
                        if (!a) return '';
                        if (!b) return '(' + a;
                        if (!c) return '(' + a + ') ' + b;
                        return '(' + a + ') ' + b + '-' + c;
                    });
                }

                tel.addEventListener('input', function () {
                    var pos = tel.selectionStart;
                    var prev = tel.value;
                    tel.value = maskPhone(tel.value);
                    var diff = tel.value.length - prev.length;
                    tel.setSelectionRange(pos + diff, pos + diff);
                });

                tel.addEventListener('keydown', function (e) {
                    if (e.key && e.key.length === 1 && !/\d/.test(e.key) && !e.ctrlKey && !e.metaKey) {
                        e.preventDefault();
                    }
                });
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
