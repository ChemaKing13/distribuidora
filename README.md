# Alta Copa Distribución — sitio web

Sitio estático (HTML/CSS/JS, sin build ni dependencias) para una distribuidora de bebidas B2B: página comercial, catálogo por categorías y solicitud de cotización vía WhatsApp/formulario.

## Estructura

```
index.html             Inicio (hero, propuesta de valor, nosotros, catálogo, soluciones, por qué elegirnos, CTA)
catalogo.html          Catálogo completo con filtro por categoría
contacto.html          Canales de contacto + formulario de cotización
aviso-privacidad.html  Aviso de privacidad (plantilla base, revisar con un asesor legal)
404.html               Página de error 404
robots.txt             Indicaciones para buscadores
sitemap.xml            Mapa del sitio para buscadores
css/styles.css         Tokens de diseño (color, tipografía, espaciado) y estilos de todo el sitio
js/main.js             Configuración de contacto, menú móvil, filtro de catálogo, validación y envío del formulario por WhatsApp
assets/images/         Imágenes (hero y sección "Nosotros")
assets/favicon.svg     Ícono del sitio
```

## Antes de publicar (dominio y SEO)

`index.html`, `catalogo.html`, `contacto.html` y `aviso-privacidad.html` incluyen metadatos SEO (Open Graph, Twitter Card, `canonical`) y `index.html` incluye datos estructurados (`LocalBusiness`). Todos usan el dominio de ejemplo `https://www.altacopa.mx/`. Antes de publicar:

1. Reemplaza `https://www.altacopa.mx` por el dominio real en cada `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image` y en `robots.txt` / `sitemap.xml`.
2. Revisa `aviso-privacidad.html` con un asesor legal; es una plantilla base, no un documento legal definitivo.
3. Actualiza la fecha `[fecha]` en el aviso de privacidad.
4. `404.html` es servido automáticamente como página de error por hostings estáticos comunes (Netlify, Vercel, GitHub Pages); en un servidor propio (Apache/Nginx) puede requerir configuración adicional.

## Editar los datos de la empresa (un solo lugar)

Todos los datos de contacto (WhatsApp, teléfono, email, dirección, horario) están centralizados en `js/main.js`, al inicio del archivo, en el objeto `CONFIG`:

```js
var CONFIG = {
  whatsappNumber: "525548323739", // sin '+' ni espacios
  email: "contacto@altacopa.mx",
  address: "Av. Insurgentes Sur 1234, Col. Del Valle, Ciudad de México",
  hours: "Lunes a viernes, 9:00–18:00 h",
  whatsappGreeting: "Hola, me gustaría solicitar información / cotización...",
};
```

Al cambiar estos valores se actualizan automáticamente todos los enlaces y textos de contacto en las tres páginas (topbar, header, botón flotante de WhatsApp, sección de contacto y footer).

> Estos valores, el nombre "Alta Copa Distribución" y la dirección son **placeholders**. Reemplázalos por los datos reales antes de publicar el sitio.

## Cómo funciona la cotización

No hay carrito ni pagos. El formulario de `contacto.html` envía los datos a **Web3Forms**, que los reenvía como correo a tu bandeja. El visitante no sale del sitio y no necesita WhatsApp. Si el envío falla (sin conexión, servicio caído), se muestra un error con un enlace a WhatsApp como respaldo.

Los botones "Solicitar cotización" del catálogo llevan a `contacto.html?producto=NombreCategoria`, que precargan automáticamente esa categoría en el formulario.

### Configurar el destino de las solicitudes (obligatorio)

Sin este paso el formulario **no envía nada**. Toma un par de minutos y no requiere crear cuenta ni contraseña:

1. Entra a [web3forms.com](https://web3forms.com) y escribe el correo donde quieres recibir las solicitudes.
2. Te llega una **Access Key** (un UUID) a ese correo.
3. Pégala en `contacto.html`, en el campo oculto al inicio del formulario:

```html
<input type="hidden" name="access_key" value="TU_ACCESS_KEY_DE_WEB3FORMS">
```

4. Envía una solicitud de prueba desde el sitio y confirma que llega a tu bandeja (revisa spam la primera vez).

El plan gratuito cubre 250 solicitudes al mes. Para cambiar el correo de destino, genera una clave nueva con el correo deseado y reemplaza el valor.

## Ver el sitio localmente

No requiere instalación. Basta con abrir `index.html` en el navegador, o servirlo con cualquier servidor estático, por ejemplo:

```bash
npx serve .
```

## Personalizar el diseño

Los colores, tipografía y espaciado están definidos como variables CSS al inicio de `css/styles.css` (sección `:root`). Cambiar un valor ahí lo actualiza en todo el sitio.
