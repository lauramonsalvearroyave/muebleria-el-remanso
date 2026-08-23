// El Remanso — Firebase (Analytics + Firestore)
// Se carga como módulo en las 4 páginas. Analytics registra visitas
// automáticamente; saveLead() guarda cada "Me interesa" y cada envío
// del formulario de contacto en la colección "leads" de Firestore.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAnalytics, logEvent, isSupported as analyticsSupported } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

window.ErFirebase = { saveLead, track };
