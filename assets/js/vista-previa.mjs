// El Remanso — /vista-previa?p=<id>[&borrador=1]
//
// Dibuja una pagina de aterrizaje aunque este apagada, solo para quien tiene
// rol de administrador. Usa la misma plantilla (paginas.mjs) que el
// generador, asi que lo que se ve aqui es lo que se va a publicar.
// Con &borrador=1 muestra lo que esta escrito en el panel aunque no se haya
// guardado (el panel lo deja en localStorage del mismo navegador).

import { renderMain, tx, esc } from './paginas.mjs';

const main = document.querySelector('main');

function aviso(html) {
  main.innerHTML = `<section><div class="container text-center"><div class="card" style="max-width:520px; margin:0 auto;">${html}</div></div></section>`;
}

function esperarFirebase() {
  return new Promise(resolve => {
    const t = setInterval(() => {
      if (window.ErFirebase) { clearInterval(t); resolve(window.ErFirebase); }
    }, 50);
  });
}

function borradorGuardado(id) {
  try {
    const dato = JSON.parse(localStorage.getItem('er_borrador_pagina') || 'null');
    return dato && dato.id === id ? dato.pagina : null;
  } catch (err) {
    return null;
  }
}

async function mostrar(fb) {
  const params = new URLSearchParams(location.search);
  const id = params.get('p') || '';
  const conBorrador = params.get('borrador') === '1';

  const [guardada, products, fotosMateriales, site] = await Promise.all([
    id && id !== '__nueva__' ? fb.fetchPage(id) : Promise.resolve(null),
    fb.fetchProducts(),
    fb.fetchMaterialImages(),
    fb.fetchSiteSettings()
  ]);
  const pagina = (conBorrador && borradorGuardado(id)) || guardada;
  if (!pagina) {
    aviso('<h2 class="mt-0">No se encontró esa página</h2><p>Vuelve al panel y ábrela desde la pestaña Páginas.</p>');
    return;
  }

  const estado = pagina.published ? 'publicada' : 'APAGADA (nadie más la ve)';
  const origen = conBorrador ? 'con los cambios sin guardar del panel' : 'versión guardada';
  main.innerHTML = `
    <div class="vista-previa-aviso">
      Vista previa de <strong>/${esc(pagina.slug || 'nueva-pagina')}</strong> · ${estado} · ${origen} ·
      <a href="/admin">volver al panel</a>
    </div>
    ${renderMain(pagina, { products, fotosMateriales, whatsapp: site.whatsappNumber })}`;

  document.title = `Vista previa · ${tx(pagina.text && pagina.text.h1, 'es') || 'El Remanso'}`;
  if (window.ErI18n) window.ErI18n.applyTranslations();
}

const fb = await esperarFirebase();
fb.onAuthChange(async (user) => {
  if (!user) {
    aviso('<h2 class="mt-0">Vista previa</h2><p>Inicia sesión en el panel para ver las páginas antes de publicarlas.</p><a href="/admin" class="btn btn-primary">Ir al panel</a>');
    return;
  }
  try {
    const rol = await fb.fetchMyRole();
    if (rol !== 'admin') {
      aviso('<h2 class="mt-0">Vista previa</h2><p>Solo un administrador puede ver las páginas antes de publicarlas.</p>');
      return;
    }
    await mostrar(fb);
  } catch (err) {
    console.error(err);
    aviso(`<h2 class="mt-0">No se pudo cargar la vista previa</h2><p>${esc(err.message)}</p>`);
  }
});
