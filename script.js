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
        console.log('Cargando productos:', productos); // Para depuración
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
                    <button class="btn-agregar" onclick="event.stopPropagation(); agregarAlCarrito(${JSON.stringify(producto).replace(/"/g, '&quot;')})">
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
        
        // Obtener todas las imágenes del producto
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
                                <button class="btn-agregar" onclick="agregarAlCarrito(${JSON.stringify(producto).replace(/"/g, '&quot;')})">
                                    Agregar al Carrito
                                </button>
                    </div>
                        </div>
                </div>
            </div>
        </div>
    `;

        // Agregar el modal al DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Manejar el cierre del modal
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

// Función para cargar el hero
function cargarHero() {
    try {
        console.log('Cargando hero...');
        
        // Imagen por defecto en SVG con el estilo de La Sureña Deco
        const defaultImage = `data:image/svg+xml,${encodeURIComponent('<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#8B7355"/><text x="50%" y="50%" font-family="Arial" font-size="48" fill="#ffffff" text-anchor="middle">LA SUREÑA DECO</text></svg>')}`;
        
        // Obtener datos del localStorage o usar valores por defecto
        const heroData = {
            titulo: 'LA SUREÑA DECO',
            subtitulo: 'Decoración para tu hogar',
            imagenes: [defaultImage, defaultImage, defaultImage]
        };

        // Actualizar contenido
        const heroSlides = document.querySelector('.hero-slides');
        const heroTitle = document.querySelector('.hero-content h1');
        const heroSubtitle = document.querySelector('.hero-content p');
        const heroDots = document.querySelector('.hero-dots');

        if (heroSlides && heroTitle && heroSubtitle && heroDots) {
            // Actualizar título y subtítulo
            heroTitle.textContent = heroData.titulo;
            heroSubtitle.textContent = heroData.subtitulo;

            // Actualizar slides
            heroSlides.innerHTML = heroData.imagenes.map((img, index) => `
                <div class="hero-slide ${index === 0 ? 'active' : ''}">
                    <img src="${img}" alt="Hero imagen ${index + 1}" onerror="this.src='${defaultImage}'">
                </div>
            `).join('');

            // Actualizar dots
            heroDots.innerHTML = heroData.imagenes.map((_, index) => `
                <span class="hero-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
            `).join('');

            // Iniciar carrusel
            iniciarCarrusel();
            console.log('Hero cargado exitosamente');
        }
    } catch (error) {
        console.error('Error al cargar el hero:', error);
    }
}

// Función para iniciar el carrusel
function iniciarCarrusel() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const totalSlides = slides.length;
    let autoplayInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (index + totalSlides) % totalSlides;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Configurar controles
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
            resetAutoplay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
            resetAutoplay();
        });
    }

    // Configurar dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetAutoplay();
        });
    });

    // Función para reiniciar el autoplay
    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    // Función para iniciar el autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
    }

    // Iniciar el carrusel
    showSlide(0);
    startAutoplay();
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

// Agregar al DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    cargarHero();
    cargarAnuncios();
});

// Escuchar cambios en localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'heroData') {
        cargarHero();
    } else if (e.key === 'anuncios') {
        cargarAnuncios();
    }
});

// Hacer funciones disponibles globalmente
window.cargarBanner = cargarBanner;
window.cargarProductos = cargarProductos;
window.mostrarDetallesProducto = mostrarDetallesProducto;
window.cambiarImagenPrincipal = cambiarImagenPrincipal;
window.cambiarImagenProducto = cambiarImagenProducto;

// Al final del archivo, actualizar las funciones globales disponibles
window.cargarHero = cargarHero;
window.cargarAnuncios = cargarAnuncios;
window.iniciarCarrusel = iniciarCarrusel;