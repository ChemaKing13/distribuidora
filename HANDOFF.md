# HANDOFF — Alta Copa Distribución

> Documento de traspaso para la siguiente sesión de Claude Code.
> Última actualización: 2026-09-22

---

## 1. Qué es este proyecto

Sitio web B2B para **Alta Copa Distribución**, una distribuidora mexicana de bebidas
alcohólicas que vende a negocios (restaurantes, bares, hoteles, centros nocturnos,
catering). **No es un e-commerce**: no hay carrito, precios públicos ni pagos.

El objetivo del sitio es un embudo simple:

```
el cliente entra  →  ve el catálogo  →  se comunica (formulario de cotización)
```

Estilo visual: moderno, premium, elegante. Negro/carbón, blanco, grises y acentos
dorados sutiles. Tipografía Playfair Display (títulos) + Inter (texto).

---

## 2. Tech stack

| Área | Decisión |
|---|---|
| Frontend | HTML + CSS + JavaScript **vanilla**, sin build ni dependencias |
| CSS | Un solo archivo con sistema de tokens (`:root` custom properties) |
| JS | Un solo IIFE, sin frameworks, sin npm |
| Tipografías | Google Fonts (Playfair Display, Inter) |
| Formulario | **Web3Forms** (API externa, envía los datos por correo) |
| Hosting | Aún no definido — es un sitio estático, sirve cualquier host |
| Control de versiones | **No hay repositorio git** en esta carpeta |

No hay `package.json`, ni bundler, ni framework. Se abre el HTML y funciona.

---

## 3. Estructura y propósito de los archivos

```
index.html              Inicio: hero → catálogo destacado → CTA final
catalogo.html           Catálogo completo: 9 categorías con foto, marcas y filtro
soluciones.html         "Por qué trabajar con nosotros" + "A quién servimos"
contacto.html           Formulario de cotización (Web3Forms) + datos de la empresa
aviso-privacidad.html   Aviso de privacidad (PLANTILLA BASE, sin revisión legal)
404.html                Página de error
README.md               Documentación general del proyecto
HANDOFF.md              Este documento
robots.txt              Indicaciones para buscadores
sitemap.xml             Mapa del sitio (5 URLs)

css/styles.css          TODO el CSS del sitio (~28 KB), organizado por secciones
                        numeradas. Tokens de diseño al inicio en :root.

js/main.js              TODO el JS del sitio. Un objeto CONFIG al inicio centraliza
                        email, dirección, horario y número de WhatsApp.

assets/favicon.svg      Ícono del sitio
assets/images/          hero-bar.jpg (1920×1440) + hero-bar-mobile.jpg (900×675)
assets/images/catalogo/ 9 fotos de categoría, una por cada tipo de bebida
```

### Funciones clave en `js/main.js`

| Función | Qué hace |
|---|---|
| `applyContactConfig()` | Propaga `CONFIG` (email, dirección, horario, WhatsApp) a todas las páginas vía atributos `data-*` |
| `setupNavToggle()` | Menú móvil (cajón lateral), cierra con Escape o al hacer clic en un enlace |
| `setupScrollReveal()` | Animación de aparición con IntersectionObserver; respeta `prefers-reduced-motion` |
| `setupCatalogFilter()` | Filtro de categorías en el catálogo + sincroniza el parámetro `?categoria=` en la URL |
| `setupQuoteForm()` | Validación y envío del formulario a Web3Forms |
| `prefillFromQuery()` | Precarga la categoría en el formulario desde `?producto=Tequila` |

---

## 4. Qué funciona actualmente (verificado en navegador)

- ✅ Las 6 páginas cargan sin errores de consola.
- ✅ Navegación consistente en las 6 páginas (header + footer); el enlace "Soluciones"
  apunta a `soluciones.html` (ya no al ancla `index.html#soluciones`, que fue eliminada).
- ✅ Menú móvil: se abre/cierra, y tiene un botón dorado **"Solicitar cotización" anclado
  al fondo del cajón**, siempre visible sin hacer scroll.
- ✅ Catálogo: 9 categorías, cada una con foto, descripción, 8 marcas representativas con
  sus presentaciones (72 marcas en total) y botón CTA propio.
- ✅ Filtro de catálogo funcional, tanto por clic como por URL (`catalogo.html?categoria=mezcal`).
- ✅ Botones "Cotizar {Categoría}" llevan a `contacto.html?producto={Categoría}` y **precargan
  correctamente** esa casilla en el formulario (verificado).
- ✅ Formulario de cotización: valida todos los campos, exige al menos un producto
  seleccionado, y **envía de verdad** vía Web3Forms (el usuario ya recibió un correo de prueba
  exitoso). Si el envío falla, muestra un enlace a WhatsApp como respaldo.
