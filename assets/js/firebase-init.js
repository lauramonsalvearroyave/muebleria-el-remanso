// El Remanso — Firebase (Analytics + Firestore + Storage + Auth)
// Un solo lugar donde se inicializa Firebase para todo el sitio.
// Expone window.ErFirebase con:
//  - saveLead / track           -> ya existían (leads + métricas)
//  - fetchCategories / fetchProducts -> lectura pública para el sitio (solo activos)
//  - fetchAllCategories / fetchAllProducts -> lectura completa para el panel admin
//  - saveCategory / deleteCategory / saveProduct / deleteProduct -> escritura (requiere sesión)
//  - uploadProductImage / deleteProductImage -> Storage
//  - onAuthChange / signIn / signOut -> autenticación del panel admin
//  - seedInitialCatalog -> importa el catálogo inicial una sola vez

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics, logEvent, isSupported as analyticsSupported } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import {
  getFirestore, collection, addDoc, doc, setDoc, deleteDoc, getDocs, getDoc,
  query, where, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-storage.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut as fbSignOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

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
const storage = getStorage(app);
const auth = getAuth(app);

let analytics = null;
analyticsSupported().then(ok => {
  if (ok) analytics = getAnalytics(app);
});

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
  if (analytics) logEvent(analytics, eventName, params);
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

async function uploadProductImage(file, productId) {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-]/g, "_");
  const path = `products/${productId}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, path };
}

async function deleteProductImage(path) {
  if (!path) return;
  try {
    await deleteObject(ref(storage, path));
  } catch (err) {
    console.error("No se pudo borrar la imagen anterior:", err);
  }
}

// ---------- Autenticación (panel admin) ----------

function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

async function signIn(email, password) {
  await signInWithEmailAndPassword(auth, email, password);
}

async function signOutUser() {
  await fbSignOut(auth);
}

// ---------- Importar catálogo inicial (una sola vez, desde el panel admin) ----------

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
  saveCategory, deleteCategory,
  saveProduct, deleteProduct,
  uploadProductImage, deleteProductImage,
  onAuthChange, signIn, signOut: signOutUser,
  seedInitialCatalog
};
