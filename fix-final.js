// Solución final para el problema de imágenes
console.log('Cargando solución final para imágenes...');

// Función para mostrar detalles de un producto (VERSIÓN ULTRA SIMPLE)
function mostrarDetallesProductoSimple(producto) {
    console.log('Mostrando producto con imagen original:', producto);
    
    // Verificar que el producto sea válido
    if (!producto || !producto.nombre) {
        console.error('Producto inválido');
        return;
    }
    
    // Determinar la imagen a mostrar (intentar usar la original)
    let imagenProducto = producto.imagen || 'https://dummyimage.com/400x400/cccccc/ffffff&text=' + encodeURIComponent(producto.nombre);
    
    // Crear el HTML del modal CON IMAGEN ORIGINAL
    const modalHTML = `
        <div id="modal-producto-simple" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
        ">
            <div style="
                background: white;
                width: 90%;
                max-width: 800px;
                border-radius: 8px;
                padding: 20px;
                position: relative;
            ">
                <button 
                    id="btn-cerrar-modal-simple"
                    style="
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                    "
                >×</button>
                
                <div style="display: flex; flex-wrap: wrap; gap: 20px;">
                    <!-- Columna de imagen -->
                    <div style="flex: 1; min-width: 300px;">
                        <div style="
                            width: 100%;
                            height: 300px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: #f8f9fa;
                            margin-bottom: 15px;
                            position: relative;
                            border-radius: 4px;
                            overflow: hidden;
                        ">
                            <img 
                                id="imagen-principal-simple" 
                                src="${imagenProducto}" 
                                alt="${producto.nombre}"
                                style="max-width: 100%; max-height: 100%; object-fit: contain;"
                                onerror="this.src='https://dummyimage.com/400x400/cccccc/ffffff&text=${encodeURIComponent(producto.nombre)}'"
                            >
                        </div>
                    </div>
                    
                    <!-- Columna de información -->
                    <div style="flex: 1; min-width: 300px;">
                        <h2 style="font-size: 24px; margin-top: 0;">${producto.nombre}</h2>
                        <p style="font-size: 24px; font-weight: bold;">$${producto.precio.toLocaleString()}</p>
                        
                        <div style="margin: 20px 0;">
                            <p style="line-height: 1.6; color: #666;">
                                ${producto.descripcion || 'Sin descripción disponible'}
                            </p>
                        </div>
                        
                        <button 
                            id="btn-agregar-simple"
                            style="
                                width: 100%;
                                padding: 12px;
                                background: #e6e1d6;
                                border: none;
                                border-radius: 4px;
                                margin-top: 20px;
                                cursor: pointer;
                                font-weight: bold;
                            "
                        >AGREGAR AL CARRITO</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Eliminar cualquier modal existente
    document.querySelectorAll('[id^="modal-"]').forEach(modal => {
        modal.remove();
    });
    
    // Agregar el nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
    
    // Evento para cerrar el modal
    document.getElementById('btn-cerrar-modal-simple').addEventListener('click', function() {
        document.getElementById('modal-producto-simple').remove();
        document.body.style.overflow = 'auto';
    });
    
    // Evento para agregar al carrito
    document.getElementById('btn-agregar-simple').addEventListener('click', function() {
        try {
            // Agregar producto al carrito
            agregarAlCarritoSimple(producto);
            
            // Cerrar modal
            document.getElementById('modal-producto-simple').remove();
            document.body.style.overflow = 'auto';
            
            // Mostrar mensaje
            mostrarMensajeSimple('Producto agregado al carrito');
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
        }
    });
}

// Función para agregar al carrito simplificada
function agregarAlCarritoSimple(producto) {
    try {
        // Obtener carrito actual
        let carrito = [];
        try {
            const carritoStr = localStorage.getItem('carrito');
            if (carritoStr) {
                carrito = JSON.parse(carritoStr);
            }
        } catch (e) {
            console.error('Error al obtener carrito:', e);
        }
        
        // Verificar si el producto ya está en el carrito
        let encontrado = false;
        for (let i = 0; i < carrito.length; i++) {
            if (carrito[i] && carrito[i].id === producto.id) {
                carrito[i].cantidad = (carrito[i].cantidad || 0) + 1;
                encontrado = true;
                break;
            }
        }
        
        // Si no está en el carrito, agregarlo
        if (!encontrado) {
            carrito.push({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1
            });
        }
        
        // Guardar carrito
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Actualizar contador
        actualizarContadorSimple();
        
        return true;
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        return false;
    }
}

// Función para actualizar contador
function actualizarContadorSimple() {
    try {
        // Obtener carrito
        let carrito = [];
        try {
            const carritoStr = localStorage.getItem('carrito');
            if (carritoStr) {
                carrito = JSON.parse(carritoStr);
            }
        } catch (e) {
            console.error('Error al obtener carrito:', e);
        }
        
        // Calcular total
        let total = 0;
        carrito.forEach(item => {
            if (item && item.cantidad) {
                total += item.cantidad;
            }
        });
        
        // Actualizar contador en el DOM
        const contador = document.getElementById('contador-carrito');
        if (contador) {
            contador.textContent = total.toString();
            contador.style.display = total > 0 ? 'block' : 'none';
        }
    } catch (error) {
        console.error('Error al actualizar contador:', error);
    }
}

// Función para mostrar mensaje
function mostrarMensajeSimple(mensaje) {
    try {
        // Crear elemento para el mensaje
        const mensajeElement = document.createElement('div');
        mensajeElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 99999;
        `;
        mensajeElement.textContent = mensaje;
        
        // Agregar al DOM
        document.body.appendChild(mensajeElement);
        
        // Eliminar después de 2 segundos
        setTimeout(() => {
            if (mensajeElement.parentNode) {
                mensajeElement.parentNode.removeChild(mensajeElement);
            }
        }, 2000);
    } catch (error) {
        console.error('Error al mostrar mensaje:', error);
    }
}

