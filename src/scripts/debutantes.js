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

            var dataInput = document.getElementById('formData');
            if (typeof flatpickr !== 'undefined') {
                flatpickr(dataInput, {
                    locale: 'pt',
                    dateFormat: 'd/m/Y',
                    disableMobile: true,
                    minDate: 'today'
                });
                dataInput.setAttribute('readonly', 'readonly');
            } else {
                dataInput.type = 'date';
                dataInput.min = new Date().toISOString().split('T')[0];
            }

            document.getElementById('formWhatsapp').addEventListener('input', function (e) {
                var v = e.target.value.replace(/\D/g, '').substring(0, 11);
                if (v.length > 6) v = '(' + v.substring(0, 2) + ') ' + v.substring(2, 7) + '-' + v.substring(7);
                else if (v.length > 2) v = '(' + v.substring(0, 2) + ') ' + v.substring(2);
                else if (v.length > 0) v = '(' + v;
                e.target.value = v;
            });

            document.querySelector('input[name="pagina"]').value = window.location.href;

            function validate() {
                var valid = true;
                function err(id, errId, cond) {
                    var el = document.getElementById(id);
                    var errEl = document.getElementById(errId);
                    if (cond) { el.classList.add('error'); errEl.classList.add('visible'); valid = false; }
                    else { el.classList.remove('error'); errEl.classList.remove('visible'); }
                }
                var nome = document.getElementById('formNome').value.trim();
                var raw = document.getElementById('formWhatsapp').value.trim();
                var whatsapp = raw.replace(/\D/g, '');
                var email = document.getElementById('formEmail').value.trim();
                var tipo = document.getElementById('formTipo').value;
                var data = document.getElementById('formData').value.trim();
                var convidados = document.getElementById('formConvidados').value;
                err('formNome', 'err-nome', nome.length < 2);
                err('formWhatsapp', 'err-whatsapp', whatsapp.length < 10 || whatsapp.length > 11);
                err('formEmail', 'err-email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
                err('formTipo', 'err-tipo', tipo === '');
                err('formData', 'err-data', data === '');
                err('formConvidados', 'err-convidados', !convidados || parseInt(convidados) < 1);
                return valid;
            }

            document.getElementById('orcamentoForm').addEventListener('submit', function (e) {
                e.preventDefault();
                if (document.getElementById('website').value !== '') return;
                if (!validate()) return;

                var btn = document.getElementById('formSubmitBtn');
                var msg = document.getElementById('formMsg');
                btn.disabled = true;
                btn.textContent = 'Enviando...';
                msg.style.display = 'none';
                msg.className = 'form-msg';

                var raw = document.getElementById('formWhatsapp').value.trim().replace(/\D/g, '');
                var payload = {
                    nome: document.getElementById('formNome').value.trim(),
                    whatsapp: raw,
                    email: document.getElementById('formEmail').value.trim().toLowerCase(),
                    tipo_evento: document.getElementById('formTipo').value,
                    data: document.getElementById('formData').value,
                    convidados: document.getElementById('formConvidados').value,
                    mensagem: document.getElementById('formMensagem').value.trim(),
                    fonte: document.getElementById('formFonte').value,
                    origem: 'site-fit-eventos-debutantes',
                    pagina: window.location.href,
                    timestamp: new Date().toISOString()
                };

                var sp = new URLSearchParams(window.location.search);
                ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (k) {
                    var v = sp.get(k) || sessionStorage.getItem('fit_utm_' + k) || '';
                    if (v) payload[k] = v;
                });

                window.dataLayer.push({
                    event: 'form_envio',
                    form_name: 'debutantes',
                    form_tipo_evento: payload.tipo_evento,
                    form_origem: payload.origem
                });

                // ============================================================
                // WEBHOOK — Substitua a URL abaixo pela URL do seu webhook
                // Ex: https://n8n.seudominio.com/webhook/abc123
                // Ex: https://hook.make.com/xyz789
                // Ex: https://api.zapier.com/hooks/catch/12345/abcde
                // ============================================================
                fetch('https://COLE-A-URL-DO-SEU-WEBHOOK-AQUI.com/lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                    .then(function (res) {
                        if (!res.ok) throw new Error('Resposta do servidor: ' + res.status);
                        var grid = document.querySelector('.form-grid');
                        grid.style.display = 'none';
                        btn.style.display = 'none';
                        msg.innerHTML = 'Recebemos seu pedido de orçamento.<br>Em breve entraremos em contato.';
                        msg.className = 'form-msg success';
                        msg.style.display = 'block';
                    })
                    .catch(function (err) {
                        console.error('Erro ao enviar formulário:', err);
                        btn.disabled = false;
                        btn.textContent = 'Enviar solicitação';
                        msg.innerHTML = 'Ocorreu um erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.';
                        msg.className = 'form-msg error';
                        msg.style.display = 'block';
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
                var sp = new URLSearchParams(window.location.search);
                ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function (k) {
                    var v = sp.get(k);
                    if (v) sessionStorage.setItem('fit_utm_' + k, v);
                });
            })();

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