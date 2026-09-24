# Briefs para Canva — El Remanso

Todo lo que hay que producir en Canva y dónde va después en el sitio.

## Paleta y tipografía de la marca (para Canva)

| Uso | Color |
|---|---|
| Fondo marfil | `#FBF6EC` |
| Arena | `#F1E7D4` |
| Línea arena | `#E4D5B9` |
| Dorado | `#C08A2E` |
| Dorado suave | `#F0B566` |
| Bronce | `#A66A1E` |
| Negro cálido | `#2B2620` |

Tipografías: **Nunito** (títulos) y **Nunito Sans** (texto). Las dos están en Canva.

---

## 1. Las dos fotos del inicio

Son las únicas dos imágenes grandes de la página principal. **No van por archivo:
se suben desde el panel admin** (`admin.html` → sección de fotos del inicio), que las
guarda en Firebase y el sitio las lee solo. No hay que tocar código.

### Foto A — Hero (arriba, junto al título)

- **Tamaño:** 1200 × 1500 px (vertical 4:5) · JPG · < 500 KB
- **Recorte:** el sitio la recorta al centro (`object-fit: cover`). Deja aire arriba y abajo.
- **Qué debe mostrar:** una pieza terminada de El Remanso como protagonista —
  una poltrona o mecedora tejida— en un rincón de casa con luz natural.

**Prompt para Canva (Magic Media / Dream Lab):**

> Fotografía de producto, formato vertical. Una mecedora artesanal tejida en mimbre
> natural color miel, con cojín de lino crudo, en el rincón de una sala colombiana
> luminosa. Suelo de madera clara, pared blanco marfil, una planta de interior a un
> lado y luz de tarde entrando por la ventana. Estilo cálido y sereno, fotografía real,
> luz natural suave, sombras largas, paleta beige, crema y dorado. Sin texto, sin logos,
> sin personas.

### Foto B — Nuestra historia (el taller)

- **Tamaño:** 1200 × 1200 px (cuadrada 1:1) · JPG · < 500 KB
- **Qué debe mostrar:** las manos y el oficio, no el producto terminado.

**Prompt para Canva:**

> Fotografía cuadrada de un taller de muebles artesanales. Primer plano de las manos
> de un artesano tejiendo fibra natural sobre una estructura de mueble. Al fondo,
> desenfocado, rollos de mimbre y herramientas de madera. Luz natural lateral, tonos
> tierra, beige y dorado, ambiente cálido y tranquilo. Fotografía documental real,
> sin texto, sin logos, rostro no visible.

---

## 2. Las seis texturas de materiales

Estas **sí van por archivo**. Al exportarlas, se dejan en `assets/img/materiales/`
con el nombre exacto de la tabla y aparecen solas en la sección "Nuestros materiales".
Si el archivo todavía no existe, la web muestra la textura de color de respaldo —
no se ve nada roto.

- **Tamaño de los seis:** 1000 × 440 px (banda horizontal) · JPG · < 300 KB
- **Encuadre:** macro del tejido llenando todo el cuadro, sin fondo ni objetos.
- **Consistencia:** usa la misma luz y la misma distancia en las seis. Es lo que hace
  que la fila se vea como un set y no como seis fotos sueltas.

| Material | Archivo | Prompt para Canva |
|---|---|---|
| Mimbre | `mimbre.jpg` | Macro de un tejido de mimbre natural color miel claro, entramado fino y regular, llenando todo el encuadre. Luz natural suave, tonos crema y dorado. Fotografía real de textura, sin fondo, sin objetos, sin texto. |
| Yaré | `yare.jpg` | Macro de un tejido de yaré, raíz natural colombiana, hebras delgadas color marrón dorado, entramado apretado y flexible, llenando todo el encuadre. Luz natural suave. Fotografía real de textura, sin fondo, sin texto. |
| Rattán | `rattan.jpg` | Macro de un tejido de rattán, bejuco macizo color caramelo oscuro, entramado grueso y firme, llenando todo el encuadre. Luz natural suave, acabado satinado. Fotografía real de textura, sin fondo, sin texto. |
| Calceta de plátano | `calceta.jpg` | Macro de un tejido de calceta de plátano, fibra vegetal ancha y plana color tierra y beige grisáceo, textura rústica y fibrosa, llenando todo el encuadre. Luz natural suave. Fotografía real de textura, sin fondo, sin texto. |
| Sintético | `sintetico.jpg` | Macro de un tejido en fibra sintética tipo ratán para exteriores, color café oscuro uniforme, hebras planas y parejas, entramado regular, llenando todo el encuadre. Luz natural suave. Fotografía real de textura, sin fondo, sin texto. |
| Piola náutica | `piola.jpg` | Macro de cuerda náutica trenzada color crudo y beige, trenzado grueso y parejo, llenando todo el encuadre. Luz natural suave, textura de algodón marino. Fotografía real, sin fondo, sin texto. |

### Cómo dejarlas en el sitio

1. En Canva: **Compartir → Descargar → JPG**, y renombrar cada archivo como la tabla.
2. Copiarlos a `assets/img/materiales/`.
3. Listo. No hay que editar HTML ni CSS.
