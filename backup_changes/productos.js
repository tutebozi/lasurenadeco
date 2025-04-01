// Variables globales
let productos = [];
let imagenActualIndex = 0;
let productosInicializados = false;
const categorias = ['MESA', 'DECORACIÓN', 'HOGAR', 'COCINA', 'BAÑO', 'AROMAS', 'REGALOS'];

// Función para cargar productos
function cargarProductosCategoria(categoria = null) {
    if (!productosInicializados) {
        productos = JSON.parse(localStorage.getItem('productos') || '[]');
        productosInicializados = true;
    }

    const productosContainer = document.querySelector('.productos-container');
    if (!productosContainer) return;

    // Filtrar productos si hay categoría
    const productosMostrar = categoria ? 
        productos.filter(p => p.categoria === categoria) : 
        productos;

    // Limpiar el contenedor
    productosContainer.innerHTML = '';

    // Mostrar productos
    productosMostrar.forEach(producto => {
        const imagenUrl = producto.imagenes && producto.imagenes.length > 0 
            ? producto.imagenes[0] 
            : 'img/placeholder.jpg';

        const productoElement = document.createElement('div');
        productoElement.className = 'producto-card';
        productoElement.innerHTML = `
            <div class="producto-imagen" onclick="mostrarDetalleProducto(${producto.id})">
                <img src="${imagenUrl}" alt="${producto.nombre}" loading="lazy" class="imagen-principal">
            </div>
            <h3 class="producto-titulo">${producto.nombre}</h3>
            <p class="producto-precio">$${formatearPrecio(producto.precio)}</p>
            <p class="producto-categoria">${producto.categoria}</p>
            <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">
                Agregar al carrito
            </button>
        `;

        productosContainer.appendChild(productoElement);
    });
}

// Función para mostrar detalle del producto
function mostrarDetalleProducto(productoId) {
    const producto = productos.find(p => p.id === productoId);
    if (!producto) return;

    const modalProducto = document.getElementById('modal-producto');
    if (!modalProducto) return;

    imagenActualIndex = 0;
    const modalContenido = modalProducto.querySelector('.modal-contenido');
    
    modalContenido.innerHTML = `
        <div class="producto-imagenes-carousel">
            <div class="imagen-principal-container">
                <button class="flecha-navegacion flecha-izquierda" onclick="navegarImagen(-1)">❮</button>
                <img src="${producto.imagenes[0]}" alt="${producto.nombre}" loading="lazy">
                <button class="flecha-navegacion flecha-derecha" onclick="navegarImagen(1)">❯</button>
            </div>
            <div class="imagenes-miniaturas">
                ${producto.imagenes.map((imagen, index) => `
                    <img src="${imagen}" 
                         alt="${producto.nombre} - Imagen ${index + 1}" 
                         class="${index === 0 ? 'activa' : ''}"
                         loading="lazy"
                         onclick="cambiarImagenPrincipal(this.src, ${index})">
                `).join('')}
            </div>
        </div>
        <div class="producto-info">
            <span class="cerrar" onclick="cerrarModalProducto()">&times;</span>
            <h2>${producto.nombre}</h2>
            <p class="precio">$${formatearPrecio(producto.precio)}</p>
            <p class="descripcion">${producto.descripcion || ''}</p>
            <p class="categoria">Categoría: ${producto.categoria}</p>
            <p class="stock">Stock: ${producto.stock || 0} unidades</p>
            <button onclick="agregarAlCarrito(${producto.id})">
                Agregar al carrito
            </button>
        </div>
    `;

    modalProducto.style.display = 'block';
    setTimeout(() => modalProducto.style.opacity = '1', 10);
}

// Función para navegar entre imágenes
function navegarImagen(direccion) {
    const modalProducto = document.getElementById('modal-producto');
    const imagenes = modalProducto.querySelectorAll('.imagenes-miniaturas img');
    const totalImagenes = imagenes.length;
    
    imagenActualIndex = (imagenActualIndex + direccion + totalImagenes) % totalImagenes;
    const nuevaImagen = imagenes[imagenActualIndex].src;
    
    cambiarImagenPrincipal(nuevaImagen, imagenActualIndex);
}

// Función para cambiar la imagen principal
function cambiarImagenPrincipal(nuevaImagen, index) {
    const imagenPrincipal = document.querySelector('.imagen-principal-container img');
    const miniaturas = document.querySelectorAll('.imagenes-miniaturas img');
    
    imagenPrincipal.src = nuevaImagen;
    imagenActualIndex = index;
    
    miniaturas.forEach((miniatura, i) => {
        miniatura.classList.toggle('activa', i === index);
    });
}

// Función para cerrar el modal
function cerrarModalProducto() {
    const modalProducto = document.getElementById('modal-producto');
    modalProducto.style.opacity = '0';
    setTimeout(() => modalProducto.style.display = 'none', 300);
}

// Función para formatear precio
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CL').format(precio || 0);
}

// Inicializar eventos de categorías
function inicializarEventosCategorias() {
    document.querySelectorAll('nav ul li a').forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            const categoria = e.target.textContent;
            cargarProductosCategoria(categoria);
        });
    });
}

// Hacer las funciones disponibles globalmente
window.cargarProductosCategoria = cargarProductosCategoria;
window.mostrarDetalleProducto = mostrarDetalleProducto;
window.formatearPrecio = formatearPrecio;
window.cambiarImagenPrincipal = cambiarImagenPrincipal;
window.navegarImagen = navegarImagen;
window.cerrarModalProducto = cerrarModalProducto;
window.inicializarEventosCategorias = inicializarEventosCategorias; 