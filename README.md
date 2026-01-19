# Icegurt Web 🍦

Este es el sitio web oficial (Landing Page) para **Icegurt**, diseñado con un estilo "Retro Fun" para capturar pedidos directamente a través de WhatsApp.

## 🚀 Características
- **Diseño Mobile-First**: Optimizado para celulares.
- **Carrito Flotante**: Siempre visible para facilitar la compra.
- **Sin Backend**: Funciona 100% en el navegador del cliente.
- **Integración WhatsApp**: Genera mensajes de pedido automáticos.

## 🛠️ Cómo Editar
1. Clona el repositorio.
2. Abre la carpeta en tu editor de código favorito (VS Code).
3. **Cambiar precios/productos**: Edita directamente el archivo `index.html`. Busca las etiquetas `data-name` y `data-price` en los elementos.
   ```html
   <article class="product-card" data-name="Nuevo Producto" data-price="9999">
   ```
4. **Cambiar número de WhatsApp**: Abre `script.js` y edita la constante al inicio:
   ```javascript
   const PHONE_NUMBER = "573XXXXXXXXX"; 
   ```

## 🎨 Estilos
El diseño utiliza variables CSS en `styles.css`. Puedes cambiar los colores principales editando `:root` al principio del archivo.

## 📦 Despliegue
Este proyecto es estático (HTML/CSS/JS), por lo que puedes alojarlo gratuitamente en:
- GitHub Pages
- Vercel
- Netlify

¡Disfruta el helado! 🍧
