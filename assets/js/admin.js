// El Remanso — Panel de administración (categorías y productos).
// Todo lo que se guarda aquí lo lee el sitio público desde Firestore
// (ver assets/js/catalog-render.js). Requiere iniciar sesión.

const MATERIALS = [
  { value: '', label: '(sin material)' },
  { value: 'mimbre', label: 'Mimbre' },
  { value: 'rattan', label: 'Rattán' },
  { value: 'yare', label: 'Yaré' },
  { value: 'sintetico', label: 'Sintético' }
];

// Catálogo inicial: se usa una sola vez con el botón "Importar catálogo inicial"
// (solo aparece si la colección de productos está vacía).
const SEED_CATEGORIES = [
  { id: 'remanso', label: 'Remanso', teaser: '', flagship: true, order: 0, active: true },
  { id: 'sofas', label: 'Sofás', teaser: 'Para las tardes en familia.', flagship: false, order: 1, active: true },
  { id: 'sillas', label: 'Sillas y mecedoras', teaser: 'Para la mesa y para arrullar.', flagship: false, order: 2, active: true },
  { id: 'mesas', label: 'Mesas', teaser: 'El punto de encuentro de la casa.', flagship: false, order: 3, active: true },
  { id: 'columpios', label: 'Columpios', teaser: 'Para el jardín y para adentro.', flagship: false, order: 4, active: true },
  { id: 'accesorios', label: 'Accesorios y espejos', teaser: 'Los detalles que visten un hogar.', flagship: false, order: 5, active: true }
];

