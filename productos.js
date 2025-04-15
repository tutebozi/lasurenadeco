// Variables globales
let productos = [];
let imagenActualIndex = 0;
let categorias = JSON.parse(localStorage.getItem('categorias')) || ['MESA', 'DECORACIÓN', 'HOGAR', 'COCINA', 'BAÑO', 'AROMAS', 'REGALOS'];

// Escuchar mensajes del panel de administración
window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'categoriasUpdated') {
        console.log('Recibida actualización de categorías:', event.data.categorias);
        categorias = event.data.categorias;
        actualizarMenuCategorias();
    }
});

// Función para actualizar el menú de categorías
function actualizarMenuCategorias() {
    console.log('Actualizando menú de categorías');
    const nav = document.querySelector('nav ul');
    if (!nav) {
        console.error('No se encontró el elemento nav ul');
        return;
    }

    // Limpiar el menú actual
    nav.innerHTML = '';

    // Agregar todas las categorías al menú
    categorias.forEach(categoria => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = categoria;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            filtrarPorCategoria(categoria);
        });
        li.appendChild(a);
        nav.appendChild(li);
    });

    // Guardar las categorías actualizadas en localStorage
    localStorage.setItem('categorias', JSON.stringify(categorias));
}

// Inicializar el menú de categorías al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    actualizarMenuCategorias();
});

// Función para cargar productos
function cargarProductos() {
    const productosContainer = document.querySelector('.productos-container');
    if (!productosContainer) return;

    // Obtener productos y descuentos del localStorage
    productos = JSON.parse(localStorage.getItem('productos') || '[]');
    const descuentos = JSON.parse(localStorage.getItem('descuentos')) || {
        general: 0,
        productos: {}
    };

    // Limpiar el contenedor
    productosContainer.innerHTML = '';

    // Mostrar productos
    productos.forEach(producto => {
        const tieneMultiplesImagenes = producto.imagenes && producto.imagenes.length > 1;
        const imagenUrl = producto.imagenes && producto.imagenes.length > 0 
            ? producto.imagenes[0] 
            : 'img/placeholder.jpg';

        // Calcular descuento total (general + específico del producto)
        const descuentoProducto = descuentos.productos[producto.id] || 0;
        const descuentoTotal = Math.min(100, descuentos.general + descuentoProducto);
        
        // Calcular precio con descuento
        const precioOriginal = producto.precio;
        const precioConDescuento = precioOriginal * (1 - descuentoTotal / 100);

        const productoElement = document.createElement('div');
        productoElement.className = 'producto-card';
        productoElement.setAttribute('data-id', producto.id);
        productoElement.setAttribute('data-imagen-index', '0');
        
        // Crear el indicador de puntos para imágenes múltiples
        let indicadorPuntos = '';
        if (tieneMultiplesImagenes && producto.imagenes) {
            indicadorPuntos = '◉' + ' •'.repeat(producto.imagenes.length - 1);
        }
        
        productoElement.innerHTML = `
            <div class="producto-imagen" onclick="mostrarDetalleProducto(${producto.id})">
                ${descuentoTotal > 0 ? `<span class="descuento-badge">-${descuentoTotal}% OFF</span>` : ''}
                ${tieneMultiplesImagenes ? `<button class="flecha-card flecha-izquierda" onclick="event.stopPropagation(); navegarImagenCard(${producto.id}, -1)">❮</button>` : ''}
                <img src="${imagenUrl}" alt="${producto.nombre}" loading="lazy" class="imagen-principal">
                ${tieneMultiplesImagenes ? `<button class="flecha-card flecha-derecha" onclick="event.stopPropagation(); navegarImagenCard(${producto.id}, 1)">❯</button>` : ''}
                ${tieneMultiplesImagenes ? `<div class="indicador-imagenes">${indicadorPuntos}</div>` : ''}
            </div>
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.nombre}</h3>
                <div class="precio-container">
                    ${descuentoTotal > 0 ? `
                        <span class="precio-original">$${formatearPrecio(precioOriginal)}</span>
                        <span class="precio-actual">$${formatearPrecio(precioConDescuento)}</span>
                    ` : `
                        <span class="precio-actual">$${formatearPrecio(precioOriginal)}</span>
                    `}
                </div>
                <button class="btn-agregar" onclick="agregarAlCarrito(${producto.id})">
                    Agregar al carrito
                </button>
            </div>
        `;

        productosContainer.appendChild(productoElement);
    });
}

