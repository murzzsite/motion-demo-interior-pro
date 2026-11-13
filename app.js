(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = n => Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ');

  $('lead').addEventListener('submit', e => {
    e.preventDefault();
    const p = $('phone'); if (p.value.trim().length < 4) { p.focus(); return; }
    $('ok').hidden = false;
  });

  /* итоговая сумма видна без анимации */
  $('sum').textContent = fmt(3500 * 62);
  if (reduce || !window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis({ lerp: .09 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  /* заголовки: строки в маске */
  document.querySelectorAll('h2.mask').forEach(h => {
    const t = h.textContent; h.setAttribute('aria-label', t);
    h.innerHTML = `<span class="ln" aria-hidden="true"><i>${t}</i></span>`;
    gsap.from(h.querySelector('i'), { yPercent: 110, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
  });

  /* манифест: слова проявляются по скроллу */
  const m = $('manifest'), words = m.textContent.trim().split(/\s+/);
  m.setAttribute('aria-label', m.textContent.trim());
  m.innerHTML = words.map(w => `<span class="w" aria-hidden="true">${w}</span>`).join(' ');
  gsap.to('#manifest .w', { opacity: 1, ease: 'none', stagger: .12, scrollTrigger: { trigger: m, start: 'top 80%', end: 'bottom 45%', scrub: true } });

  /* сцена: план достраивается */
  const walls = document.querySelectorAll('#walls path');
  gsap.set(walls, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set('#rooms rect', { opacity: 0 });
  gsap.set('#names text', { opacity: 0 });
  gsap.set('#furn > *', { opacity: 0, scale: .6, transformOrigin: '50% 50%' });
  gsap.set('#lamps circle', { opacity: 0 });
  gsap.set('.cap', { opacity: 0, y: 24 });
  const cnt = { v: 0 };
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, scrollTrigger: { trigger: '.story', start: 'top top', end: '+=360%', pin: '.story__pin', scrub: .6, anticipatePin: 1 } });
  tl.to('.cap[data-i="0"]', { opacity: 1, y: 0, duration: .4 }, 0)
    .to(walls, { strokeDashoffset: 0, stagger: .2, duration: 1 }, 0)
    .to('.cap[data-i="0"]', { opacity: 0, y: -24, duration: .3 }, 1.15)
    .to('.cap[data-i="1"]', { opacity: 1, y: 0, duration: .4 }, 1.35)
    .to('#rooms rect', { opacity: 1, stagger: .15, duration: .5 }, 1.35)
    .to('#names text', { opacity: 1, stagger: .1, duration: .4 }, 1.6)
    .to('.cap[data-i="1"]', { opacity: 0, y: -24, duration: .3 }, 2.15)
    .to('.cap[data-i="2"]', { opacity: 1, y: 0, duration: .4 }, 2.35)
    .to('#furn > *', { opacity: 1, scale: 1, stagger: .12, duration: .5, ease: 'back.out(1.6)' }, 2.35)
    .to('#lamps circle', { opacity: 1, stagger: .1, duration: .3 }, 2.8)
    .to('#glows', { opacity: 1, duration: .6 }, 2.9)
    .to('.cap[data-i="2"]', { opacity: 0, y: -24, duration: .3 }, 3.15)
    .to('.cap[data-i="3"]', { opacity: 1, y: 0, duration: .4 }, 3.35)
    .to(cnt, { v: 3500 * 62, duration: .9, onUpdate: () => { $('sum').textContent = fmt(cnt.v); } }, 3.35)
    .to('#bar', { scaleX: 1, ease: 'none', duration: 4 }, 0)
    .to({}, { duration: .4 });
  $('sum').textContent = '0';

  /* бегущая строка: скорость растёт со скроллом */
  const mq = $('marq'); let x = 0;
  gsap.ticker.add(() => {
    x -= .6 + Math.abs(lenis.velocity) * .35;
    const half = mq.scrollWidth / 2; if (-x >= half) x += half;
    mq.style.transform = `translate3d(${x}px,0,0)`;
  });
})();
