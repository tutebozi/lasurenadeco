// Variables globales
let productos = [];
const categorias = ['MESA', 'DECORACIÓN', 'HOGAR', 'COCINA', 'BAÑO', 'AROMAS', 'REGALOS'];

// Función para cargar productos
function cargarProductos() {
    const productosContainer = document.querySelector('.productos-container');
    if (!productosContainer) return;

    // Obtener productos del localStorage
    let productos = [];
    const productosGuardados = localStorage.getItem('productos');
    if (productosGuardados) {
        productos = JSON.parse(productosGuardados);
    }

    // Limpiar el contenedor
    productosContainer.innerHTML = '';

    // Mostrar productos
    productos.forEach(producto => {
        const imagenUrl = producto.imagenes && producto.imagenes.length > 0 
            ? producto.imagenes[0] 
            : 'img/placeholder.jpg';

        const productoElement = document.createElement('div');
        productoElement.className = 'producto-card';
        productoElement.innerHTML = `
            <div class="producto-imagen" onclick="mostrarDetalleProducto('${producto.id}')">
                <img src="${imagenUrl}" alt="${producto.nombre}" loading="lazy">
            </div>
            <h3 class="producto-titulo">${producto.nombre}</h3>
            <p class="producto-precio">$${formatearPrecio(producto.precio)}</p>
            <p class="producto-categoria">${producto.categoria}</p>
            <button class="btn-agregar" onclick="agregarAlCarrito('${producto.id}')">
                Agregar al carrito
            </button>
        `;

        productosContainer.appendChild(productoElement);
    });
}

// Función para mostrar detalle del producto
function mostrarDetalleProducto(id) {
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const producto = productos.find(p => p.id === parseInt(id) || p.id === id);
    if (!producto) {
        console.error('Producto no encontrado:', id);
        return;
    }

    // Crear el modal si no existe
    let modal = document.querySelector('.modal-producto');
    if (modal) {
        modal.remove();
    }
    
    modal = document.createElement('div');
    modal.className = 'modal-producto';
    
    let imagenesHTML = '';
    if (producto.imagenes && producto.imagenes.length > 0) {
        imagenesHTML = `
            <div class="producto-imagenes-carousel">
                <div class="imagen-principal">
                    <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
                </div>
                ${producto.imagenes.length > 1 ? `
                    <div class="imagenes-miniaturas">
                        ${producto.imagenes.map((img, index) => `
                            <img src="${img}" 
                                alt="${producto.nombre} - Imagen ${index + 1}"
                                onclick="cambiarImagenPrincipal(this.src)"
                                class="${index === 0 ? 'activa' : ''}">
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    modal.innerHTML = `
        <div class="modal-contenido">
            <span class="cerrar" onclick="cerrarModalProducto()">&times;</span>
            ${imagenesHTML}
            <div class="producto-info">
                <h2>${producto.nombre}</h2>
                <p class="precio">$${formatearPrecio(producto.precio)}</p>
                <p class="descripcion">${producto.descripcion}</p>
                <p class="categoria">Categoría: ${producto.categoria}</p>
                <p class="stock">Stock disponible: ${producto.stock}</p>
                <button class="btn-agregar" onclick="agregarAlCarrito('${producto.id}')">
                    Agregar al carrito
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Mostrar el modal con una pequeña animación
    requestAnimationFrame(() => {
        modal.style.display = 'block';
        modal.style.opacity = '0';
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
        });
    });

    // Agregar evento para cerrar el modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            cerrarModalProducto();
        }
    });
}

// Función para cambiar la imagen principal en el detalle del producto
function cambiarImagenPrincipal(src) {
    const imagenPrincipal = document.querySelector('.imagen-principal img');
    if (imagenPrincipal) {
        imagenPrincipal.src = src;
    }
    
    // Actualizar clase activa en miniaturas
    document.querySelectorAll('.imagenes-miniaturas img').forEach(img => {
        img.classList.toggle('activa', img.src === src);
    });
}

// Función para cerrar el modal de producto
function cerrarModalProducto() {
    const modal = document.querySelector('.modal-producto');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 200);
    }
}

// Función para formatear precio
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CL').format(precio || 0);
}

// Función para filtrar productos por categoría
function filtrarPorCategoria(categoria) {
    cargarProductos();
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
        const modal = document.querySelector('.modal-producto');
        if (e.target === modal) {
            cerrarModalProducto();
        }
    });
});

// Hacer las funciones disponibles globalmente
window.cargarProductos = cargarProductos;
window.filtrarPorCategoria = filtrarPorCategoria;
window.formatearPrecio = formatearPrecio;
window.cerrarModalProducto = cerrarModalProducto;
window.cambiarImagenPrincipal = cambiarImagenPrincipal; 