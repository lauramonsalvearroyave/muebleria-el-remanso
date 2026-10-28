#!/usr/bin/env node
// El Remanso — Trae las ultimas publicaciones de Instagram para el sitio.
//
// Lo ejecuta GitHub Actions junto con el generador de paginas
// (.github/workflows/paginas.yml). Usa la API de Instagram (inicio de sesion
// de Instagram) con una llave guardada en los Secrets de GitHub:
// INSTAGRAM_TOKEN. La llave NUNCA se escribe en archivos ni en el registro.
//
// Escribe assets/data/instagram.json, que lee assets/js/instagram.js:
//   { ok, motivo, actualizado, posts: [{ id, image, link, alt }] }
// Si no hay llave o Instagram falla, ok = false y la seccion no se muestra
// en el sitio (se apaga sola). Las publicaciones anteriores se conservan en
// el archivo solo para no volver a subir las mismas fotos a Cloudinary.
//
// Las URLs de las fotos de Instagram caducan a los pocos dias: cada foto se
// copia una sola vez a Cloudinary y se reutiliza mientras siga en la lista.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = path.join(RAIZ, 'assets/data/instagram.json');
const TOKEN = (process.env.INSTAGRAM_TOKEN || '').trim();
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

// Texto alternativo a partir del pie de foto: sin hashtags ni menciones,
// hasta ~125 caracteres cortando en una palabra.
function altDesde(caption) {
  let t = String(caption || '')
    .replace(/[#@][\p{L}\p{N}_.]+/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (t.length > 125) t = t.slice(0, 125).replace(/\s+\S*$/, '') + '…';
  return t || 'Publicación de El Remanso en Instagram';
}

async function pedirInstagram() {
  const campos = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const url = `https://graph.instagram.com/me/media?fields=${campos}&limit=20&access_token=${encodeURIComponent(TOKEN)}`;
  const r = await fetch(url);
  const cuerpo = await r.json().catch(() => ({}));
  if (!r.ok || cuerpo.error) {
    // El mensaje de Meta no incluye la llave; la URL si, por eso no se usa.
    const msg = (cuerpo.error && cuerpo.error.message) || `Instagram respondio ${r.status}`;
    throw new Error(msg);
  }
  return cuerpo.data || [];
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

async function main() {
  const anterior = await leerAnterior();
  const cache = new Map((anterior.posts || []).map(p => [p.id, p.image]));
  let nuevo;

  if (!TOKEN) {
    nuevo = { ...anterior, ok: false, motivo: 'sin_conexion' };
  } else {
    try {
      const media = await pedirInstagram();
      const posts = [];
      for (const m of media) {
        if (posts.length >= MAX_POSTS) break;
        const origen = m.media_type === 'VIDEO' ? m.thumbnail_url : m.media_url;
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
        posts.push({ id: m.id, image, link: m.permalink, alt: altDesde(m.caption) });
      }
      nuevo = { ok: true, motivo: '', actualizado: anterior.actualizado, posts };
    } catch (err) {
      console.warn(`Instagram fallo: ${err.message}`);
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
