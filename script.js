// Estado del carrito
let cart = {
    items: [],
    total: 0
};

// Configuración de WhatsApp (Reemplazar XXXXX con el número real después)
const PHONE_NUMBER = "573001234567"; // Número de ejemplo

// Selectores DOM
const buttons = document.querySelectorAll('.add-btn, .add-btn-small');
const cartCountEl = document.querySelector('.cart-count');
const cartTotalEl = document.querySelector('.cart-total');
const whatsappBtn = document.getElementById('whatsapp-btn');

// Función para agregar items
function addItem(name, price) {
    // Animación de feedback visual (opcional/simple)
    
    cart.items.push({ name, price });
    cart.total += price;
    updateCartUI();
    
    // Feedback visual pequeño en el botón
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "¡Listo! 👍";
    setTimeout(() => {
        btn.innerText = originalText;
    }, 1000);
}

// Actualizar la barra flotante
function updateCartUI() {
    const count = cart.items.length;
    // Formato de moneda COP
    const formattedTotal = new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP', 
        minimumFractionDigits: 0 
    }).format(cart.total);

    cartCountEl.textContent = `${count} ítem${count !== 1 ? 's' : ''}`;
    cartTotalEl.textContent = formattedTotal;

    // Animación "pop" en el carrito cuando se actualiza
    const cartEl = document.getElementById('sticky-cart');
    cartEl.style.transform = "translateX(-50%) scale(1.05)";
    setTimeout(() => {
        cartEl.style.transform = "translateX(-50%) scale(1)";
    }, 150);
}

// Generar mensaje y abrir WhatsApp
function checkout() {
    if (cart.items.length === 0) {
        alert("¡Tu carrito está vacío! Agrega unos deliciosos helados primero. 🍦");
        return;
    }

    // Agrupar ítems para que el mensaje sea más limpio
    const summary = cart.items.reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + 1;
        return acc;
    }, {});

    let message = "Hola Icegurt! 🍦 Quiero pedir:\n\n";
    
    for (const [name, qty] of Object.entries(summary)) {
        message += `- ${qty}x ${name}\n`;
    }
    
    const formattedTotal = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(cart.total);
    message += `\n*Total: ${formattedTotal}*`;

    // Codificar mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodedMessage}`;
    
    window.open(url, '_blank');
}

// Event Listeners
buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const name = btn.dataset.name;
        const price = parseInt(btn.dataset.price);
        addItem(name, price);
    });
});

whatsappBtn.addEventListener('click', checkout);