// Función para mostrar detalle del producto
function mostrarDetalleProducto(productoId) {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const producto = productos.find(p => p.id === productoId);
    const descuentos = JSON.parse(localStorage.getItem('descuentos')) || {
        general: 0,
        productos: {}
    };

    if (!producto) {
        console.error('Producto no encontrado');
        return;
    }

    // Calcular descuento total (general + específico del producto)
    const descuentoProducto = descuentos.productos[producto.id] || 0;
    const descuentoTotal = Math.min(100, descuentos.general + descuentoProducto);
    
    // Calcular precio con descuento
    const precioOriginal = producto.precio;
    const precioConDescuento = precioOriginal * (1 - descuentoTotal / 100);

    const modal = document.getElementById('modal-producto');
    const modalContent = document.querySelector('.modal-content');

    modalContent.innerHTML = `
        <span class="cerrar-modal">&times;</span>
        <div class="detalle-producto">
            <div class="galeria-producto">
                ${producto.imagenes && producto.imagenes.length > 0 ? `
                    <div class="imagen-principal-container">
                        <button class="flecha izquierda" onclick="navegarImagen(-1)">❮</button>
                        <img src="${producto.imagenes[0]}" alt="${producto.nombre}" class="imagen-principal">
                        <button class="flecha derecha" onclick="navegarImagen(1)">❯</button>
                    </div>
                    <div class="miniaturas">
                        ${producto.imagenes.map((img, index) => `
                            <img src="${img}" alt="Miniatura ${index + 1}" 
                                class="miniatura ${index === 0 ? 'activa' : ''}"
                                onclick="cambiarImagenPrincipal(${index})">
                        `).join('')}
                    </div>
                ` : `
                    <img src="${producto.imagen || 'img/placeholder.jpg'}" alt="${producto.nombre}" class="imagen-principal">
                `}
            </div>
            <div class="info-producto">
                <h2>${producto.nombre}</h2>
                <div class="precio-container">
                    ${descuentoTotal > 0 ? `
                        <span class="precio-original">$${formatearPrecio(precioOriginal)}</span>
                        <span class="precio-actual">$${formatearPrecio(precioConDescuento)}</span>
                    ` : `
                        <span class="precio-actual">$${formatearPrecio(precioOriginal)}</span>
                    `}
                </div>
                <p class="descripcion">${producto.descripcion || 'Sin descripción disponible'}</p>
                <div class="controles-cantidad">
                    <button onclick="ajustarCantidad(-1)">-</button>
                    <input type="number" id="cantidad" value="1" min="1" onchange="validarCantidad(this)">
                    <button onclick="ajustarCantidad(1)">+</button>
                </div>
                <button class="btn-agregar" onclick="agregarAlCarritoDesdeModal(${producto.id})">
                    Agregar al carrito
                </button>
            </div>
        </div>
    `;

    // Guardar el producto actual y sus imágenes en variables globales
    window.productoActual = producto;
    window.imagenActualIndex = 0;

    modal.style.display = "block";

    // Cerrar modal al hacer clic en la X o fuera del modal
    const span = document.getElementsByClassName("cerrar-modal")[0];
    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
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

// Función para formatear precio
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CL').format(precio || 0);
}

// Función para filtrar productos por categoría
function filtrarPorCategoria(categoria) {
    console.log('Filtrando por categoría:', categoria);
    const contenedorProductos = document.querySelector('.productos-container');
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    const descuentos = JSON.parse(localStorage.getItem('descuentos')) || {
        general: 0,
        productos: {}
    };
    
    // Filtrar productos por la categoría seleccionada
    const productosFiltrados = categoria === 'TODOS' ? 
        productos : 
        productos.filter(p => p.categoria === categoria);
    
    console.log('Productos filtrados:', productosFiltrados);

    // Limpiar el contenedor
    contenedorProductos.innerHTML = '';

    if (productosFiltrados.length === 0) {
        contenedorProductos.innerHTML = `
            <div class="no-productos">
                <p>No hay productos disponibles en esta categoría.</p>
            </div>
        `;
        return;
    }

    // Mostrar los productos filtrados
    productosFiltrados.forEach(producto => {
        // Obtener la imagen principal del producto
        let imagenPrincipal = '';
        if (producto.imagen) {
            // Si tiene una imagen única
            imagenPrincipal = producto.imagen;
        } else if (producto.imagenes && producto.imagenes.length > 0) {
            // Si tiene un array de imágenes
            imagenPrincipal = producto.imagenes[0];
        } else {
            // Si no tiene ninguna imagen
            imagenPrincipal = 'img/placeholder.jpg';
        }

        const tieneMultiplesImagenes = producto.imagenes && producto.imagenes.length > 1;

        // Calcular descuento total (general + específico del producto)
        const descuentoProducto = descuentos.productos[producto.id] || 0;
        const descuentoTotal = Math.min(100, descuentos.general + descuentoProducto);
        
        // Calcular precio con descuento
        const precioOriginal = producto.precio;
        const precioConDescuento = precioOriginal * (1 - descuentoTotal / 100);

        const productoElement = document.createElement('div');
        productoElement.className = 'producto-card';
        productoElement.onclick = () => mostrarDetalleProducto(producto.id);

        productoElement.innerHTML = `
            <div class="producto-imagen">
                ${descuentoTotal > 0 ? `<span class="descuento-badge">-${descuentoTotal}% OFF</span>` : ''}
                ${tieneMultiplesImagenes ? `<button class="flecha-card flecha-izquierda" onclick="event.stopPropagation(); navegarImagenCard(${producto.id}, -1)">❮</button>` : ''}
                <img src="${imagenPrincipal}" alt="${producto.nombre}" class="imagen-principal" loading="lazy">
                ${tieneMultiplesImagenes ? `<button class="flecha-card flecha-derecha" onclick="event.stopPropagation(); navegarImagenCard(${producto.id}, 1)">❯</button>` : ''}
                ${tieneMultiplesImagenes ? `<div class="indicador-imagenes">◉ ${' •'.repeat(producto.imagenes.length - 1)}</div>` : ''}
            </div>
            <div class="producto-detalles">
                <h3>${producto.nombre}</h3>
                <div class="precio-container">
                    ${descuentoTotal > 0 ? `
                        <span class="precio-original">$${formatearPrecio(precioOriginal)}</span>
                        <span class="precio-actual">$${formatearPrecio(precioConDescuento)}</span>
                    ` : `
                        <span class="precio-actual">$${formatearPrecio(precioOriginal)}</span>
                    `}
                </div>
                <button class="btn-agregar" onclick="event.stopPropagation(); agregarAlCarrito(${producto.id})">
                    Agregar al carrito
                </button>
            </div>
        `;

        contenedorProductos.appendChild(productoElement);
    });
}

