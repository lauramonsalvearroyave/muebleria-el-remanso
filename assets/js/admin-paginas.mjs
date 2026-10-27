// El Remanso — Panel: pestana "Paginas" (paginas de aterrizaje y Google Ads).
//
// Edita pages/{id} en Firestore. No publica HTML: eso lo hace el generador
// (tools/generar-paginas.mjs) en GitHub cada ~15 minutos. La vista previa
// (/vista-previa) dibuja el borrador al instante con la misma plantilla.
//
// Usa lo que admin.js deja a mano: products, categories, subirACloudinary,
// loadData y currentUserRole. Este archivo es un modulo y carga despues.

import {
  TIPOS, BLOQUES, NOMBRES_CAMPOS, MATERIALES, MAX_TITULO_SEO, MAX_DESC_SEO,
  PAGINAS_INICIALES, CATEGORIA_EXTERIOR, esc, tx, variante,
  validarSlug, faltantesParaPublicar, productosDeCategoria
} from './paginas.mjs';

const AVISO_ADS = 'Esta página puede estar usándose en Google Ads; revisa los enlaces de sitio de la campaña.';
const CLAVE_BORRADOR = 'er_borrador_pagina';
const MAX_BOTONES = 3;

let paginas = [];       // como estan guardadas en Firestore
let editando = null;    // copia de trabajo del editor
let original = null;    // la pagina como estaba al abrirla (para comparar)
let esNueva = false;
let subiendo = false;
let errorCarga = null;

const $ = (id) => document.getElementById(id);
const clonar = (o) => JSON.parse(JSON.stringify(o ?? null));

// ---------- Rutas tipo "blocks.cta.botones.0.text.es" ----------

