// El Remanso — Páginas de aterrizaje (salas, exterior, materiales...).
//
// Un solo lugar con la plantilla y las reglas de estas páginas. Lo usan:
//  - tools/generar-paginas.mjs  -> escribe el HTML publicado (GitHub Action)
//  - assets/js/vista-previa.mjs -> dibuja el borrador para el administrador
//  - assets/js/admin-paginas.mjs -> valida antes de publicar
// Asi la vista previa y la pagina publicada no pueden diferir.
//
// Convencion de idioma: el HTML lleva el texto en espanol y la version en
// ingles va en data-en (HTML) / data-alt-en / data-content-en. i18n.js los
// intercambia con el boton ES/EN. Google lee el espanol, que es el que indexa.

export const SITIO = 'https://muebleriaelremanso.com';
export const WA_DEFECTO = '573104599629';
export const MAX_TITULO_SEO = 60;
export const MAX_DESC_SEO = 155;
export const IMAGEN_COMPARTIR_DEFECTO = 'https://res.cloudinary.com/pu28ccmt/image/upload/c_fill,w_1200,h_630,g_auto,f_jpg,q_auto/v1790303169/tqeisrcpto0t4teu8o4a.png';

// Direcciones que ya existen o que el sitio necesita: ninguna pagina nueva
// puede llamarse asi, o pisaria un archivo real.
export const SLUGS_RESERVADOS = [
  'index', 'catalogo', 'contacto', 'ayuda-legal', 'enlaces', 'admin',
  'vista-previa', '404', 'sitemap', 'robots', 'assets', 'docs', 'tools',
  'en', 'es', 'api', 'cname'
];

// La categoria "exterior" solo admite estos dos: lo demas se dana afuera.
export const MATERIALES_EXTERIOR = ['sintetico', 'piola'];

export const MATERIALES = [
  { clave: 'mimbre',    grupo: 'fibras',   i18n: 'footer.mat_mimbre',    nombre: { es: 'Mimbre', en: 'Wicker' } },
  { clave: 'yare',      grupo: 'fibras',   i18n: 'footer.mat_yare',      nombre: { es: 'Yaré', en: 'Yaré' } },
  { clave: 'rattan',    grupo: 'fibras',   i18n: 'footer.mat_rattan',    nombre: { es: 'Rattán', en: 'Rattan' } },
  { clave: 'calceta',   grupo: 'fibras',   i18n: 'footer.mat_calceta',   nombre: { es: 'Calceta de plátano', en: 'Banana fiber' } },
  { clave: 'sintetico', grupo: 'tecnicos', i18n: 'footer.mat_sintetico', nombre: { es: 'Sintético', en: 'Synthetic fiber' } },
  { clave: 'piola',     grupo: 'tecnicos', i18n: 'footer.mat_piola',     nombre: { es: 'Piola náutica', en: 'Nautical rope' } }
];

// ---------- Estructura de cada tipo de pagina ----------
// "bloques" fija el orden en que se dibujan. El encabezado (H1, intro, foto)
// no esta en la lista porque no se puede ocultar: lleva el unico H1.

export const TIPOS = {
  categoria:  { nombre: 'Categoría',            bloques: ['productos', 'materiales', 'encargo', 'galeria', 'cta', 'cobertura'] },
  materiales: { nombre: 'Materiales',           bloques: ['catalogoMateriales', 'guia', 'galeria', 'cta'] },
  proceso:    { nombre: 'Cómo trabajamos',      bloques: ['pasos', 'galeria', 'cta'] },
  galeria:    { nombre: 'Galería de clientes',  bloques: ['galeria', 'cta', 'cobertura'] },
  hoteles:    { nombre: 'Hoteles y proyectos',  bloques: ['texto', 'galeria', 'cta', 'cobertura'] }
};

// Que campos de texto tiene cada bloque. tipo 'linea' = una linea,
// 'parrafos' = texto largo (una linea en blanco separa parrafos).
export const BLOQUES = {
  productos:          { nombre: 'Productos de la categoría', campos: { titulo: 'linea', texto: 'parrafos' } },
  materiales:         { nombre: 'Materiales recomendados', campos: { titulo: 'linea', texto: 'parrafos' }, conClaves: true },
  encargo:            { nombre: 'Recordatorio: se hace por encargo', campos: { titulo: 'linea', texto: 'parrafos' } },
  catalogoMateriales: { nombre: 'Los seis materiales', campos: { fibrasTitulo: 'linea', fibrasNota: 'parrafos', tecnicosTitulo: 'linea', tecnicosNota: 'parrafos' }, conItemsMateriales: true },
  guia:               { nombre: '¿Dónde va cada material?', campos: { titulo: 'linea', interiorTitulo: 'linea', interiorTexto: 'parrafos', exteriorTitulo: 'linea', exteriorTexto: 'parrafos' } },
  pasos:              { nombre: 'Los pasos', campos: { titulo: 'linea', texto: 'parrafos' }, conPasos: true },
  texto:              { nombre: 'Texto', campos: { titulo: 'linea', texto: 'parrafos' } },
  galeria:            { nombre: 'Galería de fotos', campos: { titulo: 'linea', texto: 'parrafos' }, conFotos: true },
  cta:                { nombre: 'Llamado a la acción final', campos: { titulo: 'linea', texto: 'parrafos' }, conBotones: true },
  cobertura:          { nombre: 'Cobertura', campos: { texto: 'parrafos' } }
};

export const NOMBRES_CAMPOS = {
  titulo: 'Título', texto: 'Texto',
  fibrasTitulo: 'Título del grupo "fibras naturales"', fibrasNota: 'Nota del grupo "fibras naturales"',
  tecnicosTitulo: 'Título del grupo "alta resistencia"', tecnicosNota: 'Nota del grupo "alta resistencia"',
  interiorTitulo: 'Título "Interior"', interiorTexto: 'Texto "Interior"',
  exteriorTitulo: 'Título "Exterior"', exteriorTexto: 'Texto "Exterior"'
};

// ---------- Utilidades ----------

export function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Texto en un idioma, con el espanol de respaldo.
export function tx(valor, lang) {
  if (!valor) return '';
  if (typeof valor === 'string') return valor;
  return String((lang === 'en' && valor.en) || valor.es || '').trim();
}

function en(valor) {
  return valor && typeof valor === 'object' ? String(valor.en || '').trim() : '';
}

// Cloudinary entrega variantes al vuelo con parametros en la URL: formato
// moderno (WebP/AVIF segun el navegador), calidad automatica y el ancho que
// se pida. La foto original se guarda intacta.
export function variante(url, transformacion) {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  return url.replace('/upload/', '/upload/' + transformacion + '/');
}

