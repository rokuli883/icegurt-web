// Estado del carrito
let cart = {
    items: [],
    total: 0
};

const PHONE_NUMBER = "573134664723"; // Tu número

// Elementos
const buttons = document.querySelectorAll('.add-btn, .add-btn-small');
const cartCountEl = document.querySelector('.cart-items');
const cartTotalEl = document.querySelector('.cart-total');
const stickyCart = document.getElementById('sticky-cart');
const whatsappBtn = document.getElementById('whatsapp-btn');

const modal = document.getElementById('selection-modal');
const modalContent = document.getElementById('modal-options-container');
const modalTitle = document.getElementById('modal-product-title');
const closeSelectionModalBtn = document.getElementById('close-selection-modal');
const confirmBtn = document.getElementById('confirm-add-btn');

const cartModal = document.getElementById('cart-modal');
const cartSummaryBtn = document.getElementById('cart-summary-btn');
const closeCartModalBtn = document.getElementById('close-cart-modal');
const cartItemsContainer = document.getElementById('cart-items-container');
const modalCartTotal = document.getElementById('modal-cart-total');
const modalCheckoutBtn = document.getElementById('modal-checkout-btn');


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

// Listas de Ingredientes Globales
const LIST_TOPPINGS_CLASIC = [
    'Aritos gomita', 'Moritas gomita', 'Gusanos gomita', 'Trululu gomita', 'Banderitas gomita',
    'Lluvia de chocolate', 'Grajeas de colores', 'Quipitos', 'Zucaritas', 'Chococrispys',
    'Granola de chocolate', 'Granola de fresa', 'Granola de almendras', 'Granola normal',
    'Fresa', 'Mora', 'Maracuta', 'Mango', 'Maní', 'Maní dulce', 'Frutos secos', 'Oreo',
    'Uvas pasas', 'Arándanos deshidratados'
];

const LIST_TOPPINGS_PREMIUM = [
    'Chips chocolate negro', 'Chips chocolate blanco', 'Chokis', 'Goldchips', 'Chocopops',
    'Hershey', 'Masmelo', 'Almendras', 'M&M', 'Durazno', 'Kiwi', 'Arándanos',
    'Cereza', 'Lyche', 'Explosión de Lyche', 'Explosión de Fresa', 'Explosión de Arándanos',
    'Coco deshidratado'
];

const LIST_TOPPINGS_GOLD = ['Ferrero Chocolate', 'Marañon', 'Nuez de Brasil', 'Kinder bueno', 'Pirulin'];

const LIST_CUBIERTAS = ['Chocolate', 'Chocolate blanco', 'Chocolate sugarfree', 'Chocolate con crispy', 'Chocolate Hershey', 'Chocolate maní'];
const LIST_CUBIERTAS_GOLD = ['Chocolate de pistachos'];

// Sub-categorías para productos específicos (Musly, Bowls, etc)
const LIST_FRUTAS = ['Fresa', 'Mora', 'Maracuta', 'Mango', 'Durazno', 'Kiwi', 'Arándanos', 'Cereza', 'Lyche'];
const LIST_CEREALES = ['Granola de chocolate', 'Granola de fresa', 'Granola de almendras', 'Granola normal', 'Zucaritas', 'Chococrispys'];

// Lista completa de Todos los Toppings (Unión de listas)
const LIST_TODOS_TOPPINGS = [...LIST_TOPPINGS_CLASIC, ...LIST_TOPPINGS_PREMIUM, ...LIST_TOPPINGS_GOLD];

