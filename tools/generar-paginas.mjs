#!/usr/bin/env node
// El Remanso — Generador de las paginas de aterrizaje.
//
// Lo ejecuta GitHub Actions (.github/workflows/paginas.yml): al instante con
// "Run workflow" (boton "Publicar ahora" del panel), y solo cada pocas horas,
// porque GitHub espacia mucho los procesos programados de repos con poco
// movimiento aunque se le pidan cada 15 minutos.
// Lee Firestore (solo lo publico: no necesita llaves ni contrasenas) y escribe:
//
//   <slug>.html                pagina encendida, con su SEO ya en el HTML
//   <slug>.html                pagina apagada -> redirige a /catalogo
//   <slug-anterior>.html       direccion vieja -> redirige a la nueva
//   vista-previa.html          base de la vista previa del panel
//   sitemap.xml                solo con las paginas encendidas
//   assets/data/paginas.js     menu, pie y etiqueta de Google Ads
//
// GitHub Pages no puede responder con un 302 de servidor: la redireccion es
// instantanea en el navegador (location.replace + meta refresh) y conserva
// ?gclid=... para que Google Ads no pierda la atribucion.
//
// Uso:
//   node tools/generar-paginas.mjs              (lo normal)
//   node tools/generar-paginas.mjs --inicial    (sin leer "pages": todas apagadas)
//   node tools/generar-paginas.mjs --demo --salida <carpeta>
//        (prueba local: publica las 8 paginas iniciales en otra carpeta)

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const P = await import(pathToFileURL(path.join(RAIZ, 'assets/js/paginas.mjs')).href);

const args = process.argv.slice(2);
const MODO_INICIAL = args.includes('--inicial');
const MODO_DEMO = args.includes('--demo');
const iSalida = args.indexOf('--salida');
const SALIDA = iSalida >= 0 ? path.resolve(args[iSalida + 1]) : RAIZ;

const PROYECTO = 'el-remanso-web';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROYECTO}/databases/(default)/documents`;

// Marca de los archivos que escribe este generador. Nunca pisa un archivo
// que no la tenga: asi una direccion mal elegida no borra catalogo.html.
const MARCA = '<!-- GENERADO por tools/generar-paginas.mjs desde el panel (pestaña Páginas). No editar a mano: se sobrescribe. -->';

// ---------- Firestore (REST, solo lectura publica) ----------

function valor(v) {
  if (v == null) return null;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return v.doubleValue;
  if ('booleanValue' in v) return v.booleanValue;
  if ('nullValue' in v) return null;
  if ('timestampValue' in v) return v.timestampValue;
  if ('mapValue' in v) return campos(v.mapValue.fields || {});
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(valor);
  if ('referenceValue' in v) return v.referenceValue;
  return null;
}

function campos(fields) {
  const o = {};
  for (const [k, v] of Object.entries(fields)) o[k] = valor(v);
  return o;
}

function documento(d) {
  return { id: d.name.split('/').pop(), ...campos(d.fields || {}) };
}

async function pedir(url, opciones) {
  const r = await fetch(url, opciones);
  const cuerpo = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = new Error(`Firestore respondio ${r.status} en ${url}: ${(cuerpo.error && cuerpo.error.message) || ''}`);
    e.status = r.status;
    throw e;
  }
  return cuerpo;
}

async function listar(coleccion) {
  const docs = [];
  let token = '';
  do {
    const url = `${BASE}/${coleccion}?pageSize=300${token ? `&pageToken=${encodeURIComponent(token)}` : ''}`;
    const r = await pedir(url);
    (r.documents || []).forEach(d => docs.push(documento(d)));
    token = r.nextPageToken || '';
  } while (token);
  return docs;
}

async function leer(ruta) {
  try {
    return documento(await pedir(`${BASE}/${ruta}`));
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

// Las reglas solo dejan leer las encendidas, y exigen que la consulta lo pida.
async function paginasPublicadas() {
  const r = await pedir(`${BASE}:runQuery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: 'pages' }],
        where: { fieldFilter: { field: { fieldPath: 'published' }, op: 'EQUAL', value: { booleanValue: true } } }
      }
    })
  });
  return r.filter(x => x.document).map(x => documento(x.document));
}

// ---------- Plantilla: el mismo esqueleto de /catalogo ----------
// Cabecera, pie, "Me interesa", visor de fotos y scripts salen de
// catalogo.html tal cual esta. Si alguien cambia el menu o el pie del sitio,
// las paginas nuevas lo heredan en la siguiente vuelta del generador.

function reemplazarUna(texto, patron, nuevo, nombre) {
  if (!patron.test(texto)) throw new Error(`catalogo.html cambio: no se encontro ${nombre}. Revisar tools/generar-paginas.mjs`);
  return texto.replace(patron, nuevo);
}

function quitarLineas(texto, patron) {
  return texto.replace(patron, '');
}