function parrafos(txt) {
  return String(txt || '')
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

// Elemento de una linea con su traduccion. data-en siempre lleva HTML, por
// eso el texto va escapado dos veces: una para el atributo, otra para que
// al ponerlo como innerHTML quede como texto y no como etiquetas.
function bi(tag, valor, attrs) {
  const es = tx(valor, 'es');
  const ingles = en(valor);
  const enAttr = ingles && ingles !== es ? ` data-en="${esc(esc(ingles))}"` : '';
  return `<${tag}${attrs || ''}${enAttr}>${esc(es)}</${tag}>`;
}

// Bloque de varios parrafos con su traduccion.
function biParrafos(valor, attrs) {
  const es = tx(valor, 'es');
  if (!es) return '';
  const ingles = en(valor);
  const enAttr = ingles ? ` data-en="${esc(parrafos(ingles))}"` : '';
  return `<div${attrs || ''}${enAttr}>${parrafos(es)}</div>`;
}

function altAttrs(alt) {
  const es = tx(alt, 'es');
  const ingles = en(alt);
  return ` alt="${esc(es)}"` + (ingles && ingles !== es ? ` data-alt-en="${esc(ingles)}"` : '');
}

// Foto en varios tamanos: el navegador baja la que le sirve segun la pantalla.
function imgResponsiva(url, alt, { sizes, prioridad, clase } = {}) {
  if (!url) return '';
  const cls = clase ? ` class="${clase}"` : '';
  const carga = prioridad ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"';
  if (!url.includes('res.cloudinary.com')) {
    return `<img src="${esc(url)}"${altAttrs(alt)}${cls}${carga}>`;
  }
  const anchos = [480, 800, 1200, 1600];
  const srcset = anchos.map(w => `${esc(variante(url, `w_${w},c_limit,f_auto,q_auto`))} ${w}w`).join(', ');
  return `<img src="${esc(variante(url, 'w_1200,c_limit,f_auto,q_auto'))}" srcset="${srcset}" sizes="${esc(sizes || '100vw')}"${altAttrs(alt)}${cls}${carga}>`;
}

export function enlaceWhatsapp(numero, mensaje) {
  const base = `https://wa.me/${numero || WA_DEFECTO}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

function esExterno(url) {
  return /^https?:\/\//i.test(url || '');
}

// ---------- Productos ----------

// Un producto pertenece a su categoria principal (la del catalogo) y a las
// adicionales que se le marquen. Las paginas de categoria muestran ambas.
export function productosDeCategoria(products, categoryId) {
  if (!categoryId) return [];
  return (products || [])
    .filter(p => p.active !== false)
    .filter(p => p.categoryId === categoryId || (Array.isArray(p.categoryIds) && p.categoryIds.includes(categoryId)))
    .sort((a, b) => (a.order || 0) - (b.order || 0) || String(a.name || '').localeCompare(String(b.name || '')));
}

function fotosDe(p) {
  const todas = [p.imageUrl, ...(Array.isArray(p.images) ? p.images : [])];
  const vistas = new Set();
  return todas.map(u => (u || '').trim()).filter(u => u && !vistas.has(u) && vistas.add(u));
}

const ETIQUETA_MATERIAL = {
  mimbre: ['catalog.tag_mimbre', 'Mimbre'],
  yare: ['catalog.tag_yare', 'Yaré'],
  rattan: ['catalog.tag_rattan', 'Rattán'],
  calceta: ['catalog.tag_calceta', 'Calceta de plátano'],
  sintetico: ['catalog.tag_sintetico', 'Sintético'],
  piola: ['catalog.tag_piola', 'Piola náutica']
};

// Misma ficha que dibuja assets/js/catalog-render.js (productCardHtml), para
// que las piezas se vean igual aqui que en /catalogo y que "Me interesa" y el
// visor de fotos funcionen sin cambios. Si se cambia una, cambiar la otra.
export function tarjetaProducto(p) {
  const badges = [];
  if (p.featured) badges.push('<span class="product-badge featured" data-i18n="catalog.badge_featured">Destacado</span>');
  if (p.isNew) badges.push('<span class="product-badge new" data-i18n="catalog.badge_new">Nuevo</span>');
  if (p.soldOut) badges.push('<span class="product-badge soldout" data-i18n="catalog.badge_soldout">Agotado</span>');

  const galeria = fotosDe(p);
  const media = galeria.length
    ? `<img src="${esc(variante(galeria[0], 'w_800,f_auto,q_auto'))}" data-full="${esc(galeria[0])}" alt="${esc(p.name)}" loading="lazy" decoding="async">`
    : '<span class="placeholder-note" data-i18n="catalog.photo_note">Foto próximamente</span>';
  const zoomable = galeria.length ? ' is-zoomable' : '';
  const contador = galeria.length > 1
    ? `<span class="foto-count"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3" width="14" height="14" rx="2"/><path d="M3 7v12a2 2 0 0 0 2 2h12"/></svg>${galeria.length}</span>`
    : '';
  const datosGaleria = galeria.length > 1 ? ` data-gallery="${esc(JSON.stringify(galeria))}"` : '';

  const mat = ETIQUETA_MATERIAL[p.material];
  const materialTag = mat ? `<span class="tag-pill" data-i18n="${mat[0]}">${esc(mat[1])}</span>` : '';
  const customTag = '<span class="tag-pill tag-custom" data-i18n="catalog.tag_custom">Hecho para ti</span>';
  const story = p.story ? `<p class="product-name-story">${esc(p.story)}</p>` : '';
  const interestBtn = p.soldOut ? '' : `
        <button class="btn-interest" type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 8.6a4.6 4.6 0 0 0-8-3.1 4.6 4.6 0 0 0-8 3.1c0 5 8 10.4 8 10.4s8-5.4 8-10.4Z"/></svg>
          <span data-i18n="catalog.interest_btn">Me interesa</span>
        </button>`;

  return `
    <div class="product-card${p.soldOut ? ' is-soldout' : ''}" data-product-id="${esc(p.id)}">
      <div class="product-thumb${zoomable}"${datosGaleria}>
        <div class="product-badges">${badges.join('')}</div>
        ${media}
        ${contador}
      </div>
      <div class="product-body">
        <div class="product-tags">${materialTag}${customTag}</div>
        <h3>${esc(p.name)}</h3>
        ${story}${interestBtn}
      </div>
    </div>`;
}

// ---------- Validaciones ----------

export function validarSlug(slug, idActual, paginas) {
  const s = String(slug || '').trim();
  if (!s) return 'La dirección no puede quedar vacía.';
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)) {
    return 'Solo minúsculas sin tildes, números y guiones (ej: salas-tejidas).';
  }
  if (SLUGS_RESERVADOS.includes(s)) return `"/${s}" ya la usa el sitio. Elige otra.`;
  const choca = (paginas || []).find(p => p.id !== idActual &&
    (p.slug === s || (Array.isArray(p.previousSlugs) && p.previousSlugs.includes(s))));
  if (choca) return `"/${s}" ya es (o fue) la dirección de otra página: ${tx(choca.text && choca.text.menuLabel, 'es') || choca.id}.`;
  return '';
}

