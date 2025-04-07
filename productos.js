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

    // Obtener productos del localStorage
    productos = JSON.parse(localStorage.getItem('productos') || '[]');

    // Limpiar el contenedor
    productosContainer.innerHTML = '';

    // Mostrar productos
    productos.forEach(producto => {
        const tieneMultiplesImagenes = producto.imagenes && producto.imagenes.length > 1;
        const imagenUrl = producto.imagenes && producto.imagenes.length > 0 
            ? producto.imagenes[0] 
            : 'img/placeholder.jpg';

        const productoElement = document.createElement('div');
        productoElement.className = 'producto-card';
        productoElement.setAttribute('data-id', producto.id);
        productoElement.setAttribute('data-imagen-index', '0'); // Inicializar índice de imagen
        
        // Crear el indicador de puntos para imágenes múltiples
        let indicadorPuntos = '';
        if (tieneMultiplesImagenes && producto.imagenes) {
            indicadorPuntos = '◉' + ' •'.repeat(producto.imagenes.length - 1);
        }
        
        productoElement.innerHTML = `
            <div class="producto-imagen" onclick="mostrarDetalleProducto(${producto.id})">
                ${tieneMultiplesImagenes ? `<button class="flecha-card flecha-izquierda" onclick="event.stopPropagation(); navegarImagenCard(${producto.id}, -1)">❮</button>` : ''}
                <img src="${imagenUrl}" alt="${producto.nombre}" loading="lazy" class="imagen-principal">
                ${tieneMultiplesImagenes ? `<button class="flecha-card flecha-derecha" onclick="event.stopPropagation(); navegarImagenCard(${producto.id}, 1)">❯</button>` : ''}
                ${tieneMultiplesImagenes ? `<div class="indicador-imagenes">${indicadorPuntos}</div>` : ''}
            </div>
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.nombre}</h3>
                <p class="producto-precio">$${formatearPrecio(producto.precio)}</p>
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
    const producto = productos.find(p => p.id === productoId);
    if (!producto) {
        console.error('Producto no encontrado:', productoId);
        return;
    }

    imagenActualIndex = 0;
    const modalProducto = document.getElementById('modal-producto');
    const modalContenido = modalProducto.querySelector('.modal-contenido');
    
    const tieneMultiplesImagenes = producto.imagenes && producto.imagenes.length > 1;
    
    modalContenido.innerHTML = `
        <div class="producto-imagenes-carousel">
            <div class="imagen-principal-container">
                ${tieneMultiplesImagenes ? `<button class="flecha-navegacion flecha-izquierda" onclick="navegarImagen(-1)">❮</button>` : ''}
                <img src="${producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0] : 'img/placeholder.jpg'}" 
                    alt="${producto.nombre}" loading="lazy">
                ${tieneMultiplesImagenes ? `<button class="flecha-navegacion flecha-derecha" onclick="navegarImagen(1)">❯</button>` : ''}
            </div>
            ${tieneMultiplesImagenes ? `
            <div class="imagenes-miniaturas">
                ${producto.imagenes && producto.imagenes.map((imagen, index) => `
                    <img src="${imagen}" 
                         alt="${producto.nombre} - Imagen ${index + 1}" 
                         class="${index === 0 ? 'activa' : ''}"
                         loading="lazy"
                         onclick="cambiarImagenPrincipal(this.src, ${index})">
                `).join('')}
            </div>
            ` : ''}
        </div>
        <div class="producto-info">
            <span class="cerrar" onclick="cerrarModalProducto()">&times;</span>
            <h2>${producto.nombre}</h2>
            <p class="precio">$${formatearPrecio(producto.precio)}</p>
            <p class="descripcion">${producto.descripcion || ''}</p>
            <p class="categoria">Categoría: ${producto.categoria || ''}</p>
            <p class="stock">Stock: ${producto.stock || 0} unidades</p>
            <button onclick="agregarAlCarrito(${producto.id})">
                Agregar al carrito
            </button>
        </div>
    `;

    // Mostrar el modal con una animación suave
    modalProducto.style.display = 'block';
    setTimeout(() => modalProducto.style.opacity = '1', 10);

    // Configurar el cierre del modal
    modalProducto.onclick = (e) => {
        if (e.target === modalProducto) {
            cerrarModalProducto();
        }
    };
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

// Función para filtrar productos por categoría
function filtrarPorCategoria(categoria) {
    console.log('Filtrando por categoría:', categoria);
    const contenedorProductos = document.querySelector('.productos-container');
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    
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

        const productoElement = document.createElement('div');
        productoElement.className = 'producto-card';
        productoElement.onclick = () => mostrarDetalleProducto(producto.id);

        productoElement.innerHTML = `
            <div class="producto-imagen">
                ${tieneMultiplesImagenes ? `<button class="flecha-card flecha-izquierda" onclick="event.stopPropagation(); navegarImagenCard(${producto.id}, -1)">❮</button>` : ''}
                <img src="${imagenPrincipal}" alt="${producto.nombre}" class="imagen-principal" loading="lazy">
                ${tieneMultiplesImagenes ? `<button class="flecha-card flecha-derecha" onclick="event.stopPropagation(); navegarImagenCard(${producto.id}, 1)">❯</button>` : ''}
                ${tieneMultiplesImagenes ? `<div class="indicador-imagenes">◉ ${' •'.repeat(producto.imagenes.length - 1)}</div>` : ''}
            </div>
            <div class="producto-detalles">
                <h3>${producto.nombre}</h3>
                <p class="producto-precio">$${formatearPrecio(producto.precio)}</p>
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