- ✅ Responsive verificado en 390px, 420px, 768px, 1200px y 1300px.

---

## 5. Decisiones ya tomadas (no revertir sin preguntar)

1. **Sin tienda en línea.** No agregar carrito, precios ni pagos. El único objetivo de
   conversión es el formulario de cotización.
2. **Teléfono eliminado de todo el sitio.** Petición explícita del usuario. El número de
   WhatsApp (`525548323739`) permanece en `main.js` **solo como respaldo** si falla el envío
   del formulario. No volver a exponerlo como canal de contacto principal.
3. **Nada de botones flotantes.** El usuario pidió eliminar el botón flotante de WhatsApp
   (esquina inferior derecha) porque saturaba el diseño minimalista. Por eso el CTA persistente
   en móvil se colocó **dentro del cajón del menú**, no como barra fija ni burbuja flotante.
4. **Secciones eliminadas del Inicio:** "Quiénes somos", "Nuestra propuesta" y "Por qué
   elegirnos" fueron removidas a petición del usuario. "Por qué trabajar con nosotros" y
   "A quién servimos" se movieron a `soluciones.html`.
5. **El Inicio quedó corto a propósito:** Hero → Catálogo → CTA final. Es intencional, para
   llevar al cliente al catálogo lo antes posible.
6. **Fotos del catálogo: una por categoría, no una por marca.** Se descartó tener 72 fotos
   (una por marca) por riesgo de derechos de imagen de marcas registradas y por la dificultad
   de mantener consistencia visual.
