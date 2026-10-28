// El Remanso — Seccion "Siguenos en Instagram".
//
// Dos fuentes:
//  - settings/instagram (Firestore): encendida o no, donde se muestra y los
//    textos. Lo maneja el panel (pestana Instagram).
//  - assets/data/instagram.json: las ultimas publicaciones. Lo escribe solo
//    tools/instagram.mjs (GitHub Actions) con la API de Instagram. Si la
//    conexion falla, trae ok = false y la seccion se apaga sola.
// Sin widgets de terceros: la cuadricula es del sitio.
//
// La seccion nace oculta y vacia en el HTML. Solo se dibuja cuando ya se
// leyeron las dos fuentes y todo esta en orden. Si algo falta o falla, se
// queda oculta: nunca deja un hueco.
// Va siempre al final de la pagina, despues del llamado a WhatsApp, asi que
// al aparecer no empuja nada de lo que la persona ya esta viendo.

(function () {
  var PERFIL = 'https://www.instagram.com/muebleria_elremanso/';
  // Con menos de 4 no llena ni una fila en escritorio: mejor no mostrarla.
  var MINIMO = 4;

  // Recorte cuadrado y centrado: las fotos verticales pierden arriba y abajo
  // por igual. El panel muestra exactamente este mismo recorte.
  var RECORTE = 'c_fill,g_center,ar_1:1';

  var TEXTOS_DEFECTO = {
    title: { es: 'Síguenos en Instagram', en: 'Follow us on Instagram' },
    text: {
      es: 'Mira lo que estamos tejiendo esta semana y las piezas que ya llegaron a su lugar.',
      en: "See what we're weaving this week and the pieces that have already found their place."
    }
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function variante(url, t) {
    if (!url || url.indexOf('res.cloudinary.com') < 0 || url.indexOf('/upload/') < 0) return url;
    return url.replace('/upload/', '/upload/' + t + '/');
  }

  function texto(valor, defecto, lang) {
    var v = (valor && valor[lang]) || '';
    return String(v || (lang === 'es' ? '' : (valor && valor.es) || '') || defecto[lang] || defecto.es).trim();
  }

  // Texto con su version en ingles para el boton ES/EN (ver i18n.js).
  function bi(tag, valor, defecto, attrs) {
    var es = texto(valor, defecto, 'es');
    var en = texto(valor, defecto, 'en');
    var enAttr = en && en !== es ? ' data-en="' + esc(esc(en)) + '"' : '';
    return '<' + tag + (attrs || '') + enAttr + '>' + esc(es) + '</' + tag + '>';
  }

  function publicacion(p) {
    var anchos = [300, 450, 600, 800];
    var srcset = anchos.map(function (w) {
      return esc(variante(p.image, RECORTE + ',w_' + w + ',f_auto,q_auto')) + ' ' + w + 'w';
    }).join(', ');
    return '<a class="ig-post" href="' + esc(p.link) + '" target="_blank" rel="noopener">' +
      '<img src="' + esc(variante(p.image, RECORTE + ',w_600,f_auto,q_auto')) + '" srcset="' + srcset + '"' +
      ' sizes="(max-width: 620px) 50vw, (max-width: 900px) 33vw, 280px"' +
      ' width="600" height="600" loading="lazy" decoding="async"' +
      ' alt="' + esc(p.alt || 'Publicación de El Remanso en Instagram') + '">' +
      '</a>';
  }

  function esperarFirebase(ms) {
    return new Promise(function (resolve) {
      var inicio = Date.now();
      (function mirar() {
        if (window.ErFirebase) return resolve(window.ErFirebase);
        if (Date.now() - inicio > ms) return resolve(null);
        setTimeout(mirar, 50);
      })();
    });
  }

  async function render() {
    var sec = document.getElementById('instagramSection');
    if (!sec || sec.dataset.listo) return;

    var fb = await esperarFirebase(10000);
    if (!fb || !fb.fetchInstagram) return;

    var cfg, feed;
    try {
      var resultados = await Promise.all([
        fb.fetchInstagram(),
        fetch('assets/data/instagram.json', { cache: 'no-cache' }).then(function (r) {
          if (!r.ok) throw new Error('instagram.json ' + r.status);
          return r.json();
        })
      ]);
      cfg = resultados[0];
      feed = resultados[1];
    } catch (err) {
      console.error('No se pudo leer la seccion de Instagram:', err);
      return;                                   // se queda oculta
    }
    if (!cfg || !cfg.active) return;
    if (!feed || !feed.ok) return;              // conexion con Instagram caida: se apaga sola
    var lugar = sec.dataset.ubicacion;
    if (lugar === 'inicio' && cfg.showOnHome === false) return;
    if (lugar === 'categoria' && cfg.showOnCategories === false) return;

    var posts = (Array.isArray(feed.posts) ? feed.posts : [])
      .filter(function (p) { return p && p.image && p.link; })
      .slice(0, 8);
    if (posts.length < MINIMO) return;

    sec.innerHTML =
      '<div class="container">' +
        '<div class="text-center mb-lg">' +
          '<span class="eyebrow">Instagram</span>' +
          bi('h2', cfg.title, TEXTOS_DEFECTO.title) +
          bi('p', cfg.text, TEXTOS_DEFECTO.text, ' class="lede center"') +
        '</div>' +
        '<div class="ig-grid">' + posts.map(publicacion).join('') + '</div>' +
        '<p class="ig-mas-wrap">' +
          '<a class="btn btn-outline ig-mas" href="' + PERFIL + '" target="_blank" rel="noopener" data-i18n="instagram.ver_mas">Ver más en @muebleria_elremanso</a>' +
        '</p>' +
      '</div>';
    sec.dataset.listo = '1';
    sec.hidden = false;
    if (window.ErI18n && window.ErI18n.applyTranslations) window.ErI18n.applyTranslations();
  }

  window.ErInstagram = { render: render };
  document.addEventListener('DOMContentLoaded', render);
})();
