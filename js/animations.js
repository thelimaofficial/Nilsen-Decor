(function () {
  let dispose;
  window.initAnimations = function () {
    dispose?.();
    if (!window.gsap || !window.ScrollTrigger) return () => {};
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', (context) => {
      const events = new AbortController();
      const counters = [];
      const reveal = (trigger) => gsap.timeline({
        defaults: { duration: 0.45, ease: 'power3.out' },
        scrollTrigger: { trigger, start: 'top 88%', once: true, markers: false }
      });
      function title(timeline, selector, at = 0) {
        const lines = gsap.utils.toArray(`${selector} .title-mask__line`);
        gsap.set(lines, { overflow: 'hidden' });
        timeline.from(`${selector} .title-mask__line > span`, {
          yPercent: 100, opacity: 0, duration: 0.55, stagger: 0.07, ease: 'power4.out'
        }, at);
      }
      function initHeaderAnimation(timeline) {
        // Animate the inner box, preserving the header's CSS centering transform.
        const header = document.querySelector('.site-header');
        timeline.from('.site-header__inner', { opacity: 0, y: -10, duration: 0.45 });
        ScrollTrigger.create({ start: 24, end: 'max', markers: false,
          onToggle: self => header.classList.toggle('header--scrolled', self.isActive)
        });
      }
      function initHeroAnimation() {
        const timeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.45 } }).timeScale(1.5);
        initHeaderAnimation(timeline);
        title(timeline, '.hero', 0.35);
        timeline.from('.hero__text', { opacity: 0, y: 20 }, 1.25)
          .from('.hero__buttons .btn', { opacity: 0, y: 15, stagger: 0.1 }, 1.55)
          .from('.hero__stats .stat', { opacity: 0, y: 12, stagger: 0.1 }, 1.9);
        document.querySelectorAll('.stat strong').forEach(element => {
          const node = [...element.childNodes].find(node => node.nodeType === 3 && /\d/.test(node.textContent));
          if (!node) return;
          const original = node.textContent;
          const value = { count: 0 };
          counters.push(() => { node.textContent = original; });
          timeline.to(value, { count: Number(original.trim()), duration: 1.2,
            onUpdate: () => {
              const text = String(Math.round(value.count));
              if (node.textContent !== text) node.textContent = text;
            }
          }, 2);
        });
        // The diagonal clip stays on the parent; the reveal only clips its image.
        timeline.fromTo('.hero__media img', { clipPath: 'inset(0 0 0 100%)' },
          { clipPath: 'inset(0 0 0 0%)', duration: 0.9, clearProps: 'clipPath' }, 1.85);
        if (window.scrollY > 80 || location.hash) timeline.progress(1);
      }
      function initAboutAnimation() {
        const timeline = reveal('.about');
        title(timeline, '.about');
        timeline.from('.about__content p, .about__content .btn', { opacity: 0, y: 20, stagger: 0.1 }, 0.3)
          .from('.about__photo', { opacity: 0, duration: 0.55 }, 0.2)
          .from('.quote-card', { opacity: 0, y: 12 }, 0.45);
      }
      function initValuesAnimation() {
        reveal('.values').from('.value-card', { opacity: 0, y: 16, stagger: 0.07 });
      }
      function initProjectsAnimation() {
        title(reveal('.projects__header'), '.projects');
        reveal('.projects__featured')
          .from('.projects__featured img', { opacity: 0, duration: 0.55 })
          .from('.projects__featured .project-card__content', { opacity: 0, y: 20 }, '-=0.25');
        reveal('.projects__grid').from('.projects__grid .project-card', { opacity: 0, y: 16, stagger: 0.08 });
      }
      function initTestimonialsAnimation() {
        reveal('.testimonials').from('.testimonial-card', { opacity: 0, y: 12, stagger: 0.08 });
      }
      function initCTAAnimation() {
        reveal('.final-cta').from('.final-cta__inner', { opacity: 0, y: 12 })
          .from('.final-cta h2', { opacity: 0, y: 8 }, 0.15)
          .from('.final-cta p', { opacity: 0 }, 0.25)
          .from('.final-cta .btn', { opacity: 0 }, 0.35);
      }
      initHeroAnimation();
      const servicesIntro = reveal('.services__intro');
      title(servicesIntro, '.services__intro');
      servicesIntro.from('.services__intro p, .services__intro .btn', { opacity: 0, y: 15, stagger: 0.1 }, 0.4);
      initAboutAnimation();
      initValuesAnimation();
      initProjectsAnimation();
      initTestimonialsAnimation();
      initCTAAnimation();
      reveal('.site-footer__main').from('.site-footer__main > *', { opacity: 0, y: 15, stagger: 0.08 });
      // Keep the bottom bar visible: its reveal threshold may exceed the page's maximum scroll.
      // Keyboard focus completes the associated reveal immediately.
      document.addEventListener('focusin', event => {
        ScrollTrigger.getAll().forEach(trigger => {
          if (trigger.animation && trigger.vars.once && trigger.trigger?.contains(event.target)) trigger.animation.progress(1);
        });
      }, { signal: events.signal });
      return () => {
        events.abort();
        counters.forEach(restore => restore());
        document.querySelector('.site-header')?.classList.remove('header--scrolled');
      };
    });
    dispose = () => mm.revert();
    return dispose;
  };
})();
