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

function productCardHtml(p) {
  const t = window.ErI18n.t;
  const soldOutClass = p.soldOut ? ' is-soldout' : '';

  const badges = [];
  if (p.featured) badges.push(`<span class="product-badge featured" data-i18n="catalog.badge_featured">${esc(t('catalog.badge_featured'))}</span>`);
  if (p.isNew) badges.push(`<span class="product-badge new" data-i18n="catalog.badge_new">${esc(t('catalog.badge_new'))}</span>`);
  if (p.soldOut) badges.push(`<span class="product-badge soldout" data-i18n="catalog.badge_soldout">${esc(t('catalog.badge_soldout'))}</span>`);

  // Solo se puede ampliar si de verdad hay foto: el marcador de "proximamente"
  // no lleva cursor de lupa ni responde al clic.
  const media = p.imageUrl
    ? `<img src="${esc(variante(p.imageUrl, 'w_800,f_auto,q_auto'))}" data-full="${esc(p.imageUrl)}" alt="${esc(p.name)}" loading="lazy">`
    : `<span class="placeholder-note" data-i18n="catalog.photo_note">${esc(t('catalog.photo_note'))}</span>`;
  const zoomable = p.imageUrl ? ' is-zoomable' : '';

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
    <div class="product-card${soldOutClass}" data-product-id="${esc(p.id)}">
      <div class="product-thumb${zoomable}">
        <div class="product-badges">${badges.join('')}</div>
        ${media}
      </div>
      <div class="product-body">
        <div class="product-tags">${materialTag}${customTag}</div>
        <h3>${esc(p.name)}</h3>
        ${story}
        ${interestBtn}
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

function renderCatalogPage(root, categories, products) {
  const t = window.ErI18n.t;
  const byCategory = {};
  products.forEach(p => { (byCategory[p.categoryId] ||= []).push(p); });
  Object.values(byCategory).forEach(list => list.sort((a, b) => (a.order || 0) - (b.order || 0)));

  const chips = [`<button class="filter-chip active" data-filter="todos" data-i18n="catalog.filter_all">${esc(t('catalog.filter_all'))}</button>`]
    .concat(categories.map(c => `<button class="filter-chip" data-filter="${esc(c.id)}">${esc(c.label)}</button>`))
    .join('');

  const blocks = categories.map(c => categoryBlockHtml(c, byCategory[c.id] || [])).join('');

  root.innerHTML = `<div class="filter-bar">${chips}</div>${blocks}`;
  attachCatalogInteractions(root);
  irALaSeccionDelEnlace(root);
  document.dispatchEvent(new CustomEvent('catalogRendered'));
}

// Al llegar desde el inicio con catalogo.html#sofas, el navegador procesa el
// ancla ANTES de que este script dibuje las secciones, asi que no encuentra
// nada y se queda arriba. Hay que hacerlo a mano cuando ya existen.
function irALaSeccionDelEnlace(root) {
  const id = decodeURIComponent((location.hash || '').replace('#', '')).trim();
  if (!id) return;

  const bloque = root.querySelector(`.category-block[data-category="${CSS.escape(id)}"]`);
  if (!bloque) return;

  // Se activa tambien el filtro: quien hizo clic en "Sofas" viene buscando
  // sofas, no el catalogo entero abierto por ahi.
  const chip = root.querySelector(`.filter-chip[data-filter="${CSS.escape(id)}"]`);
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
      blocks.forEach(block => {
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

function renderHomeCategoryTeasers(root, categories) {
  const visible = categories.filter(c => !c.flagship);
  root.innerHTML = visible.map(c => `
    <a href="catalogo.html#${esc(c.id)}" class="card">
      <h3>${esc(c.label)}</h3>
      ${c.teaser ? `<p>${esc(c.teaser)}</p>` : ''}
    </a>`).join('');
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
    if (heroSlot) {
      heroSlot.innerHTML = settings.heroImageUrl
        ? `<img src="${esc(variante(settings.heroImageUrl, 'w_900,f_auto,q_auto'))}" alt="" fetchpriority="high">`
        : '';
    }
    if (aboutSlot) {
      aboutSlot.innerHTML = settings.aboutImageUrl
        ? `<img src="${esc(variante(settings.aboutImageUrl, 'w_900,f_auto,q_auto'))}" alt="" loading="lazy">`
        : '';
    }
  } catch (err) {
    console.error('No se pudieron cargar las fotos del inicio:', err);
    if (heroSlot) heroSlot.innerHTML = '';
    if (aboutSlot) aboutSlot.innerHTML = '';
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
  if (!comments.length) return;     // sin comentarios reales, no se muestra nada

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
  let ultimoFoco = null;

  function abrir(src, alt, nombre, historia) {
    ultimoFoco = document.activeElement;
    img.src = src;
    img.alt = alt || nombre || '';
    caption.innerHTML = esc(nombre || '') + (historia ? `<span>${esc(historia)}</span>` : '');
    box.hidden = false;
    // Sin esto la pagina de atras sigue desplazandose bajo el visor.
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function cerrar() {
    box.hidden = true;
    img.src = '';
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
    // data-full es la foto original; src es la variante liviana de la tarjeta.
    abrir(foto.dataset.full || foto.currentSrc || foto.src, foto.alt, nombre, historia);
  });

  closeBtn.addEventListener('click', cerrar);
  // Clic en el fondo cierra; clic sobre la foto, no.
  box.addEventListener('click', (e) => {
    if (!e.target.closest('.lightbox-figure') && !e.target.closest('.lightbox-close')) cerrar();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !box.hidden) cerrar();
  });
}

async function init() {
  const catalogRoot = document.getElementById('catalogRoot');
  const homeRoot = document.getElementById('homeCategoriesRoot');
  if (homeRoot) homeRoot.innerHTML = `<div style="grid-column:1/-1;">${spinnerHtml(96)}</div>`;
  const flagshipLink = document.getElementById('homeFlagshipLink');
  const heroSlot = document.getElementById('heroImageSlot');
  const aboutSlot = document.getElementById('aboutImageSlot');
  const commentsSection = document.getElementById('commentsSection');
  const swatches = document.querySelector('.material-swatch[data-material]');
  if (!catalogRoot && !homeRoot && !flagshipLink && !heroSlot && !aboutSlot && !commentsSection && !swatches) return;

  // No depende de Firestore: se engancha antes, para que siga funcionando
  // aunque la carga del catalogo falle.
  setUpLightbox();

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
    const [categories, products] = await Promise.all([
      window.ErFirebase.fetchCategories(),
      catalogRoot ? window.ErFirebase.fetchProducts() : Promise.resolve([])
    ]);
    await Promise.all([homeImages, comments, materiales]);

    if (catalogRoot) renderCatalogPage(catalogRoot, categories, products);
    if (homeRoot) renderHomeCategoryTeasers(homeRoot, categories);
    if (flagshipLink) {
      const flagship = categories.find(c => c.flagship);
      if (flagship) flagshipLink.setAttribute('href', `catalogo.html#${flagship.id}`);
    }
  } catch (err) {
    console.error('No se pudo cargar el catálogo:', err);
    if (catalogRoot) {
      catalogRoot.innerHTML = `<p class="admin-empty">No se pudo cargar el catálogo. Intenta de nuevo más tarde.</p>`;
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
