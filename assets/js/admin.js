// El Remanso — Panel de administración (categorías y productos).
// Todo lo que se guarda aquí lo lee el sitio público desde Firestore
// (ver assets/js/catalog-render.js). Requiere iniciar sesión.

const MATERIALS = [
  { value: '', label: '(sin material)' },
  { value: 'mimbre', label: 'Mimbre' },
  { value: 'yare', label: 'Yaré' },
  { value: 'rattan', label: 'Rattán' },
  { value: 'calceta', label: 'Calceta de plátano' },
  { value: 'sintetico', label: 'Sintético' },
  { value: 'piola', label: 'Piola náutica' }
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
let subiendoFoto = false;   // bloquea Guardar mientras una foto se esta subiendo
let fallóLaSubida = false;  // para avisar si se guarda sin la foto que se intento subir
let currentUserRole = null; // 'admin' | 'colaborador'
let comments = [];
let catIdTouched = false;   // si tocan el identificador a mano, deja de seguir al nombre
let commentsError = null;

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
  catIdTouched = false;
  const editing = categories.find(c => c.id === editingCategoryId);
  const form = document.getElementById('categoryForm');
  form.querySelector('#cat-id').value = editing ? editing.id : '';
  form.querySelector('#cat-id').disabled = false;   // editable: renombrar tambien cambia la URL
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
    const isHidden = c.active === false;
    return `
      <div class="admin-row">
        <div class="info">
          <strong>${esc(c.label)} ${c.flagship ? '<span class="tag-pill">Línea insignia</span>' : ''} ${isHidden ? '<span class="tag-pill">Oculta</span>' : ''}</strong>
          <span>ID: ${esc(c.id)} · orden ${c.order ?? 0} · ${count} producto(s)</span>
        </div>
        <div class="actions">
          <button class="btn btn-outline btn-sm" data-edit-cat="${esc(c.id)}" type="button">Editar</button>
          <button class="btn btn-outline btn-sm" data-toggle-active-cat="${esc(c.id)}" type="button">${isHidden ? 'Mostrar' : 'Ocultar'}</button>
          <button class="btn btn-light btn-sm" data-delete-cat="${esc(c.id)}" type="button">Eliminar</button>
        </div>
      </div>`;
  }).join('');
}

async function toggleCategoryActive(id) {
  const cat = categories.find(c => c.id === id);
  if (!cat) return;
  try {
    await window.ErFirebase.saveCategory(id, { active: cat.active === false });
    await loadData();
  } catch (err) {
    alert('No se pudo actualizar: ' + err.message);
  }
}

