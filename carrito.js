// Variables globales
let carrito = [];
let total = 0;

// Función para limpiar completamente el localStorage
function limpiarLocalStorage() {
    console.log('Limpiando completamente localStorage...');
    
    // Guardar algunos valores importantes
    const productos = localStorage.getItem('productos');
    const bannerImage = localStorage.getItem('bannerImage');
    const heroImage = localStorage.getItem('heroImage');
    
    // Limpiar todo
    localStorage.clear();
    
    // Restaurar valores importantes
    if (productos) localStorage.setItem('productos', productos);
    if (bannerImage) localStorage.setItem('bannerImage', bannerImage);
    if (heroImage) localStorage.setItem('heroImage', heroImage);
    
    // Crear un carrito vacío
    localStorage.setItem('carrito', JSON.stringify([]));
    
    console.log('localStorage limpiado y carrito reiniciado');
}

// Función para reiniciar completamente el carrito
function reiniciarCarrito() {
    console.log('Reiniciando completamente el carrito...');
    
    // Eliminar el carrito del localStorage
    localStorage.removeItem('carrito');
    
    // Crear un nuevo carrito vacío
    localStorage.setItem('carrito', JSON.stringify([]));
    
    // Actualizar todos los contadores posibles en el DOM
    const contadores = document.querySelectorAll('.cart-count, #contador-carrito, [class*="count"], [id*="contador"]');
    contadores.forEach(contador => {
        if (contador) {
            contador.textContent = '0';
            contador.style.display = 'none';
        }
    });
    
    // Si no se encontró ningún contador, crear uno nuevo
    if (contadores.length === 0) {
        const cartIcon = document.querySelector('.cart-icon, [class*="cart"]');
        if (cartIcon) {
            const nuevoContador = document.createElement('span');
            nuevoContador.id = 'contador-carrito-nuevo';
            nuevoContador.className = 'cart-count';
            nuevoContador.textContent = '0';
            nuevoContador.style.display = 'none';
            cartIcon.appendChild(nuevoContador);
            console.log('Nuevo contador creado:', nuevoContador);
        }
    }
    
    console.log('Carrito reiniciado completamente');
}

// Función para abrir el carrito
function abrirCarrito() {
    const modalCarrito = document.createElement('div');
    modalCarrito.className = 'modal-carrito';
    modalCarrito.id = 'modal-carrito';
    
    // Obtener carrito del localStorage
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Calcular total
    total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    modalCarrito.innerHTML = `
        <div class="modal-contenido-carrito">
            <div class="carrito-header">
                <h2>Tu Carrito</h2>
                <button class="cerrar-modal" onclick="cerrarCarrito()">×</button>
            </div>
            <div class="items-carrito">
                ${carrito.length === 0 ? 
                    '<div class="carrito-vacio">Tu carrito está vacío</div>' : 
                    carrito.map(item => `
                        <div class="item-carrito" id="item-${item.id}">
                            <img src="${item.imagen}" alt="${item.nombre}">
                            <div class="item-detalles">
                                <h3>${item.nombre}</h3>
                                <p class="item-precio">$${formatearPrecio(item.precio)}</p>
                                <div class="item-cantidad">
                                    <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
                                    <span>${item.cantidad}</span>
                                    <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
                                </div>
                            </div>
                            <button class="eliminar-item" onclick="eliminarItem(${item.id})">×</button>
                        </div>
                    `).join('')
                }
            </div>
            <div class="carrito-footer">
                <div class="total">
                    <span>Total</span>
                    <span class="total-amount">$${formatearPrecio(total)}</span>
                </div>
                <button class="btn-finalizar" onclick="finalizarCompra()">
                    FINALIZAR COMPRA
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalCarrito);
    modalCarrito.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Función para cerrar el carrito
function cerrarCarrito() {
    const modalCarrito = document.getElementById('modal-carrito');
    if (modalCarrito) {
        modalCarrito.remove();
        document.body.style.overflow = 'auto';
    }
}

// Función para cambiar la cantidad de un item
function cambiarCantidad(id, cambio) {
    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
        carrito[index].cantidad = Math.max(1, carrito[index].cantidad + cambio);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarritoUI();
    }
}

// Función para eliminar un item
function eliminarItem(id) {
    carrito = carrito.filter(item => item.id !== id);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarritoUI();
    actualizarContadorCarrito();
}

// Función para actualizar la UI del carrito
function actualizarCarritoUI() {
    const itemsContainer = document.querySelector('.items-carrito');
    total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    if (itemsContainer) {
        if (carrito.length === 0) {
            itemsContainer.innerHTML = '<div class="carrito-vacio">Tu carrito está vacío</div>';
        } else {
            itemsContainer.innerHTML = carrito.map(item => `
                <div class="item-carrito" id="item-${item.id}">
                    <img src="${item.imagen}" alt="${item.nombre}">
                    <div class="item-detalles">
                        <h3>${item.nombre}</h3>
                        <p class="item-precio">$${formatearPrecio(item.precio)}</p>
                        <div class="item-cantidad">
                            <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
                            <span>${item.cantidad}</span>
                            <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
                        </div>
                    </div>
                    <button class="eliminar-item" onclick="eliminarItem(${item.id})">×</button>
                </div>
            `).join('');
        }
        
        const totalAmount = document.querySelector('.total-amount');
        if (totalAmount) {
            totalAmount.textContent = `$${formatearPrecio(total)}`;
        }
    }
}

// Función para finalizar la compra
async function finalizarCompra() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    try {
        const response = await fetch('/crear-preferencia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: carrito.map(item => ({
                    title: item.nombre,
                    quantity: item.cantidad,
                    currency_id: 'CLP',
                    unit_price: item.precio
                }))
            })
        });

        const data = await response.json();
        
        if (data.preferenceId) {
            // Redirigir a MercadoPago
            window.location.href = data.init_point;
        } else {
            throw new Error('No se pudo crear la preferencia de pago');
        }
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        alert('Hubo un error al procesar tu compra. Por favor, intenta nuevamente.');
    }
}

// Función para formatear precios
function formatearPrecio(precio) {
    return precio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    if (contador) {
        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
    const itemExistente = carrito.find(item => item.id === producto.id);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({...producto, cantidad: 1});
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// Inicializar carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    actualizarContadorCarrito();
});

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando carrito...');
    
    // Reiniciar el carrito
    reiniciarCarrito();
    
    // Mostrar información de depuración
    console.log('Elementos del carrito en el DOM:');
    console.log('- .cart-icon:', document.querySelector('.cart-icon'));
    console.log('- #contador-carrito:', document.getElementById('contador-carrito'));
    console.log('- .cart-count:', document.querySelector('.cart-count'));
    
    // Agregar un evento de clic al icono del carrito
    const cartIcon = document.querySelector('.cart-icon, [class*="cart"]');
    if (cartIcon) {
        console.log('Agregando evento de clic al icono del carrito:', cartIcon);
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            abrirCarrito();
        });
    }
});

// Hacer las funciones disponibles globalmente
window.limpiarLocalStorage = limpiarLocalStorage;
window.reiniciarCarrito = reiniciarCarrito;
window.agregarAlCarrito = agregarAlCarrito;
window.actualizarContadorCarrito = actualizarContadorCarrito; 