// El Remanso — comportamiento compartido del sitio
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // Filtro del catálogo: muestra/oculta la SECCIÓN de categoría completa
  // (antes solo ocultaba las tarjetas y el encabezado de la categoría quedaba
  // visible igual, lo que hacía parecer que el filtro no hacía nada)
  const chips = document.querySelectorAll('.filter-chip');
  const blocks = document.querySelectorAll('.category-block[data-category]');
  if (chips.length && blocks.length) {
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const category = chip.dataset.filter;
        blocks.forEach(block => {
          const match = category === 'todos' || block.dataset.category === category;
          block.style.display = match ? '' : 'none';
        });
      });
    });
  }

  // Formulario de contacto -> abre WhatsApp con el mensaje ya redactado
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = window.ErI18n.t;
      const nombre = document.getElementById('c-nombre').value.trim();
      const telefono = document.getElementById('c-telefono').value.trim();
      const mensaje = document.getElementById('c-mensaje').value.trim();
      const lines = [
        t('contact.wa_greeting'),
        `${t('contact.field_name')}: ${nombre}`,
        `${t('contact.field_phone')}: ${telefono}`,
        `${t('contact.field_message')}: ${mensaje}`,
        t('interest.wa_consent')
      ];
      const msg = encodeURIComponent(lines.join('\n'));
      window.open(`https://wa.me/573104599629?text=${msg}`, '_blank');

      if (window.ErFirebase) {
        window.ErFirebase.saveLead({
          source: 'contacto',
          name: nombre,
          phone: telefono,
          message: mensaje,
          consent: true
        });
        window.ErFirebase.track('generate_lead', { method: 'contacto' });
      }

      contactForm.reset();
    });
  }
});