async function saveCategoryFromForm(e) {
  e.preventDefault();
  const form = e.target;
  const idInput = form.querySelector('#cat-id').value.trim();
  const label = form.querySelector('#cat-label').value.trim();
  if (!label) { alert('El nombre de la categoría es obligatorio.'); return; }

  const existing = categories.find(c => c.id === editingCategoryId);

  // De donde sale el identificador (y por tanto la URL):
  //  - categoria nueva            -> del identificador escrito, o del nombre
  //  - lo editaron a mano         -> se respeta tal cual
  //  - cambio el nombre           -> la URL sigue al nombre nuevo
  //  - el nombre quedo igual      -> la URL no se toca
  // Lo ultimo importa: hay categorias cuyo id no coincide con su nombre a
  // proposito (accesorios / "Accesorios y espejos"), y editar cualquier otro
  // campo no deberia proponer un renombrado.
  let id;
  if (!editingCategoryId || catIdTouched) {
    id = slugify(idInput || label);
  } else if (existing && existing.label !== label) {
    id = slugify(label);
  } else {
    id = editingCategoryId;
  }
  if (!id) { alert('No se pudo generar un identificador válido para la categoría.'); return; }
  const data = {
    label,
    teaser: form.querySelector('#cat-teaser').value.trim(),
    flagship: form.querySelector('#cat-flagship').checked,
    order: Number(form.querySelector('#cat-order').value) || 0,
    active: existing ? existing.active !== false : true
  };

  try {
    // Si al editar cambio el identificador, la direccion del catalogo tambien
    // cambia — y hay que llevarse los productos a la nueva.
    if (editingCategoryId && id !== editingCategoryId) {
      const afectados = products.filter(p => p.categoryId === editingCategoryId).length;
      const ok = confirm(
        `La dirección de esta categoría va a cambiar:

` +
        `  catalogo.html#${editingCategoryId}
  →  catalogo.html#${id}

` +
        (afectados ? `Se moverán ${afectados} producto(s) a la nueva dirección.
` : '') +
        `Los enlaces antiguos a #${editingCategoryId} dejarán de funcionar.

¿Continuar?`
      );
      if (!ok) return;
      await window.ErFirebase.renameCategory(editingCategoryId, id, data);
    } else {
      await window.ErFirebase.saveCategory(id, data);
    }
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
  const rutaActual = editing ? (editing.imageUrl || '') : '';
  form.querySelector('#prod-image-path').value = rutaActual;
  document.getElementById('imgWarning').textContent = '';

  const preview = document.getElementById('imgPreview');
  if (rutaActual) {
    previsualizarRuta(rutaActual, 'imgPreview', 'imgWarning');
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
    const isHidden = p.active === false;
    const pills = [];
    if (p.featured) pills.push('<span class="tag-pill">Destacado</span>');
    if (p.isNew) pills.push('<span class="tag-pill">Nuevo</span>');
    if (p.soldOut) pills.push('<span class="tag-pill">Agotado</span>');
    if (isHidden) pills.push('<span class="tag-pill">Oculto</span>');
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
          ${currentUserRole === 'admin' ? `<button class="btn btn-outline btn-sm" data-toggle-active-prod="${esc(p.id)}" type="button">${isHidden ? 'Mostrar' : 'Ocultar'}</button>` : ''}
          ${currentUserRole === 'colaborador' ? '' : `<button class="btn btn-light btn-sm" data-delete-prod="${esc(p.id)}" type="button">Eliminar</button>`}
        </div>
      </div>`;
  }).join('');
}

async function toggleProductActive(id) {
  const prod = products.find(p => p.id === id);
  if (!prod) return;
  try {
    await window.ErFirebase.saveProduct(id, { active: prod.active === false });
    await loadData();
  } catch (err) {
    alert('No se pudo actualizar: ' + err.message);
  }
}

async function saveProductFromForm(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('#prod-name').value.trim();
  const categoryId = form.querySelector('#prod-category').value;
  if (!name) { alert('El nombre del producto es obligatorio.'); return; }
  if (!categoryId) { alert('Primero crea al menos una categoría.'); return; }

  if (subiendoFoto) { alert('Espera a que termine de subir la foto antes de guardar.'); return; }

  if (fallóLaSubida && !document.getElementById('prod-image-path').value.trim()) {
    if (!confirm('La ultima foto no se pudo subir, asi que este producto va a quedar sin imagen. ¿Guardar de todos modos?')) return;
  }

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
      active: existing ? existing.active !== false : true,
      imageUrl: document.getElementById('prod-image-path').value.trim(),
      imagePath: ''
    };

    await window.ErFirebase.saveProduct(editingProductId, data);

    editingProductId = null;
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

// ---------------- Subida de fotos (Cloudinary) ----------------
// El sitio es estatico: GitHub Pages entrega archivos pero no los recibe, asi
// que subir una foto necesita un servicio externo. Se usa Cloudinary con un
// "upload preset" sin firma, que es lo que permite subir desde el navegador
// sin tener un servidor propio.
//
// Estos dos datos son publicos por diseno (viajan en el codigo del panel). La
// proteccion no esta en ocultarlos, sino en como se configura el preset en
// Cloudinary: solo imagenes, con tamano maximo y en una carpeta fija.
// Ver docs/configurar-cloudinary.md
const CLOUDINARY_CLOUD_NAME = 'pu28ccmt';
const CLOUDINARY_UPLOAD_PRESET = 'el-remanso';

function cloudinaryListo() {
  return CLOUDINARY_CLOUD_NAME !== 'PENDIENTE' && CLOUDINARY_UPLOAD_PRESET !== 'PENDIENTE';
}

async function subirACloudinary(file) {
  if (!cloudinaryListo()) {
    throw new Error('Falta configurar Cloudinary. Ver docs/configurar-cloudinary.md');
  }
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: fd
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const motivo = (data.error && data.error.message) || `Cloudinary respondio ${res.status}`;
    throw new Error(motivo);
  }
  // La foto se guarda y se entrega tal cual se subio: sin transformaciones,
  // para no alterar los 1800 x 1200 a calidad 95 del original.
  return data.secure_url;
}

// Conecta un boton de archivo con un campo de ruta y su previsualizacion.
function conectarSubida({ fileId, pathId, statusId, previewId, warningId }) {
  const fileInput = document.getElementById(fileId);
  const pathInput = document.getElementById(pathId);
  const status = document.getElementById(statusId);
  if (!fileInput || !pathInput) return;

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;

    status.className = 'upload-status';
    status.textContent = 'Subiendo ' + file.name + '...';
    fileInput.disabled = true;

    // Sin esto se puede guardar con la subida a medias y el campo vacio:
    // el producto quedaria sin foto sin que se note.
    subiendoFoto = true;
    const botonesGuardar = ['productSaveBtn', 'homeImagesSaveBtn']
      .map(id => document.getElementById(id)).filter(Boolean);
    botonesGuardar.forEach(b => { b.disabled = true; });

    try {
      const url = await subirACloudinary(file);
      pathInput.value = url;
      fallóLaSubida = false;
      previsualizarRuta(url, previewId, warningId || null);
      status.className = 'upload-status ok';
      status.textContent = 'Listo, foto subida.';
    } catch (err) {
      console.error('Fallo la subida a Cloudinary:', err);
      fallóLaSubida = true;
      status.className = 'upload-status error';
      status.textContent = 'No se pudo subir: ' + err.message;
    } finally {
      subiendoFoto = false;
      botonesGuardar.forEach(b => { b.disabled = false; });
      fileInput.disabled = false;
      fileInput.value = '';   // permite volver a elegir el mismo archivo
    }
  });
}

// ---------------- Fotos por ruta ----------------
// Las fotos viven en el repositorio y GitHub Pages las sirve. Aqui solo se
// guarda su ruta; no se sube ningun archivo. Firebase Storage no esta
// disponible en el plan gratuito, ver docs/activar-storage.md.

const CARPETA_PRODUCTOS = 'assets/img/productos/';

// "Poltrona Remanso" -> assets/img/productos/poltrona-remanso.jpg
function rutaSugerida(nombre) {
  const slug = slugify(nombre);
  return slug ? CARPETA_PRODUCTOS + slug + '.jpg' : '';
}

// Muestra la foto y avisa si la ruta no existe, que es el error tipico:
// el nombre del archivo no coincide con lo que se escribio.
function previsualizarRuta(ruta, contenedorId, avisoId) {
  const cont = document.getElementById(contenedorId);
  const aviso = avisoId ? document.getElementById(avisoId) : null;
  if (aviso) aviso.textContent = '';
  if (!cont) return;
  if (!ruta) { cont.innerHTML = ''; return; }

  const img = new Image();
  img.onload = () => {
    cont.innerHTML = '';
    cont.appendChild(img);
    if (aviso) {
      const ratio = img.naturalWidth / img.naturalHeight;
      if (ratio < 1.42 || ratio > 1.58) {
        aviso.textContent = 'Esta foto es ' + img.naturalWidth + ' x ' + img.naturalHeight +
          ' (proporcion ' + ratio.toFixed(2) + ':1). El catalogo usa 3:2 \u2014 lo ideal es 1800 x 1200 \u2014 asi que se va a ver recortada.';
      }
    }
  };
  img.onerror = () => {
    cont.innerHTML = '';
    if (aviso) aviso.textContent = 'No se encuentra ese archivo. Revisa que la foto este en la carpeta y que el nombre coincida exactamente: minusculas, sin tildes ni espacios.';
  };
  img.alt = '';
  img.src = ruta;
}
// ---------------- Importar catálogo inicial ----------------

async function runSeed() {
  const aviso = products.length > 0
    ? 'Ya hay productos guardados. Los del catálogo se van a sobrescribir con su versión original (se pierden los cambios y las fotos que les hayas puesto). ¿Continuar?'
    : 'Esto va a crear las 6 categorías y los 19 productos del catálogo. ¿Continuar?';
  if (!confirm(aviso)) return;
  const btn = document.getElementById('seedBtn');
  btn.disabled = true;
  try {
    await window.ErFirebase.seedInitialCatalog(SEED_CATEGORIES, SEED_PRODUCTS);
    await loadData();
    alert('Catálogo importado. Ya puedes editar cada producto para subir su foto real.');
  } catch (err) {
    alert('No se pudo importar: ' + err.message);
  } finally {
    btn.disabled = false;
  }
}

// Borrado total. Se pide escribir BORRAR a proposito: un solo clic de mas
// sobre un confirm normal se lleva por delante todo el catalogo.
async function runWipe() {
  const { products: np, categories: nc, photos } = await window.ErFirebase.countCatalog();
  if (np === 0 && nc === 0) { alert('El catálogo ya está vacío.'); return; }

  const detalle = `Se van a borrar ${nc} categoría(s), ${np} producto(s)` +
    (photos ? ` y ${photos} foto(s) subidas a Storage` : '') + '.';
  const escrito = prompt(`${detalle}

Esto NO se puede deshacer.
Escribe BORRAR para confirmar:`);
  if ((escrito || '').trim().toUpperCase() !== 'BORRAR') {
    alert('Cancelado, no se borró nada.');
    return;
  }

  const btn = document.getElementById('wipeBtn');
  btn.disabled = true;
  btn.textContent = 'Borrando...';
  try {
    const res = await window.ErFirebase.wipeCatalog();
    await loadData();
    alert(`Listo: se borraron ${res.categories} categoría(s) y ${res.products} producto(s). Ya puedes importar el catálogo de nuevo.`);
  } catch (err) {
    alert('No se pudo vaciar: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Vaciar el catálogo';
  }
}

// ---------------- Carga de datos + navegación por pestañas ----------------

async function loadData() {
  categories = await window.ErFirebase.fetchAllCategories();
  products = await window.ErFirebase.fetchAllProducts();

  renderCategoryList();
  renderProductList();
  if (currentUserRole === 'admin') await loadComments();   // nunca lanza, ver loadComments
  renderCategoryForm();
  renderProductForm();

  document.getElementById('productFilter').innerHTML =
    '<option value="">Todas las categorías</option>' + categoryOptionsHtml(null);

  // Importar y vaciar son siempre visibles para un administrador: hacen falta
  // justamente cuando ya hay datos y se quiere reemplazar todo.
  const isAdmin = currentUserRole === 'admin';
  document.getElementById('seedBlock').style.display = isAdmin ? '' : 'none';
  document.getElementById('seedText').textContent = products.length === 0
    ? 'Importa de una vez las 6 categorías y los 19 productos del catálogo, con su nombre, material e historia. Después editas cada uno para subirle su foto.'
    : 'Ya hay productos guardados. Si vuelves a importar, los del catálogo se sobrescriben con su versión original y los demás se quedan como están.';

  const wipeBlock = document.getElementById('wipeBlock');
  wipeBlock.style.display = isAdmin && (products.length > 0 || categories.length > 0) ? '' : 'none';
  document.getElementById('wipeCounts').textContent =
    `Hay ${categories.length} categoría(s) y ${products.length} producto(s) guardados.`;

  await loadCustomers();
  await loadOrders();

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


async function loadHomeSettings() {
  homeSettings = await window.ErFirebase.fetchHomeSettings();
  const heroPreview = document.getElementById('homeHeroPreview');
  const aboutPreview = document.getElementById('homeAboutPreview');
  heroPreview.innerHTML = homeSettings.heroImageUrl ? `<img src="${esc(homeSettings.heroImageUrl)}" alt="">` : '';
  aboutPreview.innerHTML = homeSettings.aboutImageUrl ? `<img src="${esc(homeSettings.aboutImageUrl)}" alt="">` : '';
  document.getElementById('home-hero-path').value = homeSettings.heroImageUrl || '';
  document.getElementById('home-about-path').value = homeSettings.aboutImageUrl || '';
}

function handleHomeImageSelect(e, previewId) {
  previsualizarRuta(e.target.value.trim(), previewId, null);
}

async function saveHomeImagesFromForm(e) {
  e.preventDefault();
  const errorEl = document.getElementById('homeImagesError');
  const btn = document.getElementById('homeImagesSaveBtn');
  errorEl.textContent = '';
  btn.disabled = true;
  btn.textContent = 'Guardando...';
  try {
    // Se guardan rutas del repositorio, no archivos subidos.
    await window.ErFirebase.saveHomeSettings({
      heroImageUrl: document.getElementById('home-hero-path').value.trim(),
      heroImagePath: '',
      aboutImageUrl: document.getElementById('home-about-path').value.trim(),
      aboutImagePath: ''
    });
    await loadHomeSettings();
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

function clientesFiltrados() {
  const texto = document.getElementById('customerSearch').value.trim().toLowerCase();
  if (!texto) return customers;
  // Se busca por nombre, telefono y cedula. El telefono se compara sin
  // espacios ni guiones para que "300 123" encuentre "3001234567".
  const limpio = texto.replace(/[^\w]/g, '');
  return customers.filter(c => {
    const tel = String(c.phone || '').replace(/[^\w]/g, '');
    return String(c.name || '').toLowerCase().includes(texto)
        || String(c.cedula || '').toLowerCase().includes(texto)
        || (limpio && tel.includes(limpio));
  });
}

function renderCustomerList() {
  const list = document.getElementById('customerList');
  const lista = clientesFiltrados();

  document.getElementById('customerCount').textContent =
    lista.length === customers.length
      ? `${customers.length} cliente(s)`
      : `${lista.length} de ${customers.length}`;

  if (!customers.length) {
    list.innerHTML = '<p class="admin-empty">Todavía no hay clientes guardados.</p>';
    return;
  }
  if (!lista.length) {
    list.innerHTML = '<p class="admin-empty">Ningún cliente coincide con la búsqueda.</p>';
    return;
  }
  list.innerHTML = lista.map(c => `
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
    editingCustomerId = await window.ErFirebase.saveCustomer(editingCustomerId, data);
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

  // Un cliente con pedidos no se borra de una: son registros de venta, y
  // borrarlo dejaria pedidos apuntando a un cliente que ya no existe.
  const suyos = orders.filter(o => o.customerId === id).length;
  if (suyos > 0) {
    alert(`No puedes eliminar a "${cust ? cust.name : ''}" todavía: tiene ${suyos} pedido(s) registrado(s). Elimina primero sus pedidos en la pestaña Pedidos.`);
    return;
  }

  if (!confirm(`¿Eliminar a "${cust ? cust.name : ''}"? Se borran también sus compras antiguas. Esta acción no se puede deshacer.`)) return;
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
        <strong>${esc(m.name) || esc(m.email) || '(sin datos)'}</strong>
        <span>${esc(m.role)}${m.email ? ' · ' + esc(m.email) : ''}</span>
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
  const commentsBtn = document.getElementById('tabBtnComments');
  if (commentsBtn) commentsBtn.style.display = isCollaborator ? 'none' : '';
  switchTab(isCollaborator ? 'products' : 'categories');
}

// ---------------- Pedidos ----------------
// Dos estados independientes a proposito: un mueble puede estar entregado y
// sin pagar, o pagado y sin entregar. Con una sola lista habria que elegir
// cual de los dos hechos registrar, y el otro -- que suele ser el que hay que
// perseguir -- se perderia.

const ESTADOS_PEDIDO = [
  { value: 'cotizado',   label: 'Cotizado' },
  { value: 'en_proceso', label: 'En proceso' },
  { value: 'listo',      label: 'Listo' },
  { value: 'entregado',  label: 'Entregado' },
  { value: 'cancelado',  label: 'Cancelado' }
];

const ESTADOS_PAGO = [
  { value: 'sin_anticipo', label: 'Sin anticipo' },
  { value: 'anticipo',     label: 'Anticipo pagado' },
  { value: 'pagado',       label: 'Pagado completo' }
];

let orders = [];
let editingOrderId = null;

function etiquetaEstado(lista, valor) {
  const e = lista.find(x => x.value === valor);
  return e ? e.label : '';
}

function opcionesHtml(lista, seleccionado, todosLabel) {
  const primera = todosLabel ? `<option value="">${esc(todosLabel)}</option>` : '';
  return primera + lista.map(o =>
    `<option value="${esc(o.value)}"${o.value === seleccionado ? ' selected' : ''}>${esc(o.label)}</option>`
  ).join('');
}

function pesos(n) {
  const v = Number(n) || 0;
  return '$' + v.toLocaleString('es-CO');
}

// Saldo = lo que falta por cobrar. Es el numero que de verdad importa.
function saldoDe(o) {
  return Math.max(0, (Number(o.value) || 0) - (Number(o.deposit) || 0));
}

function renderOrderForm() {
  const editing = orders.find(o => o.id === editingOrderId);
  const form = document.getElementById('orderForm');

  document.getElementById('ord-customer').innerHTML =
    '<option value="">Elige un cliente</option>' +
    customers.map(c => `<option value="${esc(c.id)}"${editing && editing.customerId === c.id ? ' selected' : ''}>${esc(c.name)}</option>`).join('');

  document.getElementById('ord-status').innerHTML =
    opcionesHtml(ESTADOS_PEDIDO, editing ? editing.status : 'cotizado');
  document.getElementById('ord-payment-status').innerHTML =
    opcionesHtml(ESTADOS_PAGO, editing ? editing.paymentStatus : 'sin_anticipo');
  document.getElementById('ord-material').innerHTML =
    materialOptionsHtml(editing ? editing.material : '');

  const campos = {
    'ord-product': 'product', 'ord-value': 'value', 'ord-deposit': 'deposit',
    'ord-payment-method': 'paymentMethod', 'ord-money-place': 'moneyPlace',
    'ord-balance-date': 'balanceDate', 'ord-delivery-date': 'deliveryDate',
    'ord-address': 'address', 'ord-notes': 'notes'
  };
  Object.entries(campos).forEach(([id, campo]) => {
    document.getElementById(id).value = editing ? (editing[campo] ?? '') : '';
  });

  document.getElementById('orderFormTitle').textContent =
    editing ? `Editar pedido: ${editing.product}` : 'Agregar pedido';
  document.getElementById('orderCancelBtn').style.display = editing ? '' : 'none';
  actualizarSaldoEnFormulario();
}

function actualizarSaldoEnFormulario() {
  const total = Number(document.getElementById('ord-value').value) || 0;
  const anticipo = Number(document.getElementById('ord-deposit').value) || 0;
  const nota = document.getElementById('ordBalance');
  if (!total && !anticipo) { nota.textContent = ''; return; }
  const saldo = Math.max(0, total - anticipo);
  nota.textContent = saldo > 0
    ? `Saldo pendiente: ${pesos(saldo)}`
    : 'Sin saldo pendiente.';
  nota.className = 'balance-note' + (saldo > 0 ? ' pendiente' : ' saldado');
}

function pedidosFiltrados() {
  const texto = document.getElementById('orderSearch').value.trim().toLowerCase();
  const estado = document.getElementById('orderStatusFilter').value;
  const pago = document.getElementById('orderPaymentFilter').value;

  return orders.filter(o => {
    if (estado && o.status !== estado) return false;
    if (pago && o.paymentStatus !== pago) return false;
    if (!texto) return true;
    return [o.customerName, o.product, o.address].some(v =>
      String(v || '').toLowerCase().includes(texto));
  });
}

function renderOrderTotals(lista) {
  const box = document.getElementById('orderTotals');
  if (!lista.length) { box.innerHTML = ''; return; }

  const activos = lista.filter(o => o.status !== 'cancelado');
  const porCobrar = activos.reduce((a, o) => a + saldoDe(o), 0);
  const vendido = activos.reduce((a, o) => a + (Number(o.value) || 0), 0);
  const entregadosSinPagar = activos.filter(o => o.status === 'entregado' && o.paymentStatus !== 'pagado').length;

  box.innerHTML = `
    <div class="stage-chip"><strong>${lista.length}</strong><span>pedido(s)</span></div>
    <div class="stage-chip"><strong>${pesos(vendido)}</strong><span>valor total</span></div>
    <div class="stage-chip stage-no_compro"><strong>${pesos(porCobrar)}</strong><span>por cobrar</span></div>
    ${entregadosSinPagar ? `<div class="stage-chip stage-no_compro"><strong>${entregadosSinPagar}</strong><span>entregado(s) sin pagar</span></div>` : ''}`;
}

function renderOrderList() {
  const list = document.getElementById('orderList');
  const lista = pedidosFiltrados();

  document.getElementById('orderCount').textContent =
    lista.length === orders.length
      ? `${orders.length} pedido(s)`
      : `${lista.length} de ${orders.length}`;

  renderOrderTotals(lista);

  if (!orders.length) {
    list.innerHTML = '<p class="admin-empty">Todavía no hay pedidos. Agrega el primero con el formulario de arriba.</p>';
    return;
  }
  if (!lista.length) {
    list.innerHTML = '<p class="admin-empty">Ningún pedido coincide con la búsqueda.</p>';
    return;
  }

  list.innerHTML = lista.map(o => {
    const saldo = saldoDe(o);
    const detalle = [
      o.material ? materialLabel(o.material) : '',
      o.value ? pesos(o.value) : '',
      o.deliveryDate ? 'entrega ' + o.deliveryDate : ''
    ].filter(Boolean).join(' · ');

    const alerta = o.status === 'entregado' && o.paymentStatus !== 'pagado' && saldo > 0
      ? `<span class="tag-pill tag-alerta">debe ${pesos(saldo)}</span>` : '';

    return `
      <div class="admin-row">
        <div class="info">
          <strong>${esc(o.product || '(sin pieza)')}</strong>
          <span>${esc(o.customerName || '(sin cliente)')}${detalle ? ' · ' + esc(detalle) : ''}</span>
          ${saldo > 0 ? `<span>Saldo: ${pesos(saldo)}${o.balanceDate ? ' · pago acordado ' + esc(o.balanceDate) : ''}</span>` : ''}
        </div>
        <div class="pills">
          <span class="tag-pill estado-${esc(o.status || '')}">${esc(etiquetaEstado(ESTADOS_PEDIDO, o.status))}</span>
          <span class="tag-pill pago-${esc(o.paymentStatus || '')}">${esc(etiquetaEstado(ESTADOS_PAGO, o.paymentStatus))}</span>
          ${alerta}
        </div>
        <div class="actions">
          ${currentUserRole === 'admin' ? `
            <button class="btn btn-outline btn-sm" data-edit-order="${esc(o.id)}" type="button">Editar</button>
            <button class="btn btn-light btn-sm" data-delete-order="${esc(o.id)}" type="button">Eliminar</button>` : ''}
        </div>
      </div>`;
  }).join('');
}

async function saveOrderFromForm(e) {
  e.preventDefault();
  const customerId = document.getElementById('ord-customer').value;
  const product = document.getElementById('ord-product').value.trim();
  if (!customerId) { alert('Elige a qué cliente pertenece el pedido.'); return; }
  if (!product) { alert('Escribe qué pieza es.'); return; }

  const cliente = customers.find(c => c.id === customerId);
  const btn = document.getElementById('orderSaveBtn');
  btn.disabled = true;
  btn.textContent = 'Guardando...';
  try {
    await window.ErFirebase.saveOrder(editingOrderId, {
      customerId,
      // Se guarda el nombre ademas del id para poder buscar y listar sin
      // tener que cruzar con la coleccion de clientes en cada fila.
      customerName: cliente ? cliente.name : '',
      product,
      material: document.getElementById('ord-material').value,
      value: Number(document.getElementById('ord-value').value) || 0,
      deposit: Number(document.getElementById('ord-deposit').value) || 0,
      paymentMethod: document.getElementById('ord-payment-method').value.trim(),
      moneyPlace: document.getElementById('ord-money-place').value.trim(),
      balanceDate: document.getElementById('ord-balance-date').value,
      deliveryDate: document.getElementById('ord-delivery-date').value,
      address: document.getElementById('ord-address').value.trim(),
      notes: document.getElementById('ord-notes').value.trim(),
      status: document.getElementById('ord-status').value,
      paymentStatus: document.getElementById('ord-payment-status').value
    });
    editingOrderId = null;
    await loadOrders();
    document.getElementById('orderForm').reset();
    renderOrderForm();
  } catch (err) {
    alert('No se pudo guardar el pedido: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Guardar pedido';
  }
}

async function loadOrders() {
  try {
    orders = await window.ErFirebase.fetchOrders();
  } catch (err) {
    // Igual que con los comentarios: que un fallo aqui no tumbe el panel.
    console.error('No se pudieron cargar los pedidos:', err);
    orders = [];
    document.getElementById('orderList').innerHTML =
      `<p class="admin-empty" style="color:#9A3B2A;">No se pudieron leer los pedidos: <strong>${esc(err.message || '')}</strong><br>Falta agregar la regla de la colección <code>orders</code> en la consola de Firebase. Está en <code>docs/firestore.rules</code>.</p>`;
    return;
  }
  renderOrderList();
  renderOrderForm();
}

// ---------------- Comentarios de clientes ----------------

const STAGE_LABELS = {
  compro:    'Compró',
  encargado: 'Encargado, esperando',
  cotizo:    'Cotizó, lo está pensando',
  no_compro: 'No compró',
  otro:      'Otra cosa'
};

// El conteo por etapa es lo que muestra donde se esta cayendo la venta.
function renderCommentStats() {
  const box = document.getElementById('commentStats');
  if (!comments.length) { box.innerHTML = ''; return; }

  const counts = {};
  for (const c of comments) counts[c.stage || 'otro'] = (counts[c.stage || 'otro'] || 0) + 1;

  box.innerHTML = Object.keys(STAGE_LABELS)
    .filter(k => counts[k])
    .map(k => `<div class="stage-chip stage-${k}"><strong>${counts[k]}</strong><span>${esc(STAGE_LABELS[k])}</span></div>`)
    .join('');
}

function renderCommentList() {
  const list = document.getElementById('commentList');

  // El contador de la pestaña avisa sin tener que entrar a mirar.
  const pendientes = comments.filter(c => !c.published).length;
  const badge = document.getElementById('pendingBadge');
  badge.textContent = pendientes;
  badge.hidden = pendientes === 0;

  if (commentsError) {
    list.innerHTML = `<p class="admin-empty" style="color:#9A3B2A;">
      No se pudieron leer los comentarios: <strong>${esc(commentsError.message || '')}</strong><br>
      Falta agregar la regla de la colección <code>testimonials</code> en la consola de Firebase.
      Está en <code>docs/reglas-firestore-comentarios.md</code>.</p>`;
    return;
  }

  if (!comments.length) {
    list.innerHTML = '<p class="admin-empty">Todavía no ha llegado ningún comentario. Manda el enlace de arriba por WhatsApp después de cada entrega.</p>';
    return;
  }

  // Lo que falta revisar va primero; dentro de cada grupo, lo más reciente.
  const ordenados = [...comments].sort((a, b) => Number(!!a.published) - Number(!!b.published));
  list.innerHTML = ordenados.map(c => {
    const when = c.createdAt && c.createdAt.toDate ? c.createdAt.toDate().toLocaleString('es-CO') : '';
    const who = [c.name, c.city].filter(Boolean).join(' · ');
    const stage = STAGE_LABELS[c.stage] || STAGE_LABELS.otro;
    return `
      <div class="admin-row${c.published ? '' : ' is-pending'}">
        <div class="info">
          <strong>${esc(who || '(sin nombre)')}</strong>
          <span>${esc(stage)}${c.piece ? ' · ' + esc(c.piece) : ''}${when ? ' · ' + when : ''}</span>
          <span class="quote-preview">"${esc(c.quote || '')}"</span>
        </div>
        <div class="pills">
          <span class="tag-pill">${c.published ? 'Publicado' : 'Sin publicar'}</span>
        </div>
        <div class="actions">
          <button class="btn btn-outline btn-sm" data-toggle-comment="${esc(c.id)}" type="button">${c.published ? 'Ocultar' : 'Publicar'}</button>
          <button class="btn btn-light btn-sm" data-delete-comment="${esc(c.id)}" type="button">Eliminar</button>
        </div>
      </div>`;
  }).join('');
}

function bindCommentActions() {
  const list = document.getElementById('commentList');

  list.addEventListener('click', async (e) => {
    const toggle = e.target.closest('[data-toggle-comment]');
    if (toggle) {
      const c = comments.find(x => x.id === toggle.dataset.toggleComment);
      if (!c) return;
      // Al publicar el primero le damos un orden al final de la fila.
      const order = c.order != null ? c.order : comments.filter(x => x.published).length;
      await window.ErFirebase.updateTestimonial(c.id, { published: !c.published, order });
      await loadComments();
      return;
    }

    const del = e.target.closest('[data-delete-comment]');
    if (del) {
      if (!confirm('¿Eliminar este comentario? No se puede deshacer.')) return;
      await window.ErFirebase.deleteTestimonial(del.dataset.deleteComment);
      await loadComments();
    }
  });

  document.getElementById('copyOpinionLink').addEventListener('click', async (e) => {
    const url = new URL('contacto.html#comentario', location.href).href;
    try {
      await navigator.clipboard.writeText(url);
      e.target.textContent = 'Copiado';
      setTimeout(() => { e.target.textContent = 'Copiar'; }, 1800);
    } catch (err) {
      prompt('Copia este enlace:', url);
    }
  });
}

// Si falla (tipicamente porque falta la regla de Firestore), se avisa en su
// propio panel y no se propaga: lo demas del panel tiene que seguir cargando.
async function loadComments() {
  try {
    comments = await window.ErFirebase.fetchAllTestimonials();
    commentsError = null;
  } catch (err) {
    comments = [];
    commentsError = err;
    console.error('No se pudieron cargar los comentarios:', err);
  }
  renderCommentStats();
  renderCommentList();
}

function switchTab(tab) {
  document.getElementById('categoriesPanel').style.display = tab === 'categories' ? '' : 'none';
  document.getElementById('productsPanel').style.display = tab === 'products' ? '' : 'none';
  document.getElementById('customersPanel').style.display = tab === 'customers' ? '' : 'none';
  document.getElementById('leadsPanel').style.display = tab === 'leads' ? '' : 'none';
  document.getElementById('ordersPanel').style.display = tab === 'orders' ? '' : 'none';
  document.getElementById('commentsPanel').style.display = tab === 'comments' ? '' : 'none';
  document.getElementById('homePanel').style.display = tab === 'home' ? '' : 'none';
  document.getElementById('teamPanel').style.display = tab === 'team' ? '' : 'none';
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
}

function wireEvents() {
  document.querySelectorAll('.admin-tab').forEach(t => {
    t.addEventListener('click', () => switchTab(t.dataset.tab));
  });

  document.getElementById('categoryForm').addEventListener('submit', saveCategoryFromForm);

  // El identificador (y por tanto la URL) sigue al nombre mientras se escribe.
  // Si alguien lo edita a mano, se respeta y deja de seguirlo.
  const catLabel = document.getElementById('cat-label');
  const catId = document.getElementById('cat-id');
  catLabel.addEventListener('input', () => {
    if (!catIdTouched) catId.value = slugify(catLabel.value);
  });
  catId.addEventListener('input', () => { catIdTouched = true; });
  document.getElementById('categoryCancelBtn').addEventListener('click', () => {
    editingCategoryId = null;
    document.getElementById('categoryForm').reset();
    renderCategoryForm();
  });
  document.getElementById('categoryList').addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit-cat]');
    const delBtn = e.target.closest('[data-delete-cat]');
    const toggleBtn = e.target.closest('[data-toggle-active-cat]');
    if (editBtn) { editingCategoryId = editBtn.dataset.editCat; renderCategoryForm(); window.scrollTo({ top: document.getElementById('categoryForm').offsetTop - 100, behavior: 'smooth' }); }
    if (delBtn) deleteCategoryById(delBtn.dataset.deleteCat);
    if (toggleBtn) toggleCategoryActive(toggleBtn.dataset.toggleActiveCat);
  });

  document.getElementById('productForm').addEventListener('submit', saveProductFromForm);
  document.getElementById('productCancelBtn').addEventListener('click', () => {
    editingProductId = null;
    document.getElementById('productForm').reset();
    renderProductForm();
  });
  document.getElementById('productList').addEventListener('click', (e) => {
    const editBtn = e.target.closest('[data-edit-prod]');
    const delBtn = e.target.closest('[data-delete-prod]');
    const toggleBtn = e.target.closest('[data-toggle-active-prod]');
    if (editBtn) { editingProductId = editBtn.dataset.editProd; renderProductForm(); window.scrollTo({ top: document.getElementById('productForm').offsetTop - 100, behavior: 'smooth' }); }
    if (delBtn) deleteProductById(delBtn.dataset.deleteProd);
    if (toggleBtn) toggleProductActive(toggleBtn.dataset.toggleActiveProd);
  });
  document.getElementById('productFilter').addEventListener('change', renderProductList);
  const rutaInput = document.getElementById('prod-image-path');
  rutaInput.addEventListener('input', () => {
    previsualizarRuta(rutaInput.value.trim(), 'imgPreview', 'imgWarning');
  });
  conectarSubida({ fileId: 'prod-image-file', pathId: 'prod-image-path',
                   statusId: 'uploadStatus', previewId: 'imgPreview', warningId: 'imgWarning' });
  conectarSubida({ fileId: 'home-hero-file', pathId: 'home-hero-path',
                   statusId: 'heroUploadStatus', previewId: 'homeHeroPreview' });
  conectarSubida({ fileId: 'home-about-file', pathId: 'home-about-path',
                   statusId: 'aboutUploadStatus', previewId: 'homeAboutPreview' });

  document.getElementById('suggestPathBtn').addEventListener('click', () => {
    const nombre = document.getElementById('prod-name').value.trim();
    const ruta = rutaSugerida(nombre);
    if (!ruta) { alert('Escribe primero el nombre de la pieza.'); return; }
    rutaInput.value = ruta;
    previsualizarRuta(ruta, 'imgPreview', 'imgWarning');
  });
  document.getElementById('seedBtn').addEventListener('click', runSeed);
  document.getElementById('wipeBtn').addEventListener('click', runWipe);
  // ----- Clientes: buscador -----
  document.getElementById('customerSearch').addEventListener('input', renderCustomerList);

  // ----- Pedidos -----
  document.getElementById('orderStatusFilter').innerHTML = opcionesHtml(ESTADOS_PEDIDO, '', 'Todos los estados');
  document.getElementById('orderPaymentFilter').innerHTML = opcionesHtml(ESTADOS_PAGO, '', 'Todos los pagos');
  document.getElementById('orderForm').addEventListener('submit', saveOrderFromForm);
  document.getElementById('orderSearch').addEventListener('input', renderOrderList);
  document.getElementById('orderStatusFilter').addEventListener('change', renderOrderList);
  document.getElementById('orderPaymentFilter').addEventListener('change', renderOrderList);
  ['ord-value', 'ord-deposit'].forEach(id =>
    document.getElementById(id).addEventListener('input', actualizarSaldoEnFormulario));
  document.getElementById('orderCancelBtn').addEventListener('click', () => {
    editingOrderId = null;
    document.getElementById('orderForm').reset();
    renderOrderForm();
  });
  document.getElementById('orderList').addEventListener('click', async (e) => {
    const edit = e.target.closest('[data-edit-order]');
    if (edit) {
      editingOrderId = edit.dataset.editOrder;
      renderOrderForm();
      window.scrollTo({ top: document.getElementById('orderFormCard').offsetTop - 100, behavior: 'smooth' });
      return;
    }
    const del = e.target.closest('[data-delete-order]');
    if (del) {
      if (!confirm('¿Eliminar este pedido? No se puede deshacer.')) return;
      await window.ErFirebase.deleteOrder(del.dataset.deleteOrder);
      await loadOrders();
    }
  });

  bindCommentActions();

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
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const errorEl = document.getElementById('signupError');
    errorEl.textContent = '';
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      await window.ErFirebase.redeemInviteAndSignUp(code, name, email, password);
      // onAuthChange lleva a la persona directo al panel.
    } catch (err) {
      errorEl.textContent = err.message || 'No se pudo crear la cuenta. Revisa el código e intenta de nuevo.';
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById('home-hero-path').addEventListener('input', (e) => handleHomeImageSelect(e, 'homeHeroPreview'));
  document.getElementById('home-about-path').addEventListener('input', (e) => handleHomeImageSelect(e, 'homeAboutPreview'));
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
