(function () {
  function shouldReduceMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initHeroAnimations() {
    if (!window.gsap || shouldReduceMotion()) return;

    const gsap = window.gsap;
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
      .from("[data-header]", { y: -24, opacity: 0, duration: 0.72 })
      .from(".hero__title .title-mask__line > span", { yPercent: 105, duration: 0.75, stagger: 0.09 }, "-=0.28")
      .from(".hero .accent-line", { scaleX: 0, transformOrigin: "left center", duration: 0.45 }, "-=0.22")
      .from(".hero__text", { y: 18, opacity: 0, duration: 0.5 }, "-=0.2")
      .from(".hero__buttons .btn", { y: 18, opacity: 0, duration: 0.45, stagger: 0.08 }, "-=0.12")
      .from(".stat", { y: 18, opacity: 0, duration: 0.48, stagger: 0.08 }, "-=0.1")
      .from(".hero__media", { clipPath: "polygon(35% 0, 100% 0, 100% 100%, 22% 100%)", opacity: 0.75, duration: 0.9 }, "-=0.82");
  }

  function initScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger || shouldReduceMotion()) return;

    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    document.querySelectorAll(".section-title .title-mask__line > span").forEach((line) => {
      if (line.closest(".hero__title")) return;
      gsap.from(line, {
        yPercent: 104,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: line,
          start: "top 88%",
        },
      });
    });

    gsap.utils.toArray(".value-card, .project-card, .testimonial-card").forEach((card, index) => {
      gsap.from(card, {
        y: 24,
        opacity: 0,
        duration: 0.55,
        delay: (index % 4) * 0.035,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
        },
      });
    });

    gsap.utils.toArray(".about__media img, .project-card img").forEach((image) => {
      gsap.fromTo(
        image,
        { yPercent: 3, scale: 1.04 },
        {
          yPercent: -3,
          scale: 1.04,
          ease: "none",
          scrollTrigger: {
            trigger: image,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });
  }

  window.initHeroAnimations = initHeroAnimations;
  window.initScrollAnimations = initScrollAnimations;
})();
