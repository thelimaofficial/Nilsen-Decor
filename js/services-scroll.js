(function () {
  let dispose;
  window.initServicesScroll = function () {
    dispose?.();
    const section = document.querySelector('.services');
    if (!section) return () => {};
    const items = [...section.querySelectorAll('.service-item')];
    const progress = section.querySelector('.services__axis-progress');
    const axis = section.querySelector('.services__axis');
    const lineState = { index: 0 };
    const events = new AbortController();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const original = items.map(item => item.className);
    const descriptions = items.map(item => item.querySelector('.service-item__description'));
    const numbers = items.map(item => item.querySelector('.service-item__number'));
    const dots = items.map(item => item.querySelector('.service-item__dot'));
    const titles = items.map(item => item.querySelector('.service-item__title'));
    const hasGSAP = !!(window.gsap && window.ScrollTrigger);
    const context = hasGSAP ? gsap.context(() => {}, section) : null;
    const mm = hasGSAP ? gsap.matchMedia() : null;
    if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
    let active = 0;
    let transition;
    let trigger;
    let scrollTrack;
    section.classList.add('services--interactive');
    const targets = items.flatMap((item, i) => [item, numbers[i], titles[i], item.querySelector('.service-item__divider'), descriptions[i]]);
    const animatedProperties = 'height,minHeight,fontSize,lineHeight,color,backgroundColor,opacity,display,maxHeight,overflow,transform';
    const snapshot = () => targets.map(element => {
      const style = getComputedStyle(element);
      return { height: style.display === 'none' ? '0px' : style.height,
        minHeight: style.minHeight, fontSize: style.fontSize, lineHeight: style.lineHeight,
        color: style.color, backgroundColor: style.backgroundColor,
        opacity: style.display === 'none' ? 0 : Number(style.opacity),
        ...(element.classList.contains('service-item__description') ? { y: hasGSAP ? gsap.getProperty(element, 'y') : 0 } : {}) };
    });
    function renderLine() {
      // Follow the real dot positions as rows expand; equal percentages would miss them.
      const lower = Math.floor(lineState.index);
      const upper = Math.min(items.length - 1, lower + 1);
      const fraction = lineState.index - lower;
      const a = dots[lower].getBoundingClientRect();
      const b = dots[upper].getBoundingClientRect();
      const bounds = axis.getBoundingClientRect();
      const point = (a.top + a.height / 2) * (1 - fraction) + (b.top + b.height / 2) * fraction;
      const scale = bounds.height ? Math.max(0, Math.min(1, (point - bounds.top) / bounds.height)) : 0;
      progress.style.transform = `scaleY(${scale})`;
    }
    function select(index, animate = true) {
      if (index === active && items[index].getAttribute('aria-expanded') !== null) return;
      // Capture the currently rendered state before interrupting a fast scroll.
      const before = snapshot();
      transition?.kill();
      if (hasGSAP) gsap.set(targets, { clearProps: animatedProperties });
      active = index;
      items.forEach((item, i) => {
        item.classList.toggle('service-item--active', i === index);
        item.classList.toggle('service-item--passed', i < index);
        item.setAttribute('aria-expanded', String(i === index));
        descriptions[i].setAttribute('aria-hidden', String(i !== index));
        dots[i].classList.toggle('is-passed', i <= index);
      });
      if (!hasGSAP || reduced.matches || !animate) {
        lineState.index = index;
        renderLine();
        return;
      }
      const after = snapshot();
      context.add(() => {
        transition = gsap.timeline({ defaults: { duration: 0.35, ease: 'power2.out' },
          onUpdate: renderLine,
          onComplete: () => { gsap.set(targets, { clearProps: animatedProperties }); renderLine(); }
        });
        transition.to(lineState, { index }, 0);
        targets.forEach((element, i) => {
          if (Object.keys(after[i]).every(key => String(before[i][key]) === String(after[i][key]))) return;
          if (element.classList.contains('service-item__description')) {
            gsap.set(element, { display: 'block', maxHeight: 'none', overflow: 'hidden' });
            // Enter below the baseline, leave slightly above it.
            before[i].y = before[i].opacity === 0 ? 10 : before[i].y;
            after[i].y = after[i].opacity === 0 ? -5 : 0;
          }
          transition.fromTo(element, before[i], after[i], 0);
        });
      });
    }
    items.forEach((item, index) => {
      const description = descriptions[index];
      description.id = `service-description-${index}`;
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-controls', description.id);
      item.setAttribute('aria-label', titles[index].textContent.trim());
      function activate() {
        if (reduced.matches) return;
        if (scrollTrack && trigger) {
          window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * ((index + 0.5) / items.length), behavior: 'instant' });
          ScrollTrigger.update();
        }
        select(index);
      }
      item.addEventListener('click', activate, { signal: events.signal });
      item.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); }
        const next = event.key === 'ArrowDown' ? (index + 1) % items.length : event.key === 'ArrowUp' ? (index + items.length - 1) % items.length : null;
        if (next !== null) { event.preventDefault(); items[next].focus(); }
      }, { signal: events.signal });
    });
    select(0, false);
    if (mm) {
      mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
        section.classList.remove('services--reduced');
        let resizeTimer;
        const scrollContext = gsap.context(() => {});
        function setup() {
          transition?.progress(1);
          scrollContext.revert();
          if (scrollTrack) { scrollTrack.replaceWith(section); scrollTrack = null; }
          trigger = null;
          section.style.removeProperty('height');
          // Keep the document height stable when descriptions change.
          const previous = active;
          let height = 0;
          items.forEach((_, i) => { select(i, false); height = Math.max(height, section.getBoundingClientRect().height); });
          select(previous, false);
          const header = document.querySelector('.site-header');
          const headerBottom = header ? header.getBoundingClientRect().bottom + 16 : 0;
          const stickyTop = Math.max(0, headerBottom - parseFloat(getComputedStyle(section).paddingTop));
          const canStick = height <= window.innerHeight - stickyTop;
          const distance = Math.min(1800, window.innerHeight * 2.2);
          if (canStick) {
            // Native sticky stays inside its track, including during reverse scrolling.
            scrollTrack = document.createElement('div');
            scrollTrack.className = 'services-scroll-track';
            scrollTrack.style.height = `${height + distance}px`;
            section.before(scrollTrack);
            scrollTrack.append(section);
          }
          scrollContext.add(() => {
            gsap.set(section, { height });
            if (canStick) gsap.set(section, { position: 'sticky', top: stickyTop });
            // The row transition already smooths the change. A second scrubbed
            // playhead would replay intermediate selections after clicks or fast scrolling.
            const syncSelection = self => select(Math.min(items.length - 1, Math.floor(self.progress * items.length)));
            trigger = ScrollTrigger.create({ trigger: scrollTrack || section,
              start: canStick ? `top ${stickyTop}` : 'top 65%',
              end: canStick ? `+=${distance}` : 'bottom 45%',
              invalidateOnRefresh: true, markers: false,
              onUpdate: syncSelection
            });
            syncSelection(trigger);
          });
        }
        setup();
        const resize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { setup(); ScrollTrigger.refresh(); }, 200); };
        window.addEventListener('resize', resize);
        // Recompute the reserved height when font metrics change.
        let disposed = false;
        document.fonts?.ready.then(() => { if (!disposed) resize(); });
        return () => {
          disposed = true;
          clearTimeout(resizeTimer);
          window.removeEventListener('resize', resize);
          scrollContext.revert();
          if (scrollTrack) { scrollTrack.replaceWith(section); scrollTrack = null; }
          trigger = null;
          section.style.removeProperty('height');
          lineState.index = active;
          renderLine();
        };
      });
    }
    function syncReducedMotion() {
      transition?.progress(1);
      section.classList.toggle('services--reduced', reduced.matches);
      items.forEach((item, i) => {
        if (reduced.matches) {
          ['role', 'tabindex', 'aria-controls', 'aria-label', 'aria-expanded'].forEach(name => item.removeAttribute(name));
          descriptions[i].removeAttribute('aria-hidden');
        } else {
          item.setAttribute('role', 'button');
          item.setAttribute('tabindex', '0');
          item.setAttribute('aria-controls', descriptions[i].id);
          item.setAttribute('aria-label', titles[i].textContent.trim());
          item.setAttribute('aria-expanded', String(i === active));
          descriptions[i].setAttribute('aria-hidden', String(i !== active));
        }
      });
    }
    syncReducedMotion();
    // The unpinned/mobile timeline also needs its line updated after reflow.
    window.addEventListener('resize', renderLine, { signal: events.signal });
    document.fonts?.ready.then(() => { if (!events.signal.aborted) renderLine(); });
    reduced.addEventListener('change', syncReducedMotion, { signal: events.signal });
    dispose = () => {
      events.abort();
      transition?.progress(1);
      mm?.revert();
      context?.revert();
      section.classList.remove('services--interactive', 'services--reduced');
      progress.style.removeProperty('transform');
      items.forEach((item, i) => {
        item.className = original[i];
        ['role', 'tabindex', 'aria-controls', 'aria-label', 'aria-expanded'].forEach(name => item.removeAttribute(name));
        const description = descriptions[i];
        description.removeAttribute('aria-hidden');
        description.removeAttribute('id');
        dots[i].classList.remove('is-passed');
      });
    };
    return dispose;
  };
})();
