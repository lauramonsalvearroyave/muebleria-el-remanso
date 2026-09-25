# Analítica del sitio

Dónde se leen los datos y qué pregunta responde cada cosa.

## Dónde entrar

[analytics.google.com](https://analytics.google.com) → propiedad **El Remanso**
(la misma cuenta de Google del proyecto Firebase).

También desde Firebase → **Analytics Dashboard**, pero ahí se ve menos.

> **Los informes tardan 24–48 horas.** Si acabas de hacer algo y quieres verlo
> ya, usa **Tiempo real** (menú izquierdo): muestra lo que está pasando en los
> últimos 30 minutos.

---

## Lo que se mide solo, sin que hiciéramos nada

Google lo activa por defecto:

| Dato | Dónde se ve |
|---|---|
| Visitas y usuarios | Informes → Ciclo de vida → Adquisición |
| De dónde llegan (Instagram, Google, directo) | Adquisición → Adquisición de tráfico |
| Celular o computador | Informes → Usuario → Tecnología |
| Ciudad | Informes → Usuario → Datos demográficos |
| Páginas más vistas | Interacción → Páginas y pantallas |
| Si leen la página completa | Evento `scroll` (se dispara al 90%) |
| Duración de la visita | Interacción → Interacción general |

---

## Los eventos que agregamos

Se ven en **Informes → Interacción → Eventos**.

| Evento | Qué significa | Qué decidir con eso |
|---|---|---|
| `contacto_whatsapp` | Alguien hizo clic en un botón de WhatsApp | Dónde poner el esfuerzo. Parámetro **`origen`**: `hero`, `pie`, `flotante`, `modal_interes`, `catalogo`… |
| `ver_pieza` | Ampliaron la foto de una pieza | **Qué miran más.** Parámetro `pieza` |
| `me_interesa` | Abrieron el formulario de una pieza | Interés real, no curiosidad. Parámetro `pieza` |
| `generate_lead` | Enviaron el formulario | La conversión. Comparar con `me_interesa` |
| `filtrar_categoria` | Filtraron por una colección | Qué buscan: ¿salas? ¿camas nido? |
| `cambio_idioma` | Cambiaron a inglés | Si vale la pena mantener el inglés |
| `submit_testimonial` | Enviaron un comentario | Cuánta gente responde |

### Dos comparaciones que valen más que los números sueltos

**`me_interesa` contra `generate_lead`.** El primero es cuánta gente abre el
formulario; el segundo, cuánta lo envía. La diferencia es cuánta se arrepiente
a mitad de camino. Si es mucha, el formulario está pidiendo demasiado.

**`contacto_whatsapp` por `origen`.** Si el botón flotante casi no aparece,
está ocupando pantalla para nada. Si el del hero domina, la primera pantalla
está haciendo el trabajo.

---

## Para ver el nombre de las piezas

Por defecto GA4 muestra que hubo 40 `ver_pieza`, pero no de cuáles piezas.
Para desglosarlo hay que registrar el parámetro una sola vez:

1. **Administrar** (engranaje, abajo a la izquierda)
2. **Definiciones personalizadas** → **Crear dimensión personalizada**
3. Rellenar:
   - *Nombre*: `Pieza`
   - *Ámbito*: **Evento**
   - *Parámetro del evento*: `pieza`
4. Guardar

Repetir para `origen` (nombre: `Origen del WhatsApp`) y para `categoria`.

> Los datos empiezan a acumularse **desde que se crea la dimensión**, no hacia
> atrás. Conviene hacerlo cuanto antes.

Después se ven en **Explorar** → informe libre, poniendo la dimensión en filas
y el recuento de eventos en valores.

---

## Cómo comprobar que está midiendo

1. Abre el sitio en una ventana normal
2. En GA4 entra a **Tiempo real**
3. Haz clic en un botón de WhatsApp y amplía la foto de una pieza
4. En menos de un minuto deben aparecer `contacto_whatsapp` y `ver_pieza`

Si no aparece nada, la causa más común es un **bloqueador de anuncios** en tu
navegador: bloquean Google Analytics. Prueba en otro navegador o desactívalo
para el sitio. El sitio funciona igual, solo deja de medir.
