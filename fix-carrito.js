// Al inicio del archivo
console.log('fix-carrito.js - Versión 1.0');

// Versión completamente nueva del carrito
console.log('Cargando nueva versión del carrito...');

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

// Función para agregar producto al carrito
function agregarProductoAlCarrito(producto) {
    try {
        console.log('Agregando producto al carrito:', producto);
        
        if (!producto || !producto.id) {
            console.error('Producto inválido');
            return false;
        }
        
        // Obtener carrito actual
        const carrito = obtenerCarrito();
        
        // Crear objeto del producto para el carrito
        const productoParaCarrito = {
            id: producto.id,
            nombre: producto.nombre || 'Producto sin nombre',
            precio: Number(producto.precio) || 0,
            imagen: producto.imagen || (producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0] : 'https://via.placeholder.com/50'),
            cantidad: 1
        };
        
        // Verificar si ya existe
        let productoExistente = false;
        for (let i = 0; i < carrito.length; i++) {
            if (carrito[i] && carrito[i].id === productoParaCarrito.id) {
                carrito[i].cantidad = (carrito[i].cantidad || 0) + 1;
                productoExistente = true;
                break;
            }
        }
        
        // Si no existe, agregarlo
        if (!productoExistente) {
            carrito.push(productoParaCarrito);
        }
        
        // Guardar carrito
        guardarCarrito(carrito);
        
        // Actualizar contador
        actualizarContador();
        
        // Mostrar mensaje
        mostrarMensaje('Producto agregado al carrito');
        
        return true;
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        return false;
    }
}

// Función para actualizar el contador
function actualizarContador() {
    try {
        const carrito = obtenerCarrito();
        let total = 0;
        
        for (let i = 0; i < carrito.length; i++) {
            if (carrito[i] && typeof carrito[i].cantidad === 'number') {
                total += carrito[i].cantidad;
            }
        }
        
        // Actualizar todos los posibles contadores
        const contadores = document.querySelectorAll('#contador-carrito, .cart-count');
        contadores.forEach(contador => {
            if (contador) {
                contador.textContent = total.toString();
                contador.style.display = total > 0 ? 'inline-block' : 'none';
            }
        });
        
        return total;
    } catch (error) {
        console.error('Error al actualizar contador:', error);
        return 0;
    }
}

// Función para mostrar mensaje
function mostrarMensaje(texto) {
    try {
        // Eliminar mensajes anteriores
        const mensajesAnteriores = document.querySelectorAll('.mensaje-flotante');
        mensajesAnteriores.forEach(m => m.remove());
        
        // Crear nuevo mensaje
        const mensaje = document.createElement('div');
        mensaje.className = 'mensaje-flotante';
        mensaje.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #4A4A4A;
            color: white;
            padding: 15px 25px;
            border-radius: 4px;
            z-index: 1000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        mensaje.textContent = texto;
        
        // Agregar al DOM
        document.body.appendChild(mensaje);
        
        // Eliminar después de 3 segundos
        setTimeout(() => {
            mensaje.remove();
        }, 3000);
    } catch (error) {
        console.error('Error al mostrar mensaje:', error);
    }
}

// Función para abrir el carrito
function abrirCarrito() {
    try {
        console.log('Abriendo carrito...');
        
        // Verificar si ya existe un modal
        let modalCarrito = document.getElementById('modal-carrito-nuevo');
        if (modalCarrito) {
            modalCarrito.style.display = 'flex';
            actualizarContenidoCarrito();
            return;
        }
        
        // Crear modal desde cero
        modalCarrito = document.createElement('div');
        modalCarrito.id = 'modal-carrito-nuevo';
        modalCarrito.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        
        // Contenido del modal
        modalCarrito.innerHTML = `
            <div class="carrito-contenido" style="
                background: white;
                padding: 20px;
                border-radius: 8px;
                max-width: 90%;
                width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            ">
                <button class="btn-cerrar-carrito" style="
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                ">×</button>
                
                <h2 style="margin-top: 0; margin-bottom: 20px; text-align: center;">Tu Carrito</h2>
                
                <div class="items-carrito" style="margin-bottom: 20px;">
                    <!-- Aquí se cargarán los items -->
                </div>
                
                <div class="carrito-total" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                ">
                    <h3 style="margin: 0;">Total: <span class="total-amount">$0</span></h3>
                    <div>
                        <button class="btn-finalizar" style="
                            padding: 10px 20px;
                            background: #2ecc71;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            margin-left: 10px;
                        ">Finalizar Compra</button>
                        <button class="btn-vaciar" style="
                            padding: 10px 20px;
                            background: #e74c3c;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                            margin-left: 10px;
                        ">Vaciar Carrito</button>
                    </div>
                </div>
            </div>
        `;
        
        // Agregar el modal al DOM
        document.body.appendChild(modalCarrito);
        document.body.style.overflow = 'hidden';
        
        // Actualizar contenido
        actualizarContenidoCarrito();
        
        // Agregar eventos
        // Cerrar modal
        modalCarrito.querySelector('.btn-cerrar-carrito').addEventListener('click', () => {
            cerrarCarrito();
        });
        
        // Cerrar al hacer clic fuera
        modalCarrito.addEventListener('click', (e) => {
            if (e.target === modalCarrito) {
                cerrarCarrito();
            }
        });
        
        // Finalizar compra
        modalCarrito.querySelector('.btn-finalizar').addEventListener('click', () => {
            finalizarCompra();
        });
        
        // Vaciar carrito
        modalCarrito.querySelector('.btn-vaciar').addEventListener('click', () => {
            vaciarCarrito();
        });
        
    } catch (error) {
        console.error('Error al abrir carrito:', error);
    }
}

