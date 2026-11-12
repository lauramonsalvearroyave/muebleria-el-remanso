// El Remanso — dibuja el catálogo y las categorías leyendo Firestore.
// Usado por catalogo.html (#catalogRoot) e index.html (#homeCategoriesRoot,
// enlace #homeFlagshipLink). Los productos/categorías los administra el
// panel admin.html; este script solo LEE (nunca escribe).

// Cloudinary genera variantes al vuelo insertando parametros en la URL.
// La tarjeta mide unos 400 px, asi que servirle la foto original de 1800 px
// y 800 KB es desperdiciar 9 de cada 10 bytes. El archivo guardado no se
// toca: el visor sigue abriendo el original a resolucion completa.
function variante(url, transformacion) {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;   // fotos del repositorio u otras fuentes: se dejan igual
  }
  return url.replace('/upload/', '/upload/' + transformacion + '/');
}

// Spinner de carga. Se usa en los huecos que se llenan desde Firestore, para
// que no se vea el fondo pelado mientras llega la respuesta. Sin texto: la
// animacion ya dice lo que hay que decir.
function spinnerHtml(px) {
  const tam = px || 120;
  return `
    <div class="er-loader" role="status" aria-label="Cargando">
      <div class="er-loader__mark" style="width:${tam}px;height:${tam}px;">
        <svg class="er-loader__ring" viewBox="0 0 184 184" aria-hidden="true">
          <circle class="track" cx="92" cy="92" r="88"/>
          <circle class="arc" cx="92" cy="92" r="88"/>
        </svg>
        <img class="er-loader__logo" src="assets/img/logo-mark.png" alt="" style="width:${Math.round(tam*0.48)}px;height:${Math.round(tam*0.48)}px;">
      </div>
    </div>`;
}

// Todas las fotos de una pieza, en orden: la portada primero. Se separan asi
// -- portada en imageUrl, resto en images -- para que una pieza de una sola
// foto siga guardandose y leyendose igual que siempre.
function fotosDe(p) {
  const todas = [p.imageUrl, ...(Array.isArray(p.images) ? p.images : [])];
  const vistas = new Set();
  return todas
    .map(u => (u || '').trim())
    .filter(u => u && !vistas.has(u) && vistas.add(u));
}

function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

const MATERIAL_KEYS = {
  mimbre: 'catalog.tag_mimbre',
  yare: 'catalog.tag_yare',
  rattan: 'catalog.tag_rattan',
  calceta: 'catalog.tag_calceta',
  sintetico: 'catalog.tag_sintetico',
  piola: 'catalog.tag_piola'
};

// Boton de compartir de cada ficha. Mismo HTML en assets/js/paginas.mjs
// (tarjetaProducto): si se cambia uno, cambiar el otro.
function botonCompartirHtml(etiqueta) {
  return `<button class="btn-compartir" type="button" aria-label="${esc(etiqueta)}" data-i18n-aria="catalog.share_btn"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg></button>`;
}

// "Nuevo" se quita solo: isNew guarda la fecha en que se marco (o false), y
// la pieza deja de verse como nueva DIAS_NUEVO dias despues. Las marcadas
// antes de guardar la fecha (isNew: true) cuentan desde NUEVO_DESDE_ANTES.
// La misma regla esta en assets/js/paginas.mjs y assets/js/admin.js.
const DIAS_NUEVO = 15;
const NUEVO_DESDE_ANTES = '2026-11-12T00:00:00-05:00';
function esNueva(p) {
  if (!p.isNew) return false;
  const desde = Date.parse(p.isNew === true ? NUEVO_DESDE_ANTES : p.isNew);
  return !isNaN(desde) && Date.now() - desde < DIAS_NUEVO * 86400000;
}

