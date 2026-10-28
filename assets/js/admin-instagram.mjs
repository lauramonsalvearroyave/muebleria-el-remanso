// El Remanso — Panel: pestana "Instagram".
//
// Edita settings/instagram, que lee assets/js/instagram.js en el sitio. Se
// guarda y se ve al instante: no pasa por el generador de paginas.
// Usa de admin.js: subirACloudinary.

import { esc, variante } from './paginas.mjs';

const MIN_POSTS = 6;
const MAX_POSTS = 8;
// El mismo recorte que usa el sitio (assets/js/instagram.js): cuadrado, centrado.
const RECORTE = 'c_fill,g_center,ar_1:1';

const DEFECTO = {
  active: false,                 // nace APAGADA
  showOnHome: true,
  showOnCategories: true,
  title: { es: 'Síguenos en Instagram', en: 'Follow us on Instagram' },
  text: {
    es: 'Mira lo que estamos tejiendo esta semana y las piezas que ya llegaron a su lugar.',
    en: "See what we're weaving this week and the pieces that have already found their place."
  },
  posts: []
};

let cfg = null;
let guardada = null;   // como esta en Firestore (para saber si estaba encendida)
let subiendo = false;

const $ = (id) => document.getElementById(id);
const clonar = (o) => JSON.parse(JSON.stringify(o ?? null));

function poner(obj, ruta, valor) {
  const partes = ruta.split('.');
  let o = obj;
  partes.slice(0, -1).forEach((k, i) => {
    if (o[k] == null || typeof o[k] !== 'object') o[k] = /^\d+$/.test(partes[i + 1]) ? [] : {};
    o = o[k];
  });
  o[partes[partes.length - 1]] = valor;
}

