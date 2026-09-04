(function () {
  function initServicesScroll() {
    const section = document.querySelector("[data-services-section]");
    const timeline = document.querySelector("[data-services-timeline]");
    const progress = document.querySelector("[data-services-progress]");
    const items = Array.from(document.querySelectorAll("[data-service-item]"));

    if (!section || !timeline || !items.length) return;

    const setActive = (index) => {
      const safeIndex = Math.max(0, Math.min(items.length - 1, index));
      items.forEach((item, itemIndex) => {
        item.classList.toggle("service-item--active", itemIndex === safeIndex);
        item.setAttribute("aria-expanded", itemIndex === safeIndex ? "true" : "false");
      });

      if (progress) {
        const value = items.length === 1 ? 100 : (safeIndex / (items.length - 1)) * 100;
        progress.style.height = `${value}%`;
      }
    };

    items.forEach((item, index) => {
      item.addEventListener("click", () => setActive(index));
    });

    setActive(0);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canPin = window.matchMedia("(min-width: 901px)").matches;

    if (!window.gsap || !window.ScrollTrigger || reducedMotion || !canPin) return;

    window.gsap.registerPlugin(window.ScrollTrigger);

    window.ScrollTrigger.create({
      trigger: section,
      start: "top top+=96",
      end: () => `+=${Math.max(760, Math.round(window.innerHeight * 1.15))}`,
      pin: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const index = Math.min(items.length - 1, Math.floor(self.progress * items.length));
        setActive(index);
        if (progress) {
          progress.style.height = `${self.progress * 100}%`;
        }
      },
    });
  }

  window.initServicesScroll = initServicesScroll;
})();