// Función para cerrar el carrito
function cerrarCarrito() {
    try {
        const modalCarrito = document.getElementById('modal-carrito-nuevo');
        if (modalCarrito) {
            modalCarrito.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    } catch (error) {
        console.error('Error al cerrar carrito:', error);
    }
}

// Función para actualizar el contenido del carrito
function actualizarContenidoCarrito() {
    try {
        const modalCarrito = document.getElementById('modal-carrito-nuevo');
        if (!modalCarrito) return;
        
        const itemsContainer = modalCarrito.querySelector('.items-carrito');
        if (!itemsContainer) return;
        
        const carrito = obtenerCarrito();
        
        // Si el carrito está vacío
        if (carrito.length === 0) {
            itemsContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Tu carrito está vacío</p>';
            modalCarrito.querySelector('.total-amount').textContent = '$0';
            return;
        }
        
        // Calcular total
        let total = 0;
        
        // Generar HTML para cada item
        let itemsHTML = '';
        
        carrito.forEach(item => {
            if (!item) return;
            
            const precio = Number(item.precio) || 0;
            const cantidad = Number(item.cantidad) || 0;
            
            total += precio * cantidad;
            
            itemsHTML += `
                <div class="item-carrito" style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    border-bottom: 1px solid #eee;
                    margin-bottom: 10px;
                ">
                    <div style="display: flex; align-items: center;">
                        <img src="${item.imagen || 'https://via.placeholder.com/50'}" alt="${item.nombre}" style="
                            width: 50px;
                            height: 50px;
                            object-fit: cover;
                            margin-right: 10px;
                            border-radius: 4px;
                        ">
                        <div>
                            <h3 style="margin: 0; font-size: 16px;">${item.nombre}</h3>
                            <p style="margin: 5px 0 0 0; color: #666;">$${precio.toLocaleString()} x ${cantidad}</p>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center;">
                        <button class="btn-menos" data-id="${item.id}" style="
                            background: #eee;
                            border: none;
                            width: 25px;
                            height: 25px;
                            border-radius: 50%;
                            cursor: pointer;
                            font-size: 14px;
                            margin-right: 5px;
                        ">-</button>
                        <span style="margin: 0 5px;">${cantidad}</span>
                        <button class="btn-mas" data-id="${item.id}" style="
                            background: #eee;
                            border: none;
                            width: 25px;
                            height: 25px;
                            border-radius: 50%;
                            cursor: pointer;
                            font-size: 14px;
                            margin-right: 10px;
                        ">+</button>
                        <button class="btn-eliminar" data-id="${item.id}" style="
                            background: #e74c3c;
                            color: white;
                            border: none;
                            width: 25px;
                            height: 25px;
                            border-radius: 50%;
                            cursor: pointer;
                            font-size: 14px;
                        ">×</button>
                    </div>
                </div>
            `;
        });
        
        // Actualizar el contenido
        itemsContainer.innerHTML = itemsHTML;
        
        // Actualizar el total
        modalCarrito.querySelector('.total-amount').textContent = `$${total.toLocaleString()}`;
        
        // Agregar eventos a los botones
        // Botones de menos
        modalCarrito.querySelectorAll('.btn-menos').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                cambiarCantidad(id, -1);
            });
        });
        
        // Botones de más
        modalCarrito.querySelectorAll('.btn-mas').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                cambiarCantidad(id, 1);
            });
        });
        
        // Botones de eliminar
        modalCarrito.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                eliminarDelCarrito(id);
            });
        });
        
    } catch (error) {
        console.error('Error al actualizar contenido del carrito:', error);
    }
}

