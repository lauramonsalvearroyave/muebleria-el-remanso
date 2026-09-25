// El Remanso — Firebase (Analytics + Firestore + Storage + Auth)
// Un solo lugar donde se inicializa Firebase para todo el sitio.
// Expone window.ErFirebase con:
//  - saveLead / track           -> ya existían (leads + métricas)
//  - fetchCategories / fetchProducts -> lectura pública para el sitio (solo activos)
//  - fetchAllCategories / fetchAllProducts -> lectura completa para el panel admin
//  - saveCategory / deleteCategory / saveProduct / deleteProduct -> escritura (requiere sesión)
//  - uploadProductImage / deleteProductImage -> Storage
//  - onAuthChange / signIn / signOut -> autenticación del panel admin (carga diferida)
//  - seedInitialCatalog -> importa el catálogo inicial una sola vez

// Solo se importan de entrada los dos modulos que el sitio publico necesita
// para dibujar (app + firestore). Analytics, Storage y Auth se cargan con
// import() dinamico cuando de verdad hacen falta: si se importan aqui arriba,
// el navegador espera a que bajen los cinco antes de disparar DOMContentLoaded,
// que es justo lo que arranca el catalogo.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore, collection, addDoc, doc, setDoc, deleteDoc, getDocs, getDoc,
  query, where, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDqiu8m3EIJMiYzMSlM6RF14TUomlkiQPE",
  authDomain: "el-remanso-web.firebaseapp.com",
  projectId: "el-remanso-web",
  storageBucket: "el-remanso-web.firebasestorage.app",
  messagingSenderId: "256514950026",
  appId: "1:256514950026:web:8082ca038544fa71113e73",
  measurementId: "G-3PKHJ3M6CF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SDK = "https://www.gstatic.com/firebasejs/10.13.2";

// Cada modulo se baja una sola vez: la promesa se guarda y se reutiliza.
let storagePromise = null;
function loadStorage() {
  if (!storagePromise) {
    storagePromise = import(`${SDK}/firebase-storage.js`).then(m => {
      const storage = m.getStorage(app);
      // Por defecto el SDK reintenta hasta 2 minutos antes de rendirse. Si el
      // bucket no existe o las reglas niegan, el boton se queda en "Guardando..."
      // todo ese rato sin decir nada. 20 s basta para una foto y falla a tiempo.
      storage.maxUploadRetryTime = 20000;
      storage.maxOperationRetryTime = 20000;
      return { ...m, storage };
    });
  }
  return storagePromise;
}

let authPromise = null;
function loadAuth() {
  if (!authPromise) {
    authPromise = import(`${SDK}/firebase-auth.js`)
      .then(m => ({ ...m, auth: m.getAuth(app) }));
  }
  return authPromise;
}

// Analytics no hace falta para dibujar nada, asi que se carga cuando el
// navegador esta libre. Lo que se intente medir antes queda en cola.
let analytics = null;
let logEventFn = null;
const pendingEvents = [];

async function startAnalytics() {
  try {
    const m = await import(`${SDK}/firebase-analytics.js`);
    if (!(await m.isSupported())) return;
    analytics = m.getAnalytics(app);
    logEventFn = m.logEvent;
    for (const [name, params] of pendingEvents) logEventFn(analytics, name, params);
    pendingEvents.length = 0;
  } catch (err) {
    console.error("No se pudo iniciar Analytics:", err);
  }
}

if ("requestIdleCallback" in window) {
  requestIdleCallback(startAnalytics, { timeout: 5000 });
} else {
  window.addEventListener("load", () => setTimeout(startAnalytics, 1500), { once: true });
}

async function saveLead(data) {
  try {
    await addDoc(collection(db, "leads"), {
      ...data,
      page: location.pathname,
      createdAt: serverTimestamp()
    });
  } catch (err) {
    // No bloquea el envío por WhatsApp si Firebase falla (ej. sin internet)
    console.error("No se pudo guardar el registro en Firebase:", err);
  }
}

