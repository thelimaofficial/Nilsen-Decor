(function () {
  function init() {
    window.NilsenMotion?.destroy();
    const cleanup = [];
    const events = new AbortController();
    let destroyed = false;
    window.NilsenMotion = { destroy() {
      destroyed = true;
      events.abort();
      cleanup.reverse().forEach(fn => fn?.());
    } };
    if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    try {
      cleanup.push(window.initServicesScroll?.());
      cleanup.push(window.initAnimations?.());
    } catch (error) {
      window.NilsenMotion.destroy();
      console.error('Não foi possível iniciar as animações.', error);
    }
    const refresh = () => { if (!destroyed) window.ScrollTrigger?.refresh(); };
    window.addEventListener('load', refresh, { once: true, signal: events.signal });
    document.querySelectorAll('img').forEach(img => {
      if (!img.complete) img.addEventListener('load', refresh, { once: true, signal: events.signal });
    });
    document.fonts?.ready.then(refresh);
    refresh();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
  window.addEventListener('pagehide', () => window.NilsenMotion?.destroy());
  window.addEventListener('pageshow', event => { if (event.persisted) init(); });
})();