// Lo que impide encender una pagina. Lista vacia = se puede publicar.
export function faltantesParaPublicar(pagina, products) {
  const f = [];
  const t = pagina.text || {};
  const seo = pagina.seo || {};
  if (!tx(t.h1, 'es')) f.push('El título principal (H1) en español');
  if (!tx(t.intro, 'es')) f.push('El texto de introducción en español');
  if (!pagina.heroImage || !pagina.heroImage.url) f.push('La imagen principal');
  else if (!tx(pagina.heroImage.alt, 'es')) f.push('El texto alternativo de la imagen principal');

  const titulo = tx(seo.title, 'es');
  const desc = tx(seo.description, 'es');
  if (!titulo) f.push('El título SEO');
  else if (titulo.length > MAX_TITULO_SEO) f.push(`Acortar el título SEO (${titulo.length} de ${MAX_TITULO_SEO} caracteres)`);
  if (!desc) f.push('La meta descripción');
  else if (desc.length > MAX_DESC_SEO) f.push(`Acortar la meta descripción (${desc.length} de ${MAX_DESC_SEO} caracteres)`);

  if (pagina.type === 'categoria') {
    if (!pagina.categoryId) f.push('Elegir la categoría de productos');
    else if (!productosDeCategoria(products, pagina.categoryId).length) f.push('Al menos un producto visible asignado a la categoría');
  }

  const galeria = (pagina.blocks && pagina.blocks.galeria) || {};
  const fotos = Array.isArray(galeria.fotos) ? galeria.fotos : [];
  if (pagina.type === 'galeria' && !fotos.length) f.push('Al menos una foto en la galería');
  if (galeria.visible !== false && fotos.some(ft => !tx(ft.alt, 'es'))) {
    f.push('El texto alternativo de todas las fotos de la galería');
  }
  return f;
}

// ---------- Plantilla ----------

function bloqueVisible(pagina, clave) {
  const b = pagina.blocks && pagina.blocks[clave];
  return !!b && b.visible !== false;
}

function botonesHtml(botones, numero, clasePrimero) {
  return (botones || [])
    .filter(b => b && tx(b.text, 'es') && b.url)
    .map((b, i) => {
      const url = String(b.url).replace(/^https:\/\/wa\.me\/\d+/, `https://wa.me/${numero || WA_DEFECTO}`);
      const wa = /^https:\/\/wa\.me\//.test(url);
      const clase = wa ? 'btn btn-whatsapp' : (i === 0 && clasePrimero ? 'btn btn-primary' : 'btn btn-outline');
      const destino = esExterno(url) ? ' target="_blank" rel="noopener"' : '';
      return bi('a', b.text, ` href="${esc(url)}" class="${clase}"${destino}`);
    })
    .join('\n          ');
}

function tituloBloque(valor, tag) {
  return tx(valor, 'es') ? bi(tag || 'h2', valor) : '';
}

function swatch(clave, fotos) {
  const url = fotos && fotos[clave];
  const img = url ? `<img src="${esc(variante(url, 'w_600,f_auto,q_auto'))}" alt="" loading="lazy" decoding="async">` : '';
  return `<div class="material-swatch swatch-${clave}" data-material="${clave}">${img}</div>`;
}