function track(eventName, params) {
  if (analytics && logEventFn) logEventFn(analytics, eventName, params);
  else pendingEvents.push([eventName, params]);
}

// ---------- Leads: lectura/edición para el panel admin ----------

async function fetchLeads() {
  const q = query(collection(db, "leads"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function updateLead(id, data) {
  await setDoc(doc(db, "leads", id), data, { merge: true });
}

async function deleteLead(id) {
  await deleteDoc(doc(db, "leads", id));
}

// ---------- Ajustes del sitio (número de WhatsApp) ----------
// Se guarda por fuera del código para que se pueda cambiar sin tocar el sitio.

const DEFAULT_WHATSAPP_NUMBER = "573104599629";

async function fetchSiteSettings() {
  const snap = await getDoc(doc(db, "settings", "site"));
  return snap.exists() ? snap.data() : {};
}

async function saveSiteSettings(data) {
  await setDoc(doc(db, "settings", "site"), data, { merge: true });
}

async function getWhatsappNumber() {
  try {
    const settings = await fetchSiteSettings();
    return settings.whatsappNumber || DEFAULT_WHATSAPP_NUMBER;
  } catch (err) {
    return DEFAULT_WHATSAPP_NUMBER;
  }
}

// ---------- Catálogo: lectura pública (solo activos) ----------

async function fetchCategories() {
  const q = query(collection(db, "categories"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(c => c.active !== false);
}

async function fetchProducts() {
  const q = query(collection(db, "products"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).filter(p => p.active !== false);
}

// ---------- Catálogo: lectura completa para el panel admin ----------

async function fetchAllCategories() {
  const q = query(collection(db, "categories"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function fetchAllProducts() {
  const q = query(collection(db, "products"), orderBy("order", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ---------- Catálogo: escritura (requiere sesión, ver reglas de seguridad) ----------

async function saveCategory(id, data) {
  const ref_ = doc(db, "categories", id);
  await setDoc(ref_, data, { merge: true });
}

// Cambiar el identificador de una categoria = cambiar la clave del documento,
// que en Firestore no se puede editar en sitio. Hay que crear el nuevo, mover
// los productos que apuntaban al viejo y recien ahi borrar el viejo. En ese
// orden: si algo falla a mitad, nunca quedan productos apuntando a la nada.
async function renameCategory(oldId, newId, data) {
  if (oldId === newId) {
    await setDoc(doc(db, "categories", newId), data, { merge: true });
    return 0;
  }

  const clash = await getDoc(doc(db, "categories", newId));
  if (clash.exists()) {
    throw new Error(`Ya existe otra categoria con la direccion "${newId}". Elige otro nombre.`);
  }

  await setDoc(doc(db, "categories", newId), data);

  const snap = await getDocs(query(collection(db, "products"), where("categoryId", "==", oldId)));
  await Promise.all(snap.docs.map(d =>
    setDoc(doc(db, "products", d.id), { categoryId: newId }, { merge: true })
  ));

  await deleteDoc(doc(db, "categories", oldId));
  return snap.size;
}

async function deleteCategory(id) {
  await deleteDoc(doc(db, "categories", id));
}

async function saveProduct(id, data) {
  const newId = id || doc(collection(db, "products")).id;
  await setDoc(doc(db, "products", newId), data, { merge: true });
  return newId;
}

async function deleteProduct(id) {
  await deleteDoc(doc(db, "products", id));
}

// ---------- Imágenes ----------

// Traduce los errores de Storage a algo accionable. El mas comun al empezar
// es que Storage no este activado todavia en la consola de Firebase.
function explicarErrorStorage(err) {
  const code = err && err.code ? String(err.code) : '';
  if (code.includes('unauthorized')) {
    return new Error('Las reglas de Storage no permiten subir. Revisa la pestaña Reglas de Storage en la consola de Firebase.');
  }
  if (code.includes('unknown') || code.includes('retry-limit') || code.includes('bucket-not-found')) {
    return new Error('No se encontró el almacenamiento de fotos. Falta activar Storage en la consola de Firebase (Compilación → Storage → Comenzar).');
  }
  return err;
}

async function uploadProductImage(file, productId) {
  const { storage, ref, uploadBytes, getDownloadURL } = await loadStorage();
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, "_");
  const path = `products/${productId}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);
  try {
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, path };
  } catch (err) {
    throw explicarErrorStorage(err);
  }
}

async function deleteProductImage(path) {
  if (!path) return;
  try {
    const { storage, ref, deleteObject } = await loadStorage();
    await deleteObject(ref(storage, path));
  } catch (err) {
    console.error("No se pudo borrar la imagen anterior:", err);
  }
}

// ---------- Fotos del inicio (hero + "Nuestra historia") ----------

async function fetchHomeSettings() {
  const snap = await getDoc(doc(db, "settings", "home"));
  return snap.exists() ? snap.data() : {};
}

async function saveHomeSettings(data) {
  await setDoc(doc(db, "settings", "home"), data, { merge: true });
}

async function uploadSiteImage(file, key) {
  const { storage, ref, uploadBytes, getDownloadURL } = await loadStorage();
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, "_");
  const path = `site/${key}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);
  try {
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return { url, path };
  } catch (err) {
    throw explicarErrorStorage(err);
  }
}

// ---------- Autenticación (panel admin) ----------

// Mantiene la firma sincrona de siempre: engancha el listener en cuanto
// el modulo de Auth termina de bajar.
function onAuthChange(callback) {
  loadAuth().then(({ auth, onAuthStateChanged }) => onAuthStateChanged(auth, callback));
}

async function signIn(email, password) {
  const { auth, signInWithEmailAndPassword } = await loadAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

async function signOutUser() {
  const { auth, signOut } = await loadAuth();
  await signOut(auth);
}

// Quien esta con sesion abierta ahora mismo (null si no hay).
async function currentUser() {
  const { auth } = await loadAuth();
  return auth.currentUser;
}

// ---------- Roles y equipo ----------
// "admin": administra categorías, productos e invitaciones.
// "colaborador": solo puede cambiar imagen y promociones (Agotado/Destacado/Nuevo)
// de productos que ya existen. Ver reglas de seguridad de Firestore.

function randomInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin 0/O/1/I para evitar confusiones
  let code = "";
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function fetchMyRole() {
  const user = await currentUser();
  if (!user) return null;
  const snap = await getDoc(doc(db, "team", user.uid));
  return snap.exists() ? snap.data().role : null;
}

// Solo un admin puede generar invitaciones (lo exige la regla de seguridad).
async function createInvite(email) {
  const code = randomInviteCode();
  await setDoc(doc(db, "invites", code), {
    email: email || "",
    role: "colaborador",
    createdBy: (await currentUser()).uid,
    createdAt: serverTimestamp(),
    used: false,
    usedBy: null
  });
  return code;
}

async function fetchInvites() {
  const snap = await getDocs(collection(db, "invites"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function fetchTeamMembers() {
  const snap = await getDocs(collection(db, "team"));
  return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
}

// Le quita el rol a alguien (deja de poder editar nada) — no borra su cuenta
// de inicio de sesión, eso requeriría un backend con permisos de administrador.
async function removeTeamMember(uid) {
  await deleteDoc(doc(db, "team", uid));
}

// Flujo de "Registrarme": valida el código, crea la cuenta, reclama la
// invitación y crea el documento de equipo — en ese orden, porque las
// reglas de seguridad verifican cada paso antes de permitir el siguiente.
async function redeemInviteAndSignUp(code, name, email, password) {
  const inviteRef = doc(db, "invites", code.trim().toUpperCase());
  const inviteSnap = await getDoc(inviteRef);
  if (!inviteSnap.exists()) throw new Error("Ese código de invitación no existe.");
  const invite = inviteSnap.data();
  if (invite.used) throw new Error("Ese código de invitación ya fue usado.");
  if (invite.email && invite.email.toLowerCase() !== email.toLowerCase()) {
    throw new Error("Este código de invitación es para otro correo.");
  }

  const { auth, createUserWithEmailAndPassword } = await loadAuth();
  await createUserWithEmailAndPassword(auth, email, password);
  const uid = auth.currentUser.uid;

  await setDoc(inviteRef, { used: true, usedBy: uid }, { merge: true });
  await setDoc(doc(db, "team", uid), {
    role: "colaborador",
    name,
    email,
    inviteCode: inviteRef.id,
    createdAt: serverTimestamp()
  });
}

// ---------- Clientes (CRM) + historial de compras ----------
// Colaborador puede ver y crear (clientes nuevos, compras nuevas);
// solo administrador puede editar o borrar. Ver reglas de seguridad.

async function fetchCustomers() {
  const q = query(collection(db, "customers"), orderBy("name", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function saveCustomer(id, data) {
  const newId = id || doc(collection(db, "customers")).id;
  await setDoc(doc(db, "customers", newId), data, { merge: true });
  return newId;
}

// Firestore NO borra las subcolecciones al borrar el documento padre: quedan
// huerfanas, invisibles pero guardadas. Tratandose de datos personales de una
// persona que pide que la borren, eso no basta -- hay que llevarselas tambien.
async function deleteCustomer(id) {
  const snap = await getDocs(collection(db, "customers", id, "purchases"));
  await Promise.all(snap.docs.map(d => deleteDoc(doc(db, "customers", id, "purchases", d.id))));
  await deleteDoc(doc(db, "customers", id));
  return snap.size;
}

async function fetchPurchases(customerId) {
  const q = query(collection(db, "customers", customerId, "purchases"), orderBy("date", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function addPurchase(customerId, data) {
  await addDoc(collection(db, "customers", customerId, "purchases"), {
    ...data,
    createdAt: serverTimestamp()
  });
}

async function deletePurchase(customerId, purchaseId) {
  await deleteDoc(doc(db, "customers", customerId, "purchases", purchaseId));
}

// Crea un cliente a partir de un interesado ya existente, sin perder lo
// que ya sabíamos de él (nombre, teléfono, qué producto le interesó).
async function convertLeadToCustomer(lead) {
  const customerId = await saveCustomer(null, {
    name: lead.name || "",
    phone: lead.phone || "",
    notes: lead.product ? `Interesado originalmente en: ${lead.product}` : "",
    createdAt: serverTimestamp()
  });
  await updateLead(lead.id, { convertedToCustomerId: customerId });
  return customerId;
}

// ---------- Fotos de los materiales ----------
// Se administran desde el panel, no por archivo, para no depender del
// repositorio. Viven en settings/materials, que ya tiene lectura publica.

async function fetchMaterialImages() {
  const snap = await getDoc(doc(db, "settings", "materials"));
  return snap.exists() ? snap.data() : {};
}

async function saveMaterialImages(data) {
  await setDoc(doc(db, "settings", "materials"), data, { merge: true });
}

// ---------- Pedidos ----------
// Coleccion propia y no subcoleccion del cliente: la pestana Pedidos necesita
// listarlos TODOS para filtrar por estado, y eso desde una subcoleccion obliga
// a recorrer cliente por cliente. Se guarda customerName ademas de customerId
// para poder buscar y mostrar sin ir a buscar el cliente en cada fila.

async function fetchOrders() {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function saveOrder(id, data) {
  const newId = id || doc(collection(db, "orders")).id;
  const payload = { ...data };
  if (!id) payload.createdAt = serverTimestamp();
  await setDoc(doc(db, "orders", newId), payload, { merge: true });
  return newId;
}

async function deleteOrder(id) {
  await deleteDoc(doc(db, "orders", id));
}

// ---------- Comentarios de clientes ----------
// Los envía cualquiera desde contacto.html y entran SIN publicar: hasta que
// alguien del equipo los aprueba en el panel, no se ven en el sitio. El campo
// "stage" (compro / cotizo / pensandolo) sirve para ver en que se queda la venta.

async function submitTestimonial(data) {
  await addDoc(collection(db, "testimonials"), {
    ...data,
    published: false,
    createdAt: serverTimestamp()
  });
}

// Lectura pública del inicio: solo lo aprobado. Se ordena aquí y no en la
// consulta a propósito — un where + orderBy obligaría a crear un índice
// compuesto en Firebase, y para unas decenas de comentarios no compensa.
async function fetchPublishedTestimonials() {
  const q = query(collection(db, "testimonials"), where("published", "==", true));
  const snap = await getDocs(q);
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

async function fetchAllTestimonials() {
  const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function updateTestimonial(id, data) {
  await setDoc(doc(db, "testimonials", id), data, { merge: true });
}

async function deleteTestimonial(id) {
  await deleteDoc(doc(db, "testimonials", id));
}

// ---------- Vaciar el catálogo (destructivo, solo desde el panel admin) ----------
// Borra TODOS los productos y TODAS las categorías, y de paso las fotos que
// esos productos tuvieran en Storage (si no, quedarían colgadas sin dueño).
// No se puede deshacer: quien llama debe confirmarlo antes.

async function countCatalog() {
  const [prodSnap, catSnap] = await Promise.all([
    getDocs(collection(db, "products")),
    getDocs(collection(db, "categories"))
  ]);
  const photos = prodSnap.docs.filter(d => d.data().imagePath).length;
  return { products: prodSnap.size, categories: catSnap.size, photos };
}

async function wipeCatalog() {
  const [prodSnap, catSnap] = await Promise.all([
    getDocs(collection(db, "products")),
    getDocs(collection(db, "categories"))
  ]);

  // Primero las fotos: si algo falla aquí, los documentos siguen en pie y
  // se puede reintentar sin haber perdido la referencia a la imagen.
  for (const d of prodSnap.docs) {
    const path = d.data().imagePath;
    if (path) await deleteProductImage(path);
  }

  await Promise.all(prodSnap.docs.map(d => deleteDoc(doc(db, "products", d.id))));
  await Promise.all(catSnap.docs.map(d => deleteDoc(doc(db, "categories", d.id))));

  return { products: prodSnap.size, categories: catSnap.size };
}

// ---------- Importar catálogo inicial (desde el panel admin) ----------

async function seedInitialCatalog(categories, products) {
  for (const cat of categories) {
    const { id, ...data } = cat;
    await setDoc(doc(db, "categories", id), data);
  }
  for (const prod of products) {
    const { id, ...data } = prod;
    await setDoc(doc(db, "products", id), data);
  }
}

window.ErFirebase = {
  saveLead, track,
  fetchCategories, fetchProducts,
  fetchAllCategories, fetchAllProducts,
  saveCategory, deleteCategory, renameCategory,
  saveProduct, deleteProduct,
  uploadProductImage, deleteProductImage,
  fetchHomeSettings, saveHomeSettings, uploadSiteImage,
  fetchMaterialImages, saveMaterialImages,
  fetchSiteSettings, saveSiteSettings, getWhatsappNumber,
  fetchLeads, updateLead, deleteLead,
  fetchCustomers, saveCustomer, deleteCustomer,
  fetchPurchases, addPurchase, deletePurchase, convertLeadToCustomer,
  fetchOrders, saveOrder, deleteOrder,
  onAuthChange, signIn, signOut: signOutUser,
  fetchMyRole, createInvite, fetchInvites, redeemInviteAndSignUp,
  fetchTeamMembers, removeTeamMember,
  submitTestimonial, fetchPublishedTestimonials, fetchAllTestimonials,
  updateTestimonial, deleteTestimonial,
  seedInitialCatalog, wipeCatalog, countCatalog
};