function armar(esqueleto, { head, main, slug, robots, catalogoActivo, scriptsExtra }) {
  let html = esqueleto;
  html = html.replace('<!DOCTYPE html>', `<!DOCTYPE html>\n${MARCA}`);
  html = quitarLineas(html, /^[ \t]*<meta name="description"[^\n]*\n/m);
  html = quitarLineas(html, /^[ \t]*<link rel="canonical"[^\n]*\n/m);
  html = quitarLineas(html, /^[ \t]*<!-- Vista previa al compartir[^\n]*\n/m);
  html = quitarLineas(html, /^[ \t]*<meta property="og:[^\n]*\n/gm);
  html = quitarLineas(html, /^[ \t]*<meta name="twitter:[^\n]*\n/gm);
  html = reemplazarUna(html, /<title[^>]*>[\s\S]*?<\/title>/, () => head + (robots ? `\n<meta name="robots" content="${robots}">` : ''), '<title>');
  html = reemplazarUna(html, /<main>[\s\S]*<\/main>/, () => `<main>\n${main}\n</main>`, '<main>');
  html = reemplazarUna(html, /<body>/, `<body data-pagina="${P.esc(slug)}">`, '<body>');
  if (!catalogoActivo) html = html.replace('<a href="/catalogo" class="active"', '<a href="/catalogo"');
  if (scriptsExtra) html = reemplazarUna(html, /<\/body>/, `${scriptsExtra}\n</body>`, '</body>');
  return html;
}

function redireccion(destino) {
  return `<!DOCTYPE html>
${MARCA}
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, follow">
<title>El Remanso</title>
<link rel="canonical" href="${P.SITIO}${destino}">
<script>location.replace(${JSON.stringify(destino)} + location.search);</script>
<meta http-equiv="refresh" content="0; url=${destino}">
</head>
<body>
<p><a href="${destino}">Continuar a El Remanso</a></p>
</body>
</html>
`;
}

function paginasJs(publicadas, apagadas, etiqueta) {
  const datos = {
    publicadas: publicadas.map(p => ({
      id: p.id,
      slug: p.slug,
      tipo: p.type,
      menu: { es: P.tx(p.text && p.text.menuLabel, 'es'), en: (p.text && p.text.menuLabel && p.text.menuLabel.en) || '' },
      enMenu: p.showInMenu !== false,
      enPie: p.showInFooter !== false,
      orden: p.menuOrder || 0
    })),
    apagadas,
    etiqueta: etiqueta || ''
  };
  return `/* ${MARCA.replace(/<!--|-->/g, '').trim()} */
window.ER_PAGINAS = ${JSON.stringify(datos, null, 2)};

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
`;
}

const SITEMAP_BASE = [
  ['/', 'weekly', '1.0'],
  ['/catalogo', 'weekly', '0.8'],
  ['/contacto', 'monthly', '0.5'],
  ['/ayuda-legal', 'monthly', '0.5']
];

function sitemap(publicadas) {
  const urls = SITEMAP_BASE.map(([ruta, freq, prio]) => `  <url>
    <loc>${P.SITIO}${ruta}</loc>
    <changefreq>${freq}</changefreq>
    <priority>${prio}</priority>
  </url>`);
  publicadas
    .slice()
    .sort((a, b) => (a.menuOrder || 0) - (b.menuOrder || 0))
    .forEach(p => {
      const fecha = typeof p.updatedAt === 'string' ? `\n    <lastmod>${p.updatedAt.slice(0, 10)}</lastmod>` : '';
      urls.push(`  <url>
    <loc>${P.SITIO}/${p.slug}</loc>${fecha}
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
    });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

// ---------- Programa ----------

async function main() {
  const esqueleto = (await readFile(path.join(RAIZ, 'catalogo.html'), 'utf8')).replace(/\r\n/g, '\n');

  // 1. Leer todo antes de escribir nada: si Firestore falla a mitad de
  //    camino, no queda el sitio a medio publicar.
  const [products, settingsSite, settingsMateriales, settingsPaginas] = await Promise.all([
    listar('products'),
    leer('settings/site'),
    leer('settings/materials'),
    MODO_INICIAL ? Promise.resolve(null) : leer('settings/pages')
  ]);

  let publicadasLeidas = [];
  if (!MODO_INICIAL && !MODO_DEMO) {
    try {
      publicadasLeidas = await paginasPublicadas();
    } catch (err) {
      // Antes de publicar las reglas nuevas, Firestore niega leer "pages". Si
      // ademas nunca se ha creado ninguna pagina (no hay indice), no hay nada
      // encendido y se sigue. Si ya hay paginas, se falla: mejor no publicar
      // que apagar por error algo que esta en una campana.
      if (err.status === 403 && !settingsPaginas) {
        console.warn('Firestore aun no permite leer "pages" (faltan las reglas nuevas). Se publican todas apagadas.');
      } else {
        throw err;
      }
    }
  }

  const publicadas = MODO_DEMO
    ? P.PAGINAS_INICIALES.map(p => ({ ...p, published: true }))
    : publicadasLeidas.filter(p => {
        const err = P.validarSlug(p.slug, p.id, []);
        if (err) console.warn(`Se omite la pagina ${p.id}: ${err}`);
        return !err;
      });

  const ctx = {
    products,
    fotosMateriales: settingsMateriales || {},
    whatsapp: (settingsSite && settingsSite.whatsappNumber) || P.WA_DEFECTO
  };

  // Todas las paginas conocidas, encendidas o no: las iniciales siempre (asi
  // sus direcciones redirigen desde el primer dia) mas las del indice.
  const conocidas = new Map();
  P.PAGINAS_INICIALES.forEach(p => conocidas.set(p.id, { slug: p.slug, previousSlugs: [] }));
  Object.entries((settingsPaginas && settingsPaginas.indice) || {}).forEach(([id, v]) =>
    conocidas.set(id, { slug: v.slug, previousSlugs: v.previousSlugs || [] }));
  publicadas.forEach(p => conocidas.set(p.id, { slug: p.slug, previousSlugs: p.previousSlugs || [] }));

  const encendidas = new Set(publicadas.map(p => p.id));
  const archivos = new Map();   // ruta relativa -> contenido
  const poner = (slug, contenido, prioridad) => {
    if (!slug || P.SLUGS_RESERVADOS.includes(slug) || !/^[a-z0-9-]+$/.test(slug)) return;
    const ruta = `${slug}.html`;
    const actual = archivos.get(ruta);
    if (!actual || prioridad > actual.prioridad) archivos.set(ruta, { contenido, prioridad });
  };

  // 2. Paginas encendidas (prioridad alta: le ganan a cualquier redireccion).
  for (const p of publicadas) {
    const html = armar(esqueleto, {
      head: P.renderHead(p),
      main: P.renderMain(p, ctx),
      slug: p.slug,
      catalogoActivo: p.type === 'categoria'
    });
    poner(p.slug, html, 3);
  }

  // 3. Apagadas -> /catalogo. Direcciones viejas -> la nueva, o /catalogo.
  for (const [id, info] of conocidas) {
    const destinoActual = encendidas.has(id) ? `/${info.slug}` : '/catalogo';
    if (!encendidas.has(id)) poner(info.slug, redireccion('/catalogo'), 2);
    (info.previousSlugs || []).forEach(viejo => {
      if (viejo !== info.slug) poner(viejo, redireccion(destinoActual), 1);
    });
  }

  // 4. Base de la vista previa: el mismo esqueleto, sin indexar.
  archivos.set('vista-previa.html', {
    contenido: armar(esqueleto, {
      head: '<title>Vista previa | El Remanso</title>',
      robots: 'noindex, nofollow',
      main: '  <div class="er-loader" role="status" aria-label="Cargando" style="min-height:60vh;"><div class="er-loader__mark" style="width:140px;height:140px;"><svg class="er-loader__ring" viewBox="0 0 184 184" aria-hidden="true"><circle class="track" cx="92" cy="92" r="88"/><circle class="arc" cx="92" cy="92" r="88"/></svg><img class="er-loader__logo" src="assets/img/logo-mark.png" alt="" style="width:67px;height:67px;"></div></div>',
      slug: 'vista-previa',
      catalogoActivo: false,
      scriptsExtra: '<script type="module" src="assets/js/vista-previa.mjs"></script>'
    }),
    prioridad: 9
  });

  const apagadas = Array.from(conocidas.keys()).filter(id => !encendidas.has(id));
  archivos.set('sitemap.xml', { contenido: sitemap(publicadas), prioridad: 9 });
  archivos.set('assets/data/paginas.js', {
    contenido: paginasJs(publicadas, apagadas, settingsSite && settingsSite.googleTagId),
    prioridad: 9
  });

  // 5. Escribir solo lo que cambio.
  const cambiados = [];
  for (const [rel, { contenido }] of archivos) {
    const destino = path.join(SALIDA, rel);
    const actual = existsSync(destino) ? (await readFile(destino, 'utf8')).replace(/\r\n/g, '\n') : null;
    if (actual !== null && rel.endsWith('.html') && !actual.includes(MARCA)) {
      throw new Error(`${rel} existe y no lo creo este generador: no se sobrescribe. Elige otra direccion para esa pagina.`);
    }
    if (actual === contenido) continue;
    await mkdir(path.dirname(destino), { recursive: true });
    await writeFile(destino, contenido);
    cambiados.push(rel);
  }

  console.log(`Encendidas: ${publicadas.map(p => '/' + p.slug).join(', ') || 'ninguna'}`);
  console.log(`Apagadas (redirigen a /catalogo): ${apagadas.map(id => '/' + conocidas.get(id).slug).join(', ') || 'ninguna'}`);
  console.log(cambiados.length ? `Archivos actualizados:\n  ${cambiados.join('\n  ')}` : 'Sin cambios.');
}

main().catch(err => {
  console.error(err.message || err);
  process.exit(1);
});