const RENDER_BLOQUE = {
  productos(pagina, b, ctx) {
    const lista = productosDeCategoria(ctx.products, pagina.categoryId);
    const grid = lista.length >= 4 ? 'grid-4' : 'grid-3';
    const tarjetas = lista.length
      ? lista.map(tarjetaProducto).join('')
      : '<p class="admin-empty" style="grid-column:1/-1;" data-i18n="catalog.empty_category">Pronto agregaremos piezas a esta colección.</p>';
    return `
      ${tituloBloque(b.titulo)}
      ${biParrafos(b.texto, ' class="lede"')}
      <div class="grid ${grid} pagina-productos">${tarjetas}</div>`;
  },

  materiales(pagina, b, ctx) {
    const claves = (Array.isArray(b.claves) ? b.claves : []).filter(k => MATERIALES.some(m => m.clave === k));
    const tarjetas = claves.map(k => {
      const m = MATERIALES.find(x => x.clave === k);
      return `
        <div class="card material-card">
          ${swatch(k, ctx.fotosMateriales)}
          <h3 data-i18n="${m.i18n}">${esc(m.nombre.es)}</h3>
        </div>`;
    }).join('');
    return `
      ${tituloBloque(b.titulo)}
      ${biParrafos(b.texto, ' class="lede"')}
      ${tarjetas ? `<div class="grid grid-4 materiales-recomendados">${tarjetas}</div>` : ''}
      <p class="pagina-enlace" data-requiere-pagina="materiales">
        <a href="/materiales" class="btn btn-outline" data-i18n="pagina.ver_materiales">Conocer todos los materiales</a>
      </p>`;
  },

  encargo(pagina, b) {
    return `
      <div class="custom-note pagina-encargo">
        ${tx(b.titulo, 'es') ? bi('strong', b.titulo) : ''}
        ${biParrafos(b.texto)}
      </div>`;
  },

  catalogoMateriales(pagina, b, ctx) {
    const items = b.items || {};
    const tarjeta = m => {
      const it = items[m.clave] || {};
      return `
        <div class="card material-card">
          ${swatch(m.clave, ctx.fotosMateriales)}
          ${bi('h3', it.titulo || m.nombre)}
          ${biParrafos(it.desc)}
        </div>`;
    };
    const fibras = MATERIALES.filter(m => m.grupo === 'fibras').map(tarjeta).join('');
    const tecnicos = MATERIALES.filter(m => m.grupo === 'tecnicos').map(tarjeta).join('');
    const grupo = (titulo, nota) => `
      <div class="material-group">
        ${tx(titulo, 'es') ? bi('h2', titulo, ' class="material-group-title"') : ''}
        ${biParrafos(nota, ' class="material-group-note"')}
      </div>`;
    return `
      ${grupo(b.fibrasTitulo, b.fibrasNota)}
      <div class="grid grid-4">${fibras}</div>
      ${grupo(b.tecnicosTitulo, b.tecnicosNota)}
      <div class="grid grid-2 grid-tech">${tecnicos}</div>`;
  },

  guia(pagina, b) {
    const lista = claves => `<ul class="guia-lista">${claves.map(k => {
      const m = MATERIALES.find(x => x.clave === k);
      return `<li data-i18n="${m.i18n}">${esc(m.nombre.es)}</li>`;
    }).join('')}</ul>`;
    return `
      ${tituloBloque(b.titulo)}
      <div class="grid grid-2 guia-materiales">
        <div class="card">
          ${tituloBloque(b.interiorTitulo, 'h3')}
          ${biParrafos(b.interiorTexto)}
          ${lista(MATERIALES.map(m => m.clave))}
        </div>
        <div class="card">
          ${tituloBloque(b.exteriorTitulo, 'h3')}
          ${biParrafos(b.exteriorTexto)}
          ${lista(MATERIALES_EXTERIOR)}
        </div>
      </div>`;
  },

  pasos(pagina, b) {
    const pasos = (Array.isArray(b.items) ? b.items : []).filter(p => tx(p.titulo, 'es'));
    return `
      ${tituloBloque(b.titulo)}
      ${biParrafos(b.texto, ' class="lede"')}
      <div class="steps">${pasos.map((p, i) => `
        <div class="step">
          <div class="step-top"><span class="step-num">${i + 1}</span>${bi('h3', p.titulo)}</div>
          ${biParrafos(p.desc)}
        </div>`).join('')}
      </div>`;
  },

  texto(pagina, b) {
    return `
      ${tituloBloque(b.titulo)}
      ${biParrafos(b.texto, ' class="pagina-texto"')}`;
  },

  galeria(pagina, b) {
    const fotos = (Array.isArray(b.fotos) ? b.fotos : []).filter(f => f && f.url);
    if (!fotos.length) return '';
    const urls = fotos.map(f => f.url);
    // Cada foto abre el visor empezando por ella y sigue con las demas.
    const items = fotos.map((f, i) => {
      const orden = urls.slice(i).concat(urls.slice(0, i));
      return `
        <figure class="galeria-item product-thumb is-zoomable" data-gallery="${esc(JSON.stringify(orden))}">
          ${imgResponsiva(f.url, f.alt, { sizes: '(max-width: 620px) 100vw, (max-width: 900px) 50vw, 380px' }).replace('<img ', `<img data-full="${esc(f.url)}" `)}
        </figure>`;
    }).join('');
    return `
      ${tituloBloque(b.titulo)}
      ${biParrafos(b.texto, ' class="lede"')}
      <div class="grid grid-3 pagina-galeria">${items}</div>`;
  },

  cta(pagina, b, ctx) {
    return `
      <div class="text-center">
        ${tituloBloque(b.titulo)}
        ${biParrafos(b.texto, ' class="lede center"')}
        <div class="hero-cta" style="justify-content:center;">
          ${botonesHtml(b.botones, ctx.whatsapp, true)}
        </div>
      </div>`;
  },

  cobertura(pagina, b) {
    return `
      <div class="pagina-cobertura">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>
        ${biParrafos(b.texto)}
      </div>`;
  }
};

// Contenido de <main>. ctx = { products, fotosMateriales, whatsapp }
export function renderMain(pagina, ctx) {
  const t = pagina.text || {};
  const hero = pagina.heroImage || {};
  const ctaBotones = (pagina.blocks && pagina.blocks.cta && pagina.blocks.cta.botones) || [];
  const esCategoria = pagina.type === 'categoria';

  const migas = `
      <nav class="migas" aria-label="Ruta">
        <a href="/" data-i18n="nav.home">Inicio</a>
        ${esCategoria ? '<span aria-hidden="true">/</span><a href="/catalogo" data-i18n="nav.catalog">Catálogo</a>' : ''}
        <span aria-hidden="true">/</span>${bi('span', t.menuLabel || t.h1, ' aria-current="page"')}
      </nav>`;

  const encabezado = `
  <section class="hero pagina-hero">
    <div class="container${hero.url ? '' : ' sin-foto'}">
      <div>
        ${migas}
        ${bi('h1', t.h1)}
        ${biParrafos(t.intro, ' class="lede"')}
        <div class="hero-cta">
          ${botonesHtml(ctaBotones, ctx.whatsapp, true)}
        </div>
      </div>
      ${hero.url ? `<div class="hero-art">${imgResponsiva(hero.url, hero.alt, { sizes: '(max-width: 860px) 100vw, 520px', prioridad: true })}</div>` : ''}
    </div>
  </section>`;

  let alterna = true;
  const secciones = (TIPOS[pagina.type] || TIPOS.categoria).bloques
    .filter(clave => bloqueVisible(pagina, clave))
    .map(clave => {
      const html = RENDER_BLOQUE[clave](pagina, pagina.blocks[clave], ctx).trim();
      if (!html) return '';
      alterna = !alterna;
      const tight = clave === 'encargo' || clave === 'cobertura';
      const clases = [alterna ? 'section-alt' : '', tight ? 'section-tight' : '', `bloque-${clave}`].filter(Boolean).join(' ');
      return `
  <section class="${clases}">
    <div class="container">
      ${html}
    </div>
  </section>`;
    })
    .join('');

  return encabezado + secciones;
}

function imagenCompartir(pagina) {
  const seo = pagina.seo || {};
  const base = seo.image || (pagina.heroImage && pagina.heroImage.url);
  if (!base) return IMAGEN_COMPARTIR_DEFECTO;
  // Se fuerza 1200 x 630 recortando con criterio: suba lo que se suba,
  // WhatsApp y Facebook reciben la medida que esperan.
  return base.includes('res.cloudinary.com') ? variante(base, 'c_fill,w_1200,h_630,g_auto,f_jpg,q_auto') : base;
}

