// El Remanso — Panel: pestana "Instagram".
//
// Las publicaciones llegan solas desde Instagram (tools/instagram.mjs en
// GitHub Actions -> assets/data/instagram.json). Aqui solo se decide si la
// seccion se muestra, donde, y con que textos (settings/instagram). Se ve
// en el sitio al guardar, sin "Publicar ahora".

import { esc, variante } from './paginas.mjs';

const MINIMO = 4;   // el mismo de assets/js/instagram.js
const RECORTE = 'c_fill,g_center,ar_1:1';
const GUIA = 'docs/instagram.md';
const ACCIONES = 'https://github.com/lauramonsalvearroyave/muebleria-el-remanso/actions/workflows/paginas.yml';

const DEFECTO = {
  active: false,                 // nace APAGADA
  showOnHome: true,
  showOnCategories: true,
  title: { es: 'Síguenos en Instagram', en: 'Follow us on Instagram' },
  text: {
    es: 'Mira lo que estamos tejiendo esta semana y las piezas que ya llegaron a su lugar.',
    en: "See what we're weaving this week and the pieces that have already found their place."
  }
};

let cfg = null;
let feed = null;

const $ = (id) => document.getElementById(id);
const clonar = (o) => JSON.parse(JSON.stringify(o ?? null));

function poner(obj, ruta, valor) {
  const partes = ruta.split('.');
  let o = obj;
  partes.slice(0, -1).forEach(k => { if (o[k] == null || typeof o[k] !== 'object') o[k] = {}; o = o[k]; });
  o[partes[partes.length - 1]] = valor;
}

function obtener(obj, ruta) {
  return ruta.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function campoBi(ruta, nombre, tipo) {
  const uno = (lang) => {
    const r = `${ruta}.${lang}`;
    const id = 'ig-' + r.replace(/\./g, '-');
    const valor = obtener(cfg, r) || '';
    const control = tipo === 'parrafos'
      ? `<textarea id="${id}" data-campo="${r}" rows="3">${esc(valor)}</textarea>`
      : `<input type="text" id="${id}" data-campo="${r}" value="${esc(valor)}">`;
    return `<div class="field"><label for="${id}">${esc(nombre)}<span class="lang-tag">${lang.toUpperCase()}</span></label>${control}</div>`;
  };
  return `<div class="bilingue">${uno('es')}${uno('en')}</div>`;
}

function interruptor(ruta, texto, marcado) {
  return `<label class="switch"><input type="checkbox" data-campo="${ruta}" data-tipo="bool"${marcado ? ' checked' : ''}> ${esc(texto)}</label>`;
}

function fecha(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' });
  } catch { return iso; }
}

// Estado de la conexion con Instagram, en palabras.
function estadoConexion() {
  const posts = (feed && Array.isArray(feed.posts)) ? feed.posts : [];
  if (!feed || feed.motivo === 'sin_conexion') {
    return { tipo: 'falta', html: `<strong>Instagram todavía no está conectado.</strong> Sigue la guía <code>${GUIA}</code> (una sola vez, unos 30 minutos). Mientras tanto la sección no se muestra en el sitio.` };
  }
  if (!feed.ok) {
    return { tipo: 'falta', html: `<strong>La conexión con Instagram está fallando</strong>, así que la sección está oculta en el sitio (se apagó sola). Motivo: <em>${esc(feed.motivo || 'desconocido')}</em>. Si dice que la llave venció, sigue el paso "Reconectar" de <code>${GUIA}</code>.` };
  }
  if (posts.length < MINIMO) {
    return { tipo: 'falta', html: `<strong>Conectado, pero llegaron solo ${posts.length} publicación(es) con foto.</strong> Hacen falta al menos ${MINIMO} para mostrar la sección.` };
  }
  return { tipo: 'ok', html: `<strong>Conectado a Instagram.</strong> ${posts.length} publicaciones (última actualización: ${esc(fecha(feed.actualizado))}). Se renuevan solas cada pocas horas.` };
}

