# Páginas de aterrizaje: cómo encender, apagar y editar

Panel → pestaña **Páginas**. Solo la ven los administradores.

## Antes de la primera vez (una sola vez)

1. **Publicar las reglas nuevas de Firestore.** Firebase Console → Firestore → Reglas →
   pegar el contenido de `docs/firestore.rules` → Publicar. Sin esto, la pestaña Páginas
   muestra un aviso y no deja crear nada.
2. Panel → Páginas → **Crear las páginas iniciales**. Crea las 8 páginas, todas apagadas,
   y la categoría **Exterior**.
3. Pestaña Productos: en cada pieza de sintético o piola náutica que vaya a la intemperie,
   marcar **Exterior** en "También aparece en".

## Encender una página

1. **Editar** → completar lo que pide el recuadro rojo ("Para poder encender falta…").
   Casi siempre es la **imagen principal** y su texto alternativo.
2. **Vista previa** para revisarla tal como va a quedar (aunque esté apagada).
3. Activar **Publicada** → **Guardar cambios**.
4. Botón **Publicar ahora** (arriba en la pestaña Páginas) → en GitHub, **Run workflow** →
   **Run workflow**. En 2 o 3 minutos la página aparece en el sitio, el menú, el pie y el
   mapa del sitio (`sitemap.xml`).

Esto vale para cualquier cambio: encender, apagar, editar textos o fotos, o la etiqueta de
Google. Si no se usa "Publicar ahora", GitHub lo publica solo, pero puede tardar horas.

## Apagar una página

Botón **Apagar** en la lista, o desactivar **Publicada** y guardar. El panel avisa:
*"Esta página puede estar usándose en Google Ads; revisa los enlaces de sitio de la campaña"*.
Mientras está apagada, quien entra a su dirección llega a `/catalogo` (no ve un error), y
los enlaces que apuntaban a ella se ocultan solos.

## Editar

- **Textos en español e inglés**: cada campo tiene su versión EN. Si la EN queda vacía,
  se muestra la española.
- **Bloques**: cada uno tiene su interruptor "Mostrar". El encabezado no se puede ocultar
  (lleva el único H1).
- **Productos de una página de categoría**: no se eligen en la página sino en cada pieza
  (Productos → "También aparece en"). Salen en el orden de "Orden dentro de la categoría".
- **Dirección (URL)**: se puede cambiar. La anterior sigue llevando a la nueva.
- **SEO**: título (máx. 60 caracteres) y descripción (máx. 155), con contador. Imagen para
  compartir de 1200×630; si no se sube, se usa la principal recortada.
- **Botones**: los del llamado final también aparecen arriba. Por defecto llevan a
  WhatsApp y al catálogo.

## Medición (Google Ads)

- Cada clic a WhatsApp (enlace, "Me interesa" o formulario de contacto) envía el evento
  **`clic_whatsapp`** con `pagina_origen`, `origen` y `producto` (cuando aplica).
  En Google Ads se importa como conversión desde GA4.
- La etiqueta de Ads (`AW-…`) o de Tag Manager (`GTM-…`) se pega en
  **Ajustes → Etiqueta de Google Ads o Tag Manager**. GA4 ya está instalado.

## Si algo no se actualiza

Los cambios los publica un proceso en GitHub (pestaña **Actions → Publicar páginas**), que
se lanza con **Publicar ahora**. Si un cambio no aparece 5 minutos después, revisa ahí si
la última ejecución quedó en rojo.

GitHub pausa los procesos automáticos tras 60 días sin cambios en el repositorio; si
pasa, en esa misma pestaña aparece un botón para reactivarlo.

---

## Qué entregar para cada página

| Página | Fase | Para poder encenderla | Recomendado |
|---|---|---|---|
| `/salas` | 1 | Foto principal horizontal 4:3 (1600×1200) de una sala en un espacio real | Revisar textos; 2–6 fotos para la galería |
| `/exterior` | 1 | Foto principal 4:3 de piezas en terraza/jardín. Marcar **Exterior** en las piezas de sintético o piola | Fotos de exterior para la galería |
| `/columpios` | 1 | Foto principal 4:3 de un columpio o cama nido instalado | Revisar textos |
| `/materiales` | 1 | Foto principal 4:3 (tejidos, taller o detalle) | Las 6 fotos de textura ya están en Ajustes |
| `/comedores` | 2 | Foto principal 4:3 de un comedor | Fotos de mesas en madera (piñón de oreja, samán, teca, roble) |
| `/como-trabajamos` | 2 | Foto principal 4:3 del taller o de manos tejiendo | Fotos del proceso para la galería |
| `/clientes` | 3 | Foto principal y **al menos una foto real** de un mueble entregado, con permiso del cliente. **Nada de IA ni de bancos de imágenes** | 6–12 fotos con su descripción |
| `/hoteles` | 3 | Foto principal 4:3 de un proyecto comercial | Nombres de proyectos o clientes que se puedan mencionar, y fotos |

Todas las fotos: JPG, bien iluminadas, sin marcas de agua. Cada una necesita un **texto
alternativo**: una frase que describa lo que se ve ("Sala Prado en rattán en una terraza
de Envigado").
