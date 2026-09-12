(function () {
  let dispose;
  window.initServicesScroll = function () {
    dispose?.();
    const section = document.querySelector('.services');
    if (!section) return () => {};

    const items = [...section.querySelectorAll('.service-item')];
    const progress = section.querySelector('.services__axis-progress');
    const axis = section.querySelector('.services__axis');
    const descriptions = items.map(item => item.querySelector('.service-item__description'));
    const titles = items.map(item => item.querySelector('.service-item__title'));
    const dots = items.map(item => item.querySelector('.service-item__dot'));
    const events = new AbortController();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const original = items.map(item => item.className);
    const hasGSAP = !!(window.gsap && window.ScrollTrigger);
    const mm = hasGSAP ? gsap.matchMedia() : null;

    let active = 0;
    let trigger = null;
    const scrollCompletion = 0.85;
    section.classList.add('services--interactive');

    function renderLine(targetIndex = active) {
      if (!dots.length || !axis || !progress) return;
      const clampedIndex = Math.max(0, Math.min(items.length - 1, targetIndex));
      const dot = dots[clampedIndex];
      const axisRect = axis.getBoundingClientRect();
      const dotRect = dot.getBoundingClientRect();
      if (!axisRect.height) return;
      const point = dotRect.top + dotRect.height / 2;
      const scale = Math.max(0, Math.min(1, (point - axisRect.top) / axisRect.height));
      axis.style.setProperty('--service-progress', `${scale * 100}%`);
    }

    function renderLineInterpolated(lowerIndex, fraction) {
      if (!dots.length || !axis || !progress) return;
      const lower = Math.max(0, Math.min(items.length - 1, lowerIndex));
      const upper = Math.min(items.length - 1, lower + 1);
      const dotA = dots[lower].getBoundingClientRect();
      const dotB = dots[upper].getBoundingClientRect();
      const axisRect = axis.getBoundingClientRect();
      if (!axisRect.height) return;
      const pointA = dotA.top + dotA.height / 2;
      const pointB = dotB.top + dotB.height / 2;
      const point = pointA * (1 - fraction) + pointB * fraction;
      const scale = Math.max(0, Math.min(1, (point - axisRect.top) / axisRect.height));
      axis.style.setProperty('--service-progress', `${scale * 100}%`);
    }

    function select(index) {
      if (index < 0 || index >= items.length) return;
      active = index;
      items.forEach((item, i) => {
        const isActive = i === index;
        item.classList.toggle('service-item--active', isActive);
        item.classList.toggle('service-item--passed', i < index);
        item.setAttribute('aria-expanded', String(isActive));
        descriptions[i].setAttribute('aria-hidden', String(!isActive));
        dots[i].classList.toggle('is-passed', i <= index);
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
        if (trigger) {
          const targetP = index * scrollCompletion / Math.max(1, items.length - 1);
          const targetScroll = trigger.start + (trigger.end - trigger.start) * targetP;
          // Round forward so pixel rounding cannot leave the previous item selected.
          window.scrollTo({ top: Math.ceil(targetScroll), behavior: 'smooth' });
        } else {
          select(index);
          renderLine(index);
        }
      }

      item.addEventListener('click', activate, { signal: events.signal });
      item.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          activate();
        }
        const next = event.key === 'ArrowDown'
          ? (index + 1) % items.length
          : event.key === 'ArrowUp'
            ? (index + items.length - 1) % items.length
            : null;
        if (next !== null) {
          event.preventDefault();
          items[next].focus();
        }
      }, { signal: events.signal });
    });

    select(0);
    renderLine(0);

    function getHeaderOffset() {
      const header = document.querySelector('.site-header');
      return header ? Math.round(header.getBoundingClientRect().bottom + 12) : 90;
    }

    function syncProgress(self) {
      const lineProgress = Math.min(items.length - 1,
        (self.progress / scrollCompletion) * (items.length - 1));
      const lower = Math.min(items.length - 1, Math.floor(lineProgress + 1e-9));
      if (lower !== active) select(lower);
      // Measure after selecting: the expanded item changes the dot positions.
      renderLineInterpolated(lower, Math.max(0, lineProgress - lower));
    }

    if (mm) {
      mm.add('(min-width: 901px) and (prefers-reduced-motion: no-preference)', () => {
        section.classList.remove('services--reduced');
        // Native sticky stays inside this track on refresh and reverse scrolling.
        const track = document.createElement('div');
        track.className = 'services-scroll-track';
        section.before(track);
        track.append(section);
        const getDistance = () => Math.round(Math.min(1400, Math.max(850, window.innerHeight * 1.35)));
        const measureTrack = () => {
          track.style.setProperty('--services-sticky-top', `${getHeaderOffset()}px`);
          track.style.height = `${section.getBoundingClientRect().height + getDistance()}px`;
        };
        measureTrack();
        ScrollTrigger.addEventListener('refreshInit', measureTrack);
        trigger = ScrollTrigger.create({
          trigger: track,
          start: () => `top ${getHeaderOffset()}px`,
          end: () => `+=${getDistance()}`,
          invalidateOnRefresh: true,
          onUpdate: syncProgress,
          onRefresh: syncProgress
        });

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', measureTrack);
          trigger?.kill();
          trigger = null;
          track.replaceWith(section);
          renderLine(active);
        };
      });
    }

    // Follow row transitions on desktop and mobile, even after scrolling stops.
    const observer = new ResizeObserver(() => {
      if (trigger) syncProgress(trigger);
      else renderLine(active);
    });
    items.forEach(item => observer.observe(item));

    function syncReducedMotion() {
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
    reduced.addEventListener('change', syncReducedMotion, { signal: events.signal });

    dispose = () => {
      events.abort();
      observer.disconnect();
      trigger?.kill();
      mm?.revert();
      section.classList.remove('services--interactive', 'services--reduced');
      axis.style.removeProperty('--service-progress');
      items.forEach((item, i) => {
        item.className = original[i];
        ['role', 'tabindex', 'aria-controls', 'aria-label', 'aria-expanded'].forEach(name => item.removeAttribute(name));
        descriptions[i].removeAttribute('aria-hidden');
        descriptions[i].removeAttribute('id');
        dots[i].classList.remove('is-passed');
      });
    };
    return dispose;
  };
})();
