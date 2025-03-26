// Variables globales
let productos = [];
const categorias = ['MESA', 'DECORACIÓN', 'HOGAR', 'COCINA', 'BAÑO', 'AROMAS', 'REGALOS'];

// Función para cargar productos
async function cargarProductos(categoria = null) {
    try {
        // Obtener productos del localStorage o usar array vacío
        productos = JSON.parse(localStorage.getItem('productos')) || [];
        
        // Filtrar por categoría si se especifica
        const productosFiltrados = categoria ? 
            productos.filter(p => p.categoria === categoria) : 
            productos;

        const contenedor = document.querySelector('.productos-container');
        if (!contenedor) return;

        if (productosFiltrados.length === 0) {
            contenedor.innerHTML = '<p class="no-productos">No hay productos disponibles</p>';
            return;
        }

        // Crear una imagen temporal para verificar si placeholder.jpg existe
        const img = new Image();
        img.src = 'img/placeholder.jpg';
        const placeholderDefault = 'data:image/svg+xml;base64,' + btoa(`
            <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#f8f9fa"/>
                <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#495057" text-anchor="middle">
                    Imagen no disponible
                </text>
            </svg>
        `);

        contenedor.innerHTML = productosFiltrados.map(producto => `
            <div class="producto-card" onclick="mostrarDetallesProducto(${producto.id})">
                <img src="${producto.imagen || 'img/placeholder.jpg'}" 
                     alt="${producto.nombre}"
                     onerror="this.onerror=null; this.src='${placeholderDefault}'">
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p class="precio">$${formatearPrecio(producto.precio)}</p>
                    <p class="descripcion">${producto.descripcion}</p>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Función para mostrar detalles del producto
function mostrarDetallesProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    // Crear modal si no existe
    let modal = document.getElementById('modal-producto-detalle');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-producto-detalle';
        modal.className = 'modal-producto';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-contenido">
            <span class="cerrar" onclick="cerrarModalDetalle()">&times;</span>
            <div class="producto-detalle">
                <div class="producto-imagen">
                    <img src="${producto.imagen || 'img/placeholder.jpg'}" 
                         alt="${producto.nombre}"
                         onerror="this.src='img/placeholder.jpg'">
                </div>
                <div class="producto-info-detalle">
                    <h2>${producto.nombre}</h2>
                    <p class="precio">$${formatearPrecio(producto.precio)}</p>
                    <p class="descripcion">${producto.descripcion}</p>
                    <p class="categoria">Categoría: ${producto.categoria}</p>
                    <p class="stock">Stock disponible: ${producto.stock} unidades</p>
                    <div class="cantidad-container">
                        <label>Cantidad:</label>
                        <div class="cantidad-controls">
                            <button onclick="cambiarCantidad(-1)">-</button>
                            <input type="number" id="cantidad" value="1" min="1" max="${producto.stock}">
                            <button onclick="cambiarCantidad(1)">+</button>
                        </div>
                    </div>
                    <button class="btn-agregar" onclick="agregarAlCarritoDesdeModal(${producto.id})">
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Función para cerrar el modal de detalles
function cerrarModalDetalle() {
    const modal = document.getElementById('modal-producto-detalle');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Función para cambiar la cantidad en el modal
function cambiarCantidad(cambio) {
    const input = document.getElementById('cantidad');
    const nuevoValor = parseInt(input.value) + cambio;
    if (nuevoValor >= 1 && nuevoValor <= parseInt(input.max)) {
        input.value = nuevoValor;
    }
}

// Función para agregar al carrito desde el modal
function agregarAlCarritoDesdeModal(id) {
    const producto = productos.find(p => p.id === id);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    
    if (producto && cantidad > 0) {
        const productoParaCarrito = {
            ...producto,
            cantidad: cantidad
        };
        agregarAlCarrito(productoParaCarrito);
        cerrarModalDetalle();
    }
}

// Función para formatear precio
function formatearPrecio(precio) {
    return precio.toLocaleString('es-CL');
}

// Función para filtrar productos por categoría
function filtrarPorCategoria(categoria) {
    cargarProductos(categoria);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    
    // Agregar eventos a los enlaces de categorías
    document.querySelectorAll('nav ul li a').forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            const categoria = e.target.textContent;
            filtrarPorCategoria(categoria);
        });
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('modal-producto-detalle');
        if (e.target === modal) {
            cerrarModalDetalle();
        }
    });
});

// Hacer las funciones disponibles globalmente
window.cargarProductos = cargarProductos;
window.filtrarPorCategoria = filtrarPorCategoria;
window.formatearPrecio = formatearPrecio;
window.mostrarDetallesProducto = mostrarDetallesProducto;
window.cerrarModalDetalle = cerrarModalDetalle;
window.cambiarCantidad = cambiarCantidad;
window.agregarAlCarritoDesdeModal = agregarAlCarritoDesdeModal; 