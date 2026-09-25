# Activar Storage (las fotos)

Sin esto **ninguna foto se puede subir**: ni las de los productos ni las dos
del inicio. Lo comprobé contra tu proyecto y la respuesta fue clara:

```
el-remanso-web.firebasestorage.app   404  The specified bucket does not exist.
el-remanso-web.appspot.com           404  The specified bucket does not exist.
```

No hay ningún bucket creado. Firestore (los textos, productos, comentarios)
sí funciona — es un servicio aparte. Storage es solo para archivos.

## 1. Activarlo

1. [console.firebase.google.com](https://console.firebase.google.com/) →
   proyecto **el-remanso-web**
2. Menú izquierdo → **Compilación** → **Storage**
3. Botón **Comenzar** / *Get started*
4. Cuando pregunte por la ubicación, elige una y confirma. **No se puede
   cambiar después**, así que escoge una cercana: `us-central1` o
   `southamerica-east1` (São Paulo) van bien para Colombia.

> **Si te pide activar facturación (plan Blaze):** desde 2024 los proyectos
> nuevos necesitan plan Blaze para usar Storage. Blaze es de pago por uso y
> tiene una capa gratuita generosa — para un catálogo de 19 fotos el consumo
> es prácticamente cero. Aun así, si te aparece ese paso, decídelo tú: no lo
> actives sin querer. Puedes ponerle un límite de gasto en la consola de
> Google Cloud.

## 2. Confirmar el nombre del bucket

Cuando termine, arriba en la pantalla de Storage vas a ver el nombre del
bucket, algo como `gs://el-remanso-web.firebasestorage.app`.

**Pásamelo tal cual.** Tiene que coincidir con lo que dice
`assets/js/firebase-init.js`:

```js
storageBucket: "el-remanso-web.firebasestorage.app",
```

Si Firebase te creó otro nombre, hay que corregir esa línea o las fotos van
a seguir sin subir.

## 3. Las reglas de Storage

Son **distintas** de las de Firestore y se editan en otra pestaña:
*Storage* → pestaña **Reglas**.

Reemplaza lo que haya por esto:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Las fotos se ven en el sitio público: lectura abierta.
    match /{allPaths=**} {
      allow read: if true;

      // Subir o borrar: solo con sesión iniciada en el panel, solo
      // imágenes, y hasta 10 MB por archivo.
      allow write: if request.auth != null
                   && request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

Y dale **Publicar**.

La lectura es abierta a propósito: son las fotos del catálogo, tienen que
verse sin iniciar sesión. Lo que está protegido es subir y borrar.

## 4. Probar

1. Panel → **Productos** → edita una pieza → sube su foto → **Guardar**
2. Debe guardar en unos segundos y mostrarse en la ficha
3. Ábrela en `catalogo.html` y haz clic para verla ampliada

Si falla, ahora el mensaje te dice qué pasó en vez de quedarse pensando:
antes el SDK reintentaba 2 minutos en silencio y el botón se quedaba en
"Guardando...". Ahora se rinde a los 20 segundos y explica el motivo.