const SEED_PRODUCTS = [
  { id: 'seed-r1', categoryId: 'remanso', name: 'Poltrona Remanso', story: 'Remanso: el nombre de nuestro taller, y el de esta mecedora insignia tejida a mano.', material: 'rattan', order: 0, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-r2', categoryId: 'remanso', name: 'Set Remanso', story: 'El mismo nombre, ahora en sofá, poltronas y mesa de centro: nuestra combinación más querida.', material: 'rattan', order: 1, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-r3', categoryId: 'remanso', name: 'Columpio Nido Remanso', story: 'Nuestra pieza más pedida lleva, con orgullo, el nombre de la casa.', material: 'sintetico', order: 2, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-a1', categoryId: 'sofas', name: 'Sofá Yaguará 2 puestos', story: 'Yaguará: como el felino que camina con calma por nuestros montes.', material: 'rattan', order: 0, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-a2', categoryId: 'sofas', name: 'Sofá Yaguará 3 puestos', story: 'Yaguará: como el felino que camina con calma por nuestros montes.', material: 'rattan', order: 1, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-a3', categoryId: 'sofas', name: 'Set de sala Manso', story: 'Manso: sinónimo de calma — la misma raíz de nuestro propio nombre.', material: 'yare', order: 2, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-t1', categoryId: 'sillas', name: 'Mecedora de cuarto Nana', story: 'Nana: como le decimos a quien nos arrulla desde siempre.', material: 'mimbre', order: 0, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-t2', categoryId: 'sillas', name: 'Silla trenzada Cauca', story: 'Cauca: el río que ha visto tejer a varias generaciones.', material: 'mimbre', order: 1, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-t3', categoryId: 'sillas', name: 'Banca tejida Cariño', story: 'Porque así se teje cada pieza: con cariño.', material: 'yare', order: 2, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-t4', categoryId: 'sillas', name: 'Silla de bar Remolino', story: 'Remolino: como se siente una buena conversación en la barra.', material: 'rattan', order: 3, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-s1', categoryId: 'mesas', name: 'Juego de comedor Orilla', story: 'Orilla: el borde donde el río se detiene, como se detiene esta mesa.', material: 'rattan', order: 0, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-s2', categoryId: 'mesas', name: 'Mesa auxiliar Junco', story: 'Junco: la fibra que crece junto al agua tranquila.', material: 'mimbre', order: 1, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-s3', categoryId: 'mesas', name: 'Mesa de centro Raíz', story: 'Raíz: lo que sostiene, igual que el centro de una casa.', material: 'rattan', order: 2, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-v1', categoryId: 'columpios', name: 'Columpio de jardín Cauca', story: 'Cauca: el río que ha visto tejer a varias generaciones.', material: 'sintetico', order: 0, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-v2', categoryId: 'columpios', name: 'Columpio infantil Retoño', story: 'Retoño: como llamamos a los brotes nuevos de la familia.', material: 'mimbre', order: 1, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-e1', categoryId: 'accesorios', name: 'Espejo tejido Aura', story: 'Aura: ese brillo que rodea lo hecho con amor.', material: 'mimbre', order: 0, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-e2', categoryId: 'accesorios', name: 'Lámpara colgante Junco', story: 'Junco: la fibra que crece junto al agua tranquila.', material: 'yare', order: 1, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-e3', categoryId: 'accesorios', name: 'Matera tejida Raíz', story: 'Raíz: para las plantas que llevan años en la familia.', material: 'rattan', order: 2, active: true, soldOut: false, featured: false, isNew: false },
  { id: 'seed-e4', categoryId: 'accesorios', name: 'Cojín para mascotas Compañía', story: 'Compañía: porque las mascotas también son familia.', material: 'mimbre', order: 3, active: true, soldOut: false, featured: false, isNew: false }
];

let categories = [];
let products = [];
let invites = [];
let editingCategoryId = null; // null = creando una nueva
let editingProductId = null;
let selectedImageFile = null;
let currentUserRole = null; // 'admin' | 'colaborador'

function esc(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function materialLabel(value) {
  const m = MATERIALS.find(x => x.value === value);
  return m ? m.label : '';
}

// ---------------- Categorías ----------------

function renderCategoryForm() {
  const editing = categories.find(c => c.id === editingCategoryId);
  const form = document.getElementById('categoryForm');
  form.querySelector('#cat-id').value = editing ? editing.id : '';
  form.querySelector('#cat-id').disabled = !!editing;
  form.querySelector('#cat-label').value = editing ? editing.label : '';
  form.querySelector('#cat-teaser').value = editing ? (editing.teaser || '') : '';
  form.querySelector('#cat-flagship').checked = editing ? !!editing.flagship : false;
  form.querySelector('#cat-order').value = editing ? (editing.order ?? categories.length) : categories.length;
  document.getElementById('categoryFormTitle').textContent = editing ? `Editar categoría: ${editing.label}` : 'Agregar categoría';
  document.getElementById('categoryCancelBtn').style.display = editing ? '' : 'none';
}

function renderCategoryList() {
  const list = document.getElementById('categoryList');
  if (!categories.length) {
    list.innerHTML = '<p class="admin-empty">Todavía no hay categorías.</p>';
    return;
  }
  list.innerHTML = categories.map(c => {
    const count = products.filter(p => p.categoryId === c.id).length;
    return `
      <div class="admin-row">
        <div class="info">
          <strong>${esc(c.label)} ${c.flagship ? '<span class="tag-pill">Línea insignia</span>' : ''}</strong>
          <span>ID: ${esc(c.id)} · orden ${c.order ?? 0} · ${count} producto(s)</span>
        </div>
        <div class="actions">
          <button class="btn btn-outline btn-sm" data-edit-cat="${esc(c.id)}" type="button">Editar</button>
          <button class="btn btn-light btn-sm" data-delete-cat="${esc(c.id)}" type="button">Eliminar</button>
        </div>
      </div>`;
  }).join('');
}

async function saveCategoryFromForm(e) {
  e.preventDefault();
  const form = e.target;
  const idInput = form.querySelector('#cat-id').value.trim();
  const label = form.querySelector('#cat-label').value.trim();
  if (!label) { alert('El nombre de la categoría es obligatorio.'); return; }

  const id = editingCategoryId || slugify(idInput || label);
  if (!id) { alert('No se pudo generar un identificador válido para la categoría.'); return; }

  const data = {
    label,
    teaser: form.querySelector('#cat-teaser').value.trim(),
    flagship: form.querySelector('#cat-flagship').checked,
    order: Number(form.querySelector('#cat-order').value) || 0,
    active: true
  };

  try {
    await window.ErFirebase.saveCategory(id, data);
    editingCategoryId = null;
    await loadData();
    form.reset();
    renderCategoryForm();
  } catch (err) {
    alert('No se pudo guardar la categoría: ' + err.message);
  }
}

async function deleteCategoryById(id) {
  const count = products.filter(p => p.categoryId === id).length;
  if (count > 0) {
    alert(`No puedes eliminar esta categoría todavía: tiene ${count} producto(s). Muévelos a otra categoría o elimínalos primero.`);
    return;
  }
  if (!confirm('¿Eliminar esta categoría? Esta acción no se puede deshacer.')) return;
  try {
    await window.ErFirebase.deleteCategory(id);
    await loadData();
  } catch (err) {
    alert('No se pudo eliminar: ' + err.message);
  }
}

// ---------------- Productos ----------------

function categoryOptionsHtml(selectedId) {
  return categories.map(c => `<option value="${esc(c.id)}" ${c.id === selectedId ? 'selected' : ''}>${esc(c.label)}</option>`).join('');
}

function materialOptionsHtml(selected) {
  return MATERIALS.map(m => `<option value="${esc(m.value)}" ${m.value === selected ? 'selected' : ''}>${esc(m.label)}</option>`).join('');
}

function renderProductForm() {
  const editing = products.find(p => p.id === editingProductId);
  const form = document.getElementById('productForm');
  form.querySelector('#prod-name').value = editing ? editing.name : '';
  form.querySelector('#prod-story').value = editing ? (editing.story || '') : '';
  form.querySelector('#prod-category').innerHTML = categoryOptionsHtml(editing ? editing.categoryId : (categories[0] && categories[0].id));
  form.querySelector('#prod-material').innerHTML = materialOptionsHtml(editing ? editing.material : '');
  form.querySelector('#prod-order').value = editing ? (editing.order ?? 0) : 0;
  form.querySelector('#prod-soldout').checked = editing ? !!editing.soldOut : false;
  form.querySelector('#prod-featured').checked = editing ? !!editing.featured : false;
  form.querySelector('#prod-new').checked = editing ? !!editing.isNew : false;
  form.querySelector('#prod-image').value = '';
  selectedImageFile = null;

  const preview = document.getElementById('imgPreview');
  if (editing && editing.imageUrl) {
    preview.innerHTML = `<img src="${esc(editing.imageUrl)}" alt="">`;
  } else {
    preview.innerHTML = '';
  }

  document.getElementById('productFormTitle').textContent = editing ? `Editar producto: ${editing.name}` : 'Agregar producto';
  document.getElementById('productCancelBtn').style.display = editing ? '' : 'none';

  const isCollaborator = currentUserRole === 'colaborador';
  document.getElementById('productAdminFields').style.display = isCollaborator ? 'none' : '';
  document.getElementById('collaboratorNotice').style.display = isCollaborator ? '' : 'none';
  // Un colaborador no puede crear productos nuevos, solo editar los existentes.
  document.getElementById('productFormCard').style.display = (isCollaborator && !editing) ? 'none' : '';
  form.querySelector('#prod-name').required = !isCollaborator;
}

function renderProductList() {
  const list = document.getElementById('productList');
  const filterValue = document.getElementById('productFilter').value;
  const filtered = filterValue ? products.filter(p => p.categoryId === filterValue) : products;

  if (!filtered.length) {
    list.innerHTML = '<p class="admin-empty">No hay productos para mostrar.</p>';
    return;
  }

  list.innerHTML = filtered.map(p => {
    const cat = categories.find(c => c.id === p.categoryId);
    const thumb = p.imageUrl ? `<img src="${esc(p.imageUrl)}" alt="">` : '';
    const pills = [];
    if (p.featured) pills.push('<span class="tag-pill">Destacado</span>');
    if (p.isNew) pills.push('<span class="tag-pill">Nuevo</span>');
    if (p.soldOut) pills.push('<span class="tag-pill">Agotado</span>');
    return `
      <div class="admin-row">
        <div class="thumb">${thumb}</div>
        <div class="info">
          <strong>${esc(p.name)}</strong>
          <span>${esc(cat ? cat.label : '(sin categoría)')} ${p.material ? '· ' + esc(materialLabel(p.material)) : ''}</span>
          <div class="pills">${pills.join('')}</div>
        </div>
        <div class="actions">
          <button class="btn btn-outline btn-sm" data-edit-prod="${esc(p.id)}" type="button">Editar</button>
          ${currentUserRole === 'colaborador' ? '' : `<button class="btn btn-light btn-sm" data-delete-prod="${esc(p.id)}" type="button">Eliminar</button>`}
        </div>
      </div>`;
  }).join('');
}

async function saveProductFromForm(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('#prod-name').value.trim();
  const categoryId = form.querySelector('#prod-category').value;
  if (!name) { alert('El nombre del producto es obligatorio.'); return; }
  if (!categoryId) { alert('Primero crea al menos una categoría.'); return; }

  const saveBtn = document.getElementById('productSaveBtn');
  saveBtn.disabled = true;
  saveBtn.textContent = 'Guardando...';

  try {
    const existing = products.find(p => p.id === editingProductId);
    // Un colaborador solo puede tocar imagen y promociones — las reglas de
    // seguridad de Firestore exigen esto también, esto es solo para la UI.
    const data = currentUserRole === 'colaborador' ? {
      soldOut: form.querySelector('#prod-soldout').checked,
      featured: form.querySelector('#prod-featured').checked,
      isNew: form.querySelector('#prod-new').checked
    } : {
      name,
      story: form.querySelector('#prod-story').value.trim(),
      categoryId,
      material: form.querySelector('#prod-material').value,
      order: Number(form.querySelector('#prod-order').value) || 0,
      soldOut: form.querySelector('#prod-soldout').checked,
      featured: form.querySelector('#prod-featured').checked,
      isNew: form.querySelector('#prod-new').checked,
      active: true,
      imageUrl: existing ? (existing.imageUrl || '') : '',
      imagePath: existing ? (existing.imagePath || '') : ''
    };

    const id = await window.ErFirebase.saveProduct(editingProductId, data);

    if (selectedImageFile) {
      const oldPath = data.imagePath;
      const { url, path } = await window.ErFirebase.uploadProductImage(selectedImageFile, id);
      await window.ErFirebase.saveProduct(id, { imageUrl: url, imagePath: path });
      if (oldPath) await window.ErFirebase.deleteProductImage(oldPath);
    }

    editingProductId = null;
    selectedImageFile = null;
    await loadData();
    form.reset();
    renderProductForm();
  } catch (err) {
    alert('No se pudo guardar el producto: ' + err.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Guardar producto';
  }
}

async function deleteProductById(id) {
  const prod = products.find(p => p.id === id);
  if (!confirm(`¿Eliminar "${prod ? prod.name : ''}"? Esta acción no se puede deshacer.`)) return;
  try {
    await window.ErFirebase.deleteProduct(id);
    if (prod && prod.imagePath) await window.ErFirebase.deleteProductImage(prod.imagePath);
    await loadData();
  } catch (err) {
    alert('No se pudo eliminar: ' + err.message);
  }
}

function handleImageSelect(e) {
  const file = e.target.files[0];
  const warning = document.getElementById('imgWarning');
  warning.textContent = '';
  if (!file) { selectedImageFile = null; return; }

  if (file.size > 5 * 1024 * 1024) {
    warning.textContent = 'La imagen pesa más de 5MB — intenta con una más liviana.';
    e.target.value = '';
    selectedImageFile = null;
    return;
  }

  selectedImageFile = file;
  const img = new Image();
  const objectUrl = URL.createObjectURL(file);
  img.onload = () => {
    document.getElementById('imgPreview').innerHTML = `<img src="${objectUrl}" alt="">`;
    const ratio = img.naturalWidth / img.naturalHeight;
    if (ratio < 1.15 || ratio > 1.55) {
      warning.textContent = 'Esta imagen no tiene una proporción horizontal cercana a 4:3 — se puede ver recortada en las esquinas. Puedes subirla igual si te gusta como se ve.';
    }
  };
  img.src = objectUrl;
}

// ---------------- Importar catálogo inicial ----------------

async function runSeed() {
  if (!confirm('Esto va a crear las 6 categorías y 19 productos del catálogo inicial. ¿Continuar?')) return;
  try {
    await window.ErFirebase.seedInitialCatalog(SEED_CATEGORIES, SEED_PRODUCTS);
    await loadData();
    alert('Catálogo importado. Ya puedes editar cada producto para subir su foto real.');
  } catch (err) {
    alert('No se pudo importar: ' + err.message);
  }
}

// ---------------- Carga de datos + navegación por pestañas ----------------

async function loadData() {
  categories = await window.ErFirebase.fetchAllCategories();
  products = await window.ErFirebase.fetchAllProducts();

  renderCategoryList();
  renderProductList();
  renderCategoryForm();
  renderProductForm();

  document.getElementById('productFilter').innerHTML =
    '<option value="">Todas las categorías</option>' + categoryOptionsHtml(null);

  document.getElementById('seedBlock').style.display = products.length === 0 ? '' : 'none';

  await loadCustomers();

  if (currentUserRole === 'admin') {
    invites = await window.ErFirebase.fetchInvites();
    renderInviteList();
    await loadHomeSettings();
    await loadSiteSettings();
    await loadLeads();
    await loadTeamMembers();
  }
}

// ---------------- Fotos de inicio (hero + "Nuestra historia") ----------------

let homeSettings = {};
let selectedHomeHeroFile = null;
let selectedHomeAboutFile = null;

async function loadHomeSettings() {
  homeSettings = await window.ErFirebase.fetchHomeSettings();
  const heroPreview = document.getElementById('homeHeroPreview');
  const aboutPreview = document.getElementById('homeAboutPreview');
  heroPreview.innerHTML = homeSettings.heroImageUrl ? `<img src="${esc(homeSettings.heroImageUrl)}" alt="">` : '';
  aboutPreview.innerHTML = homeSettings.aboutImageUrl ? `<img src="${esc(homeSettings.aboutImageUrl)}" alt="">` : '';
}

function handleHomeImageSelect(e, previewId, which) {
  const file = e.target.files[0];
  if (!file) return;
  if (which === 'hero') selectedHomeHeroFile = file; else selectedHomeAboutFile = file;
  const objectUrl = URL.createObjectURL(file);
  document.getElementById(previewId).innerHTML = `<img src="${objectUrl}" alt="">`;
}

async function saveHomeImagesFromForm(e) {
  e.preventDefault();
  const errorEl = document.getElementById('homeImagesError');
  const btn = document.getElementById('homeImagesSaveBtn');
  errorEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Guardando...';
  try {
    const data = {};
    if (selectedHomeHeroFile) {
      const { url, path } = await window.ErFirebase.uploadSiteImage(selectedHomeHeroFile, 'hero');
      data.heroImageUrl = url;
      data.heroImagePath = path;
      if (homeSettings.heroImagePath) await window.ErFirebase.deleteProductImage(homeSettings.heroImagePath);
    }
    if (selectedHomeAboutFile) {
      const { url, path } = await window.ErFirebase.uploadSiteImage(selectedHomeAboutFile, 'about');
      data.aboutImageUrl = url;
      data.aboutImagePath = path;
      if (homeSettings.aboutImagePath) await window.ErFirebase.deleteProductImage(homeSettings.aboutImagePath);
    }
    if (Object.keys(data).length) {
      await window.ErFirebase.saveHomeSettings(data);
      selectedHomeHeroFile = null;
      selectedHomeAboutFile = null;
      await loadHomeSettings();
    }
  } catch (err) {
    errorEl.textContent = 'No se pudo guardar: ' + err.message;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Guardar fotos de inicio';
  }
}

// ---------------- Ajustes: número de WhatsApp ----------------

async function loadSiteSettings() {
  const settings = await window.ErFirebase.fetchSiteSettings();
  document.getElementById('whatsapp-number').value = settings.whatsappNumber || '';
}

async function saveWhatsappFromForm(e) {
  e.preventDefault();
  const errorEl = document.getElementById('whatsappError');
  const btn = document.getElementById('whatsappSaveBtn');
  errorEl.textContent = '';
  const digits = document.getElementById('whatsapp-number').value.replace(/\D/g, '');
  if (digits.length < 10) {
    errorEl.textContent = 'Escribe el número completo con indicativo de país (ej: 57 para Colombia), solo números.';
    return;
  }
  btn.disabled = true;
  btn.textContent = 'Guardando...';
  try {
    await window.ErFirebase.saveSiteSettings({ whatsappNumber: digits });
    document.getElementById('whatsapp-number').value = digits;
  } catch (err) {
    errorEl.textContent = 'No se pudo guardar: ' + err.message;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Guardar número';
  }
}

// ---------------- Clientes (CRM) ----------------
// Colaborador puede ver y agregar (clientes nuevos, compras nuevas);
// solo administrador puede editar o borrar. Ver reglas de seguridad.

let customers = [];
let editingCustomerId = null;
let purchases = [];

async function loadCustomers() {
  customers = await window.ErFirebase.fetchCustomers();
  document.getElementById('purchase-material').innerHTML = materialOptionsHtml('');
  renderCustomerList();
  renderCustomerForm();
}

function renderCustomerList() {
  const list = document.getElementById('customerList');
  if (!customers.length) {
    list.innerHTML = '<p class="admin-empty">Todavía no hay clientes guardados.</p>';
    return;
  }
  list.innerHTML = customers.map(c => `
    <div class="admin-row">
      <div class="info">
        <strong>${esc(c.name)}</strong>
        <span>${c.cedula ? 'CC ' + esc(c.cedula) + ' · ' : ''}${esc(c.email || c.phone || '')}</span>
      </div>
      <div class="actions">
        <button class="btn btn-outline btn-sm" data-edit-cust="${esc(c.id)}" type="button">Ver / Editar</button>
        ${currentUserRole === 'admin' ? `<button class="btn btn-light btn-sm" data-delete-cust="${esc(c.id)}" type="button">Eliminar</button>` : ''}
      </div>
    </div>`).join('');
}

function renderCustomerForm() {
  const editing = customers.find(c => c.id === editingCustomerId);
  const form = document.getElementById('customerForm');

  if (editing) {
    document.getElementById('cust-name').value = editing.name || '';
    document.getElementById('cust-cedula').value = editing.cedula || '';
    document.getElementById('cust-email').value = editing.email || '';
    document.getElementById('cust-phone').value = editing.phone || '';
    document.getElementById('cust-likes').value = editing.likes || '';
    document.getElementById('cust-notes').value = editing.notes || '';
    document.getElementById('cust-consent').checked = !!editing.consent;
  } else {
    form.reset();
  }
  document.getElementById('cust-material').innerHTML = materialOptionsHtml(editing ? editing.material : '');

  document.getElementById('customerFormTitle').textContent = editing ? `Editar cliente: ${editing.name}` : 'Agregar cliente';
  document.getElementById('customerCancelBtn').style.display = editing ? '' : 'none';

  const isReadOnly = currentUserRole === 'colaborador' && !!editing;
  ['cust-name', 'cust-cedula', 'cust-email', 'cust-phone', 'cust-material', 'cust-likes', 'cust-notes', 'cust-consent'].forEach(id => {
    document.getElementById(id).disabled = isReadOnly;
  });
  document.getElementById('customerReadOnlyNotice').style.display = isReadOnly ? '' : 'none';
  document.getElementById('customerSaveBtn').style.display = isReadOnly ? 'none' : '';

  const detail = document.getElementById('customerDetail');
  if (editing) {
    detail.style.display = '';
    loadPurchases(editing.id);
  } else {
    detail.style.display = 'none';
    purchases = [];
  }
}

async function saveCustomerFromForm(e) {
  e.preventDefault();
  const name = document.getElementById('cust-name').value.trim();
  if (!name) { alert('El nombre es obligatorio.'); return; }

  const btn = document.getElementById('customerSaveBtn');
  btn.disabled = true;
  btn.textContent = 'Guardando...';
  try {
    const data = {
      name,
      cedula: document.getElementById('cust-cedula').value.trim(),
      email: document.getElementById('cust-email').value.trim(),
      phone: document.getElementById('cust-phone').value.trim(),
      material: document.getElementById('cust-material').value,
      likes: document.getElementById('cust-likes').value.trim(),
      notes: document.getElementById('cust-notes').value.trim(),
      consent: document.getElementById('cust-consent').checked
    };
    await window.ErFirebase.saveCustomer(editingCustomerId, data);
    editingCustomerId = null;
    await loadCustomers();
  } catch (err) {
    alert('No se pudo guardar el cliente: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Guardar cliente';
  }
}

async function deleteCustomerById(id) {
  const cust = customers.find(c => c.id === id);
  if (!confirm(`¿Eliminar a "${cust ? cust.name : ''}"? Esta acción no se puede deshacer.`)) return;
  try {
    await window.ErFirebase.deleteCustomer(id);
    if (editingCustomerId === id) editingCustomerId = null;
    await loadCustomers();
  } catch (err) {
    alert('No se pudo eliminar: ' + err.message);
  }
}

async function loadPurchases(customerId) {
  purchases = await window.ErFirebase.fetchPurchases(customerId);
  renderPurchaseList();
}

function renderPurchaseList() {
  const list = document.getElementById('purchaseList');
  if (!purchases.length) {
    list.innerHTML = '<p class="admin-empty">Todavía no hay compras registradas.</p>';
    return;
  }
  list.innerHTML = purchases.map(p => `
    <div class="admin-row">
      <div class="info">
        <strong>${esc(p.product || '')}</strong>
        <span>${p.material ? esc(materialLabel(p.material)) + ' · ' : ''}${p.value ? '$' + Number(p.value).toLocaleString('es-CO') : ''}${p.date ? ' · ' + esc(p.date) : ''}</span>
      </div>
      ${currentUserRole === 'admin' ? `<div class="actions"><button class="btn btn-light btn-sm" data-delete-purchase="${esc(p.id)}" type="button">Eliminar</button></div>` : ''}
    </div>`).join('');
}

async function savePurchaseFromForm(e) {
  e.preventDefault();
  if (!editingCustomerId) return;
  const product = document.getElementById('purchase-product').value.trim();
  if (!product) { alert('El producto es obligatorio.'); return; }
  try {
    await window.ErFirebase.addPurchase(editingCustomerId, {
      product,
      material: document.getElementById('purchase-material').value,
      value: Number(document.getElementById('purchase-value').value) || 0,
      date: document.getElementById('purchase-date').value
    });
    document.getElementById('purchaseForm').reset();
    await loadPurchases(editingCustomerId);
  } catch (err) {
    alert('No se pudo agregar la compra: ' + err.message);
  }
}

async function deletePurchaseById(purchaseId) {
  if (!editingCustomerId) return;
  if (!confirm('¿Eliminar esta compra?')) return;
  await window.ErFirebase.deletePurchase(editingCustomerId, purchaseId);
  await loadPurchases(editingCustomerId);
}

// ---------------- Interesados (leads) ----------------

let leads = [];

async function loadLeads() {
  leads = await window.ErFirebase.fetchLeads();
  renderLeadList();
}

function renderLeadList() {
  const list = document.getElementById('leadList');
  if (!leads.length) {
    list.innerHTML = '<p class="admin-empty">Todavía no hay personas interesadas.</p>';
    return;
  }
  list.innerHTML = leads.map(l => {
    const when = l.createdAt && l.createdAt.toDate ? l.createdAt.toDate().toLocaleString('es-CO') : '';
    const detail = l.product ? `Producto: ${esc(l.product)}` : (l.message ? esc(l.message) : '');
    return `
      <div class="admin-row">
        <div class="info">
          <strong>${esc(l.name || '(sin nombre)')}</strong>
          <span>${esc(l.phone || '')} · ${when}</span>
          ${detail ? `<span>${detail}</span>` : ''}
        </div>
        <div class="pills">
          <label style="display:flex; align-items:center; gap:6px; font-size:.85rem;">
            <input type="checkbox" data-contacted="${esc(l.id)}" ${l.contacted ? 'checked' : ''}> Contactado
          </label>
        </div>
        <div class="actions">
          ${l.convertedToCustomerId
            ? '<span style="font-size:.85rem; color:var(--ink-soft);">Ya es cliente</span>'
            : `<button class="btn btn-outline btn-sm" data-convert-lead="${esc(l.id)}" type="button">Convertir en cliente</button>`}
          <button class="btn btn-light btn-sm" data-delete-lead="${esc(l.id)}" type="button">Eliminar</button>
        </div>
      </div>`;
  }).join('');
}

async function toggleLeadContacted(id, contacted) {
  await window.ErFirebase.updateLead(id, { contacted });
  const lead = leads.find(l => l.id === id);
  if (lead) lead.contacted = contacted;
}

async function deleteLeadById(id) {
  if (!confirm('¿Eliminar este registro? Esta acción no se puede deshacer.')) return;
  await window.ErFirebase.deleteLead(id);
  await loadLeads();
}

async function convertLeadById(id) {
  const lead = leads.find(l => l.id === id);
  if (!lead) return;
  try {
    const customerId = await window.ErFirebase.convertLeadToCustomer(lead);
    await loadLeads();
    await loadCustomers();
    editingCustomerId = customerId;
    switchTab('customers');
    renderCustomerForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    alert('No se pudo convertir en cliente: ' + err.message);
  }
}

// ---------------- Equipo: miembros actuales ----------------

let teamMembers = [];
let currentUserUid = null;

async function loadTeamMembers() {
  teamMembers = await window.ErFirebase.fetchTeamMembers();
  renderTeamMemberList();
}

function renderTeamMemberList() {
  const list = document.getElementById('teamMemberList');
  if (!teamMembers.length) {
    list.innerHTML = '<p class="admin-empty">No hay miembros del equipo todavía.</p>';
    return;
  }
  list.innerHTML = teamMembers.map(m => `
    <div class="admin-row">
      <div class="info">
        <strong>${esc(m.email || m.uid)}</strong>
        <span>${esc(m.role)}</span>
      </div>
      <div class="actions">
        ${m.uid === currentUserUid
          ? '<span style="font-size:.85rem; color:var(--ink-soft);">(tu cuenta)</span>'
          : `<button class="btn btn-light btn-sm" data-remove-team="${esc(m.uid)}" type="button">Quitar acceso</button>`}
      </div>
    </div>`).join('');
}

async function removeTeamMemberById(uid) {
  const member = teamMembers.find(m => m.uid === uid);
  if (!confirm(`¿Quitarle el acceso a "${member ? (member.email || uid) : uid}"?`)) return;
  try {
    await window.ErFirebase.removeTeamMember(uid);
    await loadTeamMembers();
  } catch (err) {
    alert('No se pudo quitar el acceso: ' + err.message);
  }
}

function renderInviteList() {
  const list = document.getElementById('inviteList');
  if (!list) return;
  if (!invites.length) {
    list.innerHTML = '<p class="admin-empty">Todavía no has generado invitaciones.</p>';
    return;
  }
  const sorted = [...invites].sort((a, b) => (a.used === b.used) ? 0 : (a.used ? 1 : -1));
  list.innerHTML = sorted.map(inv => `
    <div class="admin-row">
      <div class="info">
        <strong style="font-family:monospace; letter-spacing:.05em;">${esc(inv.id)}</strong>
        <span>${inv.email ? esc(inv.email) : 'Cualquier correo'}</span>
      </div>
      <div class="pills">
        ${inv.used ? '<span class="tag-pill">Usada</span>' : '<span class="tag-pill">Disponible</span>'}
      </div>
    </div>`).join('');
}

function applyRoleUI() {
  const isCollaborator = currentUserRole === 'colaborador';
  const catBtn = document.getElementById('tabBtnCategories');
  const teamBtn = document.getElementById('tabBtnTeam');
  const homeBtn = document.getElementById('tabBtnHome');
  const leadsBtn = document.getElementById('tabBtnLeads');
  if (catBtn) catBtn.style.display = isCollaborator ? 'none' : '';
  if (teamBtn) teamBtn.style.display = isCollaborator ? 'none' : '';
  if (homeBtn) homeBtn.style.display = isCollaborator ? 'none' : '';
  if (leadsBtn) leadsBtn.style.display = isCollaborator ? 'none' : '';
  switchTab(isCollaborator ? 'products' : 'categories');
}

function switchTab(tab) {
  document.getElementById('categoriesPanel').style.display = tab === 'categories' ? '' : 'none';
  document.getElementById('productsPanel').style.display = tab === 'products' ? '' : 'none';
  document.getElementById('customersPanel').style.display = tab === 'customers' ? '' : 'none';
  document.getElementById('leadsPanel').style.display = tab === 'leads' ? '' : 'none';
  document.getElementById('homePanel').style.display = tab === 'home' ? '' : 'none';
  document.getElementById('teamPanel').style.display = tab === 'team' ? '' : 'none';
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
}

function wireEvents() {
  document.querySelectorAll('.admin-tab').forEach(t => {
    t.addEventListener('click', () => switchTab(t.dataset.tab));
  });

  document.getElementById('categoryForm').addEventListener('submit', saveCategoryFromForm);
  document.getElementById('categoryCancelBtn').addEventListener('click', () => {
    editingCategoryId = null;
    document.getElementById('categoryForm').reset();
    renderCategoryForm();
  });
  document.getElementById('categoryList').addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit-cat]');
    const delBtn = e.target.closest('[data-delete-cat]');
    if (editBtn) { editingCategoryId = editBtn.dataset.editCat; renderCategoryForm(); window.scrollTo({ top: document.getElementById('categoryForm').offsetTop - 100, behavior: 'smooth' }); }
    if (delBtn) deleteCategoryById(delBtn.dataset.deleteCat);
  });

  document.getElementById('productForm').addEventListener('submit', saveProductFromForm);
  document.getElementById('productCancelBtn').addEventListener('click', () => {
    editingProductId = null;
    selectedImageFile = null;
    document.getElementById('productForm').reset();
    renderProductForm();
  });
  document.getElementById('productList').addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit-prod]');
    const delBtn = e.target.closest('[data-delete-prod]');
    if (editBtn) { editingProductId = editBtn.dataset.editProd; renderProductForm(); window.scrollTo({ top: document.getElementById('productForm').offsetTop - 100, behavior: 'smooth' }); }
    if (delBtn) deleteProductById(delBtn.dataset.deleteProd);
  });
  document.getElementById('productFilter').addEventListener('change', renderProductList);
  document.getElementById('prod-image').addEventListener('change', handleImageSelect);
  document.getElementById('seedBtn').addEventListener('click', runSeed);

  document.getElementById('logoutBtn').addEventListener('click', () => window.ErFirebase.signOut());

  document.getElementById('showSignupLink').addEventListener('click', (e) => {
    e.preventDefault();
    showView('signupView');
  });
  document.getElementById('showLoginLink').addEventListener('click', (e) => {
    e.preventDefault();
    showView('loginView');
  });

  document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('signup-code').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const errorEl = document.getElementById('signupError');
    errorEl.textContent = '';
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      await window.ErFirebase.redeemInviteAndSignUp(code, email, password);
      // onAuthChange lleva a la persona directo al panel.
    } catch (err) {
      errorEl.textContent = err.message || 'No se pudo crear la cuenta. Revisa el código e intenta de nuevo.';
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById('home-hero-image').addEventListener('change', (e) => handleHomeImageSelect(e, 'homeHeroPreview', 'hero'));
  document.getElementById('home-about-image').addEventListener('change', (e) => handleHomeImageSelect(e, 'homeAboutPreview', 'about'));
  document.getElementById('homeImagesForm').addEventListener('submit', saveHomeImagesFromForm);
  document.getElementById('whatsappForm').addEventListener('submit', saveWhatsappFromForm);

  document.getElementById('leadList').addEventListener('click', (e) => {
    const delBtn = e.target.closest('[data-delete-lead]');
    const convertBtn = e.target.closest('[data-convert-lead]');
    if (delBtn) deleteLeadById(delBtn.dataset.deleteLead);
    if (convertBtn) convertLeadById(convertBtn.dataset.convertLead);
  });
  document.getElementById('leadList').addEventListener('change', (e) => {
    const checkbox = e.target.closest('[data-contacted]');
    if (checkbox) toggleLeadContacted(checkbox.dataset.contacted, checkbox.checked);
  });

  document.getElementById('customerForm').addEventListener('submit', saveCustomerFromForm);
  document.getElementById('customerCancelBtn').addEventListener('click', () => {
    editingCustomerId = null;
    document.getElementById('customerForm').reset();
    renderCustomerForm();
  });
  document.getElementById('customerList').addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit-cust]');
    const delBtn = e.target.closest('[data-delete-cust]');
    if (editBtn) { editingCustomerId = editBtn.dataset.editCust; renderCustomerForm(); window.scrollTo({ top: document.getElementById('customerForm').offsetTop - 100, behavior: 'smooth' }); }
    if (delBtn) deleteCustomerById(delBtn.dataset.deleteCust);
  });
  document.getElementById('purchaseForm').addEventListener('submit', savePurchaseFromForm);
  document.getElementById('purchaseList').addEventListener('click', (e) => {
    const delBtn = e.target.closest('[data-delete-purchase]');
    if (delBtn) deletePurchaseById(delBtn.dataset.deletePurchase);
  });

  document.getElementById('teamMemberList').addEventListener('click', (e) => {
    const removeBtn = e.target.closest('[data-remove-team]');
    if (removeBtn) removeTeamMemberById(removeBtn.dataset.removeTeam);
  });

  document.getElementById('noAccessLogoutBtn').addEventListener('click', () => window.ErFirebase.signOut());

  document.getElementById('inviteForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('invite-email');
    try {
      const code = await window.ErFirebase.createInvite(emailInput.value.trim());
      document.getElementById('newInviteCode').textContent = code;
      document.getElementById('newInviteBox').style.display = '';
      emailInput.value = '';
      invites = await window.ErFirebase.fetchInvites();
      renderInviteList();
    } catch (err) {
      alert('No se pudo generar la invitación: ' + err.message);
    }
  });

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('loginError');
    errorEl.textContent = '';
    try {
      await window.ErFirebase.signIn(email, password);
      // onAuthChange se encarga de mostrar el panel.
    } catch (err) {
      errorEl.textContent = 'No se pudo iniciar sesión. Revisa el correo y la contraseña.';
    }
  });
}

function showView(name) {
  ['loginView', 'signupView', 'noAccessView', 'adminView'].forEach(id => {
    document.getElementById(id).style.display = id === name ? '' : 'none';
  });
}

let currentUserEmail = '';

async function enterAdminView() {
  currentUserRole = await window.ErFirebase.fetchMyRole();
  if (!currentUserRole) {
    showView('noAccessView');
    return;
  }
  showView('adminView');
  document.getElementById('adminUserEmail').textContent = currentUserEmail;
  applyRoleUI();
  await loadData();
}

document.addEventListener('DOMContentLoaded', () => {
  wireEvents();
  switchTab('categories');

  const waitForFirebase = setInterval(() => {
    if (!window.ErFirebase) return;
    clearInterval(waitForFirebase);

    window.ErFirebase.onAuthChange(async (user) => {
      if (!user) {
        showView('loginView');
        return;
      }
      currentUserEmail = user.email;
      currentUserUid = user.uid;
      await enterAdminView();
    });
  }, 50);
});