// Etiquetas de <head>: titulo, descripcion, canonical, Open Graph y migas.
export function renderHead(pagina) {
  const seo = pagina.seo || {};
  const t = pagina.text || {};
  const url = `${SITIO}/${pagina.slug}`;
  const titulo = tx(seo.title, 'es') || tx(t.h1, 'es');
  const tituloEn = en(seo.title);
  const desc = tx(seo.description, 'es');
  const descEn = en(seo.description);
  const imagen = imagenCompartir(pagina);
  const altImagen = tx(pagina.heroImage && pagina.heroImage.alt, 'es') || titulo;

  const migas = [{ name: 'Inicio', item: `${SITIO}/` }];
  if (pagina.type === 'categoria') migas.push({ name: 'Catálogo', item: `${SITIO}/catalogo` });
  migas.push({ name: tx(t.menuLabel, 'es') || titulo, item: url });
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: migas.map((m, i) => ({ '@type': 'ListItem', position: i + 1, name: m.name, item: m.item }))
  };

  return `<title${tituloEn ? ` data-en="${esc(esc(tituloEn))}"` : ''}>${esc(titulo)}</title>
<meta name="description" content="${esc(desc)}"${descEn ? ` data-content-en="${esc(descEn)}"` : ''}>
<link rel="canonical" href="${esc(url)}">

<!-- Vista previa al compartir el enlace (WhatsApp, Instagram, Facebook) -->
<meta property="og:type" content="website">
<meta property="og:site_name" content="El Remanso">
<meta property="og:locale" content="es_CO">
<meta property="og:url" content="${esc(url)}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(imagen)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(altImagen)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(titulo)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(imagen)}">

<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2).replace(/</g, '\\u003c')}
</script>`;
}

// ---------- Contenido inicial ----------
// Todas nacen APAGADAS. Los textos de /materiales y /como-trabajamos son
// copia exacta de las secciones del inicio (assets/js/i18n.js).

const B = (es, en) => ({ es, en });
const WA = `https://wa.me/${WA_DEFECTO}`;
const BOTONES_DEFECTO = [
  { text: B('Escríbenos por WhatsApp', 'Message us on WhatsApp'), url: WA },
  { text: B('Ver todo el catálogo', 'View the full catalog'), url: '/catalogo' }
];
const COBERTURA = { visible: true, texto: B('Hacemos envíos a toda Colombia desde nuestro taller en Las Palmas, kilómetro 17.', 'We ship anywhere in Colombia from our workshop in Las Palmas, kilometer 17.') };
const ENCARGO = (es, en) => ({
  visible: true,
  titulo: B('Cada pieza se hace por encargo.', 'Every piece is made to order.'),
  texto: B(es, en)
});

function base(extra) {
  return {
    published: false,
    showInMenu: true,
    showInFooter: true,
    heroImage: { url: '', alt: B('', '') },
    previousSlugs: [],
    ...extra
  };
}