function productCardHtml(p) {
  const t = window.ErI18n.t;
  const soldOutClass = p.soldOut ? ' is-soldout' : '';

  const badges = [];
  if (p.featured) badges.push(`<span class="product-badge featured" data-i18n="catalog.badge_featured">${esc(t('catalog.badge_featured'))}</span>`);
  if (esNueva(p)) badges.push(`<span class="product-badge new" data-i18n="catalog.badge_new">${esc(t('catalog.badge_new'))}</span>`);
  if (p.soldOut) badges.push(`<span class="product-badge soldout" data-i18n="catalog.badge_soldout">${esc(t('catalog.badge_soldout'))}</span>`);

  // Una pieza puede tener varias fotos. La portada vive en imageUrl y las
  // demas en images; la cuadricula muestra solo la portada, para que no se
  // mueva sola, y el resto aparece al ampliarla.
  const galeria = fotosDe(p);
  // Solo se puede ampliar si de verdad hay foto: el marcador de "proximamente"
  // no lleva cursor de lupa ni responde al clic.
  const media = galeria.length
    ? `<img src="${esc(variante(galeria[0], 'w_800,f_auto,q_auto'))}" data-full="${esc(galeria[0])}" alt="${esc(p.name)}" loading="lazy">`
    : `<span class="placeholder-note" data-i18n="catalog.photo_note">${esc(t('catalog.photo_note'))}</span>`;
  const zoomable = galeria.length ? ' is-zoomable' : '';
  // La senal de que hay mas fotos. Discreta a proposito: la cuadricula es para
  // mirar muebles, no para contar archivos.
  const contador = galeria.length > 1
    ? `<span class="foto-count"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="3" width="14" height="14" rx="2"/><path d="M3 7v12a2 2 0 0 0 2 2h12"/></svg>${galeria.length}</span>`
    : '';
  const datosGaleria = galeria.length > 1 ? ` data-gallery="${esc(JSON.stringify(galeria))}"` : '';

  const materialKey = MATERIAL_KEYS[p.material];
  const materialTag = materialKey
    ? `<span class="tag-pill" data-i18n="${materialKey}">${esc(t(materialKey))}</span>`
    : '';

  // Todas las piezas se tejen por encargo, asi que la etiqueta va en todas.
  const customTag = `<span class="tag-pill tag-custom" data-i18n="catalog.tag_custom">${esc(t('catalog.tag_custom'))}</span>`;

  const story = p.story ? `<p class="product-name-story">${esc(p.story)}</p>` : '';
  const interestBtn = p.soldOut ? '' : `
    <button class="btn-interest" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 8.6a4.6 4.6 0 0 0-8-3.1 4.6 4.6 0 0 0-8 3.1c0 5 8 10.4 8 10.4s8-5.4 8-10.4Z"/></svg>
      <span data-i18n="catalog.interest_btn">${esc(t('catalog.interest_btn'))}</span>
    </button>`;

  return `
    <div class="product-card${soldOutClass}" data-product-id="${esc(p.id)}" id="pieza-${esc(p.id)}"${p.featured ? ' data-destacada' : ''}${esNueva(p) ? ' data-nueva' : ''}>
      <div class="product-thumb${zoomable}"${datosGaleria}>
        <div class="product-badges">${badges.join('')}</div>
        ${media}
        ${contador}
      </div>
      <div class="product-body">
        <div class="product-tags">${materialTag}${customTag}</div>
        <h3>${esc(p.name)}</h3>
        ${story}
        <div class="product-acciones">${interestBtn}
          ${botonCompartirHtml(t('catalog.share_btn'))}
        </div>
      </div>
    </div>`;
}

function categoryBlockHtml(cat, products) {
  const t = window.ErI18n.t;
  const badge = cat.flagship
    ? `<span class="category-badge" data-i18n="catalog.cat_flagship_badge">${esc(t('catalog.cat_flagship_badge'))}</span>`
    : '';
  const gridClass = products.length >= 4 ? 'grid-4' : 'grid-3';
  const cardsHtml = products.length
    ? products.map(productCardHtml).join('')
    : `<p class="admin-empty" style="grid-column:1/-1;" data-i18n="catalog.empty_category">${esc(t('catalog.empty_category'))}</p>`;

  return `
    <div class="category-block" data-category="${esc(cat.id)}" id="${esc(cat.id)}">
      <div class="category-intro"><h2>${esc(cat.label)} ${badge}</h2></div>
      <div class="grid ${gridClass}">${cardsHtml}</div>
    </div>`;
}

// Datos estructurados del catalogo. El contenido lo dibuja JavaScript desde
// Firestore, asi que los nombres e historias de las piezas -- el mejor
// material que hay para busqueda -- no estan en el HTML que llega del
// servidor. Esto se los entrega a Google en un formato que entiende.
// No se declara precio: se acuerda por WhatsApp segun medidas y material,
// e inventar uno seria falso.
function publicarDatosDeProductos(categories, products) {
  const porId = {};
  categories.forEach(c => { porId[c.id] = c.label; });

  const lista = products.slice(0, 100).map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: p.name,
      ...(p.story ? { description: p.story } : {}),
      ...(fotosDe(p).length ? { image: fotosDe(p).map(u => variante(u, 'w_1200,f_auto,q_auto')) } : {}),
      ...(porId[p.categoryId] ? { category: porId[p.categoryId] } : {}),
      ...(p.material ? { material: window.ErI18n.t(MATERIAL_KEYS[p.material] || '') } : {}),
      brand: { "@type": "Brand", name: "El Remanso" },
      url: `https://muebleriaelremanso.com//catalogo#${p.categoryId || ''}`
    }
  }));

  const datos = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Catálogo El Remanso",
    numberOfItems: lista.length,
    itemListElement: lista
  };

  let tag = document.getElementById('catalogoJsonLd');
  if (!tag) {
    tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.id = 'catalogoJsonLd';
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify(datos);
}

