/* Hono Contábil — comportamento do site. Para trocar contatos e endereços, edite só o bloco SITE abaixo. */
const SITE = {
  app: 'https://app.honocontabil.com.br',   // endereço do sistema (subdomínio apontado para o Railway)
  whatsapp: '5599982850044',                // DDI + DDD + número, só dígitos
  email: 'contato@honocontabil.com.br',
  // Cole aqui o link de cada rede social. As que ficarem vazias não aparecem no site.
  redes: { instagram: '', facebook: '', linkedin: '', youtube: '' },
};

(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  // ----- endereços e contatos vindos do SITE -----
  $$('[data-app]').forEach((a) => { a.href = SITE.app + a.getAttribute('data-app'); });
  $$('[data-wa]').forEach((a) => { const u = new URL(a.href); a.href = `https://wa.me/${SITE.whatsapp}${u.search}`; });
  $$('[data-email]').forEach((a) => { a.href = `mailto:${SITE.email}`; a.textContent = SITE.email; });
  let algumaRede = false;
  $$('[data-rede]').forEach((a) => { const url = SITE.redes[a.dataset.rede]; if (url) { a.href = url; a.hidden = false; algumaRede = true; } });
  if (algumaRede) $('#redes').hidden = false;
  const ano = $('#ano'); if (ano) ano.textContent = new Date().getFullYear();

  // ----- topo: sombra ao rolar e botão do WhatsApp -----
  const topo = $('#topo'), zap = $('#zap');
  const aoRolar = () => { const y = window.scrollY; topo.classList.toggle('rolou', y > 8); zap.classList.toggle('ve', y > 640); };
  aoRolar(); window.addEventListener('scroll', aoRolar, { passive: true });

  // ----- menu no celular -----
  const burger = $('#burger'), menu = $('#menu');
  const fechar = () => { menu.classList.remove('aberto'); burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Abrir menu'); };
  burger.addEventListener('click', () => { const ab = menu.classList.toggle('aberto'); burger.setAttribute('aria-expanded', String(ab)); burger.setAttribute('aria-label', ab ? 'Fechar menu' : 'Abrir menu'); });
  $$('#menu a').forEach((a) => a.addEventListener('click', fechar));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(); });

  // ----- explorador de funcionalidades -----
  const expl = $('#expl'); if (!expl) return;
  const itens = $$('.expl-item', expl), imgs = $$('.expl-imgs img', expl), painel = $('#p-receber');
  const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let atual = 0, timer = null, manual = false, visivel = false;

  function mostrar(i, foco) {
    atual = (i + itens.length) % itens.length;
    itens.forEach((b, n) => { const on = n === atual; b.classList.toggle('on', on); b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    const k = itens[atual].dataset.img;
    imgs.forEach((im) => im.classList.toggle('on', im.dataset.k === k));
    painel.setAttribute('aria-labelledby', itens[atual].id);
    if (foco) itens[atual].focus();
    // reinicia a barra de progresso
    expl.classList.remove('auto'); void expl.offsetWidth; if (!manual && !reduz) expl.classList.add('auto');
    agendar();
  }
  function agendar() { clearTimeout(timer); if (manual || reduz || !visivel) return; timer = setTimeout(() => mostrar(atual + 1), 7000); }
  function assumir() { manual = true; expl.classList.remove('auto'); clearTimeout(timer); }

  itens.forEach((b, n) => {
    b.addEventListener('click', () => { assumir(); mostrar(n); });
    b.addEventListener('keydown', (e) => {
      const d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (d) { e.preventDefault(); assumir(); mostrar(atual + d, true); }
      else if (e.key === 'Home') { e.preventDefault(); assumir(); mostrar(0, true); }
      else if (e.key === 'End') { e.preventDefault(); assumir(); mostrar(itens.length - 1, true); }
    });
  });
  // roda sozinho só enquanto a seção está na tela e até a pessoa mexer
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => { visivel = es[0].isIntersecting; if (visivel) { if (!manual && !reduz) expl.classList.add('auto'); agendar(); } else { clearTimeout(timer); expl.classList.remove('auto'); } }, { threshold: 0.35 }).observe(expl);
  } else { manual = true; }
  mostrar(0);
})();
