# corey · music portfolio

Sitio estático para una estudiante de música. HTML + CSS + JS, Tailwind por CDN, sin build.

## Estructura

- `index.html` — todo el contenido y secciones.
- `styles.css` — animaciones, custom cursor, blobs, cards, polaroids.
- `script.js` — reveals on scroll, cursor, tilt, audio de previews, konami egg.
- (opcional) `img/` — carpeta para fotos reales.
- (opcional) `audio/` — carpeta para mp3 de previews.

## 1) Hostear en GitHub Pages — paso a paso

> Asumiendo que ya tenés cuenta en github.com.

1. **Crear el repo**
   - Entrá a <https://github.com/new>.
   - Nombre del repo: por ejemplo `corey` o `corey-music`. Hacelo **Public**.
   - **No** marques "Add a README", para evitar conflictos.
   - Click en *Create repository*.

2. **Subir los archivos** (una sola vez, desde la carpeta del proyecto)
   - Si nunca usaste git, la forma más fácil es usar **GitHub Desktop**: <https://desktop.github.com/>.
     - File → *Add local repository* → elegí la carpeta `Portafolio`.
     - Te ofrecerá *Publish repository* → elegí el repo que creaste y subí.
   - Si usás la terminal:
     ```bash
     cd "C:/Users/gaelm/OneDrive/Documentos/Portafolio"
     git init
     git add .
     git commit -m "first version"
     git branch -M main
     git remote add origin https://github.com/<TU-USUARIO>/<TU-REPO>.git
     git push -u origin main
     ```

3. **Activar GitHub Pages**
   - En el repo, andá a **Settings** (engranaje arriba a la derecha del repo).
   - En el menú lateral: **Pages**.
   - En *Source*, elegí `Deploy from a branch`.
   - En *Branch* seleccioná `main` y carpeta `/ (root)`. Click *Save*.
   - Esperá 1–2 minutos. La URL aparece arriba de esa misma página, será algo como:
     `https://<TU-USUARIO>.github.io/<TU-REPO>/`

4. **Cada vez que cambies algo**
   - Editás los archivos.
   - Commit + push (con GitHub Desktop o `git add . && git commit -m "..." && git push`).
   - GitHub Pages republica solo en ~1 minuto.

> 💡 Si querés dominio propio (`corey.com`, `coreyplays.xyz`, etc.), creá un archivo `CNAME` en la raíz del repo con el dominio dentro y configurá los registros DNS apuntando a GitHub Pages. Más info: <https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site>.

## 2) Subir música real

El sitio ya está preparado: cada botón de play tiene un atributo `data-src=""` vacío. Cuando le pongas una ruta a un mp3, el JavaScript lo reproduce de verdad.

### Opción A — alojar los mp3 en el mismo repo (más simple)

1. Crear una carpeta `audio/` al lado de `index.html`.
2. Copiar los archivos: `audio/honey-static.mp3`, `audio/small-shiba-moon.mp3`, etc.
3. En `index.html`, ubicar cada `<button class="play-btn">` y poner la ruta:
   ```html
   <button class="play-btn" data-src="audio/honey-static.mp3" aria-label="...">
   ```
4. Commit + push. Listo, suena.

> ⚠️ GitHub Pages tiene un límite blando de **1 GB por repo** y archivos individuales no mayores a 100 MB. Para previews cortas (30–60s) está perfecto. Recomiendo exportar a mp3 a 128 kbps para que cada preview pese ~1 MB.

### Opción B — embeber Spotify / SoundCloud / Bandcamp

Si las canciones ya están publicadas, podés reemplazar la card del track por un embed oficial. Ejemplos:

```html
<!-- Spotify -->
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/<ID>?utm_source=generator" width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>

<!-- SoundCloud -->
<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/<ID>&color=%23ff1f8f"></iframe>
```

Ventaja: no consume el repo, ya funciona en cualquier dispositivo.
Desventaja: rompe un poco la estética porque trae los estilos de la plataforma.

### Opción C — un CDN externo (avanzado)

Subir los mp3 a Cloudflare R2, Vercel Blob, AWS S3, etc., y usar la URL directa en `data-src`. Gratis para volúmenes chicos, sin tocar el repo. Útil si los archivos crecen.

## 3) Cambiar las fotos de la sección scrapbook

Las polaroids leen los archivos `img/photo-1.jpeg` … `img/photo-7.jpeg`. Para cambiar una foto basta con sobreescribir el archivo en `img/` manteniendo el mismo nombre, o editar el `src` en `index.html` dentro de `<section id="scrapbook">`. Los `<figcaption>` (texto manuscrito) están en el mismo bloque.

Recomendado: imágenes de ~1200×1500 px en JPG al 80% para que carguen rápido.

El shiba grande de la sección de la cita usa `svg/shiba-inu.png` y el favicon `svg/icon-web.png`.

## 4) Easter eggs

- **Konami code** — escribí `↑ ↑ ↓ ↓ ← → ← → b a` en cualquier parte del sitio para soltar una lluvia de shibas.
- Hay una pista escondida en el footer.

## 5) Personalización rápida

- **Paleta**: el bloque `tailwind.config` dentro del `<head>` define los colores. Cambiá `blush`, `hotpink`, `rose` y los blobs en `styles.css`.
- **Tipografía**: las tres fuentes vienen de Google Fonts en el `<head>`.
- **Textos**: todo está en `index.html`, en español y en líneas cortas para que sea fácil de editar.
- **Tailwind** está cargado por CDN. Para producción seria, conviene compilarlo localmente.
