// El Remanso — dibuja el catálogo y las categorías leyendo Firestore.
// Usado por catalogo.html (#catalogRoot) e index.html (#homeCategoriesRoot,
// enlace #homeFlagshipLink). Los productos/categorías los administra el
// panel admin.html; este script solo LEE (nunca escribe).

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

  const media = p.imageUrl
    ? `<img src="${esc(p.imageUrl)}" alt="${esc(p.name)}" loading="lazy">`
    : `<span class="placeholder-note" data-i18n="catalog.photo_note">${esc(t('catalog.photo_note'))}</span>`;

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
      <div class="product-thumb">
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
  document.dispatchEvent(new CustomEvent('catalogRendered'));
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

  try {
    const settings = await window.ErFirebase.fetchHomeSettings();
    if (heroSlot && settings.heroImageUrl) {
      heroSlot.innerHTML = `<img src="${esc(settings.heroImageUrl)}" alt="" loading="lazy">`;
    }
    if (aboutSlot && settings.aboutImageUrl) {
      aboutSlot.innerHTML = `<img src="${esc(settings.aboutImageUrl)}" alt="" loading="lazy">`;
    }
  } catch (err) {
    console.error('No se pudieron cargar las fotos del inicio:', err);
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

async function init() {
  const catalogRoot = document.getElementById('catalogRoot');
  const homeRoot = document.getElementById('homeCategoriesRoot');
  const flagshipLink = document.getElementById('homeFlagshipLink');
  const heroSlot = document.getElementById('heroImageSlot');
  const aboutSlot = document.getElementById('aboutImageSlot');
  const commentsSection = document.getElementById('commentsSection');
  if (!catalogRoot && !homeRoot && !flagshipLink && !heroSlot && !aboutSlot && !commentsSection) return;

  if (!window.ErFirebase) {
    console.error('Firebase no está disponible todavía.');
    return;
  }

  // Las tres lecturas son independientes entre si: en serie eran tres viajes
  // de ida y vuelta encadenados, en paralelo tardan lo que tarde la mas lenta.
  try {
    const homeImages = renderHomeImages();
    const comments = renderComments();
    const [categories, products] = await Promise.all([
      window.ErFirebase.fetchCategories(),
      catalogRoot ? window.ErFirebase.fetchProducts() : Promise.resolve([])
    ]);
    await Promise.all([homeImages, comments]);

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
