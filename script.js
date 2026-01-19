// Estado del carrito
let cart = {
    items: [],
    total: 0
};

const PHONE_NUMBER = "573001234567"; // Tu número

// Elementos
const buttons = document.querySelectorAll('.add-btn, .add-btn-small');
const cartCountEl = document.querySelector('.cart-items');
const cartTotalEl = document.querySelector('.cart-total');
const stickyCart = document.getElementById('sticky-cart');
const whatsappBtn = document.getElementById('whatsapp-btn');

// --- ANIMACIONES DE SCROLL (Intersection Observer) ---
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.product-card');

    // Configurar el observador
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Agregar clase visible con un pequeño retraso basado en el índice para efecto cascada (opcional)
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Dejar de observar una vez animado
            }
        });
    }, {
        threshold: 0.1, // Disparar cuando se vea el 10% de la tarjeta
        rootMargin: "0px 0px -50px 0px"
    });

    // Observar cada tarjeta
    cards.forEach(card => observer.observe(card));
});

// --- LÓGICA DEL CARRITO ---

function addItem(name, price) {
    cart.items.push({ name, price });
    cart.total += price;
    updateCartUI();

    // Feedback táctil/visual en el móvil
    if (navigator.vibrate) navigator.vibrate(50);
}

function updateCartUI() {
    const count = cart.items.length;
    const formattedTotal = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(cart.total);

    cartCountEl.textContent = `${count} ítem${count !== 1 ? 's' : ''}`;
    cartTotalEl.textContent = formattedTotal;

    // Mostrar el carrito solo si hay ítems
    if (count > 0) {
        stickyCart.classList.add('active');
    } else {
        stickyCart.classList.remove('active');
    }
}

function checkout() {
    if (cart.items.length === 0) return;

    // Resumen agrupado
    const summary = cart.items.reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + 1;
        return acc;
    }, {});

    let message = "¡Hola Icegurt! 🍦👋 Quiero hacer este pedido:\n\n";

    for (const [name, qty] of Object.entries(summary)) {
        message += `▪️ ${qty}x *${name}*\n`;
    }

    const formattedTotal = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(cart.total);
    message += `\n💰 *Total: ${formattedTotal}*`;
    message += `\n\n📍 _(Envíame tu ubicación por favor)_`;

    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Listeners
buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
        // Efecto Ripple simple en el botón
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Lógica de agregar
        const name = this.dataset.name || this.parentElement.dataset.name;
        const price = parseInt(this.dataset.price || this.parentElement.dataset.price);

        addItem(name, price);

        // Animación temporal del botón
        const originalText = this.innerHTML;
        this.innerHTML = "¡LISTO! ⭐";
        this.style.background = "#FFD93D";
        this.style.color = "#0E5E63";

        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.background = "";
            this.style.color = "";
        }, 800);
    });
});

whatsappBtn.addEventListener('click', checkout);
