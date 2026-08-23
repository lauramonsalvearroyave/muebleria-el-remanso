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
let editingCategoryId = null; // null = creando una nueva
let editingProductId = null;
let selectedImageFile = null;

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
          <button class="btn btn-light btn-sm" data-delete-prod="${esc(p.id)}" type="button">Eliminar</button>
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
    const data = {
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
}

function switchTab(tab) {
  document.getElementById('categoriesPanel').style.display = tab === 'categories' ? '' : 'none';
  document.getElementById('productsPanel').style.display = tab === 'products' ? '' : 'none';
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
  document.getElementById('otpEnrollLogoutBtn').addEventListener('click', () => window.ErFirebase.signOut());

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('loginError');
    errorEl.textContent = '';
    try {
      const result = await window.ErFirebase.signIn(email, password);
      if (result.mfaRequired) {
        showView('otpVerifyView');
        document.getElementById('otp-verify-code').value = '';
        document.getElementById('otp-verify-code').focus();
      }
      // Si no requiere MFA, onAuthChange se encarga de mostrar la vista correcta.
    } catch (err) {
      errorEl.textContent = 'No se pudo iniciar sesión. Revisa el correo y la contraseña.';
    }
  });

  document.getElementById('otpVerifyForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('otp-verify-code').value.trim();
    const errorEl = document.getElementById('otpVerifyError');
    errorEl.textContent = '';
    try {
      await window.ErFirebase.completeMfaSignIn(code);
      // onAuthChange se encarga de mostrar la vista correcta a partir de aquí.
    } catch (err) {
      errorEl.textContent = 'Código incorrecto o vencido. Intenta con el código actual de tu app.';
    }
  });

  document.getElementById('otpEnrollForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('otp-enroll-code').value.trim();
    const errorEl = document.getElementById('otpEnrollError');
    errorEl.textContent = '';
    try {
      await window.ErFirebase.completeMfaEnrollment(code);
      await enterAdminView();
    } catch (err) {
      errorEl.textContent = 'Código incorrecto. Verifica la hora de tu celular y vuelve a intentar.';
    }
  });
}

function showView(name) {
  ['loginView', 'otpVerifyView', 'otpEnrollView', 'adminView'].forEach(id => {
    document.getElementById(id).style.display = id === name ? '' : 'none';
  });
}

async function startEnrollmentScreen() {
  showView('otpEnrollView');
  try {
    const { qrCodeUrl, secretKey } = await window.ErFirebase.startMfaEnrollment();
    document.getElementById('otpSecretKey').textContent = secretKey;
    await QRCode.toCanvas(document.getElementById('otpQrCanvas'), qrCodeUrl, { width: 220 });
  } catch (err) {
    document.getElementById('otpEnrollError').textContent =
      'No se pudo iniciar la activación: ' + err.message + '. Si el error menciona el correo, primero debes verificarlo (revisa tu bandeja de entrada).';
  }
}

let currentUserEmail = '';

async function enterAdminView() {
  showView('adminView');
  document.getElementById('adminUserEmail').textContent = currentUserEmail;
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
      if (window.ErFirebase.hasMfaEnrolled()) {
        await enterAdminView();
      } else {
        await startEnrollmentScreen();
      }
    });
  }, 50);
});
