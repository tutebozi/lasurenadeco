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
    if (!imagenUrl) return 'https://dummyimage.com/300x300/cccccc/ffffff&text=Imagen+no+disponible';
    
    // Si es una URL de datos (base64), verificamos que sea válida
    if (imagenUrl.startsWith('data:image/')) {
        return imagenUrl; // Mantener la imagen base64 completa sin modificar
    }
    
    // Si es una URL normal, verificar que sea válida
    try {
        new URL(imagenUrl);
        return imagenUrl;
    } catch {
        return 'https://dummyimage.com/300x300/cccccc/ffffff&text=Imagen+no+disponible';
    }
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
    try {
        // Guardar el carrito sin modificar las imágenes
        localStorage.setItem('carrito', JSON.stringify(carrito));
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.warn('Límite de almacenamiento alcanzado, intentando limpiar...');
            // Intentar guardar sin imágenes
            const carritoSinImagenes = carrito.map(item => ({
                id: item.id,
                nombre: item.nombre,
                precio: item.precio,
                cantidad: item.cantidad,
                imagen: 'https://dummyimage.com/300x300/cccccc/ffffff&text=' + encodeURIComponent(item.nombre)
            }));
            localStorage.setItem('carrito', JSON.stringify(carritoSinImagenes));
        } else {
            console.error('Error al guardar el carrito:', error);
            mostrarMensaje('Error al guardar el carrito', 'error');
        }
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
            let imagen = '';
            if (producto.imagenes && Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
                // Asegurarse de que la imagen sea válida
                for (let img of producto.imagenes) {
                    if (img && (img.startsWith('data:image/') || img.startsWith('http'))) {
                        imagen = img;
                        break;
                    }
                }
            } else if (producto.imagen && (producto.imagen.startsWith('data:image/') || producto.imagen.startsWith('http'))) {
                imagen = producto.imagen;
            }
            
            // Si no se encontró una imagen válida, usar imagen por defecto
            if (!imagen) {
                imagen = 'https://dummyimage.com/300x300/cccccc/ffffff&text=' + encodeURIComponent(producto.nombre || 'Producto');
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
    try {
        // Convertir id a número si es necesario
        const itemId = typeof id === 'string' ? parseInt(id) : id;
        const item = carrito.find(item => item.id === itemId);
        
        if (item) {
            item.cantidad += cambio;
            if (item.cantidad <= 0) {
                eliminarDelCarrito(itemId);
            } else {
                guardarCarrito();
                actualizarCarrito();
            }
        }
    } catch (error) {
        console.error('Error al actualizar cantidad:', error);
    }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(id) {
    try {
        // Convertir id a número si es necesario
        const itemId = typeof id === 'string' ? parseInt(id) : id;
        carrito = carrito.filter(item => item.id !== itemId);
        guardarCarrito();
        actualizarCarrito();
        mostrarMensaje('Producto eliminado del carrito', 'info');
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
    }
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
    
    cerrarCarrito();
    iniciarCheckout();
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
    try {
        const contenedor = document.getElementById('carrito-items');
        const totalElement = document.getElementById('carrito-total');
        const btnComprar = document.querySelector('.btn-comprar');
        
        if (!contenedor || !totalElement) {
            console.error('Elementos del carrito no encontrados');
            return;
        }
        
        if (carrito.length === 0) {
            contenedor.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
            totalElement.textContent = '$0';
            if (btnComprar) btnComprar.disabled = true;
            return;
        }
        
        if (btnComprar) btnComprar.disabled = false;
        
        // Generar el HTML de los items
        contenedor.innerHTML = '';
        carrito.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'carrito-item';
            itemElement.dataset.id = item.id;
            
            // Imagen con manejo de errores
            const imagen = document.createElement('img');
            imagen.src = item.imagen;
            imagen.alt = item.nombre;
            imagen.className = 'carrito-item-imagen';
            imagen.onerror = function() {
                this.onerror = null;
                this.src = 'https://dummyimage.com/300x300/cccccc/ffffff&text=' + encodeURIComponent(item.nombre);
            };
            
            // Información del producto
            const infoDiv = document.createElement('div');
            infoDiv.className = 'carrito-item-info';
            
            const nombre = document.createElement('h3');
            nombre.className = 'carrito-item-nombre';
            nombre.textContent = item.nombre;
            
            const precio = document.createElement('p');
            precio.className = 'carrito-item-precio';
            precio.textContent = `$${formatearPrecio(item.precio)}`;
            
            // Controles de cantidad
            const cantidadDiv = document.createElement('div');
            cantidadDiv.className = 'carrito-item-cantidad';
            
            const btnMenos = document.createElement('button');
            btnMenos.className = 'btn-cantidad';
            btnMenos.textContent = '-';
            btnMenos.onclick = function() {
                actualizarCantidad(item.id, -1);
            };
            
            const cantidadSpan = document.createElement('span');
            cantidadSpan.textContent = item.cantidad;
            
            const btnMas = document.createElement('button');
            btnMas.className = 'btn-cantidad';
            btnMas.textContent = '+';
            btnMas.onclick = function() {
                actualizarCantidad(item.id, 1);
            };
            
            cantidadDiv.appendChild(btnMenos);
            cantidadDiv.appendChild(cantidadSpan);
            cantidadDiv.appendChild(btnMas);
            
            infoDiv.appendChild(nombre);
            infoDiv.appendChild(precio);
            infoDiv.appendChild(cantidadDiv);
            
            // Botón de eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.className = 'carrito-item-eliminar';
            btnEliminar.innerHTML = '<i class="fas fa-trash"></i>';
            btnEliminar.onclick = function() {
                eliminarDelCarrito(item.id);
            };
            
            // Ensamblar el item completo
            itemElement.appendChild(imagen);
            itemElement.appendChild(infoDiv);
            itemElement.appendChild(btnEliminar);
            
            contenedor.appendChild(itemElement);
        });
        
        // Actualizar el total
        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        totalElement.textContent = `$${formatearPrecio(total)}`;
    } catch (error) {
        console.error('Error al actualizar carrito:', error);
    }
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