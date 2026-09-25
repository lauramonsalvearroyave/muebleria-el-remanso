// El Remanso — comportamiento compartido del sitio

const DEFAULT_WHATSAPP_NUMBER = '573104599629';

// El número de WhatsApp se puede cambiar desde el panel admin (pestaña
// "Ajustes") sin tocar el código. Mientras carga, se usa el número por
// defecto en los enlaces ya escritos en el HTML.
function initWhatsappNumber() {
  window.ErWhatsappNumber = DEFAULT_WHATSAPP_NUMBER;
  const waitForFirebase = setInterval(() => {
    if (!window.ErFirebase) return;
    clearInterval(waitForFirebase);
    window.ErFirebase.getWhatsappNumber().then(number => {
      window.ErWhatsappNumber = number;
      document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a => {
        const url = new URL(a.href);
        url.pathname = '/' + number;
        a.href = url.toString();
      });
    });
  }, 50);
}

document.addEventListener('DOMContentLoaded', () => {
  initWhatsappNumber();

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

  // El filtro del catálogo lo maneja assets/js/catalog-render.js (los
  // productos se dibujan después de leer Firestore, así que el filtro
  // se conecta ahí, no aquí).

  // Botón "volver arriba": aparece tras bajar un poco y sube con scroll suave
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 480);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      window.open(`https://wa.me/${window.ErWhatsappNumber || DEFAULT_WHATSAPP_NUMBER}?text=${msg}`, '_blank');

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

// ---------- Comentarios de clientes (contacto.html#comentario) ----------
// Entra sin publicar: alguien del equipo lo aprueba en el panel antes de
// que aparezca en el inicio. El campo "stage" dice en que quedo la venta.

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('opinionForm');
  if (!form) return;

  const msg = document.getElementById('opinionMsg');
  const btn = document.getElementById('opinionBtn');
  const t = (k) => (window.ErI18n ? window.ErI18n.t(k) : k);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!window.ErFirebase) return;

    const data = {
      name: document.getElementById('o-nombre').value.trim(),
      city: document.getElementById('o-ciudad').value.trim(),
      stage: document.getElementById('o-etapa').value,
      piece: document.getElementById('o-pieza').value.trim(),
      quote: document.getElementById('o-mensaje').value.trim(),
      consent: true,
      order: 0
    };

    msg.textContent = '';
    msg.className = 'form-msg';
    btn.disabled = true;

    try {
      await window.ErFirebase.submitTestimonial(data);
      window.ErFirebase.track('submit_testimonial', { stage: data.stage });
      form.reset();
      msg.textContent = t('opinion.sent');
      msg.className = 'form-msg ok';
    } catch (err) {
      console.error('No se pudo enviar el comentario:', err);
      msg.textContent = t('opinion.error');
      msg.className = 'form-msg error';
    } finally {
      btn.disabled = false;
    }
  });
});
