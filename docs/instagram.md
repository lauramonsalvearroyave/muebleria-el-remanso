# Instagram en el sitio (con Behold)

La sección "Síguenos en Instagram" muestra solas las últimas publicaciones de
@muebleria_elremanso. La conexión con Instagram la hace **Behold** (behold.so): ellos
tienen la app aprobada por Meta, así que no hace falta cuenta de desarrollador ni renovar
llaves. El diseño de la sección sigue siendo el del sitio: Behold solo entrega los datos.

Si Behold falla o la cuenta se desconecta, la sección **se apaga sola** en el sitio y el
panel (pestaña Instagram) lo avisa.

## Configuración (una sola vez)

1. **behold.so** → crear cuenta → **Sources → Add Source** → conectar @muebleria_elremanso
   (la cuenta de Instagram debe ser profesional).
2. **Feeds → Add Feed**: Feed name `Sitio web` · Content type **User** · Source
   @muebleria_elremanso · Output type **JSON** → **Create Feed**.
3. Copiar la **dirección del feed** (empieza por `https://feeds.behold.so/`).
4. GitHub → repositorio **muebleria-el-remanso** → **Settings → Secrets and variables →
   Actions → New repository secret** · Name `BEHOLD_FEED_URL` · Secret: la dirección.
5. GitHub → **Actions → Publicar paginas → Run workflow**. En 2–3 minutos el panel dice
   "Conectado a Instagram" con la vista previa. Ahí se enciende la sección y se guarda.

## Cada cuánto se actualiza

El sitio consulta Behold cada vez que corre el proceso de publicación (cada pocas horas,
o al dar **Run workflow**). Behold, a su vez, revisa Instagram según su plan: en el
gratuito puede tardar hasta un día en ver una publicación nueva.

Las fotos se copian a Cloudinary una sola vez, así el sitio no gasta las "views" del plan
gratuito de Behold (que se cuentan cuando se consulta el feed, no por cada visitante).

## Si se desconecta

Entra a Behold → **Sources**. Si la cuenta aparece como *Disconnected*, reconéctala desde
ahí. No hay que cambiar nada en GitHub: la dirección del feed sigue siendo la misma.
