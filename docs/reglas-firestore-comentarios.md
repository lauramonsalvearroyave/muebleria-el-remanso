# Regla de Firestore para los comentarios

La colección `testimonials` es nueva, así que **el formulario no va a funcionar
hasta que agregues esta regla**. Las reglas de seguridad no viven en el repo:
se editan en la consola de Firebase.

## Dónde

[Firebase Console](https://console.firebase.google.com/) → proyecto
**el-remanso-web** → *Firestore Database* → pestaña **Reglas**.

## Qué pegar

Dentro del bloque `match /databases/{database}/documents { ... }`, junto a las
reglas que ya existen para `products`, `categories`, etc.:

```
// Comentarios de clientes.
// Cualquiera puede enviar uno, pero entra SIN publicar y nadie de fuera
// puede publicarlo: eso solo lo hace alguien del equipo desde el panel.
match /testimonials/{id} {
  // El sitio público solo alcanza a ver los aprobados.
  allow read: if resource.data.published == true
              || request.auth != null;

  // Enviar: obligatorio que entre sin publicar y con consentimiento.
  allow create: if request.resource.data.published == false
                && request.resource.data.consent == true
                && request.resource.data.quote is string
                && request.resource.data.quote.size() > 0
                && request.resource.data.quote.size() < 2000
                && request.resource.data.name is string
                && request.resource.data.name.size() < 120;

  // Aprobar, editar o borrar: solo con sesión iniciada en el panel.
  allow update, delete: if request.auth != null;
}
```

Después dale a **Publicar**. Tarda unos segundos en tomar efecto.

## Por qué está escrita así

- `allow create` **no** exige sesión: si la exigiera, ningún cliente podría
  dejar su comentario. Lo que sí exige es que llegue con `published == false`,
  de modo que nadie pueda publicarse solo en tu página.
- El límite de 2000 caracteres en `quote` y 120 en `name` es para que nadie
  pueda llenarte la base de datos con texto basura.
- `consent == true` deja constancia de que la persona autorizó la publicación,
  que es lo que pide la Ley 1581 de 2012.
- La lectura pública está limitada a `published == true`. Los que están
  pendientes solo los ves tú desde el panel.

## Cómo probar que quedó bien

1. Abre `contacto.html#comentario` **sin iniciar sesión** y envía un comentario
   de prueba. Debe decir "¡Gracias!".
2. Entra a `admin.html` → pestaña **Comentarios**. Debe aparecer como
   *Sin publicar*.
3. Dale **Publicar** y recarga el inicio: la sección de comentarios aparece.
4. Dale **Ocultar** y recarga: la sección vuelve a desaparecer.
5. Borra el comentario de prueba.