function renderCatalogPage(root, categories, products) {
  const t = window.ErI18n.t;
  const byCategory = {};
  products.forEach(p => { (byCategory[p.categoryId] ||= []).push(p); });
  Object.values(byCategory).forEach(list => list.sort((a, b) => (a.order || 0) - (b.order || 0)));

  // Destacados y Nuevos van justo despues de "Todas", y solo si hay piezas
  // asi: un filtro que deja la pagina vacia no sirve.
  const especiales = [
    ['destacados', 'catalog.filter_featured', products.some(p => p.featured)],
    ['nuevos', 'catalog.filter_new', products.some(esNueva)]
  ].filter(e => e[2])
    .map(([id, clave]) => `<button class="filter-chip filter-chip--especial" data-filter="${id}" data-i18n="${clave}">${esc(t(clave))}</button>`);
  const chips = [`<button class="filter-chip active" data-filter="todos" data-i18n="catalog.filter_all">${esc(t('catalog.filter_all'))}</button>`]
    .concat(especiales)
    .concat(categories.map(c => `<button class="filter-chip" data-filter="${esc(c.id)}">${esc(c.label)}</button>`))
    .join('');

  const blocks = categories.map(c => categoryBlockHtml(c, byCategory[c.id] || [])).join('');

  root.innerHTML = `<div class="filter-bar">${chips}</div>${blocks}`;
  attachCatalogInteractions(root);
  irALaSeccionDelEnlace(root);
  irALaPiezaDelEnlace();
  publicarDatosDeProductos(categories, products);
  document.dispatchEvent(new CustomEvent('catalogRendered'));
}

