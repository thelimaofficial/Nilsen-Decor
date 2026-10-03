(function () {
  const menu = document.querySelector('[data-menu]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const header = document.querySelector('[data-header]');
  if (!menu || !toggle || !header) return;

  const mobile = window.matchMedia('(max-width: 900px)');
  const icon = (open) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="' +
    (open ? 'M6 6l12 12M18 6 6 18' : 'M4 6h16M4 12h16M4 18h16') + '"/></svg>';

  function setOpen(open, restoreFocus = false) {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    toggle.innerHTML = icon(open);
    if (restoreFocus) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setOpen(open);
    // Navigation precedes the toggle in the DOM. Start at its first link so
    // keyboard users can move through it with Tab, without trapping focus.
    if (open) menu.querySelector('a[href]')?.focus();
  });
  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' && event.shiftKey && event.target === menu.querySelector('a[href]')) {
      event.preventDefault();
      setOpen(false, true);
    }
  });
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false, true);
    }
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setOpen(false);
  });
  header.addEventListener('focusout', (event) => {
    // CSS can hide the focused control before the media-query event runs.
    if (!event.relatedTarget && event.target.getClientRects().length === 0) {
      if (!mobile.matches && event.target === toggle) {
        menu.querySelector('[aria-current="page"]')?.focus();
        return;
      }
      if (mobile.matches && menu.contains(event.target)) {
        setOpen(false, true);
        return;
      }
    }
    if (!header.contains(event.relatedTarget)) setOpen(false);
  });
  mobile.addEventListener('change', () => {
    const focusWillBeHidden = mobile.matches && menu.contains(document.activeElement);
    const toggleHadFocus = document.activeElement === toggle;
    setOpen(false, focusWillBeHidden);
    if (!mobile.matches && toggleHadFocus) menu.querySelector('[aria-current="page"]')?.focus();
  });
  // Only collapse navigation once the enhancement is ready.
  header.classList.add('has-menu');
})();
