// Versión completamente nueva del carrito
console.log('Cargando versión corregida del carrito...');

// Función para obtener el carrito de forma segura
function obtenerCarrito() {
    try {
        const carritoStr = localStorage.getItem('carrito');
        if (!carritoStr) return [];
        
        const carrito = JSON.parse(carritoStr);
        if (!Array.isArray(carrito)) return [];
        
        return carrito;
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        return [];
    }
}

// Función para guardar el carrito de forma segura
function guardarCarrito(carrito) {
    try {
        if (!Array.isArray(carrito)) carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        return true;
    } catch (error) {
        console.error('Error al guardar carrito:', error);
        return false;
    }
}

// Función para agregar un producto al carrito
function agregarProductoAlCarrito(producto) {
    try {
        if (!producto || !producto.id) {
            console.error('Producto inválido');
            return false;
        }
        
        const carrito = obtenerCarrito();
        const cantidad = producto.cantidad || 1;
        
        // Verificar si el producto ya está en el carrito
        let encontrado = false;
        for (let i = 0; i < carrito.length; i++) {
            if (carrito[i] && carrito[i].id == producto.id) {
                carrito[i].cantidad = (carrito[i].cantidad || 0) + cantidad;
                encontrado = true;
                break;
            }
        }
        
        // Si no está en el carrito, agregarlo
        if (!encontrado) {
            const productoParaCarrito = {
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                imagen: 'https://via.placeholder.com/100x100?text=Producto',
                cantidad: cantidad
            };
            carrito.push(productoParaCarrito);
        }
        
        guardarCarrito(carrito);
        actualizarContador();
        mostrarMensaje('Producto agregado al carrito');
        
        return true;
    } catch (error) {
        console.error('Error al agregar producto:', error);
        return false;
    }
}

// Función para actualizar el contador del carrito
function actualizarContador() {
    try {
        const carrito = obtenerCarrito();
        let total = 0;
        
        carrito.forEach(item => {
            if (item && item.cantidad) {
                total += item.cantidad;
            }
        });
        
        const contador = document.getElementById('contador-carrito');
        if (contador) {
            contador.textContent = total.toString();
            contador.style.display = total > 0 ? 'block' : 'none';
        }
    } catch (error) {
        console.error('Error al actualizar contador:', error);
    }
}

