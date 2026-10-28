# Conectar Instagram al sitio (una sola vez, ~30 minutos)

La sección "Síguenos en Instagram" muestra solas tus últimas 8 publicaciones. Para eso
el sitio necesita una **llave** de Instagram. La llave se guarda en los *Secrets* de
GitHub (cifrada, nunca en el código ni visible para nadie) y se renueva sola cada semana.

Si la conexión falla o la llave vence, la sección **se apaga sola** en el sitio y el panel
(pestaña Instagram) lo avisa.

## 1. Cuenta profesional en Instagram

App de Instagram → tu perfil → menú ☰ → **Configuración y privacidad** → **Tipo de cuenta
y herramientas** → **Cambiar a cuenta profesional** → **Empresa**. Es gratis y no cambia
nada de lo que ya publicaste. (Si ya es profesional, salta este paso.)

## 2. Crear la app en Meta y sacar la llave

1. Entra a **developers.facebook.com** con tu cuenta de Facebook → **Mis apps** →
   **Crear app**.
2. Caso de uso: **"Administrar mensajes y contenido en Instagram"** (o el que mencione la
   API de Instagram). Tipo: **Empresa**. Nombre: `El Remanso sitio web`.
3. En el panel de la app: **Instagram** → **Configuración de la API con el inicio de
   sesión de Instagram** → **Generar identificadores de acceso** → **Agregar cuenta** →
   inicia sesión con **@muebleria_elremanso** y acepta.
4. Junto a la cuenta, **Generar identificador** → copia el texto largo. Esa es la llave.

La app puede quedarse en modo desarrollo: solo lee tu propia cuenta, no necesita revisión
de Meta.

## 3. Guardar la llave en GitHub

Repositorio **muebleria-el-remanso** → **Settings** → **Secrets and variables** →
**Actions** → **New repository secret**:

- **Name:** `INSTAGRAM_TOKEN`
- **Secret:** la llave del paso anterior

## 4. Permiso para renovarla sola

La llave de Instagram vence a los 60 días. Un proceso semanal la renueva, y para guardar
la llave nueva necesita este permiso:

1. **github.com/settings/personal-access-tokens/new** (token *fine-grained*).
2. **Token name:** `Renovar Instagram El Remanso` · **Expiration:** el máximo (1 año).
3. **Repository access:** *Only select repositories* → `muebleria-el-remanso`.
4. **Permissions → Repository permissions → Secrets:** *Read and write*.
5. **Generate token** → cópialo → guárdalo como otro secret del repositorio (igual que el
   paso 3) con el nombre **`GH_SECRETS_TOKEN`**.

📅 Este permiso vence en un año: pon un recordatorio para generarlo de nuevo.

## 5. Probar

GitHub → **Actions** → **Publicar paginas** → **Run workflow**. En 2–3 minutos, el panel
(pestaña **Instagram**) debe decir **"Conectado a Instagram"** con la vista previa. Luego
enciende la sección ahí y guarda.

(El proceso **Renovar conexión de Instagram** corre solo los lunes. No lo lances el mismo
día que creas la llave: Instagram solo deja renovarla cuando tiene al menos 24 horas.)

## Reconectar (si el panel dice que la llave venció)

Repite el **paso 2** (generar un identificador nuevo) y reemplaza el secret
`INSTAGRAM_TOKEN` en GitHub (paso 3, botón ✏️ sobre el secret). Luego
**Publicar paginas → Run workflow**.
