(function () {
  function setMenuIcon(toggle, isOpen) {
    toggle.innerHTML = `<span data-lucide="${isOpen ? "x" : "menu"}" aria-hidden="true"></span>`;
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function initMenu() {
    const header = document.querySelector("[data-header]");
    const menu = document.querySelector("[data-menu]");
    const toggle = document.querySelector("[data-menu-toggle]");

    if (!header || !menu || !toggle) return;

    const closeMenu = () => {
      menu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menu");
      setMenuIcon(toggle, false);
    };

    const openMenu = () => {
      menu.classList.add("is-open");
      document.body.classList.add("menu-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Fechar menu");
      setMenuIcon(toggle, true);
    };

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.contains("is-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    const updateHeader = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  window.initMenu = initMenu;
})();
