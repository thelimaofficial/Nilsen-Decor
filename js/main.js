(function () {
  const CONTACTS = {
    mateus: "5511934419189",
    edison: "5511947546194",
  };

  const WHATSAPP_MESSAGE = "Olá! Gostaria de solicitar um orçamento com a Nilsen Decorações em Gesso.";

  const projects = [
    {
      number: "01",
      title: "Local 1",
      category: "Residencial",
      level: "Alto padrão",
      image: "assets/images/projects/project-01.jpg",
      alt: "Fachada residencial de alto padrão com palmeiras",
    },
    {
      number: "02",
      title: "Local 2",
      category: "Residencial",
      level: "Alto padrão",
      image: "assets/images/projects/project-02.jpg",
      alt: "Área gourmet residencial com piscina",
    },
    {
      number: "03",
      title: "Local 3",
      category: "Residencial",
      level: "Alto padrão",
      image: "assets/images/projects/project-03.jpg",
      alt: "Sala integrada com iluminação linear em gesso",
    },
    {
      number: "04",
      title: "Local 4",
      category: "Residencial",
      level: "Alto padrão",
      image: "assets/images/projects/project-04.jpg",
      alt: "Fachada com acabamento em gesso e sinalização da Nilsen",
    },
  ];

  const testimonials = [
    {
      text: "Excelentes profissionais! Cumpriram os prazos, o acabamento ficou impecável e o atendimento foi excepcional do início ao fim da obra.",
      name: "Pessoa 1",
      project: "Projeto Residencial",
    },
    {
      text: "O cuidado nos detalhes fez toda diferença. A equipe conduziu o projeto com organização, limpeza e muita qualidade técnica.",
      name: "Pessoa 1",
      project: "Projeto Residencial",
    },
    {
      text: "Da primeira conversa à entrega, tudo foi tratado com clareza e compromisso. O resultado valorizou muito o ambiente.",
      name: "Pessoa 1",
      project: "Projeto Residencial",
    },
  ];

  function whatsappUrl(contactKey) {
    const phone = CONTACTS[contactKey] || CONTACTS.mateus;
    return `https://wa.me/${phone}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  }

  function initWhatsAppLinks() {
    document.querySelectorAll("[data-whatsapp]").forEach((link) => {
      link.setAttribute("href", whatsappUrl(link.dataset.whatsapp));
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }

  function createProjectCard(project, loading) {
    return `
      <article class="project-card">
        <img src="${project.image}" alt="${project.alt}" width="1284" height="1284" loading="${loading}" />
        <div class="project-card__content">
          <span class="project-card__number">${project.number}</span>
          <h3>${project.title}</h3>
          <p>${project.category} | ${project.level}</p>
        </div>
      </article>
    `;
  }

  function renderProjects() {
    const featured = document.querySelector("[data-featured-project]");
    const grid = document.querySelector("[data-projects-grid]");

    if (featured) {
      featured.innerHTML = createProjectCard(projects[0], "lazy");
    }

    if (grid) {
      grid.innerHTML = projects.slice(1).map((project) => createProjectCard(project, "lazy")).join("");
    }
  }

  function renderTestimonials() {
    const grid = document.querySelector("[data-testimonials-grid]");
    if (!grid) return;

    grid.innerHTML = testimonials
      .map(
        (testimonial) => `
          <article class="testimonial-card">
            <span class="testimonial-card__quote" aria-hidden="true">“</span>
            <p>${testimonial.text}</p>
            <span class="accent-line" aria-hidden="true"></span>
            <strong>${testimonial.name}</strong>
            <span>${testimonial.project}</span>
          </article>
        `
      )
      .join("");
  }

  function initIcons() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderProjects();
    renderTestimonials();
    initWhatsAppLinks();
    window.initMenu?.();
    window.initServicesScroll?.();
    window.initHeroAnimations?.();
    window.initScrollAnimations?.();
    initIcons();
  });

  window.Nilsen = {
    CONTACTS,
    projects,
    testimonials,
  };
})();