// Al llegar desde el inicio con /catalogo#salas, el navegador procesa el
// ancla ANTES de que este script dibuje las secciones, asi que no encuentra
// nada y se queda arriba. Hay que hacerlo a mano cuando ya existen.
function irALaSeccionDelEnlace(root) {
  const id = decodeURIComponent((location.hash || '').replace('#', '')).trim();
  if (!id) return;

  const bloque = root.querySelector(`.category-block[data-category="${CSS.escape(id)}"]`);
  // Se activa tambien el filtro: quien hizo clic en "Sofas" viene buscando
  // sofas, no el catalogo entero abierto por ahi. /catalogo#nuevos y
  // /catalogo#destacados abren esos filtros (sirven para Instagram).
  const chip = root.querySelector(`.filter-chip[data-filter="${CSS.escape(id)}"]`);
  if (!bloque && !chip) return;
  if (chip) chip.click();

  // El clic del filtro ya desplaza a la barra; si no hubo chip, se va al bloque.
  if (!chip) {
    const top = bloque.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function attachCatalogInteractions(root) {
  const chips = root.querySelectorAll('.filter-chip');
  const blocks = root.querySelectorAll('.category-block[data-category]');
  const filterBar = root.querySelector('.filter-bar');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const category = chip.dataset.filter;
      if (window.ErFirebase) {
        window.ErFirebase.track('filtrar_categoria', {
          categoria: category,
          nombre: (chip.textContent || '').trim().slice(0, 100)
        });
      }
      // Destacados / Nuevos filtran pieza por pieza dentro de cada coleccion
      // y esconden las colecciones que se quedan sin ninguna.
      const marca = { destacados: 'data-destacada', nuevos: 'data-nueva' }[category];
      blocks.forEach(block => {
        const fichas = block.querySelectorAll('.product-card');
        if (marca) {
          let hay = 0;
          fichas.forEach(c => {
            const si = c.hasAttribute(marca);
            c.style.display = si ? '' : 'none';
            if (si) hay++;
          });
          block.style.display = hay ? '' : 'none';
          return;
        }
        fichas.forEach(c => { c.style.display = ''; });
        const match = category === 'todos' || block.dataset.category === category;
        block.style.display = match ? '' : 'none';
      });
      if (filterBar) {
        const headerOffset = 90;
        const top = filterBar.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

function piezasDe(products, categoryId) {
  return products.filter(p => p.categoryId === categoryId);
}

// Si la coleccion tiene su pagina encendida (/salas, /comedores...), se va
// alla: ahi la gente se queda mas. Si no, a su seccion del catalogo.
function enlaceDeColeccion(categoryId) {
  const pag = ((window.ER_PAGINAS && window.ER_PAGINAS.publicadas) || [])
    .find(p => p.tipo === 'categoria' && p.categoria === categoryId);
  return pag ? `/${pag.slug}` : `/catalogo#${categoryId}`;
}

// Las colecciones llevan la foto de su primera pieza: una foto invita mas
// que un titulo solo.
function renderHomeCategoryTeasers(root, categories, products) {
  const t = window.ErI18n.t;
  const visible = categories.filter(c => !c.flagship);
  root.innerHTML = visible.map(c => {
    const piezas = piezasDe(products, c.id);
    const conFoto = piezas.find(p => fotosDe(p).length);
    const foto = conFoto
      ? `<div class="coleccion-foto"><img src="${esc(variante(fotosDe(conFoto)[0], 'w_700,f_auto,q_auto'))}" alt="" loading="lazy" decoding="async"></div>`
      : '';
    const cuantas = piezas.length
      ? `<span class="coleccion-cuantas">${piezas.length} ${esc(t(piezas.length === 1 ? 'home.cat_piece' : 'home.cat_pieces'))}</span>`
      : '';
    return `
    <a href="${esc(enlaceDeColeccion(c.id))}" class="card coleccion${foto ? '' : ' sin-foto'}" data-origen="colecciones">
      ${foto}
      <div class="coleccion-texto">
        <h3>${esc(c.label)}</h3>
        ${c.teaser ? `<p>${esc(c.teaser)}</p>` : ''}
        <span class="coleccion-ir">${cuantas}<span data-i18n="home.cat_go">${esc(t('home.cat_go'))}</span> →</span>
      </div>
    </a>`;
  }).join('');
}

// Linea insignia del inicio: mosaico con sus piezas con foto (hasta 4). La
// primera va en grande; el CSS acomoda el resto segun cuantas sean
// (mosaico--1 a mosaico--4). Cada una lleva su frase, que es lo que la hace
// sentir especial. El nombre va sin el " · Línea Insignia" del final, que
// ahi sobra. Sin piezas, quedan el titulo y los botones.
function renderHomeFlagship(root, categories, products) {
  const insignia = categories.find(c => c.flagship);
  const piezas = insignia ? products.filter(p => p.categoryId === insignia.id && fotosDe(p).length).slice(0, 4) : [];
  if (!piezas.length) {
    root.hidden = true;
    return;
  }
  root.classList.add(`mosaico--${piezas.length}`);
  root.innerHTML = piezas.map((p, i) => `
    <a href="/catalogo#pieza-${esc(encodeURIComponent(p.id))}" class="pieza-insignia" data-origen="linea_remanso">
      <img src="${esc(variante(fotosDe(p)[0], i === 0 ? 'w_1200,f_auto,q_auto' : 'w_800,f_auto,q_auto'))}" alt="${esc(p.name)}" loading="lazy" decoding="async">
      <span class="pieza-insignia__texto">
        <strong>${esc(String(p.name || '').split(' · ')[0])}</strong>
        ${p.story ? `<em>${esc(p.story)}</em>` : ''}
      </span>
    </a>`).join('');
}

// Piezas destacadas del inicio: las marcadas como "Destacado" en el panel.
// Si hay menos de 4, se completa con una pieza con foto de cada coleccion,
// para que siempre haya muebles a la vista: la segunda, porque la primera
// ya es la foto de su coleccion mas abajo. La linea insignia no entra: tiene
// su propia seccion. Cada una lleva a su ficha del catalogo, que la abre en
// grande.
const MAX_DESTACADAS = 6;
function renderHomeFeatured(root, categories, products) {
  const conFoto = products.filter(p => fotosDe(p).length && !p.soldOut);
  let lista = conFoto.filter(p => p.featured);
  if (lista.length < 4) {
    categories.filter(c => !c.flagship).forEach(c => {
      const deLaColeccion = conFoto.filter(p => p.categoryId === c.id && !lista.includes(p));
      const pieza = deLaColeccion[1] || deLaColeccion[0];
      if (pieza) lista.push(pieza);
    });
  }
  lista = lista.slice(0, MAX_DESTACADAS);
  if (!lista.length) {
    root.closest('section').hidden = true;
    return;
  }
  const nombres = {};
  categories.forEach(c => { nombres[c.id] = c.label; });
  root.classList.toggle('destacadas--4', lista.length === 4);
  root.innerHTML = lista.map(p => `
    <a href="/catalogo#pieza-${esc(encodeURIComponent(p.id))}" class="destacada" data-origen="destacadas">
      <div class="destacada-foto"><img src="${esc(variante(fotosDe(p)[0], 'w_700,f_auto,q_auto'))}" alt="${esc(p.name)}" loading="lazy" decoding="async"></div>
      <div class="destacada-texto">
        ${nombres[p.categoryId] ? `<span class="destacada-coleccion">${esc(nombres[p.categoryId])}</span>` : ''}
        <h3>${esc(p.name)}</h3>
      </div>
    </a>`).join('');
}

// Sin foto cargada, el hueco no se muestra: un recuadro vacio o un "foto
// proximamente" se ve a medio hacer. El texto pasa a ocupar todo el ancho.
function ponerFotoOcultar(slot, html) {
  if (!slot) return;
  slot.innerHTML = html;
  slot.hidden = !html;
  const fila = slot.parentElement;
  if (fila) fila.classList.toggle('sin-foto', !html);
}

async function renderHomeImages() {
  const heroSlot = document.getElementById('heroImageSlot');
  const aboutSlot = document.getElementById('aboutImageSlot');
  if (!heroSlot && !aboutSlot) return;

  // Mientras llega la respuesta de Firestore, spinner en vez de fondo pelado.
  if (heroSlot) heroSlot.innerHTML = spinnerHtml(130);
  if (aboutSlot) aboutSlot.innerHTML = spinnerHtml(130);

  try {
    const settings = await window.ErFirebase.fetchHomeSettings();

    // Los huecos miden unos 500 px de ancho: pedir 900 basta de sobra a 2x.
    // La foto original se guarda intacta; esto es solo lo que se entrega.
    ponerFotoOcultar(heroSlot, settings.heroImageUrl
      ? `<img src="${esc(variante(settings.heroImageUrl, 'w_900,f_auto,q_auto'))}" alt="" fetchpriority="high">`
      : '');
    ponerFotoOcultar(aboutSlot, settings.aboutImageUrl
      ? `<img src="${esc(variante(settings.aboutImageUrl, 'w_900,f_auto,q_auto'))}" alt="" loading="lazy">`
      : '');
  } catch (err) {
    console.error('No se pudieron cargar las fotos del inicio:', err);
    ponerFotoOcultar(heroSlot, '');
    ponerFotoOcultar(aboutSlot, '');
  }
}

// ---------- Comentarios aprobados (carrusel del inicio) ----------

function testimonialHtml(c) {
  const who = [c.name, c.city].filter(Boolean).join(' · ');
  return `
    <figure class="testimonial">
      <blockquote><p>"${esc(c.quote)}"</p></blockquote>
      <figcaption class="who">— ${esc(who || 'Cliente de El Remanso')}</figcaption>
    </figure>`;
}

// Flechas y puntos solo aparecen si hay mas tarjetas de las que caben.
function setUpCarousel(section, track, dotsRoot) {
  const prev = section.querySelector('.carousel-arrow.prev');
  const next = section.querySelector('.carousel-arrow.next');
  const cards = Array.from(track.children);

  const perView = () => {
    const card = cards[0];
    if (!card) return 1;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return Math.max(1, Math.round((track.clientWidth + gap) / (card.offsetWidth + gap)));
  };

  const pages = () => Math.max(1, Math.ceil(cards.length / perView()));
  const currentPage = () => {
    const card = cards[0];
    if (!card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return Math.round(track.scrollLeft / ((card.offsetWidth + gap) * perView()));
  };

  function renderDots() {
    const total = pages();
    if (total <= 1) {
      dotsRoot.innerHTML = '';
      prev.hidden = next.hidden = true;
      return;
    }
    prev.hidden = next.hidden = false;
    const now = currentPage();
    dotsRoot.innerHTML = Array.from({ length: total }, (_, i) =>
      `<button type="button" data-page="${i}" aria-current="${i === now}" aria-label="${i + 1}"></button>`
    ).join('');
    prev.disabled = now === 0;
    next.disabled = now >= total - 1;
  }

  function goTo(page) {
    const card = cards[0];
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    track.scrollTo({ left: page * (card.offsetWidth + gap) * perView() });
  }

  prev.addEventListener('click', () => goTo(Math.max(0, currentPage() - 1)));
  next.addEventListener('click', () => goTo(Math.min(pages() - 1, currentPage() + 1)));
  dotsRoot.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-page]');
    if (b) goTo(Number(b.dataset.page));
  });

  let raf = null;
  track.addEventListener('scroll', () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(renderDots);
  });
  window.addEventListener('resize', renderDots);
  renderDots();
}

// ---------- Fotos de los materiales (inicio) ----------
// Se administran desde el panel. Si un material no tiene foto, se queda su
// textura de color, que es un respaldo digno y no un hueco.

async function renderMaterialImages() {
  const recuadros = document.querySelectorAll('.material-swatch[data-material]');
  if (!recuadros.length) return;

  let fotos = {};
  try {
    fotos = await window.ErFirebase.fetchMaterialImages();
  } catch (err) {
    console.error('No se pudieron cargar las fotos de los materiales:', err);
    return;
  }

  recuadros.forEach(rec => {
    const url = fotos[rec.dataset.material];
    if (!url) return;
    // El recuadro mide 208 px; 600 alcanza de sobra hasta en pantallas 2x.
    const liviana = variante(url, 'w_600,f_auto,q_auto');
    let img = rec.querySelector('img');
    if (!img) {
      img = new Image();
      img.loading = 'lazy';
      img.alt = '';
      rec.appendChild(img);
    }
    img.src = liviana;
  });
}

const MINIMO_COMENTARIOS = 3;

async function renderComments() {
  const section = document.getElementById('commentsSection');
  if (!section) return;

  let comments = [];
  try {
    comments = await window.ErFirebase.fetchPublishedTestimonials();
  } catch (err) {
    console.error('No se pudieron cargar los comentarios:', err);
    return;                         // la seccion se queda oculta, que es lo correcto
  }
  // Un carrusel con uno o dos comentarios se ve vacio, y hasta resta
  // confianza: la seccion aparece sola cuando ya hay suficientes.
  if (comments.length < MINIMO_COMENTARIOS) return;

  const track = document.getElementById('commentsTrack');
  track.innerHTML = comments.map(testimonialHtml).join('');
  section.hidden = false;
  setUpCarousel(section, track, document.getElementById('commentsDots'));
}

// ---------- Visor de foto ampliada ----------

function setUpLightbox() {
  const box = document.getElementById('photoLightbox');
  if (!box) return;

  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const contador = document.getElementById('lightboxCount');
  let ultimoFoco = null;
  let fotos = [];
  let actual = 0;

  function mostrar(i) {
    if (!fotos.length) return;
    // Da la vuelta: despues de la ultima viene la primera.
    actual = (i + fotos.length) % fotos.length;
    img.src = fotos[actual];
    if (contador) contador.textContent = fotos.length > 1 ? `${actual + 1} / ${fotos.length}` : '';
    const varias = fotos.length > 1;
    if (prevBtn) prevBtn.hidden = !varias;
    if (nextBtn) nextBtn.hidden = !varias;
    // La siguiente se va cargando mientras se mira esta, para que el cambio
    // sea inmediato y no un parpadeo en blanco.
    if (varias) new Image().src = fotos[(actual + 1) % fotos.length];
  }

  function abrir(galeria, alt, nombre, historia) {
    ultimoFoco = document.activeElement;
    fotos = galeria;
    img.alt = alt || nombre || '';
    caption.innerHTML = esc(nombre || '') + (historia ? `<span>${esc(historia)}</span>` : '');
    mostrar(0);
    box.hidden = false;
    // Sin esto la pagina de atras sigue desplazandose bajo el visor.
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function cerrar() {
    box.hidden = true;
    img.src = '';
    fotos = [];
    document.body.style.overflow = '';
    if (ultimoFoco) ultimoFoco.focus();
  }

  // Delegacion: las fichas se dibujan despues de leer Firestore.
  document.addEventListener('click', (e) => {
    const thumb = e.target.closest('.product-thumb.is-zoomable');
    if (!thumb) return;
    const foto = thumb.querySelector('img');
    if (!foto) return;
    const card = thumb.closest('.product-card');
    const nombre = card ? (card.querySelector('h3')?.textContent || '').trim() : '';
    const historia = card ? (card.querySelector('.product-name-story')?.textContent || '').trim() : '';
    // Ampliar la foto es la senal mas honesta de interes: nadie abre a
    // pantalla completa un mueble que no le llamo la atencion.
    if (window.ErFirebase) {
      window.ErFirebase.track('ver_pieza', { pieza: (nombre || '').slice(0, 100) });
    }
    // data-full es la foto original; src es la variante liviana de la tarjeta.
    const portada = foto.dataset.full || foto.currentSrc || foto.src;
    let galeria = [portada];
    if (thumb.dataset.gallery) {
      // Si el dato viniera roto, mejor abrir solo la portada que no abrir nada.
      try {
        const lista = JSON.parse(thumb.dataset.gallery);
        if (Array.isArray(lista) && lista.length) galeria = lista;
      } catch (err) { /* se queda con la portada */ }
    }
    abrir(galeria, foto.alt, nombre, historia);
  });

  closeBtn.addEventListener('click', cerrar);
  if (prevBtn) prevBtn.addEventListener('click', () => mostrar(actual - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => mostrar(actual + 1));

  // Clic en el fondo cierra; clic sobre la foto o los botones, no.
  box.addEventListener('click', (e) => {
    if (!e.target.closest('.lightbox-figure') && !e.target.closest('.lightbox-close') &&
        !e.target.closest('.lightbox-nav')) cerrar();
  });
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') cerrar();
    if (fotos.length < 2) return;
    if (e.key === 'ArrowRight') mostrar(actual + 1);
    if (e.key === 'ArrowLeft') mostrar(actual - 1);
  });

  // Deslizar en el celular, que es donde casi nadie busca una flecha.
  let xInicio = null;
  let yInicio = null;
  box.addEventListener('touchstart', (e) => {
    xInicio = e.changedTouches[0].clientX;
    yInicio = e.changedTouches[0].clientY;
  }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (xInicio === null || fotos.length < 2) return;
    const dx = e.changedTouches[0].clientX - xInicio;
    const dy = e.changedTouches[0].clientY - yInicio;
    // Solo cuenta si fue claramente horizontal: si no, se confunde con
    // desplazar la pagina y las fotos saltan solas.
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      mostrar(actual + (dx < 0 ? 1 : -1));
    }
    xInicio = null;
    yInicio = null;
  }, { passive: true });
}