// Función para cambiar la cantidad de un producto
function cambiarCantidad(id, delta) {
    try {
        const carrito = obtenerCarrito();
        
        for (let i = 0; i < carrito.length; i++) {
            if (carrito[i] && carrito[i].id == id) {
                carrito[i].cantidad = Math.max(1, (carrito[i].cantidad || 0) + delta);
                break;
            }
        }
        
        guardarCarrito(carrito);
        actualizarContador();
        actualizarContenidoCarrito();
        
    } catch (error) {
        console.error('Error al cambiar cantidad:', error);
    }
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(id) {
    try {
        let carrito = obtenerCarrito();
        
        carrito = carrito.filter(item => item && item.id != id);
        
        guardarCarrito(carrito);
        actualizarContador();
        actualizarContenidoCarrito();
        
    } catch (error) {
        console.error('Error al eliminar del carrito:', error);
    }
}

// Función para vaciar el carrito
function vaciarCarrito() {
    try {
        if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
            guardarCarrito([]);
            actualizarContador();
            actualizarContenidoCarrito();
            mostrarMensaje('Carrito vaciado');
        }
    } catch (error) {
        console.error('Error al vaciar carrito:', error);
    }
}

// Función para finalizar la compra
function finalizarCompra() {
    try {
        const carrito = obtenerCarrito();
        
        if (carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        
        // Aquí iría la lógica para procesar el pago
        alert('Redirigiendo al proceso de pago...');
        
    } catch (error) {
        console.error('Error al finalizar compra:', error);
    }
}

// Función para validar y limpiar URLs de imágenes
function limpiarUrl(url) {
    if (!url || typeof url !== 'string') {
        return null;
    }

    // Limpiar espacios en blanco
    url = url.trim();

    // Si es una data URL (base64), verificar que sea válida
    if (url.startsWith('data:')) {
        try {
            // Verificar que sea una data URL de imagen válida
            if (url.match(/^data:image\/(jpeg|jpg|png|gif|webp);base64,/)) {
                return url;
            }
        } catch (e) {
            console.error('Error al validar data URL:', e);
            return null;
        }
    }

    // Si es una URL normal, verificar que sea válida
    try {
        const urlObj = new URL(url);
        return url;
    } catch (e) {
        // Intentar arreglar URLs relativas o sin protocolo
        if (!url.startsWith('http')) {
            try {
                new URL('http://' + url);
                return 'http://' + url;
            } catch (e2) {
                console.error('URL inválida:', url);
                return null;
            }
        }
        return null;
    }
}

// Función para mostrar detalles de un producto
function mostrarDetallesProducto(producto) {
    console.log('Mostrando producto:', producto);
    
    // Verificar que el producto sea válido
    if (!producto || !producto.nombre) {
        console.error('Producto inválido');
        return;
    }
    
    // Usar solo una imagen por defecto para evitar errores
    const imagenPorDefecto = 'https://via.placeholder.com/400x400?text=Imagen+no+disponible';
    
    // Crear el HTML del modal
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
                    <!-- Columna de imágenes -->
                    <div style="flex: 1; min-width: 300px;">
                        <!-- Imagen principal -->
                        <div style="
                            width: 100%;
                            height: 400px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: #f8f9fa;
                            margin-bottom: 15px;
                            position: relative;
                        ">
                            <img 
                                id="imagen-principal" 
                                src="${imagenPorDefecto}" 
                                alt="${producto.nombre}"
                                style="max-width: 100%; max-height: 100%; object-fit: contain;"
                            >
                        </div>
                    </div>
                    
                    <!-- Columna de información -->
                    <div style="flex: 1; min-width: 300px;">
                        <h2 style="font-size: 24px; margin-top: 0;">${producto.nombre}</h2>
                        <p style="font-size: 24px; font-weight: bold;">$${producto.precio.toLocaleString()}</p>
                        
                        <!-- Resto del contenido... -->
                        
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
    
    // Evento para agregar al carrito
    document.getElementById('btn-agregar-producto').addEventListener('click', function() {
        try {
            agregarProductoAlCarrito(producto);
            document.getElementById('modal-producto').remove();
            document.body.style.overflow = 'auto';
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
        }
    });
}

// Función para verificar si una imagen existe
function verificarImagen(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// Modificar la función precargarImagenes
async function precargarImagenes(urls) {
    const imagenesValidas = [];
    for (const url of urls) {
        const existe = await verificarImagen(url);
        if (existe) {
            imagenesValidas.push(url);
        } else {
            console.error('Imagen no válida:', url);
        }
    }
    return imagenesValidas;
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando carrito...');
    actualizarContador();
});

// Reemplazar funciones globales
window.abrirCarrito = abrirCarrito;
window.cerrarCarrito = cerrarCarrito;
window.agregarProductoAlCarrito = agregarProductoAlCarrito;
window.mostrarDetallesProducto = mostrarDetallesProducto;
window.actualizarContadorCarrito = actualizarContador;

console.log('Nueva versión del carrito cargada correctamente'); 