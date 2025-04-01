// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
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
    
    carrito = [];
    
    console.log('Carrito reiniciado completamente');
}

// Función para abrir el carrito
function abrirCarrito() {
    document.getElementById('modal-carrito').classList.add('mostrar');
    actualizarCarrito();
}

// Función para cerrar el carrito
function cerrarCarrito() {
    const modalCarrito = document.getElementById('modal-carrito');
    if (modalCarrito) {
        modalCarrito.classList.remove('mostrar');
    }
}

// Función para optimizar imagen antes de guardar
function optimizarImagen(imagenUrl) {
    if (!imagenUrl) return '';
    // Si es una URL de datos (base64), la recortamos para ahorrar espacio
    if (imagenUrl.startsWith('data:image')) {
        return imagenUrl.substring(0, 100) + '...';
    }
    return imagenUrl;
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
    try {
        // Optimizar el carrito antes de guardar
        const carritoOptimizado = carrito.map(item => ({
            id: item.id,
            nombre: item.nombre,
            precio: item.precio,
            imagen: optimizarImagen(item.imagen),
            cantidad: item.cantidad
        }));

        // Intentar guardar el carrito optimizado
        try {
            localStorage.setItem('carrito', JSON.stringify(carritoOptimizado));
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.warn('Límite de almacenamiento alcanzado, intentando limpiar...');
                // Intentar guardar sin imágenes
                const carritoSinImagenes = carritoOptimizado.map(item => ({
                    id: item.id,
                    nombre: item.nombre,
                    precio: item.precio,
                    cantidad: item.cantidad
                }));
                localStorage.setItem('carrito', JSON.stringify(carritoSinImagenes));
                mostrarMensaje('Carrito guardado sin imágenes debido a limitaciones de espacio', 'warning');
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('Error al guardar el carrito:', error);
        mostrarMensaje('Error al guardar el carrito', 'error');
    }
    
    actualizarContadorCarrito();
}

// Función para agregar un producto al carrito
function agregarAlCarrito(productoId) {
    try {
        const productos = JSON.parse(localStorage.getItem('productos') || '[]');
        const producto = productos.find(p => p.id === productoId);
        
        if (!producto) {
            console.error('Producto no encontrado:', productoId);
            return;
        }
        
        const itemExistente = carrito.find(item => item.id === producto.id);
        
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            // Obtener la imagen de forma segura
            let imagen = producto.imagen;
            if (!imagen && producto.imagenes) {
                imagen = Array.isArray(producto.imagenes) ? producto.imagenes[0] : producto.imagenes;
            }
            if (!imagen) {
                imagen = 'https://dummyimage.com/300x300/cccccc/ffffff&text=' + encodeURIComponent(producto.nombre || '');
            }

            carrito.push({
                id: producto.id,
                nombre: producto.nombre || 'Producto sin nombre',
                precio: producto.precio || 0,
                imagen: imagen,
                cantidad: 1
            });
        }
        
        guardarCarrito();
        actualizarContadorCarrito();
        mostrarMensaje('Producto agregado al carrito', 'success');
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        mostrarMensaje('Error al agregar el producto', 'error');
    }
}

// Función para mostrar mensajes flotantes
function mostrarMensaje(mensaje, tipo = 'success') {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = `mensaje-flotante mensaje-${tipo}`;
    mensajeDiv.textContent = mensaje;
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        mensajeDiv.classList.add('fadeout');
        setTimeout(() => mensajeDiv.remove(), 300);
    }, 2000);
}

// Función para actualizar la cantidad de un producto
function actualizarCantidad(id, cambio) {
    const item = carrito.find(item => item.id === id);
    if (item) {
        item.cantidad += cambio;
        if (item.cantidad <= 0) {
            carrito = carrito.filter(item => item.id !== id);
        }
        guardarCarrito();
        actualizarCarrito();
    }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    actualizarCarrito();
    mostrarMensaje('Producto eliminado del carrito', 'info');
}

// Función para vaciar el carrito
function vaciarCarrito() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        carrito = [];
        guardarCarrito();
        actualizarCarrito();
        mostrarMensaje('Carrito vaciado', 'info');
    }
}

// Función para finalizar la compra
function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarMensaje('El carrito está vacío', 'error');
        return;
    }
    
    // Aquí iría la lógica para procesar el pago
    alert('¡Gracias por tu compra! Pronto implementaremos el proceso de pago.');
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
    cerrarCarrito();
    mostrarMensaje('¡Compra finalizada con éxito!', 'success');
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contador.textContent = total;
        contador.style.display = total > 0 ? 'block' : 'none';
    }
}

// Función para actualizar la visualización del carrito
function actualizarCarrito() {
    const contenedor = document.getElementById('carrito-items');
    const totalElement = document.getElementById('carrito-total');
    
    if (!contenedor || !totalElement) {
        console.error('Elementos del carrito no encontrados');
        return;
    }
    
    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
        totalElement.textContent = '$0';
        return;
    }
    
    contenedor.innerHTML = carrito.map(item => `
        <div class="carrito-item">
            <img src="${item.imagen}" alt="${item.nombre}" class="carrito-item-imagen">
            <div class="carrito-item-info">
                <h3 class="carrito-item-nombre">${item.nombre}</h3>
                <p class="carrito-item-precio">$${formatearPrecio(item.precio)}</p>
                <div class="carrito-item-cantidad">
                    <button class="btn-cantidad" onclick="actualizarCantidad(${item.id}, -1)">-</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-cantidad" onclick="actualizarCantidad(${item.id}, 1)">+</button>
                </div>
            </div>
            <i class="fas fa-trash carrito-item-eliminar" onclick="eliminarDelCarrito(${item.id})"></i>
        </div>
    `).join('');
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    totalElement.textContent = `$${formatearPrecio(total)}`;
}

// Función para formatear precios
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CL').format(precio || 0);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando carrito...');
    
    // Cargar carrito desde localStorage
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Actualizar contador
    actualizarContadorCarrito();
    
    // Agregar evento de clic al icono del carrito
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
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
window.actualizarCantidad = actualizarCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;
window.vaciarCarrito = vaciarCarrito;
window.finalizarCompra = finalizarCompra;
window.abrirCarrito = abrirCarrito;
window.cerrarCarrito = cerrarCarrito;
window.mostrarMensaje = mostrarMensaje; 