// ---------- Compartir una pieza ----------
// Cada ficha tiene su ancla (#pieza-<id>): el enlace abre la misma pagina
// donde se compartio (/catalogo o /salas...) y baja hasta esa pieza.

const ICONOS_COMPARTIR = {
  copiar: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6Z"/></svg>',
  correo: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'
};

function enlaceDePieza(card) {
  return `${location.origin}${location.pathname}#pieza-${encodeURIComponent(card.dataset.productId)}`;
}

async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch (err) {
    // Navegadores viejos o sin permiso: el metodo antiguo todavia funciona.
    const area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

function setUpCompartir() {
  const t = window.ErI18n.t;
  const menu = document.createElement('div');
  menu.className = 'menu-compartir';
  menu.hidden = true;
  menu.setAttribute('role', 'dialog');
  document.body.appendChild(menu);
  let card = null;
  let boton = null;

  function cerrar() {
    if (menu.hidden) return;
    menu.hidden = true;
    if (boton) boton.setAttribute('aria-expanded', 'false');
    card = null;
  }

  function abrir(btn) {
    boton = btn;
    card = btn.closest('.product-card');
    menu.setAttribute('aria-label', t('catalog.share_title'));
    menu.innerHTML = `
      <p class="menu-compartir__titulo">${esc(t('catalog.share_title'))}</p>
      ${['copiar', 'whatsapp', 'correo'].map(medio => `
        <button type="button" data-medio="${medio}">${ICONOS_COMPARTIR[medio]}<span>${esc(t({ copiar: 'catalog.share_copy', whatsapp: 'catalog.share_whatsapp', correo: 'catalog.share_email' }[medio]))}</span></button>`).join('')}`;
    menu.hidden = false;
    btn.setAttribute('aria-expanded', 'true');

    // Debajo del boton, alineado a su derecha, sin salirse de la pantalla.
    const r = btn.getBoundingClientRect();
    const ancho = menu.offsetWidth;
    const izq = Math.min(Math.max(8, r.right - ancho), document.documentElement.clientWidth - ancho - 8);
    menu.style.left = `${izq + window.scrollX}px`;
    menu.style.top = `${r.bottom + 8 + window.scrollY}px`;
    menu.querySelector('button').focus();
  }

  async function compartir(medio) {
    if (!card) return;
    const nombre = (card.querySelector('h3')?.textContent || '').trim();
    const url = enlaceDePieza(card);
    if (window.ErFirebase) window.ErFirebase.track('compartir_pieza', { pieza: nombre.slice(0, 100), medio });

    if (medio === 'copiar') {
      const ok = await copiarTexto(url);
      const etiqueta = menu.querySelector('[data-medio="copiar"] span');
      if (ok && etiqueta) etiqueta.textContent = t('catalog.share_copied');
      setTimeout(cerrar, 1200);
      return;
    }
    const texto = `${t('catalog.share_text')} ${nombre}`;
    if (medio === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${texto}\n${url}`)}`, '_blank', 'noopener');
    } else {
      location.href = `mailto:?subject=${encodeURIComponent(`${t('catalog.share_subject')}: ${nombre}`)}&body=${encodeURIComponent(`${texto}\n\n${url}`)}`;
    }
    cerrar();
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-compartir');
    if (btn) {
      const mismo = !menu.hidden && boton === btn;
      cerrar();
      if (!mismo) abrir(btn);
      return;
    }
    const opcion = e.target.closest('.menu-compartir [data-medio]');
    if (opcion) { compartir(opcion.dataset.medio); return; }
    if (!e.target.closest('.menu-compartir')) cerrar();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) { cerrar(); if (boton) boton.focus(); }
  });
  window.addEventListener('resize', cerrar);
}

