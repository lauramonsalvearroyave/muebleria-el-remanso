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

// Envia un evento a Google (GA4 y, si esta configurada, la etiqueta de Ads).
// Si el modulo de Firebase aun no termino de cargar, se va directo por gtag,
// que existe desde el primer instante: un clic temprano no se pierde.
function medir(evento, params) {
  if (window.ErFirebase) window.ErFirebase.track(evento, params);
  else if (typeof window.gtag === 'function') window.gtag('event', evento, params || {});
}
window.ErMedir = medir;

function paginaDeOrigen() {
  return location.pathname || '/';
}

// ---------- Menu y pie, desde las paginas encendidas ----------
// assets/data/paginas.js (lo escribe el generador) trae las paginas
// publicadas. Las de categoria van como submenu de "Catalogo"; las demas,
// sueltas antes de "Contacto". Se arma apenas carga este script, antes de
// que i18n.js traduzca, para que lo nuevo tambien quede en el idioma elegido.

function escHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function enlacePagina(p, actual) {
  const es = (p.menu && p.menu.es) || p.slug;
  const en = p.menu && p.menu.en && p.menu.en !== es ? ` data-en="${escHtml(escHtml(p.menu.en))}"` : '';
  const activo = actual === '/' + p.slug ? ' class="active" aria-current="page"' : '';
  return `<a href="/${escHtml(p.slug)}"${activo}${en}>${escHtml(es)}</a>`;
}

function construirMenuYPie() {
  const datos = window.ER_PAGINAS;
  if (!datos || !Array.isArray(datos.publicadas) || !datos.publicadas.length) return;

  const paginas = datos.publicadas.slice().sort((a, b) => (a.orden || 0) - (b.orden || 0));
  const actual = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';

  const lista = document.querySelector('.main-nav > ul');
  const enMenu = paginas.filter(p => p.enMenu);
  if (lista && enMenu.length) {
    const categorias = enMenu.filter(p => p.tipo === 'categoria');
    const otras = enMenu.filter(p => p.tipo !== 'categoria');

    const liCatalogo = lista.querySelector('a[href="/catalogo"]')?.closest('li');
    if (liCatalogo && categorias.length) {
      liCatalogo.classList.add('has-submenu');
      liCatalogo.insertAdjacentHTML('beforeend', `
        <button class="submenu-toggle" type="button" aria-expanded="false" data-i18n-aria="nav.open_submenu" aria-label="Ver las categorías del catálogo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <ul class="submenu">${categorias.map(p => `<li>${enlacePagina(p, actual)}</li>`).join('')}</ul>`);
      const boton = liCatalogo.querySelector('.submenu-toggle');
      const cerrar = () => { liCatalogo.classList.remove('open'); boton.setAttribute('aria-expanded', 'false'); };
      boton.addEventListener('click', (e) => {
        e.stopPropagation();
        const abierto = liCatalogo.classList.toggle('open');
        boton.setAttribute('aria-expanded', String(abierto));
      });
      document.addEventListener('click', (e) => { if (!liCatalogo.contains(e.target)) cerrar(); });
      liCatalogo.addEventListener('keydown', (e) => { if (e.key === 'Escape') { cerrar(); boton.focus(); } });
    }

    const liContacto = lista.querySelector('a[href="/contacto"]')?.closest('li') || null;
    otras.forEach(p => {
      const li = document.createElement('li');
      li.innerHTML = enlacePagina(p, actual);
      lista.insertBefore(li, liContacto);
    });
    if (otras.length >= 2) document.documentElement.classList.add('menu-amplio');
  }

  const grid = document.querySelector('.site-footer .footer-grid');
  const enPie = paginas.filter(p => p.enPie);
  if (grid && enPie.length) {
    const col = document.createElement('div');
    col.className = 'footer-paginas';
    col.innerHTML = `<h4 data-i18n="footer.explore_title">Explora</h4>
      <ul>${enPie.map(p => `<li>${enlacePagina(p, '')}</li>`).join('')}</ul>`;
    grid.insertBefore(col, grid.children[1] || null);
    grid.classList.add('con-paginas');
  }
}

construirMenuYPie();

// GA4 ya registra los clics salientes, pero todos juntos y sin distinguir
// cual boton fue: WhatsApp, Instagram y la SIC caen en el mismo saco. Aqui
// se manda un evento propio con el origen, que es lo que permite saber si
// convierte mas el hero, el catalogo o el boton flotante.
function origenDelBoton(a) {
  if (a.classList.contains('wa-float')) return 'flotante';
  if (a.closest('.site-footer')) return 'pie';
  if (a.closest('.hero')) return 'hero';
  if (a.closest('.modal-box')) return 'modal_interes';
  const seccion = a.closest('section');
  if (seccion && seccion.id) return seccion.id;
  // Ultimo recurso: la pagina donde esta.
  return (location.pathname.split('/').pop() || 'inicio').replace('.html', '');
}

function medirWhatsapp() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="https://wa.me/"]');
    if (!a) return;
    const origen = origenDelBoton(a);
    medir('contacto_whatsapp', {
      origen,
      // Con las URLs limpias, la raiz deja la parte final vacia.
      pagina: (location.pathname.split('/').pop() || 'inicio')
    });
    // El evento que se importa como conversion en Google Ads: uno solo para
    // cualquier camino a WhatsApp (enlace, "Me interesa" o formulario).
    medir('clic_whatsapp', { pagina_origen: paginaDeOrigen(), origen });
  });
}

// Clics hacia Instagram. Van SOLO a GA4 (send_to): aunque en Ajustes se
// agregue la etiqueta de Google Ads, este evento no le llega a Ads. La
// conversion de las campanas es WhatsApp, no Instagram.
const GA4_ID = 'G-3PKHJ3M6CF';

function origenInstagram(a) {
  if (a.closest('.site-header')) return 'encabezado';
  if (a.closest('.site-footer')) return 'pie';
  if (a.classList.contains('ig-post')) return 'publicacion';
  if (a.classList.contains('ig-mas')) return 'boton_ver_mas';
  const seccion = a.closest('section');
  return (seccion && seccion.id) || 'contenido';
}

function medirInstagram() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="instagram.com"]');
    if (!a) return;
    medir('clic_instagram', {
      pagina_origen: paginaDeOrigen(),
      origen: origenInstagram(a),
      send_to: GA4_ID
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initWhatsappNumber();
  medirWhatsapp();
  medirInstagram();

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
      medir('clic_whatsapp', { pagina_origen: paginaDeOrigen(), origen: 'formulario_contacto' });

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