7. **Marcas visibles en las fotos:** 4 de las 9 fotos muestran botellas de marca reconocible
   (José Cuervo → Tequila, Belvedere → Vodka, Hendrick's → Ginebra, Modelo Especial → Cervezas).
   Se aceptaron **porque esas marcas sí están listadas en el catálogo de esa misma categoría**,
   así que no es engañoso. Las otras 5 son genéricas o de ambiente.
8. **Fuente de las fotos actuales:** Unsplash, licencia gratuita para uso comercial
   (se verificó que ninguna fuera de la capa de pago "Unsplash+").

---

## 6. Configuración importante

### Web3Forms (formulario de cotización)
- **Access key:** `3e40f442-c090-4e6c-8433-9ef70f355c69`
- **Ubicación:** campo oculto en `contacto.html` (línea ~113)
- Los mensajes llegan al correo asociado a esa cuenta de Web3Forms.
- Ya se probó con éxito: el usuario confirmó que recibió el correo.

### Datos de contacto (`js/main.js`, objeto `CONFIG`)
```js
whatsappNumber: "525548323739"   // SOLO respaldo si falla el formulario
email:          "contacto@altacopa.mx"
address:        "Av. Insurgentes Sur 1234, Col. Del Valle, Ciudad de México"
hours:          "Lunes a viernes, 9:00–18:00 h"
```
⚠️ **La dirección y el email parecen ser de ejemplo, no confirmados por el usuario.**
Cambiar `CONFIG` actualiza automáticamente las 6 páginas.

### Dominio
Todos los `canonical`, `og:url` y `sitemap.xml` usan `https://www.altacopa.mx/`,
que es un **dominio de ejemplo**. Debe reemplazarse antes de publicar.

### Servidor local de pruebas
```bash
cd ~/Desktop/alta-copa-distribucion && python3 -m http.server 8001
```
Corre en **puerto 8001** → http://localhost:8001

⚠️ **No usar el puerto 8000:** lo ocupa otro proyecto del usuario (`~/Desktop/estelar-media`,
un sitio de barbería llamado "La Estelar"). No cerrar ese proceso sin preguntar.

### Artifact publicado (link para compartir)
**https://claude.ai/artifact/NJSArZV5tsm7w6Q2uf6R1i** — versión 8 (2026-10-01), al día con la carpeta local (incluye la ventana de descuento):
precios en las 9 categorías, fotos del catálogo y correcciones de la revisión final.
Al cambiar archivos, republicar con `url` y en `files` solo los que cambiaron.

---

## 7. En qué estábamos cuando se acabó el contexto

Se acababa de terminar de agregar **una fotografía por categoría al catálogo** (9 fotos),
verificado visualmente en el navegador y funcionando.

Entonces el usuario escribió:

> *"voy a generar imagenes, dame las caracteristicas (dimensiones) de estas para que se
> adapten de forma profesional y limpia en nuestro website"*

**Esa pregunta quedó sin responder.** El usuario quiere generar sus propias imágenes
(probablemente con IA) para reemplazar las fotos de stock de Unsplash, y necesita las
especificaciones técnicas exactas.

La sección 8 contiene esas especificaciones ya calculadas a partir del CSS real.

---

## 8. Especificaciones de imagen (respuesta pendiente al usuario)

Calculadas a partir del CSS real: `--container-max: 1200px`, padding `2rem`, grid de
3 columnas con gap `1.5rem`.

### 8.1 Fotos de categoría del catálogo — LAS QUE EL USUARIO VA A GENERAR

Regla CSS que las gobierna (`css/styles.css`, `.product-photo`):
`aspect-ratio: 4/3` + `object-fit: cover` + esquinas superiores redondeadas 14px.

Tamaño real al que se muestran:

| Viewport | Columnas | Tamaño mostrado |
|---|---|---|
| ≥1025px | 3 | ~361 × 271 px |
| 769–1024px | 2 | ~466 × 350 px |
| ≤768px | 1 | hasta ~718 × 538 px |

**Especificación recomendada:**

| Característica | Valor |
|---|---|
| **Dimensiones** | **1200 × 900 px** (proporción **4:3** horizontal) |
| Alternativa máxima calidad | 1440 × 1080 px (cubre pantallas retina en tablet) |
| Formato | JPG (o WebP si se prefiere; habría que actualizar el HTML) |
| Calidad | 75–80 |
| Peso objetivo | ≤ 250 KB por imagen (las actuales van de 57 a 318 KB) |
| Cantidad | 9 (una por categoría) |

**Nombres de archivo exactos** (deben respetarse, están referenciados en `catalogo.html`):
```
assets/images/catalogo/tequila.jpg
assets/images/catalogo/mezcal.jpg
assets/images/catalogo/whisky.jpg
assets/images/catalogo/vodka.jpg
assets/images/catalogo/ron.jpg
assets/images/catalogo/ginebra.jpg
assets/images/catalogo/vinos.jpg
assets/images/catalogo/cervezas.jpg
assets/images/catalogo/otros.jpg
```

**Guía de composición (importante):**
- El recorte es **centrado** (`object-fit: cover`). Dejar aire alrededor del sujeto: si la
  botella toca los bordes, se va a cortar.
- Componer en **horizontal 4:3**. Las imágenes verticales funcionan, pero se les recorta
  mucho arriba y abajo (así están hoy 4 de las 9, y se ven bien, pero no es lo ideal).
- Estilo a mantener para que combine con el sitio: **iluminación cálida, fondo oscuro o
  desenfocado, ambiente de bar premium**. Evitar fondos blancos de estudio: chocan con la
  paleta crema/carbón del sitio.
- Evitar texto incrustado en la imagen (no se puede traducir ni escalar bien).
- Hay un efecto de zoom al pasar el cursor (`scale(1.05)`), así que un poco de margen extra
  en la composición ayuda.

### 8.2 Hero (portada del Inicio) — por si también se regenera

Regla CSS: `min-height: 88vh` + `object-fit: cover` + `object-position: center 40%`
+ degradado oscuro encima (de 92% de opacidad abajo a 42% arriba).

| Variante | Dimensiones recomendadas | Archivo |
|---|---|---|
| Escritorio | **2400 × 1600 px** (3:2) — hoy es 1920×1440 | `assets/images/hero-bar.jpg` |
| Móvil | **900 × 1200 px (VERTICAL 3:4)** | `assets/images/hero-bar-mobile.jpg` |

⚠️ **Nota sobre el hero móvil:** el archivo actual (`900×675`, horizontal) se recorta
muchísimo en pantallas de teléfono altas — solo se ve el centro de la foto. Una versión
**vertical** mejoraría bastante el encuadre en móvil.

**Zona segura:** el texto del hero (título + botones) ocupa la **franja inferior izquierda**,
hasta 760px de ancho, y el degradado oscurece fuertemente la parte baja. Colocar el sujeto
visual en la **mitad superior o a la derecha**.

### 8.3 Imagen para redes sociales (Open Graph)

Actualmente las 5 páginas reutilizan `hero-bar.jpg` (1920×1440, 4:3) como `og:image`, y
las redes lo recortan mal porque esperan 1.91:1.

Si se quiere corregir: crear **1200 × 630 px** y actualizar los `og:image` / `twitter:image`.
Es opcional, no bloquea nada.

### 8.4 Lo que NO necesita imágenes

Las tarjetas de `soluciones.html` (valor y tipos de negocio) usan **íconos SVG en línea**,
no fotos. No hace falta generar nada para ellas salvo que se decida rediseñarlas.

---

## 9. Problemas conocidos

### Contenido desactualizado (contradice el estado real del sitio)
1. **`aviso-privacidad.html` línea ~105** dice que el formulario *"envía los datos a través
   de WhatsApp"*. **Ya no es cierto**: ahora usa Web3Forms (correo). Es un documento legal,
   así que la imprecisión importa. También la línea ~100 menciona contacto "por teléfono",
   pero el teléfono se eliminó del sitio.
2. **`contacto.html` línea 7** — la meta descripción SEO dice *"Contáctanos por WhatsApp,
   teléfono, email o formulario"*. Desactualizada por la misma razón. El usuario ya fue
   avisado de esto y decidió dejarlo pendiente.
3. **`aviso-privacidad.html` línea 79** tiene un literal `[fecha]` sin rellenar, y advierte
   que es una plantilla sin revisión legal.

### Archivos huérfanos
4. `assets/images/equipo-confianza.jpg` y `equipo-confianza-mobile.jpg` (195 KB juntos)
   **ya no se usan en ninguna página** — quedaron de la sección "Quiénes somos" eliminada.
   Se pueden borrar.

### Accesibilidad menor
5. El botón del menú móvil tiene `aria-controls="nav-links"` en las 6 páginas, pero
   **no existe ningún elemento con `id="nav-links"`** (el `<ul>` solo tiene la *clase*
   `nav-links`). Los lectores de pantalla no pueden resolver esa referencia.
   Arreglo: agregar `id="nav-links"` al `<ul>`.

### Datos de ejemplo sin confirmar
6. Dirección, email y dominio (`altacopa.mx`) parecen ser de relleno. Confirmar con el
   usuario antes de publicar.

### Entorno de desarrollo (no afecta al sitio publicado)
7. **Caché agresiva del navegador de pruebas.** `python3 -m http.server` no envía cabeceras
   `Cache-Control`, y el panel del navegador sigue sirviendo el `styles.css` viejo aunque el
   archivo en disco ya esté actualizado. Esto **provocó una verificación equivocada** durante
   la sesión anterior.
   **Cómo evitarlo:** después de editar el CSS, verificar con
   `curl -s http://localhost:8001/css/styles.css | grep ...` (fuente de verdad), o forzar
   recarga inyectando el CSS con `fetch(url, {cache:'no-store'})` antes de tomar capturas.
   Nunca confiar en una captura de pantalla sin confirmar que el CSS cargado es el nuevo.

---

## 10. Próximos pasos exactos

### Paso 1 — Responder la pregunta pendiente (lo primero)
Entregar al usuario las especificaciones de la **sección 8.1**: **1200 × 900 px, proporción
4:3, JPG, ≤250 KB**, con los 9 nombres de archivo exactos y la guía de composición.
Si también quiere regenerar el hero, darle la sección 8.2.

### Paso 2 — Cuando entregue las imágenes generadas
1. Colocarlas en `assets/images/catalogo/` con **los nombres exactos** de la lista (así no
   hay que tocar el HTML).
2. Verificar dimensiones y peso:
   ```bash
   cd ~/Desktop/alta-copa-distribucion/assets/images/catalogo
   for f in *.jpg; do echo "$f: $(sips -g pixelWidth -g pixelHeight "$f" | tail -2 | tr -d ' \n')  $(($(stat -f%z "$f")/1024))KB"; done
   ```
3. **Revisar cada imagen visualmente con la herramienta Read** antes de darla por buena.
   En la sesión anterior, **4 de 9 fotos descargadas no correspondían a su categoría**
   (el título decía "ron" pero era whisky; "ginebra" era un refresco sin alcohol). No confiar
   en el nombre del archivo ni en la descripción: mirar la imagen.
4. Verificar en el navegador con la precaución de caché del punto 9.7.

### Paso 3 — Republicar el artifact
Hecho el 2026-10-01 (versión 8). Repetir tras cada cambio local.

### Paso 4 — Pendientes menores (preguntar antes, no son urgentes)
- Corregir el aviso de privacidad (WhatsApp → Web3Forms) y la meta descripción de contacto.
- Borrar las dos imágenes huérfanas `equipo-confianza*.jpg`.
- Agregar `id="nav-links"` al `<ul>` del menú en las 6 páginas.
- Confirmar dirección, email y dominio reales antes de publicar.

---

## 11. Cómo trabaja este usuario (preferencias observadas)

- **Escribe en español**; responderle en español.
- Pide cambios **incrementales y concretos**, uno a la vez ("elimina X", "mueve Y más abajo").
- **Valora el minimalismo**: ha pedido quitar varias secciones y elementos. Ante la duda,
  quitar antes que agregar.
- Revisa el resultado en `localhost` después de cada cambio, así que conviene verificar en
  el navegador y avisarle qué URL abrir.
- Agradece que se le señalen los problemas encontrados de paso, pero **no** que se arreglen
  cosas fuera de lo que pidió sin avisar.