// Quien abre un enlace compartido (#pieza-<id>) ve la pieza en grande, como
// si le hubiera dado clic. Detras queda la pagina en esa ficha, que se
// resalta al cerrar el visor para que se vea cual era. Devuelve si la encontro.
function irALaPiezaDelEnlace() {
  const m = /^#pieza-(.+)$/.exec(location.hash);
  if (!m) return false;
  const card = document.getElementById('pieza-' + decodeURIComponent(m[1]));
  if (!card) return false;

  const resaltar = () => {
    card.classList.remove('pieza-enlazada');
    void card.offsetWidth;   // reinicia la animacion
    card.classList.add('pieza-enlazada');
  };
  const top = card.getBoundingClientRect().top + window.scrollY - 100;
  const thumb = card.querySelector('.product-thumb.is-zoomable');
  const visor = document.getElementById('photoLightbox');
  if (!thumb || !visor) {
    // Sin foto (o sin visor) no hay nada que ampliar: solo se baja a la ficha.
    window.scrollTo({ top, behavior: 'smooth' });
    resaltar();
    return true;
  }
  window.scrollTo({ top });   // sin animacion: el visor la taparia a medias
  thumb.click();              // abre el visor por el mismo camino que un clic
  const alCerrar = new MutationObserver(() => {
    if (!visor.hidden) return;
    alCerrar.disconnect();
    resaltar();
  });
  alCerrar.observe(visor, { attributes: true, attributeFilter: ['hidden'] });
  return true;
}