function obtener(obj, ruta) {
  return ruta.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function recortar(v) {
  if (typeof v === 'string') return v.trim();
  if (Array.isArray(v)) return v.map(recortar);
  if (v && typeof v === 'object') {
    const r = {};
    Object.keys(v).forEach(k => { r[k] = recortar(v[k]); });
    return r;
  }
  return v;
}

function esEnlaceInstagram(url) {
  return /^https:\/\/(www\.)?instagram\.com\/\S+/i.test(String(url || '').trim());
}

// Lo que impide encender la seccion. Vacio = se puede encender.
function problemas(c) {
  const p = [];
  const posts = c.posts || [];
  if (posts.length < MIN_POSTS) p.push(`Al menos ${MIN_POSTS} publicaciones (hay ${posts.length}).`);
  posts.forEach((post, i) => {
    const falta = [];
    if (!post.image) falta.push('la imagen');
    if (!esEnlaceInstagram(post.link)) falta.push('un enlace de Instagram válido (https://www.instagram.com/...)');
    if (!String((post.alt && post.alt.es) || '').trim()) falta.push('el texto alternativo en español');
    if (falta.length) p.push(`Publicación ${i + 1}: falta ${falta.join(', ')}.`);
  });
  if (!c.showOnHome && !c.showOnCategories) p.push('Elegir dónde se muestra: en el inicio, en las páginas de categoría o en ambos.');
  return p;
}

// ---------- Formulario ----------

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

function interruptor(ruta, texto, marcado, id) {
  return `<label class="switch"><input type="checkbox"${id ? ` id="${id}"` : ''} data-campo="${ruta}" data-tipo="bool"${marcado ? ' checked' : ''}> ${esc(texto)}</label>`;
}

function filaPublicacion(post, i, total) {
  const original = post.image ? variante(post.image, 'w_240,c_limit,f_auto,q_auto') : '';
  const cuadrada = post.image ? variante(post.image, `${RECORTE},w_240,f_auto,q_auto`) : '';
  const idLink = `ig-posts-${i}-link`;
  return `
    <div class="ig-fila">
      <div class="ig-previas">
        <figure class="ig-previa"><div class="marco">${original ? `<img src="${esc(original)}" alt="">` : ''}</div><figcaption>Original</figcaption></figure>
        <figure class="ig-previa"><div class="marco cuadrado">${cuadrada ? `<img src="${esc(cuadrada)}" alt="">` : ''}</div><figcaption><strong>Así se verá</strong></figcaption></figure>
      </div>
      <div class="ig-campos">
        <div class="field">
          <label for="${idLink}">Enlace a la publicación ${i + 1}</label>
          <input type="url" id="${idLink}" data-campo="posts.${i}.link" value="${esc(post.link || '')}" placeholder="https://www.instagram.com/p/..." spellcheck="false">
        </div>
        ${campoBi(`posts.${i}.alt`, 'Texto alternativo (qué se ve en la foto)', 'linea')}
        <div class="step-actions" style="gap:6px;">
          <button type="button" class="btn btn-light btn-sm" data-mover="-1" data-i="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Subir publicación ${i + 1}">↑ Subir</button>
          <button type="button" class="btn btn-light btn-sm" data-mover="1" data-i="${i}" ${i === total - 1 ? 'disabled' : ''} aria-label="Bajar publicación ${i + 1}">↓ Bajar</button>
          <button type="button" class="btn btn-light btn-sm" data-quitar="${i}">Quitar</button>
        </div>
      </div>
    </div>`;
}

function render() {
  const cont = $('igEditor');
  if (!cont || !cfg) return;
  const posts = cfg.posts || [];
  cont.innerHTML = `
    <div id="igEstado"></div>

    <h4 class="form-section" style="margin-top:0; padding-top:0; border-top:none;">Estado</h4>
    <div class="switches">
      ${interruptor('active', 'Sección encendida', cfg.active, 'igActiva')}
      ${interruptor('showOnHome', 'Mostrar en el inicio', cfg.showOnHome !== false)}
      ${interruptor('showOnCategories', 'Mostrar en las páginas de categoría', cfg.showOnCategories !== false)}
    </div>

    <h4 class="form-section">Textos</h4>
    ${campoBi('title', 'Título', 'linea')}
    ${campoBi('text', 'Texto', 'parrafos')}

    <h4 class="form-section">Publicaciones (${posts.length} de ${MAX_POSTS})</h4>
    <p class="form-note">El orden de aquí es el orden en el sitio. Cada imagen enlaza a su publicación.</p>
    ${posts.length < MAX_POSTS ? `
    <div class="upload-row">
      <label for="igArchivos" class="btn btn-primary btn-sm">Agregar imágenes</label>
      <input type="file" id="igArchivos" accept="image/*" multiple hidden>
      <span id="igSubida" class="upload-status"></span>
    </div>` : '<p class="form-note">Ya están las 8. Quita una para agregar otra.</p>'}
    ${posts.map((p, i) => filaPublicacion(p, i, posts.length)).join('') || '<p class="foto-galeria-vacia">Todavía no hay publicaciones.</p>'}

    <div class="editor-acciones">
      <button type="button" id="igGuardar" class="btn btn-primary">Guardar</button>
      <span id="igMsg" class="editor-mensaje" role="status"></span>
    </div>`;
  actualizarEstado();
}

function leer() {
  const cont = $('igEditor');
  if (!cont || !cfg) return;
  cont.querySelectorAll('[data-campo]').forEach(el => {
    poner(cfg, el.dataset.campo, el.dataset.tipo === 'bool' ? el.checked : el.value);
  });
}

function actualizarEstado() {
  leer();
  const p = problemas(cfg);
  const caja = $('igEstado');
  if (!caja) return;
  if (cfg.active) {
    caja.innerHTML = '<div class="faltantes ok"><strong>Encendida:</strong> se muestra en el sitio.</div>';
  } else if (p.length) {
    caja.innerHTML = `<div class="faltantes"><strong>Apagada. Para poder encenderla falta:</strong><ul>${p.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
  } else {
    caja.innerHTML = '<div class="faltantes ok"><strong>Apagada, pero lista:</strong> ya se puede encender.</div>';
  }
}

function mensaje(texto, tipo) {
  const m = $('igMsg');
  if (!m) return;
  m.textContent = texto;
  m.className = 'editor-mensaje' + (tipo ? ' ' + tipo : '');
}

async function subir(input) {
  const archivos = Array.from(input.files || []);
  if (!archivos.length) return;
  leer();
  const cupo = MAX_POSTS - (cfg.posts || []).length;
  const tomados = archivos.slice(0, cupo);
  subiendo = true;
  $('igGuardar').disabled = true;
  const fallos = [];
  for (let i = 0; i < tomados.length; i++) {
    $('igSubida').textContent = `Subiendo ${i + 1} de ${tomados.length}...`;
    try {
      const url = await subirACloudinary(tomados[i]);
      cfg.posts.push({ image: url, link: '', alt: { es: '', en: '' } });
    } catch (err) {
      console.error('Fallo la subida:', err);
      fallos.push(tomados[i].name);
    }
  }
  subiendo = false;
  render();
  const aviso = [];
  if (fallos.length) aviso.push(`No se pudieron subir: ${fallos.join(', ')}.`);
  if (archivos.length > cupo) aviso.push(`Solo caben ${MAX_POSTS}: se omitieron ${archivos.length - cupo}.`);
  mensaje(aviso.length ? aviso.join(' ') : 'Imágenes agregadas. Revisa cómo quedan recortadas, completa enlace y texto, y guarda.', aviso.length ? 'error' : '');
}

async function guardar() {
  if (subiendo) { mensaje('Espera a que terminen de subir las imágenes.', 'error'); return; }
  leer();
  cfg = recortar(cfg);
  if (cfg.active) {
    const p = problemas(cfg);
    if (p.length) {
      actualizarEstado();
      mensaje('La sección está encendida y le falta lo que dice arriba. Complétalo, o apágala para guardar el borrador.', 'error');
      return;
    }
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
      text: cfg.text,
      posts: (cfg.posts || []).slice(0, MAX_POSTS)
    });
    guardada = clonar(cfg);
    render();
    mensaje(cfg.active
      ? 'Guardado. Ya se ve en el sitio (recarga la página para verlo).'
      : 'Guardado. La sección sigue apagada: no se ve en el sitio.', 'ok');
  } catch (err) {
    mensaje('No se pudo guardar: ' + err.message, 'error');
  } finally {
    const b = $('igGuardar');
    if (b) b.disabled = false;
  }
}

async function cargar() {
  try {
    const datos = await window.ErFirebase.fetchInstagram();
    cfg = { ...clonar(DEFECTO), ...(datos || {}) };
    delete cfg.updatedAt;
  } catch (err) {
    console.error('No se pudo leer la configuracion de Instagram:', err);
    cfg = clonar(DEFECTO);
  }
  cfg.posts = Array.isArray(cfg.posts) ? cfg.posts : [];
  guardada = clonar(cfg);
  render();
}

function conectar() {
  const cont = $('igEditor');
  if (!cont) return;

  cont.addEventListener('input', actualizarEstado);

  cont.addEventListener('change', (e) => {
    const t = e.target;
    if (t.id === 'igArchivos') { subir(t); return; }
    if (t.id === 'igActiva') {
      leer();
      if (t.checked) {
        const p = problemas(cfg);
        if (p.length) {
          t.checked = false;
          cfg.active = false;
          mensaje('No se puede encender todavía: completa lo que falta (arriba).', 'error');
        } else {
          mensaje('Se encenderá al guardar.');
        }
      } else if (guardada && guardada.active) {
        mensaje('Se apagará al guardar.');
      }
    }
    actualizarEstado();
  });

  cont.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.id === 'igGuardar') { guardar(); return; }
    leer();
    const posts = cfg.posts;
    if ('quitar' in b.dataset) posts.splice(Number(b.dataset.quitar), 1);
    else if ('mover' in b.dataset) {
      const i = Number(b.dataset.i);
      const j = i + Number(b.dataset.mover);
      if (j >= 0 && j < posts.length) [posts[i], posts[j]] = [posts[j], posts[i]];
    } else return;
    // Con menos de 6, una seccion encendida quedaria incompleta.
    if (cfg.active && problemas(cfg).length) {
      cfg.active = false;
      render();
      mensaje('Quedaron menos publicaciones de las necesarias: la sección se apagará al guardar.', 'error');
      return;
    }
    render();
  });
}

conectar();

window.ErInstagramAdmin = { cargar };
