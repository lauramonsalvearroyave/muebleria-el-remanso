# Regla de Firestore para los comentarios

La colección `testimonials` es nueva. Hasta que agregues esta regla, el
formulario no puede guardar nada y la pestaña Comentarios del panel te va a
mostrar un aviso en rojo. Las reglas no viven en el repo: se editan en la
consola de Firebase.

> **Esto se AGREGA, no reemplaza.** Va junto a las reglas que ya tienes para
> `products`, `categories`, `team`, `customers`, etc. Si borras las demás y
> dejas solo esta, se rompe el sitio entero.

## Dónde

1. Entra a [console.firebase.google.com](https://console.firebase.google.com/)
2. Proyecto **el-remanso-web**
3. Menú izquierdo → **Firestore Database**
4. Pestaña **Reglas** (arriba, junto a "Datos")

## Qué pegar

Busca la línea `match /databases/{database}/documents {`. Dentro de ese
bloque, después de las reglas que ya están y **antes de la llave que lo
cierra**, pega esto:

```
    // Comentarios de clientes.
    // Cualquiera puede enviar el suyo, pero entra SIN publicar y nadie de
    // fuera puede publicarlo: eso solo pasa desde el panel.
    match /testimonials/{id} {

      // El sitio público solo alcanza los aprobados.
      // Con sesión iniciada se ven todos, incluidos los pendientes.
      allow read: if resource.data.published == true
                  || request.auth != null;

      // Enviar un comentario: sin sesión, pero con condiciones.
      allow create: if request.resource.data.published == false
                    && request.resource.data.consent == true
                    && request.resource.data.quote is string
                    && request.resource.data.quote.size() > 0
                    && request.resource.data.quote.size() < 2000
                    && request.resource.data.name is string
                    && request.resource.data.name.size() < 120
                    && request.resource.data.keys().hasOnly([
                         'name', 'city', 'stage', 'piece', 'quote',
                         'consent', 'order', 'published', 'createdAt'
                       ]);

      // Aprobar, ocultar, editar o borrar: solo desde el panel.
      allow update, delete: if request.auth != null;
    }
```

Después dale a **Publicar** (botón azul arriba a la derecha). Tarda unos
segundos en tomar efecto.

## Por qué está escrita así

- **`create` no exige sesión.** Si la exigiera, ningún cliente podría dejar su
  comentario. Lo que sí exige es que llegue con `published == false`, de modo
  que nadie pueda publicarse solo en tu página.
- **`hasOnly`** limita el envío a esos nueve campos exactos. Sin eso, alguien
  podría mandarte documentos con campos inventados.
- **Los límites de tamaño** (2000 caracteres en el comentario, 120 en el
  nombre) evitan que te llenen la base de datos con texto basura.
- **`consent == true`** deja constancia de que la persona autorizó la
  publicación, que es lo que pide la Ley 1581 de 2012.
- **La lectura pública** está limitada a `published == true`. Los pendientes
  solo los ves con sesión iniciada.

### Si quieres que solo un administrador pueda publicar

Si en tus reglas ya tienes una función tipo `isAdmin()` que consulta
`team/{uid}`, puedes cambiar la última línea por:

```
      allow update, delete: if isAdmin();
```

Así un colaborador no podría aprobar comentarios. Con `request.auth != null`
cualquiera con sesión en el panel puede hacerlo.

## Cómo probar que quedó bien

1. Abre `contacto.html#comentario` **sin iniciar sesión** (o en ventana de
   incógnito) y envía un comentario de prueba. Debe decir "¡Gracias!".
2. Entra a `admin.html` → pestaña **Comentarios**. Debe aparecer con el
   contador rojo en la pestaña y marcado *Sin publicar*.
3. Dale **Publicar** y recarga el inicio: la sección de comentarios aparece.
4. Dale **Ocultar** y recarga: la sección vuelve a desaparecer.
5. Borra el comentario de prueba.

Si el paso 1 falla, el mensaje de error del panel te dice qué pasó.