// ---------- Paginas de aterrizaje (/salas, /exterior...) ----------

// Las fotos ya vienen en el HTML, pero en un celular lento tardan: mientras
// bajan se ve el spinner en su hueco y no un recuadro vacio.
function spinnerMientrasCargan(raiz) {
  raiz.querySelectorAll('.hero-art img, .material-swatch img, .product-thumb img').forEach(img => {
    if (img.complete) return;   // ya estaba (o venia de la cache)
    const hueco = img.parentElement;
    const tam = hueco.classList.contains('hero-art') ? 130 : hueco.classList.contains('material-swatch') ? 56 : 80;
    const capa = document.createElement('div');
    capa.className = 'er-carga-foto';
    capa.innerHTML = spinnerHtml(tam);
    hueco.appendChild(capa);
    img.classList.add('er-cargando');
    const listo = () => { capa.remove(); img.classList.remove('er-cargando'); };
    img.addEventListener('load', listo, { once: true });
    img.addEventListener('error', listo, { once: true });
  });
}

// El HTML publicado trae las piezas que habia al generarlo, y GitHub lo
// regenera cada pocas horas. Se vuelven a leer de Firestore para que una
// pieza recien cargada en el panel salga ya, igual que en /catalogo.
// Mismo filtro y orden que productosDeCategoria() en assets/js/paginas.mjs.
async function actualizarProductosDeLaPagina() {
  const grid = document.querySelector('.pagina-productos[data-categoria]');
  if (!grid || !window.ErFirebase) return;
  const id = grid.dataset.categoria;
  let products;
  try {
    products = await window.ErFirebase.fetchProducts();
  } catch (err) {
    console.error('No se pudieron actualizar las piezas:', err);
    return;   // se quedan las del HTML publicado
  }
  const lista = products
    .filter(p => p.categoryId === id || (Array.isArray(p.categoryIds) && p.categoryIds.includes(id)))
    .sort((a, b) => (a.order || 0) - (b.order || 0) || String(a.name || '').localeCompare(String(b.name || '')));

  // Si lo que se ve no cambio, no se redibuja: evita el parpadeo de las fotos.
  const firma = (...datos) => datos.join('|');
  const actual = [...grid.querySelectorAll('.product-card')].map(c => firma(
    c.dataset.productId,
    (c.querySelector('h3')?.textContent || '').trim(),
    c.querySelector('.product-thumb img')?.dataset.full || '',
    (c.querySelector('.product-name-story')?.textContent || '').trim(),
    c.classList.contains('is-soldout'),
    c.hasAttribute('data-nueva'),
    c.hasAttribute('data-destacada'))).join('\n');
  const nueva = lista.map(p => firma(p.id, (p.name || '').trim(), fotosDe(p)[0] || '', (p.story || '').trim(),
    !!p.soldOut, esNueva(p), !!p.featured)).join('\n');
  if (actual === nueva) return;

  grid.innerHTML = lista.length
    ? lista.map(productCardHtml).join('')
    : `<p class="admin-empty" style="grid-column:1/-1;" data-i18n="catalog.empty_category">${esc(window.ErI18n.t('catalog.empty_category'))}</p>`;
  grid.classList.toggle('grid-4', lista.length >= 4);
  grid.classList.toggle('grid-3', lista.length < 4);
  spinnerMientrasCargan(grid);
}

