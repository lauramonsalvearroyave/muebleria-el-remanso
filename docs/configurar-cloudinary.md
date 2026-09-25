# Configurar Cloudinary (subir fotos desde el panel)

El panel ya tiene el botón **"Subir una foto"**, pero no va a funcionar hasta
completar estos pasos. Son unos 10 minutos y **no piden tarjeta**.

## Por qué Cloudinary y no Firebase

El sitio es estático: GitHub Pages entrega archivos pero no los recibe. Subir
una foto desde el navegador necesita un servicio que la reciba. Firebase
Storage hace eso pero exige plan de pago. Cloudinary lo hace gratis, con
25 créditos al mes — para un catálogo de 19 fotos sobra de lejos.

---

## 1. Crear la cuenta

1. Entra a [cloudinary.com](https://cloudinary.com) → **Sign up free**
2. Regístrate con el correo. **No pide tarjeta.**
3. Cuando pregunte qué vas a hacer, cualquier opción sirve.

## 2. Anotar el Cloud name

En el panel de Cloudinary, arriba, vas a ver **Cloud name**: una palabra
corta, algo como `dxxxxxxx` o el nombre que hayas elegido.

**Ese es el primer dato que necesito.**

## 3. Crear el preset de subida

Esto es lo que permite subir desde el navegador sin servidor propio.

1. **Settings** (el engranaje) → pestaña **Upload**
2. Baja hasta **Upload presets**
3. Si ves un enlace *Enable unsigned uploading*, dale clic
4. **Add upload preset**
5. Configúralo así:

| Campo | Valor | Por qué |
|---|---|---|
| **Preset name** | `el-remanso` | Es el segundo dato que necesito |
| **Signing mode** | **Unsigned** | Sin esto no se puede subir desde el navegador |
| **Folder** | `el-remanso` | Todo queda ordenado en una carpeta |

6. **Save**

## 4. Ponerle límites (importante)

El nombre del preset viaja en el código del panel, así que es público. La
protección no está en esconderlo, sino en limitar qué se puede subir con él.
En ese mismo preset, busca estas opciones y configúralas:

- **Allowed formats:** `jpg, png, webp` — solo imágenes, nada de otros archivos
- **Max file size:** `10000000` (10 MB)
- **Max image width / height:** déjalo vacío, para que **no recorte ni
  reescale** tus fotos. Tienen que quedar tal cual las subes.

Sin esos límites, alguien que lea el código podría subir archivos a tu cuenta.
Con ellos, lo peor que puede pasar es que suba una imagen a tu carpeta.

## 5. Pasarme los dos datos

Mándame:

```
Cloud name:  ..........
Preset name: ..........
```

Yo los pongo en [assets/js/admin.js](../assets/js/admin.js) —está marcado con
`PENDIENTE`— y despliego. A partir de ahí el botón funciona.

---

## Cómo va a quedar el flujo

1. Panel → **Productos** → editas la pieza
2. **Subir una foto** → eliges el archivo
3. Se sube, se ve la previsualización y el campo se llena solo
4. **Guardar producto**

La foto se guarda y se entrega **tal cual la subes**: no le aplico ninguna
transformación, para no tocar tus 1800 × 1200 a calidad 95.

> Si algún día quieres que carguen más rápido, Cloudinary puede convertirlas
> a WebP y ajustar calidad automáticamente sin que se note. Hoy no lo hago
> porque pediste que las fotos queden sin modificar. Es un cambio de una línea.

## Sigue disponible la ruta del repositorio

Debajo del botón hay un desplegable, *"o escribir la ruta de una foto del
proyecto"*. Sirve si alguna vez quieres usar una imagen que ya está en
`assets/img/`, o si Cloudinary llegara a fallar. Los dos caminos escriben en
el mismo campo.
