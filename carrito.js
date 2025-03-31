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
    cerrarModalLogin(); // Cerrar el modal de login si está abierto
    cerrarModalRegistro(); // Cerrar el modal de registro si está abierto
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

// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
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
            imagen = 'https://dummyimage.com/300x300/cccccc/ffffff&text=' + encodeURIComponent(producto.nombre);
        }

        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: imagen,
            cantidad: 1
        });
    }
    
    guardarCarrito();
    actualizarContadorCarrito();
    mostrarMensaje('Producto agregado al carrito', 'success');
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
    
    if (!usuarioActual) {
        mostrarMensaje('Debes iniciar sesión para finalizar la compra', 'error');
        cerrarCarrito();
        mostrarModalLogin();
        return;
    }
    
    // Aquí iría la lógica para procesar el pago
    alert('¡Gracias por tu compra! Pronto implementaremos el proceso de pago.');
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
    cerrarCarrito();
}

// Función para guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    contador.textContent = total;
    contador.style.display = total > 0 ? 'block' : 'none';
}

// Función para actualizar la visualización del carrito
function actualizarCarrito() {
    const contenedor = document.getElementById('carrito-items');
    const totalElement = document.getElementById('carrito-total');
    
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
    return new Intl.NumberFormat('es-CL').format(precio);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
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

// Módulo del carrito
const CarritoModule = {
    carrito: [],

    init() {
        console.log('Inicializando CarritoModule...');
        this.carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        this.actualizarContador();
        
        // Agregar evento de clic al icono del carrito
        document.addEventListener('DOMContentLoaded', () => {
            const cartIcon = document.querySelector('.cart-icon, [class*="cart"]');
            if (cartIcon) {
                cartIcon.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.abrirCarrito();
                });
            }
            this.actualizarContador();
        });
    },

    agregarProducto(producto) {
        if (!producto || !producto.id) {
            console.error('Producto inválido:', producto);
            return;
        }

        try {
            const itemExistente = this.carrito.find(item => item.id === producto.id);
            
            if (itemExistente) {
                itemExistente.cantidad = (itemExistente.cantidad || 1) + 1;
            } else {
                // Obtener la imagen de forma segura
                let imagen = producto.imagen;
                if (!imagen && producto.imagenes) {
                    imagen = Array.isArray(producto.imagenes) ? producto.imagenes[0] : producto.imagenes;
                }
                if (!imagen) {
                    imagen = 'https://dummyimage.com/300x300/cccccc/ffffff&text=' + encodeURIComponent(producto.nombre);
                }

                this.carrito.push({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: Number(producto.precio),
                    imagen: imagen,
                    cantidad: 1
                });
            }
            
            this.guardarCarrito();
            this.mostrarMensaje('¡Producto agregado al carrito!');
        } catch (error) {
            console.error('Error al agregar producto:', error);
            this.mostrarMensaje('Error al agregar el producto', 'error');
        }
    },

    actualizarContador() {
        const contador = document.querySelector('.cart-count');
        if (contador) {
            const totalItems = this.carrito.reduce((total, item) => total + (Number(item.cantidad) || 0), 0);
            contador.textContent = totalItems;
            contador.style.display = totalItems > 0 ? 'block' : 'none';
        }
    },

    mostrarMensaje(mensaje, tipo = 'success') {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = `mensaje-flotante mensaje-${tipo}`;
        mensajeDiv.textContent = mensaje;
        document.body.appendChild(mensajeDiv);
        
        setTimeout(() => {
            mensajeDiv.classList.add('fadeout');
            setTimeout(() => mensajeDiv.remove(), 300);
        }, 2000);
    },

    abrirCarrito() {
        const modalCarrito = document.createElement('div');
        modalCarrito.className = 'modal-carrito';
        
        try {
            const total = this.carrito.reduce((sum, item) => {
                const precio = Number(item.precio) || 0;
                const cantidad = Number(item.cantidad) || 0;
                return sum + (precio * cantidad);
            }, 0);
            
            modalCarrito.innerHTML = `
                <div class="modal-contenido-carrito">
                    <div class="carrito-header">
                        <h2>Tu Carrito</h2>
                        <button class="btn-cerrar" onclick="CarritoModule.cerrarCarrito()">&times;</button>
                    </div>
                    <div class="items-carrito">
                        ${this.carrito.length === 0 ? '<p class="carrito-vacio">Tu carrito está vacío</p>' : 
                            this.carrito.map(item => {
                                const imagenUrl = item.imagen || 'https://dummyimage.com/300x300/cccccc/ffffff&text=Imagen+no+disponible';
                                const precio = Number(item.precio) || 0;
                                const cantidad = Number(item.cantidad) || 0;
                                
                                return `
                                    <div class="item-carrito">
                                        <img 
                                            src="${imagenUrl}" 
                                            alt="${item.nombre}"
                                            onerror="this.src='https://dummyimage.com/300x300/cccccc/ffffff&text=Imagen+no+disponible'"
                                        >
                                        <div class="item-info">
                                            <h3>${item.nombre}</h3>
                                            <p class="precio">$${precio.toLocaleString()}</p>
                                            <div class="cantidad-controles">
                                                <button onclick="CarritoModule.cambiarCantidad('${item.id}', -1)">-</button>
                                                <span>${cantidad}</span>
                                                <button onclick="CarritoModule.cambiarCantidad('${item.id}', 1)">+</button>
                                            </div>
                                        </div>
                                        <button class="eliminar-item" onclick="CarritoModule.eliminarProducto('${item.id}')">&times;</button>
                                    </div>
                                `;
                            }).join('')
                        }
                    </div>
                    ${this.carrito.length > 0 ? `
                        <div class="carrito-footer">
                            <div class="total">
                                <span>Total:</span>
                                <span>$${total.toLocaleString()}</span>
                            </div>
                            <button class="btn-finalizar" onclick="CarritoModule.finalizarCompra()">Finalizar Compra</button>
                            <button class="btn-vaciar" onclick="CarritoModule.vaciarCarrito()">Vaciar Carrito</button>
                        </div>
                    ` : ''}
                </div>
            `;
            
            document.body.appendChild(modalCarrito);
        } catch (error) {
            console.error('Error al abrir el carrito:', error);
            this.mostrarMensaje('Error al abrir el carrito', 'error');
        }
    },

    cerrarCarrito() {
        const modalCarrito = document.querySelector('.modal-carrito');
        if (modalCarrito) {
            modalCarrito.remove();
        }
    },

    cambiarCantidad(id, cambio) {
        const item = this.carrito.find(item => item.id === id);
        
        if (item) {
            item.cantidad = Math.max(1, (Number(item.cantidad) || 1) + cambio);
            this.guardarCarrito();
            this.actualizarVistaCarrito();
        }
    },

    eliminarProducto(id) {
        const index = this.carrito.findIndex(item => item.id === id);
        if (index > -1) {
            this.carrito.splice(index, 1);
            this.guardarCarrito();
            this.actualizarVistaCarrito();
            this.mostrarMensaje('Producto eliminado del carrito');
        }
    },

    actualizarVistaCarrito() {
        const modalCarrito = document.querySelector('.modal-carrito');
        if (modalCarrito) {
            modalCarrito.remove();
            this.abrirCarrito();
        }
    },

    vaciarCarrito() {
        if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
            this.carrito = [];
            this.guardarCarrito();
            this.actualizarVistaCarrito();
            this.mostrarMensaje('Carrito vaciado');
        }
    },

    finalizarCompra() {
        if (this.carrito.length === 0) {
            this.mostrarMensaje('El carrito está vacío', 'error');
            return;
        }
        
        alert('¡Gracias por tu compra! Pronto implementaremos el proceso de pago.');
        this.carrito = [];
        this.guardarCarrito();
        this.cerrarCarrito();
        this.mostrarMensaje('¡Compra finalizada con éxito!');
    },

    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
        this.actualizarContador();
    }
};

// Inicializar el módulo
CarritoModule.init();

// Exponer el módulo globalmente
window.CarritoModule = CarritoModule; 