async function init() {
  // Paginas de aterrizaje: el contenido ya viene en el HTML publicado. De este
  // archivo necesitan el visor, el spinner de las fotos y las piezas al dia.
  if (document.body.dataset.pagina) {
    setUpLightbox();
    setUpCompartir();
    spinnerMientrasCargan(document);
    const encontrada = irALaPiezaDelEnlace();
    // Una pieza recien cargada solo existe despues de leer Firestore.
    actualizarProductosDeLaPagina().then(() => { if (!encontrada) irALaPiezaDelEnlace(); });
    return;
  }

  const catalogRoot = document.getElementById('catalogRoot');
  const homeRoot = document.getElementById('homeCategoriesRoot');
  const featuredRoot = document.getElementById('homeFeaturedRoot');
  const flagshipRoot = document.getElementById('homeFlagshipRoot');
  if (homeRoot) homeRoot.innerHTML = `<div style="grid-column:1/-1;">${spinnerHtml(96)}</div>`;
  if (featuredRoot) featuredRoot.innerHTML = `<div style="grid-column:1/-1;">${spinnerHtml(96)}</div>`;
  const flagshipLink = document.getElementById('homeFlagshipLink');
  const heroSlot = document.getElementById('heroImageSlot');
  const aboutSlot = document.getElementById('aboutImageSlot');
  const commentsSection = document.getElementById('commentsSection');
  const swatches = document.querySelector('.material-swatch[data-material]');
  if (!catalogRoot && !homeRoot && !flagshipLink && !heroSlot && !aboutSlot && !commentsSection && !swatches) return;

  // No depende de Firestore: se engancha antes, para que siga funcionando
  // aunque la carga del catalogo falle.
  setUpLightbox();
  if (catalogRoot) setUpCompartir();

  if (!window.ErFirebase) {
    console.error('Firebase no está disponible todavía.');
    return;
  }

  // Las tres lecturas son independientes entre si: en serie eran tres viajes
  // de ida y vuelta encadenados, en paralelo tardan lo que tarde la mas lenta.
  try {
    const homeImages = renderHomeImages();
    const comments = renderComments();
    const materiales = renderMaterialImages();
    const [todasLasCategorias, products] = await Promise.all([
      window.ErFirebase.fetchCategories(),
      (catalogRoot || homeRoot || featuredRoot || flagshipRoot) ? window.ErFirebase.fetchProducts() : Promise.resolve([])
    ]);
    // Hay categorias que solo agrupan piezas para una pagina (Exterior: cada
    // pieza ya esta en su seccion). No salen como seccion del catalogo.
    const categories = todasLasCategorias.filter(c => c.showInCatalog !== false);
    await Promise.all([homeImages, comments, materiales]);

    if (catalogRoot) renderCatalogPage(catalogRoot, categories, products);
    if (homeRoot) renderHomeCategoryTeasers(homeRoot, categories, products);
    if (featuredRoot) renderHomeFeatured(featuredRoot, categories, products);
    if (flagshipRoot) renderHomeFlagship(flagshipRoot, categories, products);
    if (flagshipLink) {
      const flagship = categories.find(c => c.flagship);
      if (flagship) flagshipLink.setAttribute('href', `/catalogo#${flagship.id}`);
    }
  } catch (err) {
    console.error('No se pudo cargar el catálogo:', err);
    // Mejor sin la franja que con el spinner girando para siempre.
    if (featuredRoot) featuredRoot.closest('section').hidden = true;
    if (flagshipRoot) flagshipRoot.hidden = true;
    if (catalogRoot) {
      catalogRoot.innerHTML = `<p class="admin-empty">No se pudo cargar el catálogo. Intenta de nuevo más tarde.</p>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
