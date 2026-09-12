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
    if (window.ScrollTrigger) {
      let refreshFrame;
      const beginRefresh = () => {
        cancelAnimationFrame(refreshFrame);
        document.documentElement.classList.add('is-refreshing-motion');
      };
      const endRefresh = () => {
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => {
          refreshFrame = requestAnimationFrame(() => {
            document.documentElement.classList.remove('is-refreshing-motion');
          });
        });
      };
      ScrollTrigger.addEventListener('refreshInit', beginRefresh);
      ScrollTrigger.addEventListener('refresh', endRefresh);
      cleanup.push(() => {
        cancelAnimationFrame(refreshFrame);
        ScrollTrigger.removeEventListener('refreshInit', beginRefresh);
        ScrollTrigger.removeEventListener('refresh', endRefresh);
        document.documentElement.classList.remove('is-refreshing-motion');
      });
    }
    try {
      cleanup.push(window.initServicesScroll?.());
      cleanup.push(window.initAnimations?.());
    } catch (error) {
      window.NilsenMotion.destroy();
      console.error('Não foi possível iniciar as animações.', error);
    }
    // Let scrolling/rendering settle before measuring newly loaded assets.
    const refresh = () => { if (!destroyed) window.ScrollTrigger?.refresh(true); };
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
