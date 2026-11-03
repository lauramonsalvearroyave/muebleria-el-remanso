#!/usr/bin/env node
// El Remanso — Trae las ultimas publicaciones de Instagram para el sitio.
//
// Lo ejecuta GitHub Actions junto con el generador de paginas
// (.github/workflows/paginas.yml). Lee el feed JSON de Behold (behold.so),
// que se conecta a Instagram por nosotros: sin cuenta de desarrollador en
// Meta y sin llaves que renovar. La direccion del feed esta en los Secrets
// de GitHub: BEHOLD_FEED_URL. Nunca se escribe en archivos ni en el registro.
//
// Escribe assets/data/instagram.json, que lee assets/js/instagram.js:
//   { ok, motivo, actualizado, posts: [{ id, image, link, alt }] }
// Si falta la direccion o Behold falla, ok = false y la seccion no se
// muestra en el sitio (se apaga sola).
//
// Cada foto se copia una sola vez a Cloudinary: asi el sitio no depende de
// los servidores de Behold para mostrar las imagenes ni gasta sus visitas.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = path.join(RAIZ, 'assets/data/instagram.json');
const FEED = (process.env.BEHOLD_FEED_URL || '').trim();
const MAX_POSTS = 8;
const CLOUDINARY = { nube: 'pu28ccmt', preset: 'el-remanso' };

async function leerAnterior() {
  if (!existsSync(SALIDA)) return { ok: false, motivo: 'sin_conexion', actualizado: null, posts: [] };
  try {
    return JSON.parse(await readFile(SALIDA, 'utf8'));
  } catch {
    return { ok: false, motivo: 'sin_conexion', actualizado: null, posts: [] };
  }
}

// Texto alternativo a partir del pie de foto (Behold ya quita los hashtags
// del final): sin menciones, sin el WhatsApp, hasta ~125 caracteres.
function altDesde(texto) {
  let t = String(texto || '')
    .replace(/[#@][\p{L}\p{N}_.]+/gu, '')
    .split(/\n\s*\n/)[0]
    .replace(/\s+/g, ' ')
    .trim();
  if (t.length > 125) t = t.slice(0, 125).replace(/\s+\S*$/, '') + '…';
  return t || 'Publicación de El Remanso en Instagram';
}

async function pedirFeed() {
  if (!/^https:\/\/feeds\.behold\.so\//.test(FEED)) {
    throw new Error('BEHOLD_FEED_URL no parece una direccion de Behold (https://feeds.behold.so/...)');
  }
  const r = await fetch(FEED, { headers: { accept: 'application/json' } });
  if (!r.ok) throw new Error(`Behold respondio ${r.status}`);
  const d = await r.json();
  if (!Array.isArray(d.posts)) throw new Error('El feed de Behold no trae publicaciones');
  return d.posts;
}

async function subirACloudinary(urlOrigen) {
  const fd = new FormData();
  fd.append('file', urlOrigen);
  fd.append('upload_preset', CLOUDINARY.preset);
  const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY.nube}/image/upload`, { method: 'POST', body: fd });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.secure_url) throw new Error((d.error && d.error.message) || `Cloudinary respondio ${r.status}`);
  return d.secure_url;
}

// La foto original, en su formato de Instagram (vertical 4:5 en la mayoria):
// el sitio la muestra completa. En videos, la portada. Si falta, la version
// que prepara Behold.
const FUENTE = 'original';
function fotoDe(p) {
  const s = p.sizes || {};
  const original = p.mediaType === 'VIDEO' ? p.thumbnailUrl : p.mediaUrl;
  return original || (s.full && s.full.mediaUrl) || (s.large && s.large.mediaUrl) || '';
}

async function main() {
  const anterior = await leerAnterior();
  // Solo se reutilizan las fotos ya copiadas en este mismo formato.
  const cache = new Map((anterior.posts || []).filter(p => p.fuente === FUENTE).map(p => [p.id, p.image]));
  let nuevo;

  if (!FEED) {
    nuevo = { ...anterior, ok: false, motivo: 'sin_conexion' };
  } else {
    try {
      const media = await pedirFeed();
      const posts = [];
      for (const m of media) {
        if (posts.length >= MAX_POSTS) break;
        if (m.visibility && m.visibility !== 'visible') continue;
        const origen = fotoDe(m);
        if (!origen || !m.permalink) continue;
        let image = cache.get(m.id);
        if (!image) {
          try {
            image = await subirACloudinary(origen);
          } catch (err) {
            console.warn(`No se pudo copiar la foto ${m.id} a Cloudinary: ${err.message}`);
            continue;
          }
        }
        posts.push({ id: m.id, image, fuente: FUENTE, link: m.permalink, alt: altDesde(m.prunedCaption || m.caption) });
      }
      nuevo = { ok: true, motivo: '', actualizado: anterior.actualizado, posts };
    } catch (err) {
      console.warn(`Instagram (Behold) fallo: ${err.message}`);
      nuevo = { ...anterior, ok: false, motivo: err.message.slice(0, 200) };
    }
  }

  // La fecha solo cambia si cambio algo de verdad; asi el archivo no se
  // reescribe (ni genera un cambio en GitHub) en cada vuelta.
  const igual = existsSync(SALIDA) &&
    JSON.stringify({ ...nuevo, actualizado: null }) === JSON.stringify({ ...anterior, actualizado: null });
  if (igual) {
    console.log(`Instagram: sin cambios (${nuevo.ok ? `${nuevo.posts.length} publicaciones` : nuevo.motivo}).`);
    return;
  }
  nuevo.actualizado = new Date().toISOString();
  await mkdir(path.dirname(SALIDA), { recursive: true });
  await writeFile(SALIDA, JSON.stringify(nuevo, null, 2) + '\n');
  console.log(`Instagram: ${nuevo.ok ? `${nuevo.posts.length} publicaciones` : `apagada (${nuevo.motivo})`}.`);
}

main().catch(err => {
  // Nunca tumba la publicacion de las paginas por culpa de Instagram.
  console.warn(`Instagram: error inesperado: ${err.message}`);
});