function render() {
  const cont = $('igEditor');
  if (!cont || !cfg) return;
  const conexion = estadoConexion();
  // Con la conexion caida, las fotos guardadas no se muestran: no estan en el sitio.
  const posts = (feed && feed.ok && Array.isArray(feed.posts)) ? feed.posts.slice(0, 8) : [];
  const vistaPrevia = posts.length ? `
    <div class="ig-grid" style="max-width:640px;">
      ${posts.map(p => `<a class="ig-post" href="${esc(p.link)}" target="_blank" rel="noopener"><img src="${esc(variante(p.image, RECORTE + ',w_300,f_auto,q_auto'))}" alt="${esc(p.alt || '')}" loading="lazy"></a>`).join('')}
    </div>` : '';

  cont.innerHTML = `
    <h4 class="form-section" style="margin-top:0; padding-top:0; border-top:none;">Conexión con Instagram</h4>
    <div class="faltantes${conexion.tipo === 'ok' ? ' ok' : ''}">${conexion.html}</div>
    ${vistaPrevia ? `<p class="form-note">Así se ven las últimas publicaciones, ya recortadas en cuadrado al centro:</p>${vistaPrevia}` : ''}
    <p style="margin:14px 0 0;"><a href="${ACCIONES}" target="_blank" rel="noopener" class="btn btn-light btn-sm">Traer las publicaciones ahora (GitHub)</a></p>
    <p class="form-note" style="margin-top:6px;">Solo hace falta si acabas de publicar en Instagram y no quieres esperar: abre GitHub → <strong>Run workflow</strong>.</p>

    <h4 class="form-section">En el sitio</h4>
    <div class="switches">
      ${interruptor('active', 'Sección encendida', cfg.active)}
      ${interruptor('showOnHome', 'Mostrar en el inicio', cfg.showOnHome !== false)}
      ${interruptor('showOnCategories', 'Mostrar en las páginas de categoría', cfg.showOnCategories !== false)}
    </div>
    <p class="form-note">Aunque esté encendida, si la conexión con Instagram falla la sección no se muestra hasta que vuelva a funcionar.</p>

    <h4 class="form-section">Textos</h4>
    ${campoBi('title', 'Título', 'linea')}
    ${campoBi('text', 'Texto', 'parrafos')}

    <div class="editor-acciones">
      <button type="button" id="igGuardar" class="btn btn-primary">Guardar</button>
      <span id="igMsg" class="editor-mensaje" role="status"></span>
    </div>`;
}

function leer() {
  $('igEditor').querySelectorAll('[data-campo]').forEach(el => {
    poner(cfg, el.dataset.campo, el.dataset.tipo === 'bool' ? el.checked : el.value.trim());
  });
}

function mensaje(texto, tipo) {
  const m = $('igMsg');
  if (!m) return;
  m.textContent = texto;
  m.className = 'editor-mensaje' + (tipo ? ' ' + tipo : '');
}

async function guardar() {
  leer();
  if (cfg.active && !cfg.showOnHome && !cfg.showOnCategories) {
    mensaje('Elige dónde se muestra: en el inicio, en las páginas de categoría o en ambos.', 'error');
    return;
  }
  const btn = $('igGuardar');
  btn.disabled = true;
  mensaje('Guardando...');
  try {
    await window.ErFirebase.saveInstagram({
      active: !!cfg.active,
      showOnHome: cfg.showOnHome !== false,
      showOnCategories: cfg.showOnCategories !== false,
      title: cfg.title,
      text: cfg.text
    });
    const visible = cfg.active && feed && feed.ok && (feed.posts || []).length >= MINIMO;
    mensaje(!cfg.active
      ? 'Guardado. La sección está apagada: no se ve en el sitio.'
      : visible
        ? 'Guardado. Ya se ve en el sitio (recarga la página para verlo).'
        : 'Guardado y encendida. Se verá en el sitio cuando la conexión con Instagram funcione.', 'ok');
  } catch (err) {
    mensaje('No se pudo guardar: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
  }
}

async function cargar() {
  const [datos, archivo] = await Promise.all([
    window.ErFirebase.fetchInstagram().catch(err => { console.error(err); return null; }),
    fetch('assets/data/instagram.json', { cache: 'no-cache' }).then(r => (r.ok ? r.json() : null)).catch(() => null)
  ]);
  cfg = { ...clonar(DEFECTO), ...(datos || {}) };
  delete cfg.updatedAt;
  delete cfg.posts;   // de cuando se subian a mano: ya no se usan
  feed = archivo;
  render();
}

function conectar() {
  const cont = $('igEditor');
  if (!cont) return;
  cont.addEventListener('click', (e) => {
    if (e.target.closest('#igGuardar')) guardar();
  });
}

conectar();

window.ErInstagramAdmin = { cargar };