// Función para mostrar un mensaje temporal
function mostrarMensaje(mensaje, duracion = 2000) {
    try {
        // Eliminar mensaje existente si hay uno
        const mensajeExistente = document.getElementById('mensaje-carrito');
        if (mensajeExistente) {
            mensajeExistente.remove();
        }
        
        // Crear nuevo mensaje
        const mensajeElement = document.createElement('div');
        mensajeElement.id = 'mensaje-carrito';
        mensajeElement.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #333;
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 9999;
            animation: fadeIn 0.3s;
        `;
        mensajeElement.textContent = mensaje;
        
        document.body.appendChild(mensajeElement);
        
        // Eliminar después de la duración especificada
        setTimeout(() => {
            mensajeElement.style.animation = 'fadeOut 0.3s';
            setTimeout(() => {
                if (mensajeElement.parentNode) {
                    mensajeElement.parentNode.removeChild(mensajeElement);
                }
            }, 300);
        }, duracion);
    } catch (error) {
        console.error('Error al mostrar mensaje:', error);
    }
}

// Función para mostrar detalles de un producto (VERSIÓN FINAL SIN IMÁGENES)
function mostrarDetallesProducto(producto) {
    console.log('Mostrando producto (versión sin imágenes):', producto);
    
    // Verificar que el producto sea válido
    if (!producto || !producto.nombre) {
        console.error('Producto inválido');
        return;
    }
    
    // Crear el HTML del modal SIN IMÁGENES para evitar errores
    const modalHTML = `
        <div id="modal-producto" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
        ">
            <div style="
                background: white;
                width: 90%;
                max-width: 900px;
                border-radius: 8px;
                padding: 20px;
                position: relative;
            ">
                <button 
                    id="btn-cerrar-modal"
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
                    <!-- Columna de información -->
                    <div style="flex: 1; min-width: 300px;">
                        <h2 style="font-size: 24px; margin-top: 0;">${producto.nombre}</h2>
                        <p style="font-size: 24px; font-weight: bold;">$${producto.precio.toLocaleString()}</p>
                        
                        <!-- Cantidad -->
                        <div style="
                            display: flex;
                            align-items: center;
                            margin: 20px 0;
                        ">
                            <span style="margin-right: 10px; font-weight: bold;">Cantidad:</span>
                            <div style="
                                display: flex;
                                align-items: center;
                                border: 1px solid #ddd;
                                border-radius: 4px;
                                overflow: hidden;
                            ">
                                <button 
                                    id="btn-menos"
                                    style="
                                        width: 40px;
                                        height: 40px;
                                        background: #f8f9fa;
                                        border: none;
                                        font-size: 18px;
                                        cursor: pointer;
                                    "
                                >-</button>
                                <input 
                                    id="cantidad-producto"
                                    type="number" 
                                    value="1" 
                                    min="1" 
                                    max="${producto.stock || 10}"
                                    style="
                                        width: 50px;
                                        height: 40px;
                                        border: none;
                                        text-align: center;
                                        font-size: 16px;
                                    "
                                >
                                <button 
                                    id="btn-mas"
                                    style="
                                        width: 40px;
                                        height: 40px;
                                        background: #f8f9fa;
                                        border: none;
                                        font-size: 18px;
                                        cursor: pointer;
                                    "
                                >+</button>
                            </div>
                        </div>
                        
                        <!-- Descripción -->
                        <div style="margin: 20px 0; padding: 15px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee;">
                            <p style="line-height: 1.6; color: #666;">
                                ${producto.descripcion || 'Sin descripción disponible'}
                            </p>
                        </div>
                        
                        <button 
                            id="btn-agregar-producto"
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
    
    // Eliminar modal existente si hay uno
    const modalExistente = document.getElementById('modal-producto');
    if (modalExistente) {
        modalExistente.remove();
    }
    
    // Agregar el nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
    
    // Evento para cerrar el modal
    document.getElementById('btn-cerrar-modal').addEventListener('click', function() {
        document.getElementById('modal-producto').remove();
        document.body.style.overflow = 'auto';
    });
    
    // Eventos de cantidad
    document.getElementById('btn-menos').addEventListener('click', function() {
        const input = document.getElementById('cantidad-producto');
        input.value = Math.max(1, parseInt(input.value) - 1);
    });
    
    document.getElementById('btn-mas').addEventListener('click', function() {
        const input = document.getElementById('cantidad-producto');
        input.value = Math.min(producto.stock || 10, parseInt(input.value) + 1);
    });
    
    // Evento para agregar al carrito
    document.getElementById('btn-agregar-producto').addEventListener('click', function() {
        try {
            const cantidad = parseInt(document.getElementById('cantidad-producto').value) || 1;
            const productoConCantidad = {...producto, cantidad};
            agregarProductoAlCarrito(productoConCantidad);
            document.getElementById('modal-producto').remove();
            document.body.style.overflow = 'auto';
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
        }
    });
}

// Función para modificar las imágenes en la página principal
function corregirImagenesProductos() {
    try {
        // Buscar todas las imágenes de productos en la página principal
        const imagenesProductos = document.querySelectorAll('.producto img');
        
        console.log('Corrigiendo imágenes de productos:', imagenesProductos.length);
        
        // Reemplazar todas las imágenes con una imagen por defecto
        imagenesProductos.forEach(img => {
            // Verificar si la imagen es base64 o tiene una URL inválida
            if (img.src.startsWith('data:') || !img.src.startsWith('http')) {
                img.src = 'https://dummyimage.com/300x300/cccccc/ffffff&text=Producto';
                img.onerror = function() {
                    this.src = 'https://dummyimage.com/300x300/cccccc/ffffff&text=Producto';
                };
            }
        });
    } catch (error) {
        console.error('Error al corregir imágenes:', error);
    }
}

// Ejecutar la corrección de imágenes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando carrito y corrigiendo imágenes...');
    actualizarContador();
    corregirImagenesProductos();
    
    // También ejecutar la corrección cada vez que se carguen nuevos productos
    setInterval(corregirImagenesProductos, 2000);
});

// Reemplazar funciones globales
window.agregarProductoAlCarrito = agregarProductoAlCarrito;
window.mostrarDetallesProducto = mostrarDetallesProducto;
window.actualizarContadorCarrito = actualizarContador;

console.log('Versión corregida del carrito cargada correctamente'); 