// Función para corregir todas las imágenes
function corregirTodasLasImagenes() {
    try {
        // Buscar todas las imágenes en la página
        const todasLasImagenes = document.querySelectorAll('img');
        
        console.log('Corrigiendo imágenes:', todasLasImagenes.length);
        
        // Solo reemplazar imágenes con errores
        todasLasImagenes.forEach(img => {
            // Agregar manejador de errores a todas las imágenes
            if (!img.hasAttribute('data-error-handler')) {
                img.setAttribute('data-error-handler', 'true');
                img.onerror = function() {
                    // Si la imagen falla, usar una imagen por defecto
                    const altOriginal = this.alt || 'Imagen';
                    this.src = 'https://dummyimage.com/300x300/cccccc/ffffff&text=' + encodeURIComponent(altOriginal);
                };
            }
        });
    } catch (error) {
        console.error('Error al corregir imágenes:', error);
    }
}

// Función para reemplazar el evento click en todos los productos
function reemplazarEventosClick() {
    try {
        // Buscar todos los elementos de producto
        const productos = document.querySelectorAll('.producto');
        
        console.log('Reemplazando eventos click en productos:', productos.length);
        
        // Reemplazar eventos click
        productos.forEach(producto => {
            // Eliminar eventos existentes
            const nuevoProducto = producto.cloneNode(true);
            producto.parentNode.replaceChild(nuevoProducto, producto);
            
            // Agregar nuevo evento click
            nuevoProducto.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                // Obtener datos del producto
                const id = this.getAttribute('data-id');
                const nombre = this.querySelector('h3')?.textContent || 'Producto';
                const precioText = this.querySelector('.precio')?.textContent || '0';
                const precio = parseFloat(precioText.replace(/[^\d.]/g, '')) || 0;
                
                // Obtener la imagen original
                const imagen = this.querySelector('img')?.src || '';
                
                // Crear objeto producto
                const productoObj = {
                    id: id || Date.now().toString(),
                    nombre: nombre,
                    precio: precio,
                    imagen: imagen,
                    descripcion: 'Descripción no disponible'
                };
                
                // Mostrar detalles
                mostrarDetallesProductoSimple(productoObj);
            });
        });
    } catch (error) {
        console.error('Error al reemplazar eventos click:', error);
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, aplicando solución final...');
    
    // Corregir imágenes y eventos
    corregirTodasLasImagenes();
    reemplazarEventosClick();
    actualizarContadorSimple();
    
    // Ejecutar periódicamente para asegurar que se aplique a nuevos elementos
    setInterval(corregirTodasLasImagenes, 2000);
    setInterval(reemplazarEventosClick, 2000);
});

// Reemplazar funciones globales
window.mostrarDetallesProducto = mostrarDetallesProductoSimple;
window.agregarAlCarrito = agregarAlCarritoSimple;
window.actualizarContadorCarrito = actualizarContadorSimple;

console.log('Solución final cargada correctamente'); 