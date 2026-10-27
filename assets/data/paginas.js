/* GENERADO por tools/generar-paginas.mjs desde el panel (pestaña Páginas). No editar a mano: se sobrescribe. */
window.ER_PAGINAS = {
  "publicadas": [
    {
      "id": "columpios",
      "slug": "columpios",
      "tipo": "categoria",
      "menu": {
        "es": "Columpios y camas nido",
        "en": "Swings & nest beds"
      },
      "enMenu": true,
      "enPie": true,
      "orden": 3
    },
    {
      "id": "comedores",
      "slug": "comedores",
      "tipo": "categoria",
      "menu": {
        "es": "Comedores",
        "en": "Dining sets"
      },
      "enMenu": true,
      "enPie": true,
      "orden": 4
    },
    {
      "id": "como-trabajamos",
      "slug": "como-trabajamos",
      "tipo": "proceso",
      "menu": {
        "es": "Cómo trabajamos",
        "en": "How we work"
      },
      "enMenu": true,
      "enPie": true,
      "orden": 6
    },
    {
      "id": "exterior",
      "slug": "exterior",
      "tipo": "categoria",
      "menu": {
        "es": "Exterior",
        "en": "Outdoor"
      },
      "enMenu": true,
      "enPie": true,
      "orden": 2
    },
    {
      "id": "materiales",
      "slug": "materiales",
      "tipo": "materiales",
      "menu": {
        "es": "Materiales",
        "en": "Materials"
      },
      "enMenu": true,
      "enPie": true,
      "orden": 5
    },
    {
      "id": "salas",
      "slug": "salas",
      "tipo": "categoria",
      "menu": {
        "es": "Salas",
        "en": "Living room sets"
      },
      "enMenu": true,
      "enPie": true,
      "orden": 1
    }
  ],
  "apagadas": [
    "clientes",
    "hoteles"
  ],
  "etiqueta": ""
};

// Se ejecuta en el <head>, antes de dibujar: marca que paginas estan
// encendidas (html.pag-<id>) y oculta los enlaces a las apagadas, sin parpadeo.
(function (d) {
  var P = window.ER_PAGINAS, h = d.documentElement, ocultar = [], i;
  for (i = 0; i < P.publicadas.length; i++) h.classList.add('pag-' + P.publicadas[i].id);
  for (i = 0; i < P.apagadas.length; i++) ocultar.push('[data-requiere-pagina="' + P.apagadas[i] + '"]');
  if (ocultar.length) {
    var s = d.createElement('style');
    s.textContent = ocultar.join(',') + '{display:none!important}';
    d.head.appendChild(s);
  }

  // Etiqueta adicional de Google (Ads o Tag Manager), configurable en el
  // panel. Google Analytics ya viene escrito en el HTML de cada pagina.
  var id = P.etiqueta;
  if (!id) return;
  if (/^GTM-/.test(id)) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var g = d.createElement('script');
    g.async = true;
    g.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(id);
    d.head.appendChild(g);
  } else if (typeof window.gtag === 'function') {
    window.gtag('config', id);
  }
})(document);