// Configuración de Productos Personalizables
const productsConfig = {
    'frozen': {
        title: 'Personaliza tu Icegurt',
        options: [
            {
                name: 'Toppings Clásicos',
                type: 'checkbox',
                price: 2500,
                choices: LIST_TOPPINGS_CLASIC
            },
            {
                name: 'Toppings Premium',
                type: 'checkbox',
                price: 3000,
                choices: LIST_TOPPINGS_PREMIUM
            },
            {
                name: 'Toppings Gold',
                type: 'checkbox',
                price: 4500,
                choices: LIST_TOPPINGS_GOLD
            },
            {
                name: 'Coberturas',
                type: 'checkbox',
                price: 4000,
                choices: LIST_CUBIERTAS
            },
            {
                name: 'Coberturas Gold',
                type: 'checkbox',
                price: 6000,
                choices: LIST_CUBIERTAS_GOLD
            }
        ]
    },
    'malteada': {
        title: 'Elige tu sabor',
        options: [
            {
                name: 'Sabor',
                type: 'radio',
                choices: ['Oreo', 'Milo', 'Brownie', 'Café', 'Vainilla']
            }
        ]
    },
    'bowl_waffle': {
        title: 'Arma tu Waffle',
        options: [
            {
                name: 'Toppings (Elige 2)',
                type: 'checkbox',
                limit: 2,
                choices: LIST_TODOS_TOPPINGS
            },
            {
                name: 'Salsas',
                type: 'radio',
                choices: ['Chocolate', 'Arequipe', 'Leche Condensada', 'Mora']
            }
        ]
    },
    'bowl_brownie': {
        title: 'Arma tu Bowl Brownie',
        options: [
            {
                name: 'Toppings (Elige 2)',
                type: 'checkbox',
                limit: 2,
                choices: LIST_TODOS_TOPPINGS
            },
            {
                name: 'Salsas',
                type: 'radio',
                choices: ['Chocolate', 'Arequipe', 'Leche Condensada']
            }
        ]
    },
    'bowl_griego': {
        title: 'Arma tu Bowl Griego',
        options: [
            {
                name: 'Frutas (Elige 2)',
                type: 'checkbox',
                limit: 2,
                choices: LIST_FRUTAS
            },
            {
                name: 'Cereal',
                type: 'radio',
                choices: LIST_CEREALES
            }
        ]
    },
    'parfait': {
        title: 'Arma tu Parfait',
        options: [
            {
                name: 'Frutas (Elige 2)',
                type: 'checkbox',
                limit: 2,
                choices: LIST_FRUTAS
            },
            {
                name: 'Toppings (Elige 2)',
                type: 'checkbox',
                limit: 2,
                choices: LIST_TODOS_TOPPINGS
            },
            {
                name: 'Salsas',
                type: 'radio',
                choices: ['Chocolate', 'Arequipe', 'Leche Condensada', 'Mora']
            }
        ]
    },
    'topping_clasico': {
        title: 'Elige un Topping Clásico',
        options: [
            {
                name: 'Opciones',
                type: 'radio',
                choices: LIST_TOPPINGS_CLASIC
            }
        ]
    },
    'topping_premium': {
        title: 'Elige un Topping Premium',
        options: [
            {
                name: 'Opciones',
                type: 'radio',
                choices: LIST_TOPPINGS_PREMIUM
            }
        ]
    },
    'topping_gold': {
        title: 'Elige un Topping Gold',
        options: [
            {
                name: 'Opciones',
                type: 'radio',
                choices: LIST_TOPPINGS_GOLD
            }
        ]
    },
    'cubierta': {
        title: 'Elige tu Cobertura',
        options: [
            {
                name: 'Sabores',
                type: 'radio',
                choices: LIST_CUBIERTAS
            }
        ]
    },
    'cubierta_gold': {
        title: 'Elige tu Cobertura Gold',
        options: [
            {
                name: 'Sabores',
                type: 'radio',
                choices: LIST_CUBIERTAS_GOLD
            }
        ]
    },
    'musly': {
        title: 'Arma tu Musly',
        options: [
            {
                name: 'Frutas (Elige 2)',
                type: 'checkbox',
                limit: 2,
                choices: LIST_FRUTAS
            },
            {
                name: 'Cereal',
                type: 'radio',
                choices: LIST_CEREALES
            },
            {
                name: 'Salsas',
                type: 'radio',
                choices: ['Chocolate', 'Arequipe', 'Leche Condensada', 'Mora']
            }
        ]
    }
};

let currentProduct = null;

// --- LÓGICA DEL CARRITO ---

function addItem(name, price) {
    console.log(`Adding Item: ${name} - ${price}`);
    cart.items.push({ name, price });
    cart.total += price;
    updateCartUI();

    // Feedback táctil/visual en el móvil
    if (navigator.vibrate) navigator.vibrate(50);
}

function removeItem(index) {
    const item = cart.items[index];
    cart.total -= item.price;
    cart.items.splice(index, 1);
    updateCartUI();
    renderCartItems(); // Re-renderizar la lista
}

function updateCartUI() {
    console.log("Updating Cart UI. Items:", cart.items.length);
    const count = cart.items.length;
    const formattedTotal = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(cart.total);

    cartCountEl.textContent = `${count} ítem${count !== 1 ? 's' : ''}`;
    cartTotalEl.textContent = formattedTotal;

    // Actualizar total del modal también
    if (modalCartTotal) modalCartTotal.textContent = formattedTotal;

    // Mostrar el carrito solo si hay ítems
    if (count > 0) {
        console.log("Showing Sticky Cart");
        stickyCart.classList.add('active');
    } else {
        console.log("Hiding Sticky Cart");
        stickyCart.classList.remove('active');
        // Si vaciamos el carrito, cerrar el modal también
        if (cartModal) cartModal.classList.remove('active');
    }
}

function renderCartItems() {
    cartItemsContainer.innerHTML = '';

    cart.items.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';

        const info = document.createElement('div');
        info.className = 'item-info';

        const namePart = document.createElement('div');
        namePart.className = 'item-name';
        namePart.textContent = item.name;

        const pricePart = document.createElement('div');
        pricePart.className = 'item-price';
        pricePart.textContent = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(item.price);

        info.appendChild(namePart);
        info.appendChild(pricePart);

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.innerHTML = '&times;';
        delBtn.onclick = () => removeItem(index);

        itemEl.appendChild(info);
        itemEl.appendChild(delBtn);
        cartItemsContainer.appendChild(itemEl);
    });
}

