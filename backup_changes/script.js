// Función para cargar el banner
function cargarBanner() {
    try {
        const bannerImg = localStorage.getItem('bannerImage');
        const bannerContainer = document.querySelector('.banner-principal');
        
        if (bannerImg && bannerContainer) {
            bannerContainer.style.backgroundImage = `url('${bannerImg}')`;
            bannerContainer.style.display = 'block';
        }
    } catch (error) {
        console.error('Error al cargar el banner:', error);
    }
}

// Función para cargar productos
function cargarProductos(seccion) {
    try {
        const productos = JSON.parse(localStorage.getItem('productos')) || [];
        const contenedor = document.querySelector('.productos-container');
        
        if (!contenedor) {
            console.error('No se encontró el contenedor de productos');
            return;
        }
        
        let productosFiltrados = productos;
        if (seccion && seccion !== 'todos') {
            productosFiltrados = productos.filter(p => p.seccion === seccion);
        }
        
        contenedor.innerHTML = productosFiltrados.map(producto => {
            const imagenes = producto.imagenes || [producto.imagen];
            const imagenPrincipal = imagenes[0];
            
            return `
                <div class="producto-card" data-id="${producto.id}">
                    <div class="producto-imagen">
                        <img 
                            class="imagen-principal"
                            src="${imagenPrincipal}" 
                            alt="${producto.nombre}"
                            onerror="this.src='https://dummyimage.com/300x300/cccccc/ffffff&text=${encodeURIComponent(producto.nombre)}'"
                        >
                        ${imagenes.length > 1 ? `
                            <div class="miniaturas">
                                ${imagenes.map((img, idx) => `
                                    <img 
                                        src="${img}" 
                                        class="miniatura ${idx === 0 ? 'activa' : ''}"
                                        alt="${producto.nombre} - imagen ${idx + 1}"
                                        onclick="event.stopPropagation(); cambiarImagenProducto(this, '${producto.id}', ${idx})"
                                    >
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    <h3>${producto.nombre}</h3>
                    <p class="precio">$${producto.precio.toLocaleString()}</p>
                    <button class="btn-agregar" onclick="CarritoModule.agregarProducto({
                        id: '${producto.id}',
                        nombre: '${producto.nombre.replace(/'/g, "\\'")}',
                        precio: ${producto.precio},
                        imagen: '${imagenPrincipal}'
                    })">
                        Agregar al Carrito
                    </button>
                </div>
            `;
        }).join('');
        
        // Agregar evento click a las tarjetas de productos
        document.querySelectorAll('.producto-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.id;
                const producto = productosFiltrados.find(p => p.id.toString() === id);
                if (producto) {
                    mostrarDetallesProducto(producto);
                }
            });
        });
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Función para mostrar detalles del producto
function mostrarDetallesProducto(producto) {
    try {
        console.log('Mostrando detalles del producto:', producto);
        
        const imagenes = producto.imagenes || [producto.imagen];
        const imagenPrincipal = imagenes[0] || 'https://dummyimage.com/400x400/cccccc/ffffff&text=' + encodeURIComponent(producto.nombre);
        
        const modalHTML = `
            <div class="modal-producto">
                <div class="producto-detalle">
                    <button class="btn-cerrar">×</button>
                    <div class="producto-contenido">
                        <div class="imagen-principal">
                            <img 
                                src="${imagenPrincipal}" 
                                alt="${producto.nombre}"
                                onerror="this.src='https://dummyimage.com/400x400/cccccc/ffffff&text=${encodeURIComponent(producto.nombre)}'"
                            >
                            ${imagenes.length > 1 ? `
                                <div class="miniaturas">
                                    ${imagenes.map((img, index) => `
                                        <img 
                                            src="${img}" 
                                            alt="${producto.nombre} - imagen ${index + 1}"
                                            class="miniatura"
                                            onclick="cambiarImagenPrincipal(this, ${index})"
                                        >
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                        <div class="producto-info">
                            <h2>${producto.nombre}</h2>
                            <p class="precio">$${producto.precio.toLocaleString()}</p>
                            <p class="descripcion">${producto.descripcion || ''}</p>
                            <div class="acciones">
                                <button class="btn-agregar" onclick="CarritoModule.agregarProducto({
                                    id: '${producto.id}',
                                    nombre: '${producto.nombre.replace(/'/g, "\\'")}',
                                    precio: ${producto.precio},
                                    imagen: '${imagenPrincipal}'
                                })">
                                    Agregar al Carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        const modal = document.querySelector('.modal-producto');
        const btnCerrar = modal.querySelector('.btn-cerrar');
        
        btnCerrar.onclick = () => {
            modal.remove();
        };
        
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    } catch (error) {
        console.error('Error al mostrar detalles del producto:', error);
    }
}

// Función para cambiar la imagen principal
function cambiarImagenPrincipal(miniaturaImg, index) {
    const productoCard = miniaturaImg.closest('.producto-card');
    const imagenPrincipal = productoCard.querySelector('.producto-imagen > img');
    imagenPrincipal.src = miniaturaImg.src;
}

// Función para cambiar la imagen del producto
function cambiarImagenProducto(miniaturaElement, productoId, indiceImagen) {
    const productoCard = miniaturaElement.closest('.producto-card');
    const imagenPrincipal = productoCard.querySelector('.imagen-principal');
    const miniaturas = productoCard.querySelectorAll('.miniatura');
    
    // Actualizar imagen principal
    imagenPrincipal.src = miniaturaElement.src;
    
    // Actualizar estado activo de miniaturas
    miniaturas.forEach((m, idx) => {
        m.classList.toggle('activa', idx === indiceImagen);
    });
}

// Variables globales para el texto en movimiento
let textoElement = null;

// Función que crea y maneja el texto en movimiento
function cargarTextoMovimiento() {
    const container = document.querySelector('.banner-texto-container');
    if (!container) return;

    const textoMovimiento = localStorage.getItem('textoMovimiento') || '¡Bienvenidos a LA SUREÑA DECO!';
    container.innerHTML = `<marquee class="texto-movimiento">${textoMovimiento}</marquee>`;
}

// Función para cargar el hero
function cargarHero() {
    const heroSlides = document.querySelector('.hero-slides');
    if (!heroSlides) return;

    try {
        const heroData = localStorage.getItem('heroData');
        let imagenes = [];

        if (heroData) {
            const data = JSON.parse(heroData);
            if (data.imagenes && Array.isArray(data.imagenes)) {
                imagenes = data.imagenes.filter(img => img);
            }
        }

        if (imagenes.length === 0) {
            imagenes = ['default-hero.jpg'];
        }

        heroSlides.innerHTML = imagenes.map((imagen, index) => `
            <div class="hero-slide ${index === 0 ? 'active' : ''}" style="transform: translateX(${index === 0 ? 0 : 100}%)">
                <img src="${imagen}" alt="Hero imagen ${index + 1}">
            </div>
        `).join('');

    } catch (error) {
        console.error('Error al cargar el hero:', error);
        heroSlides.innerHTML = '<div class="hero-slide active"><img src="default-hero.jpg" alt="Hero por defecto"></div>';
    }
}

// Función para cargar anuncios
function cargarAnuncios() {
    try {
        const anuncios = JSON.parse(localStorage.getItem('anuncios')) || [];
        const bannerTexto = document.querySelector('.banner-texto-container');
        
        if (bannerTexto && anuncios.length > 0) {
            bannerTexto.innerHTML = `
                <div class="banner-texto">
                    ${anuncios.map(anuncio => `<span>${anuncio}</span>`).join('')}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error al cargar anuncios:', error);
    }
}

// Inicialización única
let initialized = false;

document.addEventListener('DOMContentLoaded', function() {
    if (initialized) return;
    initialized = true;
    
    console.log('Iniciando carga de la página...');
    
    // Cargar componentes principales
    cargarHero();
    cargarTextoMovimiento();
    cargarProductosCategoria();
    inicializarEventosCategorias();
    
    console.log('Carga inicial completada');
});

// Exportar funciones necesarias
window.cargarBanner = cargarBanner;
window.mostrarDetallesProducto = mostrarDetallesProducto;
window.cambiarImagenPrincipal = cambiarImagenPrincipal;
window.cambiarImagenProducto = cambiarImagenProducto;