function obtener(obj, ruta) {
  return ruta.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function poner(obj, ruta, valor) {
  const partes = ruta.split('.');
  let o = obj;
  partes.slice(0, -1).forEach((k, i) => {
    if (o[k] == null || typeof o[k] !== 'object') o[k] = /^\d+$/.test(partes[i + 1]) ? [] : {};
    o = o[k];
  });
  o[partes[partes.length - 1]] = valor;
}

function idDeCampo(ruta) {
  return 'pg-' + ruta.replace(/\./g, '-');
}

// Quita espacios sobrantes en todos los textos antes de guardar.
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

function paraGuardar(p) {
  const c = recortar(clonar(p));
  delete c.id; delete c.updatedAt; delete c.createdAt;
  return c;
}

function etiqueta(p) {
  return tx(p.text && p.text.menuLabel, 'es') || tx(p.text && p.text.h1, 'es') || p.slug || '(sin nombre)';
}

// ---------- Carga y lista ----------

async function cargar() {
  errorCarga = null;
  try {
    paginas = await window.ErFirebase.fetchAllPages();
  } catch (err) {
    console.error('No se pudieron leer las paginas:', err);
    errorCarga = err;
    paginas = [];
  }
  renderLista();
}

function paginasQueUsan(categoryId) {
  return paginas.filter(p => p.categoryId === categoryId);
}

function renderLista() {
  const lista = $('pageList');
  const error = $('pagesError');
  const seed = $('pagesSeedBox');
  if (!lista) return;

  if (errorCarga) {
    error.textContent = 'No se pudieron leer las páginas. Lo más probable es que falte publicar las reglas nuevas de Firestore (están en docs/firestore.rules). Detalle: ' + errorCarga.message;
    seed.style.display = 'none';
    lista.innerHTML = '';
    return;
  }
  error.textContent = '';

  const faltan = PAGINAS_INICIALES.filter(i => !paginas.some(p => p.id === i.id));
  seed.style.display = faltan.length ? '' : 'none';
  if (faltan.length && paginas.length) {
    $('pagesSeedBtn').textContent = `Crear las páginas que faltan (${faltan.length})`;
  }

  if (!paginas.length) {
    lista.innerHTML = '<p class="admin-empty">Todavía no hay páginas.</p>';
    return;
  }

  const orden = paginas.slice().sort((a, b) => (a.menuOrder || 0) - (b.menuOrder || 0));
  lista.innerHTML = orden.map(p => {
    const faltantes = faltantesParaPublicar(p, products);
    const foto = p.heroImage && p.heroImage.url
      ? `<img src="${esc(variante(p.heroImage.url, 'w_160,h_160,c_fill,f_auto,q_auto'))}" alt="">` : '';
    const pills = [
      p.published ? '<span class="tag-pill pag-publicada">Publicada</span>' : '<span class="tag-pill pag-apagada">Apagada</span>',
      p.showInMenu ? '<span class="tag-pill">Menú</span>' : '',
      p.showInFooter ? '<span class="tag-pill">Pie</span>' : '',
      !p.published && faltantes.length ? `<span class="tag-pill pag-falta" title="${esc(faltantes.join(' · '))}">Faltan ${faltantes.length}</span>` : '',
      !p.published && !faltantes.length ? '<span class="tag-pill pago-pagado">Lista para encender</span>' : ''
    ].join('');
    const tipo = (TIPOS[p.type] || {}).nombre || p.type;
    return `
      <div class="admin-row">
        <div class="thumb">${foto}</div>
        <div class="info">
          <strong>${esc(etiqueta(p))}</strong>
          <span>/${esc(p.slug)} · ${esc(tipo)}${p.fase ? ` · Fase ${esc(p.fase)}` : ''}</span>
          <div class="pills">${pills}</div>
        </div>
        <div class="actions">
          <button class="btn btn-outline btn-sm" type="button" data-editar-pagina="${esc(p.id)}">Editar</button>
          <button class="btn btn-light btn-sm" type="button" data-preview-pagina="${esc(p.id)}">Vista previa</button>
          <button class="btn ${p.published ? 'btn-light' : 'btn-primary'} btn-sm" type="button" data-toggle-pagina="${esc(p.id)}">${p.published ? 'Apagar' : 'Encender'}</button>
        </div>
      </div>`;
  }).join('');
}

async function guardarPagina(p) {
  await window.ErFirebase.savePage(p.id, paraGuardar(p));
  const copia = clonar(p);
  const i = paginas.findIndex(x => x.id === p.id);
  if (i >= 0) paginas[i] = copia; else paginas.push(copia);
  // El indice de direcciones incluye las apagadas: el generador lo usa para
  // poner la redireccion a /catalogo en vez de dejar un error 404.
  await window.ErFirebase.savePagesIndex(paginas);
  renderLista();
}

async function encenderOApagar(id) {
  const p = paginas.find(x => x.id === id);
  if (!p) return;
  try {
    if (p.published) {
      if (!confirm(`¿Apagar /${p.slug}?\n\n${AVISO_ADS}\n\nMientras esté apagada, quien entre a esa dirección llegará al catálogo.`)) return;
      await guardarPagina({ ...clonar(p), published: false });
    } else {
      const faltan = faltantesParaPublicar(p, products);
      if (faltan.length) {
        alert('Todavía no se puede encender. Falta:\n\n• ' + faltan.join('\n• '));
        abrirEditor(id);
        return;
      }
      if (!confirm(`¿Encender /${p.slug}?\n\nAparecerá en el sitio, el menú, el pie y el mapa del sitio en unos 15 minutos.`)) return;
      await guardarPagina({ ...clonar(p), published: true });
    }
    if (editando && editando.id === id) cerrarEditor(true);
  } catch (err) {
    alert('No se pudo cambiar el estado: ' + err.message);
  }
}

function abrirVistaPrevia(id, conBorrador) {
  if (conBorrador) {
    try {
      localStorage.setItem(CLAVE_BORRADOR, JSON.stringify({ id, pagina: editando, t: Date.now() }));
    } catch (err) { /* sin almacenamiento: se ve la version guardada */ }
  }
  window.open(`/vista-previa?p=${encodeURIComponent(id)}${conBorrador ? '&borrador=1' : ''}`, '_blank', 'noopener');
}

async function crearIniciales() {
  if (!confirm('Se van a crear las páginas que falten, todas APAGADAS, y la categoría Exterior si no existe. ¿Continuar?')) return;
  const btn = $('pagesSeedBtn');
  btn.disabled = true;
  try {
    const exterior = categories.some(c => c.id === CATEGORIA_EXTERIOR.id) ? null : CATEGORIA_EXTERIOR;
    const n = await window.ErFirebase.seedPages(PAGINAS_INICIALES, exterior);
    await loadData();   // recarga categorias, productos y esta pestana
    alert(`Listo: ${n} página(s) creada(s), todas apagadas.` +
      (exterior ? '\n\nTambién se creó la categoría Exterior: márcala en las piezas de sintético o piola náutica (pestaña Productos → "También aparece en").' : ''));
  } catch (err) {
    alert('No se pudieron crear: ' + err.message);
  } finally {
    btn.disabled = false;
  }
}

// ---------- Editor ----------

function nuevaPaginaCategoria() {
  const base = clonar(PAGINAS_INICIALES.find(p => p.id === 'salas'));
  const vacio = () => ({ es: '', en: '' });
  const siguiente = Math.max(0, ...paginas.map(p => p.menuOrder || 0)) + 1;
  return {
    ...base,
    id: null, slug: '', fase: null, published: false, showInMenu: true, showInFooter: true,
    menuOrder: siguiente, categoryId: '', previousSlugs: [],
    text: { menuLabel: vacio(), h1: vacio(), intro: vacio() },
    heroImage: { url: '', alt: vacio() },
    seo: { title: vacio(), description: vacio(), image: '' },
    blocks: {
      ...base.blocks,
      productos: { visible: true, titulo: vacio(), texto: vacio() },
      materiales: { visible: true, titulo: vacio(), texto: vacio(), claves: [] },
      galeria: { visible: false, titulo: vacio(), texto: vacio(), fotos: [] }
    }
  };
}

function abrirEditor(id) {
  if (id) {
    const p = paginas.find(x => x.id === id);
    if (!p) return;
    editando = clonar(p);
    esNueva = false;
  } else {
    editando = nuevaPaginaCategoria();
    esNueva = true;
  }
  delete editando.updatedAt;
  delete editando.createdAt;
  editando.blocks = editando.blocks || {};
  original = clonar(editando);
  renderEditor();
  const card = $('pageEditor');
  card.style.display = '';
  window.scrollTo({ top: card.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
}

function cerrarEditor(sinPreguntar) {
  if (!sinPreguntar && editando) {
    leerFormulario();
    if (JSON.stringify(editando) !== JSON.stringify(original) &&
        !confirm('Hay cambios sin guardar. ¿Cerrar de todos modos?')) return;
  }
  editando = null;
  original = null;
  $('pageEditor').style.display = 'none';
  $('pageEditor').innerHTML = '';
}

function campoBi(ruta, nombre, tipo, opciones = {}) {
  const uno = (lang) => {
    const r = `${ruta}.${lang}`;
    const valor = obtener(editando, r) || '';
    const id = idDeCampo(r);
    const max = opciones.max ? ` data-max="${opciones.max}"` : '';
    const control = tipo === 'parrafos'
      ? `<textarea id="${id}" data-campo="${r}"${max} rows="4">${esc(valor)}</textarea>`
      : `<input type="text" id="${id}" data-campo="${r}"${max} value="${esc(valor)}">`;
    return `
      <div class="field">
        <label for="${id}">${esc(nombre)}<span class="lang-tag">${lang.toUpperCase()}</span></label>
        ${control}
        ${opciones.max ? `<span class="contador" data-contador-de="${r}"></span>` : ''}
      </div>`;
  };
  return `<div class="bilingue">${uno('es')}${uno('en')}</div>`;
}

function interruptor(ruta, texto, marcado) {
  return `<label class="switch"><input type="checkbox" data-campo="${ruta}" data-tipo="bool"${marcado ? ' checked' : ''}> ${esc(texto)}</label>`;
}

function miniatura(url) {
  return url ? `<img src="${esc(variante(url, 'w_240,h_180,c_fill,f_auto,q_auto'))}" alt="">` : '';
}

function editorFotos() {
  const tipoGaleria = editando.type === 'galeria';
  const fotos = (editando.blocks.galeria && editando.blocks.galeria.fotos) || [];
  const filas = fotos.map((f, i) => `
    <div class="fila-foto">
      <div class="img-preview">${miniatura(f.url)}</div>
      ${campoBi(`blocks.galeria.fotos.${i}.alt`, 'Texto alternativo (obligatorio)', 'linea')}
      <div class="foto-mover">
        <button type="button" class="btn btn-light btn-sm" data-foto-mover="-1" data-i="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Subir foto">↑</button>
        <button type="button" class="btn btn-light btn-sm" data-foto-mover="1" data-i="${i}" ${i === fotos.length - 1 ? 'disabled' : ''} aria-label="Bajar foto">↓</button>
        <button type="button" class="btn btn-light btn-sm" data-foto-quitar="${i}">Quitar</button>
      </div>
    </div>`).join('');
  return `
    <h5>Fotos</h5>
    <div class="admin-spec">
      Horizontales 3:2 (ej. 1800×1200), JPG. Cada foto necesita su <strong>texto alternativo</strong>: describe lo que se ve, por ejemplo "Sala Prado en rattán en una terraza de Envigado".
      ${tipoGaleria ? '<br><strong>Solo fotos reales de muebles entregados.</strong> Nada generado con IA ni de bancos de imágenes.' : ''}
    </div>
    <div class="upload-row">
      <label for="pgGaleriaFile" class="btn btn-primary btn-sm">Subir fotos</label>
      <input type="file" id="pgGaleriaFile" accept="image/*" multiple hidden>
      <span id="pgGaleriaStatus" class="upload-status"></span>
    </div>
    ${filas || '<p class="foto-galeria-vacia">Sin fotos todavía.</p>'}`;
}

function editorBotones(clave) {
  const botones = editando.blocks[clave].botones || [];
  const filas = botones.map((b, i) => `
    <div class="fila-foto" style="display:block;">
      ${campoBi(`blocks.${clave}.botones.${i}.text`, `Texto del botón ${i + 1}`, 'linea')}
      <div class="field" style="margin-bottom:8px;">
        <label for="${idDeCampo(`blocks.${clave}.botones.${i}.url`)}">Destino del botón ${i + 1}</label>
        <input type="text" id="${idDeCampo(`blocks.${clave}.botones.${i}.url`)}" data-campo="blocks.${clave}.botones.${i}.url" value="${esc(b.url || '')}" placeholder="https://wa.me/573104599629 o /catalogo">
      </div>
      <button type="button" class="btn btn-light btn-sm" data-boton-quitar="${i}">Quitar este botón</button>
    </div>`).join('');
  return `
    <h5>Botones</h5>
    <p class="form-note">Estos mismos botones aparecen también arriba, en el encabezado. Para WhatsApp usa <code>https://wa.me/573104599629</code> (el número se ajusta solo al de Ajustes); para que el mensaje llegue escrito, agrega <code>?text=</code> y el mensaje.</p>
    ${filas}
    ${botones.length < MAX_BOTONES ? '<button type="button" class="btn btn-outline btn-sm" data-boton-agregar>Agregar botón</button>' : ''}`;
}

function editorPasos() {
  const pasos = editando.blocks.pasos.items || [];
  return pasos.map((p, i) => `
    <h5>Paso ${i + 1}</h5>
    ${campoBi(`blocks.pasos.items.${i}.titulo`, 'Título del paso', 'linea')}
    ${campoBi(`blocks.pasos.items.${i}.desc`, 'Descripción', 'parrafos')}
    <button type="button" class="btn btn-light btn-sm" data-paso-quitar="${i}">Quitar este paso</button>`).join('') +
    '<p style="margin-top:12px;"><button type="button" class="btn btn-outline btn-sm" data-paso-agregar>Agregar paso</button></p>';
}

function editorBloque(clave) {
  const def = BLOQUES[clave];
  if (!editando.blocks[clave]) editando.blocks[clave] = { visible: false };
  const b = editando.blocks[clave];
  const visible = b.visible !== false;
  let campos = '';
  Object.entries(def.campos).forEach(([campo, tipo]) => {
    campos += campoBi(`blocks.${clave}.${campo}`, NOMBRES_CAMPOS[campo] || campo, tipo);
  });
  if (def.conClaves) {
    const claves = Array.isArray(b.claves) ? b.claves : [];
    campos += `
      <h5>Materiales que se muestran</h5>
      <div class="admin-checks">${MATERIALES.map(m =>
        `<label><input type="checkbox" data-clave-material="${m.clave}" ${claves.includes(m.clave) ? 'checked' : ''}> ${esc(m.nombre.es)}</label>`).join('')}
      </div>
      <p class="form-note">Las fotos de los materiales son las de Ajustes → Fotos de los materiales. El enlace "Conocer todos los materiales" solo aparece si la página /materiales está encendida.</p>`;
  }
  if (def.conItemsMateriales) {
    MATERIALES.forEach(m => {
      campos += `<h5>${esc(m.nombre.es)}</h5>
        ${campoBi(`blocks.${clave}.items.${m.clave}.titulo`, 'Nombre', 'linea')}
        ${campoBi(`blocks.${clave}.items.${m.clave}.desc`, 'Descripción', 'parrafos')}`;
    });
    campos += '<p class="form-note">Las fotos de textura son las de Ajustes → Fotos de los materiales.</p>';
  }
  if (def.conPasos) campos += editorPasos();
  if (def.conFotos) campos += editorFotos();
  if (def.conBotones) campos += editorBotones(clave);

  return `
    <div class="bloque-editor${visible ? '' : ' oculto'}" data-bloque="${clave}">
      ${interruptor(`blocks.${clave}.visible`, `Mostrar: ${def.nombre}`, visible)}
      <div class="bloque-campos">${campos}</div>
    </div>`;
}

function renderEditor() {
  const p = editando;
  const tipo = TIPOS[p.type] || TIPOS.categoria;
  const opcionesCategoria = ['<option value="">Elige una categoría…</option>']
    .concat(categories.map(c => `<option value="${esc(c.id)}" ${c.id === p.categoryId ? 'selected' : ''}>${esc(c.label)}${c.showInCatalog === false ? ' (solo páginas)' : ''}</option>`))
    .join('');
  const hero = p.heroImage || {};
  const seoImg = (p.seo && p.seo.image) || '';

  $('pageEditor').innerHTML = `
    <h3 class="admin-form-title">${esNueva ? 'Nueva página de categoría' : `Editar página: ${esc(etiqueta(p))}`}</h3>
    <div id="pgFaltantes"></div>

    <h4 class="form-section">Estado y visibilidad</h4>
    <div class="switches">
      <label class="switch"><input type="checkbox" id="pgPublicada" data-campo="published" data-tipo="bool"${p.published ? ' checked' : ''}> Publicada</label>
      ${interruptor('showInMenu', 'Mostrar en el menú', p.showInMenu)}
      ${interruptor('showInFooter', 'Mostrar en el pie de página', p.showInFooter)}
    </div>
    <div class="field-row">
      <div class="field">
        <label for="pgSlug">Dirección (URL)</label>
        <div class="slug-row"><span>muebleriaelremanso.com/</span><input type="text" id="pgSlug" data-campo="slug" value="${esc(p.slug || '')}" spellcheck="false" autocomplete="off"></div>
        <p class="form-note" id="pgSlugMsg" style="margin:6px 0 0;"></p>
      </div>
      <div class="field">
        <label for="pgOrden">Orden en el menú (1 = primero)</label>
        <input type="number" id="pgOrden" min="0" data-campo="menuOrder" data-tipo="num" value="${esc(p.menuOrder ?? 0)}">
      </div>
    </div>
    ${p.type === 'categoria' ? `
    <div class="field">
      <label for="pgCategoria">Categoría de productos que muestra</label>
      <select id="pgCategoria" data-campo="categoryId">${opcionesCategoria}</select>
      <p class="form-note" id="pgCatInfo" style="margin:6px 0 0;"></p>
    </div>` : ''}

    <h4 class="form-section">Encabezado</h4>
    <p class="form-note">El encabezado siempre se muestra: lleva el único título H1 de la página.</p>
    ${campoBi('text.menuLabel', 'Nombre en el menú', 'linea')}
    ${campoBi('text.h1', 'Título principal (H1)', 'linea')}
    ${campoBi('text.intro', 'Introducción', 'parrafos')}
    <div class="field">
      <label>Imagen principal</label>
      <div class="admin-spec">Horizontal <strong>4:3</strong> (ej. 1600×1200), JPG, bien iluminada y con el mueble como protagonista. El sitio la entrega sola en WebP/AVIF y en el tamaño de cada pantalla.</div>
      <div class="fila-foto" style="border-top:none; padding-top:0;">
        <div class="img-preview">${miniatura(hero.url)}</div>
        <div style="flex:1; min-width:240px;">
          <div class="upload-row">
            <label for="pgHeroFile" class="btn btn-primary btn-sm">${hero.url ? 'Cambiar foto' : 'Subir foto'}</label>
            <input type="file" id="pgHeroFile" accept="image/*" hidden>
            ${hero.url ? '<button type="button" class="btn btn-light btn-sm" data-quitar-imagen="heroImage.url">Quitar</button>' : ''}
            <span id="pgHeroStatus" class="upload-status"></span>
          </div>
          ${campoBi('heroImage.alt', 'Texto alternativo (obligatorio)', 'linea')}
        </div>
      </div>
    </div>

    <h4 class="form-section">Bloques</h4>
    ${tipo.bloques.map(editorBloque).join('')}

    <h4 class="form-section">SEO (Google y vista previa al compartir)</h4>
    ${campoBi('seo.title', 'Título SEO', 'linea', { max: MAX_TITULO_SEO })}
    ${campoBi('seo.description', 'Meta descripción', 'parrafos', { max: MAX_DESC_SEO })}
    <div class="field">
      <label>Imagen para compartir (WhatsApp, Facebook)</label>
      <div class="admin-spec"><strong>1200×630</strong> px. Si no subes una, se usa la imagen principal recortada a esa medida.</div>
      <div class="fila-foto" style="border-top:none; padding-top:0;">
        <div class="img-preview">${miniatura(seoImg)}</div>
        <div class="upload-row">
          <label for="pgSeoFile" class="btn btn-primary btn-sm">${seoImg ? 'Cambiar imagen' : 'Subir imagen'}</label>
          <input type="file" id="pgSeoFile" accept="image/*" hidden>
          ${seoImg ? '<button type="button" class="btn btn-light btn-sm" data-quitar-imagen="seo.image">Quitar</button>' : ''}
          <span id="pgSeoStatus" class="upload-status"></span>
        </div>
      </div>
    </div>

    <div class="editor-acciones">
      <button type="button" id="pgGuardar" class="btn btn-primary">Guardar cambios</button>
      <button type="button" id="pgPrevia" class="btn btn-outline">Vista previa</button>
      <button type="button" id="pgCerrar" class="btn btn-light">Cerrar</button>
      <span id="pgMsg" class="editor-mensaje" role="status"></span>
    </div>`;

  actualizarIndicadores();
}

// Pasa lo escrito en el formulario a "editando".
function leerFormulario() {
  const cont = $('pageEditor');
  if (!cont || !editando) return;
  cont.querySelectorAll('[data-campo]').forEach(el => {
    const ruta = el.dataset.campo;
    let valor = el.value;
    if (el.dataset.tipo === 'bool') valor = el.checked;
    else if (el.dataset.tipo === 'num') valor = Number(el.value) || 0;
    poner(editando, ruta, valor);
  });
  const claves = cont.querySelectorAll('[data-clave-material]');
  if (claves.length && editando.blocks.materiales) {
    editando.blocks.materiales.claves = Array.from(claves).filter(c => c.checked).map(c => c.dataset.claveMaterial);
  }
}

function mensaje(texto, tipo) {
  const m = $('pgMsg');
  if (!m) return;
  m.textContent = texto;
  m.className = 'editor-mensaje' + (tipo ? ' ' + tipo : '');
}

// Contadores SEO, aviso de direccion, productos de la categoria y que falta.
function actualizarIndicadores() {
  if (!editando) return;
  leerFormulario();
  const cont = $('pageEditor');

  cont.querySelectorAll('[data-contador-de]').forEach(span => {
    const campo = cont.querySelector(`[data-campo="${span.dataset.contadorDe}"]`);
    const max = Number(campo.dataset.max);
    const n = campo.value.trim().length;
    span.textContent = `${n} / ${max}`;
    span.classList.toggle('excede', n > max);
  });

  const slugMsg = $('pgSlugMsg');
  if (slugMsg) {
    const err = validarSlug(editando.slug, esNueva ? null : editando.id, paginas);
    const cambio = original && original.slug && original.slug !== editando.slug && !err;
    slugMsg.style.color = err ? '#9A3B2A' : '';
    slugMsg.textContent = err || (cambio
      ? `La dirección anterior (/${original.slug}) seguirá llevando aquí.`
      : '');
  }

  const catInfo = $('pgCatInfo');
  if (catInfo) {
    const n = productosDeCategoria(products, editando.categoryId).length;
    catInfo.textContent = editando.categoryId
      ? `${n} pieza(s) visible(s) en esta categoría, como principal o adicional. Para agregar o quitar piezas, edítalas en la pestaña Productos ("También aparece en").`
      : 'Elige qué piezas muestra esta página.';
  }

  const faltan = faltantesParaPublicar(editando, products);
  $('pgFaltantes').innerHTML = faltan.length
    ? `<div class="faltantes"><strong>Para poder encender esta página falta:</strong><ul>${faltan.map(f => `<li>${esc(f)}</li>`).join('')}</ul></div>`
    : '<div class="faltantes ok"><strong>Todo listo:</strong> esta página se puede encender.</div>';
}

// ---------- Fotos ----------

async function subirFotos(input, estado, alSubir) {
  const archivos = Array.from(input.files || []);
  if (!archivos.length) return;
  subiendo = true;
  const guardar = $('pgGuardar');
  if (guardar) guardar.disabled = true;
  const fallos = [];
  for (let i = 0; i < archivos.length; i++) {
    estado.className = 'upload-status';
    estado.textContent = archivos.length > 1 ? `Subiendo ${i + 1} de ${archivos.length}...` : 'Subiendo...';
    try {
      alSubir(await subirACloudinary(archivos[i]));
    } catch (err) {
      console.error('Fallo la subida:', err);
      fallos.push(archivos[i].name);
    }
  }
  subiendo = false;
  renderEditor();
  const nuevo = $(estado.id);
  if (nuevo) {
    nuevo.className = 'upload-status ' + (fallos.length ? 'error' : 'ok');
    nuevo.textContent = fallos.length ? `No se pudieron subir: ${fallos.join(', ')}` : 'Listo. Recuerda guardar los cambios.';
  }
}

// ---------- Guardar ----------

async function guardarEditor() {
  if (subiendo) { mensaje('Espera a que termine de subir la foto.', 'error'); return; }
  leerFormulario();
  editando = recortar(editando);
  const slug = editando.slug;

  const errSlug = validarSlug(slug, esNueva ? null : editando.id, paginas);
  if (errSlug) { mensaje(errSlug, 'error'); $('pgSlug').focus(); return; }
  if (esNueva) {
    if (paginas.some(p => p.id === slug)) { mensaje('Ya existe una página con ese identificador. Usa otra dirección.', 'error'); return; }
    editando.id = slug;
  }

  if (editando.published) {
    const faltan = faltantesParaPublicar(editando, products);
    if (faltan.length) {
      mensaje('Esta página está encendida y le falta lo que dice arriba. Complétalo, o apágala para guardar el borrador.', 'error');
      actualizarIndicadores();
      $('pgFaltantes').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  }

  // Cambio de direccion: la vieja queda como redireccion a la nueva.
  if (original && original.slug && original.slug !== slug) {
    if (original.published &&
        !confirm(`La dirección cambia de /${original.slug} a /${slug}.\n\nLa anterior seguirá llevando a la nueva, pero ${AVISO_ADS.charAt(0).toLowerCase() + AVISO_ADS.slice(1)}`)) return;
    const anteriores = new Set(editando.previousSlugs || []);
    anteriores.add(original.slug);
    anteriores.delete(slug);
    editando.previousSlugs = Array.from(anteriores);
  }

  const btn = $('pgGuardar');
  btn.disabled = true;
  mensaje('Guardando...');
  try {
    await guardarPagina(editando);
    original = clonar(editando);
    esNueva = false;
    renderEditor();
    mensaje(editando.published
      ? 'Guardado. Los cambios se verán en el sitio en unos 15 minutos.'
      : 'Guardado. La página sigue apagada; revísala con la vista previa.', 'ok');
  } catch (err) {
    mensaje('No se pudo guardar: ' + err.message, 'error');
  } finally {
    const b = $('pgGuardar');
    if (b) b.disabled = false;
  }
}

// ---------- Eventos ----------

function conectar() {
  const lista = $('pageList');
  const editor = $('pageEditor');
  if (!lista || !editor) return;

  $('pagesSeedBtn').addEventListener('click', crearIniciales);
  $('newCategoryPageBtn').addEventListener('click', () => {
    if (editando && !esNueva) cerrarEditor();
    if (!editando) abrirEditor(null);
  });

  lista.addEventListener('click', (e) => {
    const editar = e.target.closest('[data-editar-pagina]');
    const previa = e.target.closest('[data-preview-pagina]');
    const toggle = e.target.closest('[data-toggle-pagina]');
    if (editar) {
      if (editando && editando.id !== editar.dataset.editarPagina) cerrarEditor();
      if (!editando) abrirEditor(editar.dataset.editarPagina);
    }
    if (previa) abrirVistaPrevia(previa.dataset.previewPagina, false);
    if (toggle) encenderOApagar(toggle.dataset.togglePagina);
  });

  editor.addEventListener('input', () => actualizarIndicadores());

  editor.addEventListener('change', (e) => {
    const t = e.target;

    if (t.id === 'pgPublicada') {
      leerFormulario();
      if (t.checked) {
        const faltan = faltantesParaPublicar(editando, products);
        if (faltan.length) {
          t.checked = false;
          editando.published = false;
          mensaje('No se puede encender todavía: completa lo que falta (arriba).', 'error');
          $('pgFaltantes').scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          mensaje('Se encenderá al guardar los cambios.');
        }
      } else if (original && original.published) {
        if (!confirm(`¿Apagar esta página?\n\n${AVISO_ADS}`)) {
          t.checked = true;
          editando.published = true;
        } else {
          mensaje('Se apagará al guardar los cambios.');
        }
      }
      actualizarIndicadores();
      return;
    }

    if (t.dataset.campo && /^blocks\.[^.]+\.visible$/.test(t.dataset.campo)) {
      t.closest('.bloque-editor').classList.toggle('oculto', !t.checked);
    }

    if (t.id === 'pgHeroFile') subirFotos(t, $('pgHeroStatus'), url => { leerFormulario(); poner(editando, 'heroImage.url', url); });
    if (t.id === 'pgSeoFile') subirFotos(t, $('pgSeoStatus'), url => { leerFormulario(); poner(editando, 'seo.image', url); });
    if (t.id === 'pgGaleriaFile') {
      subirFotos(t, $('pgGaleriaStatus'), url => {
        leerFormulario();
        const g = editando.blocks.galeria;
        g.fotos = Array.isArray(g.fotos) ? g.fotos : [];
        g.fotos.push({ url, alt: { es: '', en: '' } });
        g.visible = true;
      });
    }

    actualizarIndicadores();
  });

  editor.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;

    if (t.id === 'pgGuardar') { guardarEditor(); return; }
    if (t.id === 'pgCerrar') { cerrarEditor(); return; }
    if (t.id === 'pgPrevia') {
      leerFormulario();
      abrirVistaPrevia(editando.id || '__nueva__', true);
      return;
    }

    // Lo que sigue cambia la estructura del formulario: primero se guarda lo
    // escrito en "editando", luego se redibuja.
    leerFormulario();
    const b = editando.blocks;
    if ('quitarImagen' in t.dataset) poner(editando, t.dataset.quitarImagen, '');
    else if ('fotoQuitar' in t.dataset) b.galeria.fotos.splice(Number(t.dataset.fotoQuitar), 1);
    else if ('fotoMover' in t.dataset) {
      const i = Number(t.dataset.i);
      const j = i + Number(t.dataset.fotoMover);
      const f = b.galeria.fotos;
      if (j >= 0 && j < f.length) [f[i], f[j]] = [f[j], f[i]];
    }
    else if ('botonAgregar' in t.dataset) {
      b.cta.botones = b.cta.botones || [];
      b.cta.botones.push({ text: { es: '', en: '' }, url: '' });
    }
    else if ('botonQuitar' in t.dataset) b.cta.botones.splice(Number(t.dataset.botonQuitar), 1);
    else if ('pasoAgregar' in t.dataset) {
      b.pasos.items = b.pasos.items || [];
      b.pasos.items.push({ titulo: { es: '', en: '' }, desc: { es: '', en: '' } });
    }
    else if ('pasoQuitar' in t.dataset) b.pasos.items.splice(Number(t.dataset.pasoQuitar), 1);
    else return;
    renderEditor();
  });
}

conectar();

window.ErPaginasAdmin = { cargar, paginasQueUsan };