// Función para navegar entre imágenes en las cards
function navegarImagenCard(productoId, direccion) {
    // Detener la propagación para evitar abrir el modal
    event.stopPropagation();
    
    const producto = productos.find(p => p.id === productoId);
    if (!producto || !producto.imagenes || producto.imagenes.length <= 1) return;
    
    const productoCard = document.querySelector(`.producto-card[data-id="${productoId}"]`);
    if (!productoCard) return;
    
    const imagenPrincipal = productoCard.querySelector('.imagen-principal');
    
    // Obtener el índice actual desde el atributo data
    let indiceActual = parseInt(productoCard.getAttribute('data-imagen-index') || '0');
    
    // Calcular el nuevo índice
    const nuevoIndice = (indiceActual + direccion + producto.imagenes.length) % producto.imagenes.length;
    
    // Cambiar la imagen
    imagenPrincipal.src = producto.imagenes[nuevoIndice];
    
    // Actualizar el índice en el atributo data
    productoCard.setAttribute('data-imagen-index', nuevoIndice.toString());
    
    // Actualizar el indicador visual
    const indicador = productoCard.querySelector('.indicador-imagenes');
    if (indicador && producto.imagenes) {
        const puntos = Array(producto.imagenes.length).fill('•');
        puntos[nuevoIndice] = '◉';
        indicador.textContent = puntos.join(' ');
    }
}

// Función para aplicar descuentos a los productos
function aplicarDescuentos() {
    const descuentos = JSON.parse(localStorage.getItem('descuentos')) || {
        general: 0,
        productos: {}
    };

    const productosContainer = document.querySelector('.productos-container');
    if (!productosContainer) return;

    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    
    productosContainer.innerHTML = productos.map(producto => {
        // Calcular descuento total (general + específico del producto)
        const descuentoProducto = descuentos.productos[producto.id] || 0;
        const descuentoTotal = Math.min(100, descuentos.general + descuentoProducto);
        
        // Calcular precio con descuento
        const precioOriginal = producto.precio;
        const precioConDescuento = precioOriginal * (1 - descuentoTotal / 100);
        
        return `
            <div class="producto-card">
                <div class="producto-imagen">
                    <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
                </div>
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <div class="precio-container">
                        ${descuentoTotal > 0 ? `
                            <span class="precio-original">$${formatearPrecio(precioOriginal)}</span>
                            <span class="precio-actual">$${formatearPrecio(precioConDescuento)}</span>
                        ` : `
                            <span class="precio-actual">$${formatearPrecio(precioOriginal)}</span>
                        `}
                    </div>
                    <button onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
                </div>
            </div>
        `;
    }).join('');
}

// Escuchar actualizaciones de descuentos
window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'descuentosUpdated') {
        // Actualizar los descuentos en localStorage
        localStorage.setItem('descuentos', JSON.stringify(event.data.descuentos));
        
        // Aplicar el nuevo color del badge
        if (event.data.css) {
            let styleElement = document.getElementById('descuento-badge-style');
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'descuento-badge-style';
                document.head.appendChild(styleElement);
            }
            styleElement.textContent = event.data.css;
        }
        
        // Actualizar la visualización de los productos
        cargarProductos();
    }
});

// Aplicar el color del badge al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    const descuentos = JSON.parse(localStorage.getItem('descuentos')) || {
        general: 0,
        productos: {},
        badgeColor: '#c41e3a'
    };

    // Crear el estilo CSS para el badge
    const css = `
        .descuento-badge {
            background-color: ${descuentos.badgeColor} !important;
            color: white !important;
            padding: 4px 8px !important;
            border-radius: 4px !important;
            position: absolute !important;
            top: 10px !important;
            right: 10px !important;
            font-weight: bold !important;
            font-size: 14px !important;
            z-index: 2 !important;
        }
    `;

    let styleElement = document.getElementById('descuento-badge-style');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'descuento-badge-style';
        document.head.appendChild(styleElement);
    }
    styleElement.textContent = css;

    // Cargar productos con los descuentos aplicados
    cargarProductos();
}); 