function toggleCartModal() {
    console.log("Toggle cart clicked. Items:", cart.items.length);
    // if (cart.items.length === 0) return; // Permite abrir siempre por si acaso

    // Toggle active
    if (cartModal.classList.contains('active')) {
        cartModal.classList.remove('active');
    } else {
        renderCartItems();
        cartModal.classList.add('active');
    }
}

function checkout() {
    if (cart.items.length === 0) return;

    // Resumen agrupado
    const summary = cart.items.reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + 1;
        return acc;
    }, {});

    let message = "¡Hola Icegurt! Quiero hacer este pedido:\n\n";

    for (const [name, qty] of Object.entries(summary)) {
        message += `- ${qty}x *${name}*\n`;
    }

    const formattedTotal = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(cart.total);
    message += `\n*Total: ${formattedTotal}*`;

    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Event Listeners para Carrito Modal
if (cartSummaryBtn) cartSummaryBtn.addEventListener('click', toggleCartModal);
if (closeCartModalBtn) closeCartModalBtn.addEventListener('click', () => cartModal.classList.remove('active'));
if (modalCheckoutBtn) modalCheckoutBtn.addEventListener('click', checkout);
if (cartModal) {
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) cartModal.classList.remove('active');
    });
}

// --- LÓGICA DEL MODAL DE SELECCIÓN ---

function openModal(type, name, price) {
    const config = productsConfig[type];
    if (!config) return;

    currentProduct = { name, price, type };

    // Resetear y popular modal
    modalTitle.textContent = config.title || `Personaliza ${name}`;
    modalContent.innerHTML = '';

    config.options.forEach((group, index) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'option-group';

        const title = document.createElement('h4');
        title.textContent = group.name;
        groupDiv.appendChild(title);

        const list = document.createElement('div');
        list.className = 'option-list';

        group.choices.forEach(choice => {
            const label = document.createElement('label');
            label.className = 'option-chip';

            const input = document.createElement('input');
            input.type = group.type === 'radio' ? 'radio' : 'checkbox';
            input.name = `option-group-${index}`;
            input.value = choice;

            // Limitador para checkboxes
            if (group.type === 'checkbox' && group.limit) {
                input.addEventListener('change', function () {
                    const checked = list.querySelectorAll(`input[name="${this.name}"]:checked`);
                    if (checked.length > group.limit) {
                        this.checked = false; // Desmarcar si pasa el límite
                        // Animación o alert pequeño
                    }
                });
            }

            // Si el grupo tiene precio adicional, agregarlo al input
            if (group.price) {
                input.dataset.addedPrice = group.price;
            }

            const span = document.createElement('span');
            // Mostrar precio si existe
            span.textContent = group.price ? `${choice} (+$${group.price / 1000}k)` : choice;

            label.appendChild(input);
            label.appendChild(span);
            list.appendChild(label);
        });

        groupDiv.appendChild(list);
        modalContent.appendChild(groupDiv);
    });

    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
    currentProduct = null;
}

if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
        if (!currentProduct) return;

        // Recolectar opciones seleccionadas y calcular precio
        const selectedOptions = [];
        let additionalPrice = 0;
        const groups = modalContent.querySelectorAll('.option-group');

        groups.forEach(group => {
            const inputs = group.querySelectorAll('input:checked');
            inputs.forEach(input => {
                selectedOptions.push(input.value);
                if (input.dataset.addedPrice) {
                    additionalPrice += parseInt(input.dataset.addedPrice);
                }
            });
        });

        const finalName = selectedOptions.length > 0
            ? `${currentProduct.name} + ${selectedOptions.join(', ')}`
            : currentProduct.name;

        const finalPrice = currentProduct.price + additionalPrice;

        addItem(finalName, finalPrice);
        closeModal();
    });
}

if (closeSelectionModalBtn) closeSelectionModalBtn.addEventListener('click', closeModal);
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Listeners
buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
        console.log("Button clicked", this);
        // Efecto Ripple simple
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 1. Intentar obtener datos del botón mismo (para adiciones)
        let name = this.dataset.name;
        let price = this.dataset.price ? parseInt(this.dataset.price) : null;
        let type = this.dataset.type; // Usualmente undefined en botones simples

        // 2. Si no hay datos en el botón, buscar en la tarjeta padre
        if (!name || price === null) {
            const card = this.closest('.product-card');
            if (card) {
                name = card.dataset.name;
                price = parseInt(card.dataset.price);
                type = card.dataset.type;
            }
        }

        // Validación de seguridad
        if (!name || isNaN(price)) {
            console.error("Error: No se pudo obtener nombre o precio válido", { name, price });
            return;
        }

        // Si tiene tipo especial, abrir modal
        if (type && productsConfig[type]) {
            console.log("Opening Modal for", type);
            openModal(type, name, price);
            return;
        }

        // Si no, agregar directo
        console.log("Adding Direct:", name);
        addItem(name, price);

        // Animación del botón (solo si fue directo)
        const originalText = this.innerHTML;
        this.innerHTML = "¡LISTO!";
        this.style.background = "#FFD93D";
        this.style.color = "#0E5E63";

        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.background = "";
            this.style.color = "";
        }, 800);
    });
});

if (whatsappBtn) whatsappBtn.addEventListener('click', checkout);