export const PAGINAS_INICIALES = [
  base({
    id: 'salas', type: 'categoria', slug: 'salas', menuOrder: 1, categoryId: 'salas', fase: 1,
    text: {
      menuLabel: B('Salas', 'Living room sets'),
      h1: B('Salas tejidas a mano', 'Hand-woven living room sets'),
      intro: B(
        'Sofás, poltronas y mesas de centro tejidos a mano, por encargo y a tu medida. Tú eliges la fibra, el color del tejido y la tela de los cojines; nosotros nos tomamos el tiempo de hacerla bien, sin afán, para que tu sala sea el lugar donde todos quieren quedarse.',
        'Sofas, armchairs and coffee tables woven by hand, made to order and to your measurements. You choose the fiber, the tone of the weave and the cushion fabric; we take the time to do it right, unhurried, so your living room becomes the place everyone wants to stay.')
    },
    seo: {
      title: B('Salas tejidas a mano por encargo | El Remanso', 'Hand-woven living room sets, made to order | El Remanso'),
      description: B(
        'Salas en mimbre, yaré, rattán y fibra sintética tejidas a mano, por encargo y a tu medida. Medellín, Envigado y toda Antioquia.',
        'Living room sets hand-woven in wicker, yaré, rattan and synthetic fiber, made to order. Medellín, Envigado and all of Antioquia.'),
      image: ''
    },
    blocks: {
      productos: { visible: true, titulo: B('Nuestras salas', 'Our living room sets'), texto: B('', '') },
      materiales: {
        visible: true,
        titulo: B('Fibras recomendadas para tu sala', 'Recommended fibers for your living room'),
        texto: B('Bajo techo funcionan todas nuestras fibras. Si la sala va en una terraza o un corredor abierto, la tejemos en sintético para que aguante el clima.',
                 'Indoors, every one of our fibers works. If your living room is on a terrace or an open porch, we weave it in synthetic fiber so it can take the weather.'),
        claves: ['mimbre', 'yare', 'rattan', 'sintetico']
      },
      encargo: ENCARGO(
        'Tú decides las medidas, la fibra, el color del tejido y la cojinería. Antes de empezar a tejer te mostramos muestras reales y te contamos el tiempo de elaboración.',
        'You decide the measurements, the fiber, the tone of the weave and the upholstery. Before we start weaving we show you real samples and tell you how long it will take.'),
      galeria: { visible: false, titulo: B('', ''), texto: B('', ''), fotos: [] },
      cta: { visible: true, titulo: B('¿Conversamos sobre tu sala?', 'Shall we talk about your living room?'), texto: B('Cuéntanos el espacio y cómo la imaginas. Te respondemos por WhatsApp.', 'Tell us about the space and how you picture it. We will reply on WhatsApp.'), botones: BOTONES_DEFECTO },
      cobertura: COBERTURA
    }
  }),

  base({
    id: 'exterior', type: 'categoria', slug: 'exterior', menuOrder: 2, categoryId: 'exterior', fase: 1,
    text: {
      menuLabel: B('Exterior', 'Outdoor'),
      h1: B('Muebles para exterior tejidos a mano', 'Hand-woven outdoor furniture'),
      intro: B(
        'Para la terraza, el balcón, el jardín o la piscina tejemos solo con materiales que aguantan la intemperie: fibra sintética y piola náutica. Se tejen con la misma técnica artesanal de siempre, por encargo y a tu medida, y no se decoloran con el sol ni se dañan con la lluvia.',
        'For the terrace, the balcony, the garden or the pool we weave only with materials that can take the weather: synthetic fiber and nautical rope. They are woven with the same artisan technique as always, made to order and to your measurements, and they do not fade in the sun or suffer in the rain.')
    },
    seo: {
      title: B('Muebles para exterior tejidos a mano | El Remanso', 'Hand-woven outdoor furniture | El Remanso'),
      description: B(
        'Muebles de exterior en fibra sintética y piola náutica, tejidos a mano por encargo. Resisten sol y lluvia. Medellín, Envigado y Antioquia.',
        'Outdoor furniture in synthetic fiber and nautical rope, hand-woven to order. Built for sun and rain. Medellín, Envigado and Antioquia.'),
      image: ''
    },
    blocks: {
      productos: { visible: true, titulo: B('Piezas para exterior', 'Outdoor pieces'), texto: B('', '') },
      materiales: {
        visible: true,
        titulo: B('Solo materiales para la intemperie', 'Only weather-proof materials'),
        texto: B('Las fibras naturales son para espacios bajo techo. Afuera usamos únicamente estos dos.',
                 'Natural fibers are made for covered spaces. Outdoors we use only these two.'),
        claves: ['sintetico', 'piola']
      },
      encargo: ENCARGO(
        'Tú decides las medidas, el color del tejido y la tela de los cojines, que también puede ser para exterior. Te mostramos muestras reales antes de empezar a tejer.',
        'You decide the measurements, the tone of the weave and the cushion fabric, which can be outdoor-grade too. We show you real samples before we start weaving.'),
      galeria: { visible: false, titulo: B('', ''), texto: B('', ''), fotos: [] },
      cta: { visible: true, titulo: B('¿Tienes una terraza en mente?', 'Got a terrace in mind?'), texto: B('Cuéntanos cómo es el espacio y te ayudamos a elegir las piezas.', 'Tell us about the space and we will help you choose the pieces.'), botones: BOTONES_DEFECTO },
      cobertura: COBERTURA
    }
  }),

  base({
    id: 'columpios', type: 'categoria', slug: 'columpios', menuOrder: 3, categoryId: 'camas-nido-y-columpios', fase: 1,
    text: {
      menuLabel: B('Columpios y camas nido', 'Swings & nest beds'),
      h1: B('Columpios y camas nido tejidos a mano', 'Hand-woven swings and nest beds'),
      intro: B(
        'Piezas para acurrucarse, leer o mecerse suave, en la terraza, el balcón o el jardín. Tejidas a mano, por encargo y a tu medida, en la fibra que mejor vaya con el lugar donde van a estar, sin afán y con todo el cuidado.',
        'Pieces for curling up, reading or gently swaying, on the terrace, the balcony or in the garden. Woven by hand, made to order and to your measurements, in the fiber that best suits where they will live — unhurried and with every care.')
    },
    seo: {
      title: B('Columpios y camas nido tejidos a mano | El Remanso', 'Hand-woven swings and nest beds | El Remanso'),
      description: B(
        'Columpios y camas nido tejidos a mano por encargo, para interior o exterior, en fibras naturales, sintético o piola náutica. Medellín y Antioquia.',
        'Swings and nest beds hand-woven to order, for indoors or outdoors, in natural fibers, synthetic fiber or nautical rope. Medellín and Antioquia.'),
      image: ''
    },
    blocks: {
      productos: { visible: true, titulo: B('Nuestros columpios y camas nido', 'Our swings and nest beds'), texto: B('', '') },
      materiales: {
        visible: true,
        titulo: B('La fibra según dónde va', 'The fiber depends on where it goes'),
        texto: B('Si va a estar al aire libre, sintético o piola náutica. Bajo techo, también en fibras naturales.',
                 'If it will be outdoors, synthetic fiber or nautical rope. Under a roof, natural fibers work too.'),
        claves: ['sintetico', 'piola', 'mimbre', 'rattan']
      },
      encargo: ENCARGO(
        'Tú decides las medidas, la fibra, el color del tejido y los cojines. Te mostramos muestras reales antes de empezar a tejer.',
        'You decide the measurements, the fiber, the tone of the weave and the cushions. We show you real samples before we start weaving.'),
      galeria: { visible: false, titulo: B('', ''), texto: B('', ''), fotos: [] },
      cta: { visible: true, titulo: B('¿Dónde te imaginas meciéndote?', 'Where do you picture yourself swaying?'), texto: B('Escríbenos y lo pensamos juntos.', 'Write to us and we will figure it out together.'), botones: BOTONES_DEFECTO },
      cobertura: COBERTURA
    }
  }),

  base({
    id: 'materiales', type: 'materiales', slug: 'materiales', menuOrder: 5, fase: 1,
    text: {
      menuLabel: B('Materiales', 'Materials'),
      h1: B('Cuatro fibras y dos materiales, un mismo oficio', 'Four fibers, two materials, one craft'),
      intro: B(
        'Cada material tiene su textura, su carácter y su mejor lugar en la casa. Te contamos en qué se diferencian para que elijas con confianza — o déjalo en nuestras manos.',
        "Every material has its own texture, its own character and its own best place in the home. We'll walk you through the differences so you can choose with confidence — or just leave it to us.")
    },
    seo: {
      title: B('Materiales: mimbre, yaré, rattán y más | El Remanso', 'Materials: wicker, yaré, rattan and more | El Remanso'),
      description: B(
        'Mimbre, yaré, rattán, calceta de plátano, fibra sintética y piola náutica: cómo es cada material y dónde va mejor, en interior o exterior.',
        'Wicker, yaré, rattan, banana fiber, synthetic fiber and nautical rope: what each material is like and where it works best, indoors or out.'),
      image: ''
    },
    blocks: {
      catalogoMateriales: {
        visible: true,
        fibrasTitulo: B('Fibras naturales', 'Natural fibers'),
        fibrasNota: B('Se recogen y se trabajan a mano, una por una. Cada una tiene su color, su grosor y su propia manera de envejecer.', 'Gathered and worked by hand, one at a time. Each has its own color, its own thickness and its own way of ageing.'),
        tecnicosTitulo: B('Materiales de alta resistencia', 'High-resistance materials'),
        tecnicosNota: B('Se tejen con la misma técnica artesanal de siempre, pero aguantan sol, lluvia y uso diario sin perder la forma.', 'Woven with the same artisan technique as always, but they take sun, rain and daily use without losing their shape.'),
        items: {
          mimbre: { titulo: B('Mimbre', 'Wicker'), desc: B('Fibra clara y liviana que se dobla sin quebrarse. La más noble de todas: cálida al tacto, de tejido fino y fácil de combinar con cualquier cojinería.', 'A pale, light fiber that bends without breaking. The kindest of them all: warm to the touch, finely woven and easy to pair with any upholstery.') },
          yare: { titulo: B('Yaré', 'Yaré'), desc: B('Raíz tradicional colombiana, muy flexible y de una resistencia enorme. Aguanta el uso diario y con los años toma un tono más profundo.', 'A traditional Colombian root, very flexible and remarkably strong. It stands up to daily use and deepens into a richer tone over the years.') },
          rattan: { titulo: B('Rattán', 'Rattan'), desc: B('La más firme de las fibras naturales. Su bejuco macizo sostiene estructuras grandes sin ceder, con un acabado elegante y sobrio.', 'The firmest of the natural fibers. Its solid cane holds up large structures without giving, with an elegant, understated finish.') },
          calceta: { titulo: B('Calceta de plátano', 'Banana fiber'), desc: B('Se obtiene del tallo seco del plátano, lo que el cultivo ya no usa. De textura gruesa y tono tierra: da un tejido rústico, con mucho carácter.', 'Made from the dried banana stem — what the harvest leaves behind. Thick in texture and earthy in tone, it gives a rustic weave with real character.') },
          sintetico: { titulo: B('Sintético', 'Synthetic fiber'), desc: B('Fibra técnica tejida igual que la natural. No se decolora con el sol ni se daña con la lluvia, y no pierde la forma con el paso del tiempo.', "A technical fiber woven just like the natural ones. It doesn't fade in the sun or suffer in the rain, and it keeps its shape over time.") },
          piola: { titulo: B('Piola náutica', 'Nautical rope'), desc: B('Cuerda trenzada de uso marino, suave al sentarse y muy resistente a la humedad y al roce. No se deshilacha ni se endurece con el tiempo.', 'Braided marine rope — soft to sit on, and highly resistant to damp and friction. It does not fray or stiffen over time.') }
        }
      },
      guia: {
        visible: true,
        titulo: B('¿Dónde va cada material?', 'Where does each material go?'),
        interiorTitulo: B('Interior', 'Indoors'),
        interiorTexto: B('Bajo techo funcionan los seis materiales: las cuatro fibras naturales y los dos de alta resistencia.', 'Under a roof, all six materials work: the four natural fibers and the two high-resistance materials.'),
        exteriorTitulo: B('Exterior', 'Outdoors'),
        exteriorTexto: B('A la intemperie, solo sintético y piola náutica: no se decoloran con el sol ni se dañan con la lluvia.', 'Out in the weather, only synthetic fiber and nautical rope: they do not fade in the sun or suffer in the rain.')
      },
      galeria: { visible: false, titulo: B('', ''), texto: B('', ''), fotos: [] },
      cta: { visible: true, titulo: B('¿No sabes cuál elegir?', 'Not sure which to choose?'), texto: B('Cuéntanos dónde va a estar el mueble y te recomendamos la fibra.', 'Tell us where the piece will live and we will recommend the fiber.'), botones: BOTONES_DEFECTO }
    }
  }),

  base({
    id: 'comedores', type: 'categoria', slug: 'comedores', menuOrder: 4, categoryId: 'comedores', fase: 2,
    text: {
      menuLabel: B('Comedores', 'Dining sets'),
      h1: B('Comedores tejidos a mano', 'Hand-woven dining sets'),
      intro: B(
        'Mesas y sillas para comer en familia, tejidas a mano y por encargo. La mesa puede ir en la misma fibra de las sillas o en madera: piñón de oreja, samán, teca o roble. Tú eliges las medidas, los puestos y la cojinería; nosotros lo hacemos sin afán.',
        'Tables and chairs for family meals, woven by hand and made to order. The table can match the chairs in the same fiber or come in wood: piñón de oreja, samán, teak or oak. You choose the size, the number of seats and the upholstery; we make it, unhurried.')
    },
    seo: {
      title: B('Comedores tejidos a mano por encargo | El Remanso', 'Hand-woven dining sets, made to order | El Remanso'),
      description: B(
        'Comedores con sillas tejidas a mano y mesa en fibra o en madera: piñón de oreja, samán, teca o roble. Por encargo en Medellín y Antioquia.',
        'Dining sets with hand-woven chairs and a table in fiber or wood: piñón de oreja, samán, teak or oak. Made to order in Medellín and Antioquia.'),
      image: ''
    },
    blocks: {
      productos: { visible: true, titulo: B('Nuestros comedores', 'Our dining sets'), texto: B('', '') },
      materiales: {
        visible: true,
        titulo: B('Fibras para las sillas', 'Fibers for the chairs'),
        texto: B('Bajo techo, cualquiera de nuestras fibras naturales; si el comedor está afuera, sintético o piola náutica. La mesa, en la misma fibra o en madera.',
                 'Indoors, any of our natural fibers; if the dining area is outdoors, synthetic fiber or nautical rope. The table, in the same fiber or in wood.'),
        claves: ['rattan', 'mimbre', 'yare', 'sintetico']
      },
      encargo: ENCARGO(
        'Tú decides las medidas, el número de puestos, la fibra, el color del tejido, la madera de la mesa y la cojinería. Te mostramos muestras reales antes de empezar.',
        'You decide the size, the number of seats, the fiber, the tone of the weave, the wood for the table and the upholstery. We show you real samples before we start.'),
      galeria: { visible: false, titulo: B('', ''), texto: B('', ''), fotos: [] },
      cta: { visible: true, titulo: B('¿Para cuántos puestos lo imaginas?', 'How many seats are you picturing?'), texto: B('Escríbenos y armamos tu comedor juntos.', 'Write to us and we will put your dining set together.'), botones: BOTONES_DEFECTO },
      cobertura: COBERTURA
    }
  }),

  base({
    id: 'como-trabajamos', type: 'proceso', slug: 'como-trabajamos', menuOrder: 6, fase: 2,
    text: {
      menuLabel: B('Cómo trabajamos', 'How we work'),
      h1: B('De tu idea a tu casa, en siete pasos', 'From your idea to your home, in seven steps'),
      intro: B(
        'Los primeros cuatro pasos los decidimos contigo; los tres últimos ocurren en el taller. Así sabes siempre en qué va tu mueble.',
        'The first four steps we decide together; the last three happen in the workshop. That way you always know where your piece stands.')
    },
    seo: {
      title: B('Cómo trabajamos: tu mueble en siete pasos | El Remanso', 'How we work: your piece in seven steps | El Remanso'),
      description: B(
        'De las medidas a la entrega: así hacemos cada mueble tejido a mano y por encargo, en siete pasos que decidimos contigo. Medellín y Antioquia.',
        'From measurements to delivery: how we make every hand-woven, made-to-order piece, in seven steps we decide with you. Medellín and Antioquia.'),
      image: ''
    },
    blocks: {
      pasos: {
        visible: true,
        titulo: B('', ''),
        texto: B('', ''),
        items: [
          { titulo: B('Medidas', 'Measurements'), desc: B('Tomamos las medidas del espacio donde va a vivir el mueble, para que entre justo y se sienta cómodo.', 'We take the measurements of the space the piece will live in, so it fits just right and feels comfortable.') },
          { titulo: B('Diseño', 'Design'), desc: B('Elegimos juntos la forma: un modelo del catálogo tal cual, o una versión pensada a tu medida.', 'We choose the shape together: a catalog model as it is, or a version made to your own measurements.') },
          { titulo: B('Material', 'Material'), desc: B('Escogemos la fibra según el uso y el lugar: natural para interiores; sintético o piola náutica si va a estar a la intemperie.', 'We pick the fiber by use and place: natural indoors; synthetic or nautical rope if it will face the weather.') },
          { titulo: B('Color y cojinería', 'Color & Upholstery'), desc: B('Eliges el tono del tejido y la tela de los cojines. Te mostramos muestras reales antes de empezar a tejer.', 'You choose the tone of the weave and the fabric for the cushions. We show you real samples before any weaving starts.') },
          { titulo: B('Tejido', 'Weaving'), desc: B('Nuestros maestros tejen la pieza a mano, hebra por hebra. Es el paso más lento — y el que marca la diferencia.', "Our craftspeople weave the piece by hand, strand by strand. It's the slowest step — and the one that makes the difference.") },
          { titulo: B('Acabado', 'Finish'), desc: B('Aplicamos el color y la protección, y revisamos la pieza completa: uniones, nivelación y terminados.', 'We apply the color and the protective coat, then check the whole piece: joints, leveling and finishing.') },
          { titulo: B('Entrega', 'Delivery'), desc: B('Coordinamos la fecha contigo y llevamos tu mueble armado hasta tu hogar.', 'We agree a date with you and bring your finished piece home, fully assembled.') }
        ]
      },
      galeria: { visible: false, titulo: B('', ''), texto: B('', ''), fotos: [] },
      cta: { visible: true, titulo: B('¿Empezamos por las medidas?', 'Shall we start with the measurements?'), texto: B('Escríbenos y te contamos cómo arrancar.', 'Write to us and we will tell you how to get started.'), botones: BOTONES_DEFECTO }
    }
  }),

  base({
    id: 'clientes', type: 'galeria', slug: 'clientes', menuOrder: 7, showInMenu: false, fase: 3,
    text: {
      menuLabel: B('Clientes', 'Our clients'),
      h1: B('Muebles en casa de nuestros clientes', "Our furniture in our clients' homes"),
      intro: B(
        'Así se ven nuestras piezas cuando ya llegaron a su lugar: fotos reales de salas, comedores, columpios y terrazas de quienes confiaron en nosotros.',
        'This is how our pieces look once they reach their place: real photos of living rooms, dining rooms, swings and terraces from the people who trusted us.')
    },
    seo: {
      title: B('Nuestros muebles en casa de clientes | El Remanso', "Our furniture in clients' homes | El Remanso"),
      description: B(
        'Fotos reales de muebles tejidos a mano de El Remanso en las casas de nuestros clientes en Medellín, Envigado y Antioquia.',
        "Real photos of El Remanso's hand-woven furniture in our clients' homes in Medellín, Envigado and Antioquia."),
      image: ''
    },
    blocks: {
      galeria: { visible: true, titulo: B('', ''), texto: B('', ''), fotos: [] },
      cta: { visible: true, titulo: B('¿Quieres que tu casa sea la próxima?', 'Would you like your home to be next?'), texto: B('Escríbenos y empezamos por las medidas.', 'Write to us and we will start with the measurements.'), botones: BOTONES_DEFECTO },
      cobertura: COBERTURA
    }
  }),

  base({
    id: 'hoteles', type: 'hoteles', slug: 'hoteles', menuOrder: 8, showInMenu: false, fase: 3,
    text: {
      menuLabel: B('Hoteles y proyectos', 'Hotels & projects'),
      h1: B('Muebles tejidos para hoteles y espacios comerciales', 'Woven furniture for hotels and commercial spaces'),
      intro: B(
        'Tejemos a mano mobiliario para hoteles, restaurantes, fincas y espacios comerciales: piezas por encargo, en la cantidad y las medidas que pida el proyecto, con materiales para interior y para la intemperie.',
        'We hand-weave furniture for hotels, restaurants, country houses and commercial spaces: made-to-order pieces, in the quantities and sizes the project needs, with materials for indoors and for the weather.')
    },
    seo: {
      title: B('Muebles tejidos para hoteles y proyectos | El Remanso', 'Woven furniture for hotels and projects | El Remanso'),
      description: B(
        'Mobiliario tejido a mano para hoteles, restaurantes y espacios comerciales, por encargo y en cantidad. Solicita una propuesta por WhatsApp.',
        'Hand-woven furniture for hotels, restaurants and commercial spaces, made to order and in volume. Request a proposal on WhatsApp.'),
      image: ''
    },
    blocks: {
      texto: {
        visible: true,
        titulo: B('Cómo trabajamos un proyecto', 'How we work on a project'),
        texto: B(
          'Nos cuentas el espacio, el estilo y las cantidades. Te proponemos piezas, fibras y acabados, y te enviamos una propuesta con los tiempos de elaboración.\n\nTejemos con el mismo cuidado una pieza que cincuenta, y coordinamos contigo entregas por etapas si el proyecto lo necesita.',
          'You tell us about the space, the style and the quantities. We suggest pieces, fibers and finishes, and send you a proposal with production times.\n\nWe weave fifty pieces with the same care as one, and we can schedule deliveries in stages if the project needs it.')
      },
      galeria: { visible: false, titulo: B('', ''), texto: B('', ''), fotos: [] },
      cta: {
        visible: true,
        titulo: B('Solicita una propuesta para tu proyecto', 'Request a proposal for your project'),
        texto: B('Cuéntanos qué tienes en mente y te respondemos por WhatsApp.', 'Tell us what you have in mind and we will reply on WhatsApp.'),
        botones: [
          { text: B('Solicitar propuesta por WhatsApp', 'Request a proposal on WhatsApp'), url: enlaceWhatsapp(WA_DEFECTO, 'Hola El Remanso, quiero una propuesta para un proyecto de hotel o espacio comercial.') },
          { text: B('Ver todo el catálogo', 'View the full catalog'), url: '/catalogo' }
        ]
      },
      cobertura: COBERTURA
    }
  })
];

// Categoria que se crea con las paginas: agrupa lo que va a la intemperie.
// No sale como seccion de /catalogo (cada pieza ya esta en la suya); solo
// alimenta la pagina /exterior.
export const CATEGORIA_EXTERIOR = {
  id: 'exterior',
  label: 'Exterior',
  teaser: 'Piezas para la terraza, el balcón y el jardín, en materiales que aguantan sol y lluvia.',
  order: 9,
  active: true,
  flagship: false,
  showInCatalog: false
};
