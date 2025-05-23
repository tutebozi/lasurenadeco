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
        const productosContainer = document.querySelector('.productos-container');
        if (!productosContainer) return;

        // Limpiar el contenedor
        productosContainer.innerHTML = '';

        // Obtener productos del localStorage
        let productos = [];
        const productosGuardados = localStorage.getItem('productos');
        
        if (productosGuardados) {
            productos = JSON.parse(productosGuardados);
            
            // Filtrar por sección si se especifica
            if (seccion && seccion !== 'todos') {
                productos = productos.filter(p => p.categoria === seccion);
            }
        }

        if (productos.length === 0) {
            productosContainer.innerHTML = '<div class="no-productos"><p>No hay productos disponibles en esta categoría.</p></div>';
            return;
        }
        
        productos.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'producto-card';
            
            // Validar y preparar las imágenes
            let imagenes = [];
            if (producto.imagenes && Array.isArray(producto.imagenes)) {
                imagenes = producto.imagenes.filter(img => validarURL(img));
            }
            
            // Si no hay imágenes válidas, usar imagen por defecto
            if (imagenes.length === 0) {
                imagenes = [carouselState.defaultImage];
            }

            card.innerHTML = `
                    <div class="producto-imagen">
                    <img src="${imagenes[0]}" alt="${producto.nombre}" class="imagen-principal" 
                         onerror="this.onerror=null; this.src='${carouselState.defaultImage}';">
                        ${imagenes.length > 1 ? `
                        <button class="flecha-card flecha-izquierda" onclick="cambiarImagenProducto(this.parentElement, '${producto.id}', 'prev')">&lt;</button>
                        <button class="flecha-card flecha-derecha" onclick="cambiarImagenProducto(this.parentElement, '${producto.id}', 'next')">&gt;</button>
                        ` : ''}
                    </div>
                <div class="producto-detalles">
                    <h3>${producto.nombre}</h3>
                    <p class="producto-precio">$${producto.precio}</p>
                    <p class="descripcion">${producto.descripcion || ''}</p>
                    <button class="btn-agregar" onclick="agregarAlCarrito('${producto.id}')">Agregar al carrito</button>
                </div>
            `;

            productosContainer.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        const productosContainer = document.querySelector('.productos-container');
        if (productosContainer) {
            productosContainer.innerHTML = '<div class="error-mensaje">Error al cargar los productos. Por favor, intente más tarde.</div>';
        }
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
let animacionID = null;
let posicionTexto = 0;
let textoElement = null;
let velocidadTexto = 2; // píxeles por frame

// Función que crea y maneja el texto en movimiento sin duplicarlo
function cargarTextoMovimiento() {
    try {
        // Cancelar cualquier animación existente
        if (animacionID) {
            cancelAnimationFrame(animacionID);
            animacionID = null;
        }
        
        const textoMovimiento = localStorage.getItem('textoMovimiento') || '¡Bienvenidos a LA SUREÑA DECO! Descuentos especiales en todos nuestros productos';
        const container = document.querySelector('.banner-texto-container');
        
        if (!container) {
            console.error('No se encontró el contenedor del banner');
            return;
        }
        
        // Limpiar el contenedor
        container.innerHTML = '';
        
        // Crear solo un elemento de texto
        textoElement = document.createElement('div');
        textoElement.className = 'texto-movimiento';
        textoElement.innerHTML = textoMovimiento;
        container.appendChild(textoElement);
        
        // Calcular dimensiones
        const textoWidth = textoElement.offsetWidth;
        const containerWidth = container.offsetWidth;
        
        // Iniciar posición (fuera de la pantalla a la derecha)
        posicionTexto = containerWidth;
        textoElement.style.left = posicionTexto + 'px';
        
        console.log('Texto inicializado. Ancho:', textoWidth, 'Contenedor:', containerWidth);
        
        // Función para animar el texto usando requestAnimationFrame
        function animar() {
            // Mover el texto a velocidad constante
            posicionTexto -= velocidadTexto;
            
            // Cuando el texto salga completamente por la izquierda, reiniciar desde la derecha
            if (posicionTexto < -textoWidth) {
                posicionTexto = containerWidth;
            }
            
            // Aplicar la posición
            textoElement.style.left = posicionTexto + 'px';
            
            // Continuar la animación
            animacionID = requestAnimationFrame(animar);
        }
        
        // Iniciar la animación
        animacionID = requestAnimationFrame(animar);
        
    } catch (error) {
        console.error('Error al inicializar el texto en movimiento:', error);
    }
}

function validarURL(url) {
    if (!url) return false;
    
    // Validar URLs de data:image
    if (url.startsWith('data:image/')) {
        return url.includes('base64,');
    }
    
    // Validar URLs HTTP/HTTPS
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Estado global del carrusel
const carouselState = {
    defaultImage: '/lasurenadeco/img/placeholder.jpg',
    currentSlide: 0,
    slides: [],
    autoplayInterval: null
};

// Función para cargar el hero
function cargarHero() {
    console.log('Imágenes a cargar en el hero:', 1);
    const heroData = {
        slides: [
            {
                imagen: '/lasurenadeco/img/hero1.jpg',
                titulo: 'Bienvenidos a LA SUREÑA DECO',
                subtitulo: 'Descubre nuestra colección'
            }
        ]
    };

    const heroSlides = document.querySelector('.hero-slides');
    const heroDots = document.querySelector('.hero-dots');
    
    if (!heroSlides || !heroDots) {
        console.error('No se encontraron los elementos del hero');
        return;
    }

    // Limpiar contenedores
    heroSlides.innerHTML = '';
    heroDots.innerHTML = '';

    // Crear slides
    heroData.slides.forEach((slide, index) => {
        console.log('Creando slide', index + 1);
        const slideDiv = document.createElement('div');
        slideDiv.className = 'hero-slide' + (index === 0 ? ' active' : '');
        slideDiv.innerHTML = `
            <img src="${slide.imagen}" alt="Hero imagen ${index + 1}" 
                 onerror="this.onerror=null; this.src='${carouselState.defaultImage}';">
            <div class="hero-text">
                <h2>${slide.titulo}</h2>
                <p>${slide.subtitulo}</p>
            </div>
        `;
        heroSlides.appendChild(slideDiv);

        // Crear punto de navegación
        const dot = document.createElement('span');
        dot.className = 'hero-dot' + (index === 0 ? ' active' : '');
        dot.onclick = () => cambiarSlide(index);
        heroDots.appendChild(dot);
    });

    console.log('Carga del hero completada');
}

// Función para iniciar el carrusel con efecto suave de deslizamiento
function iniciarCarruselDirecto(numSlides) {
    if (carouselState.interval) {
        clearInterval(carouselState.interval);
    }
    
    if (numSlides <= 1) return;
    
    console.log(`Iniciando carrusel con ${numSlides} slides`);
    
    const slides = document.querySelectorAll('.hero-slide');
    
    // Configuración inicial del carrusel
    slides.forEach((slide, i) => {
        // Primer slide visible y activo
        if (i === 0) {
            slide.style.transform = 'translateX(0)';
            slide.classList.add('active');
            slide.classList.remove('anterior');
        } 
        // Todos los demás slides a la derecha, listos para entrar
        else {
            slide.style.transform = 'translateX(100%)';
            slide.classList.remove('active', 'anterior');
        }
    });
    
    // Inicializar estado
    carouselState.currentSlide = 0;
    carouselState.isTransitioning = false;
    
    // Configurar el intervalo para cambiar slides automáticamente
    carouselState.interval = setInterval(() => {
        if (carouselState.isTransitioning) {
            return;
        }
        
        const nextIndex = (carouselState.currentSlide + 1) % numSlides;
        cambiarSlide(nextIndex);
        
    }, 4000);
    
    console.log('Carrusel iniciado correctamente');
}

// Función para cambiar slides sin usar dots
function cambiarSlide(index) {
    console.log(`Intentando cambiar al slide ${index}`);
    
    const slides = document.querySelectorAll('.hero-slide');
    
    if (!slides.length) {
        console.error('No hay slides para cambiar');
        return;
    }
    
    if (index === carouselState.currentSlide) {
        console.log('Mismo slide seleccionado, ignorando cambio');
        return;
    }
    
    if (carouselState.isTransitioning) {
        console.log('Transición en progreso, ignorando cambio');
        return;
    }
    
    console.log(`Cambiando del slide ${carouselState.currentSlide} al slide ${index}`);
    carouselState.isTransitioning = true;
    
    const currentIndex = carouselState.currentSlide;
    
    slides.forEach((slide, i) => {
        if (i !== currentIndex) {
            slide.classList.remove('anterior');
        }
    });
    
    slides[currentIndex].classList.add('anterior');
    slides[currentIndex].classList.remove('active');
    slides[currentIndex].style.transform = 'translateX(-100%)';
    
    slides[index].classList.add('active');
    slides[index].style.transform = 'translateX(0)';
    
    for (let i = 0; i < slides.length; i++) {
        if (i !== currentIndex && i !== index) {
            slides[i].style.transform = 'translateX(100%)';
        }
    }
    
    carouselState.currentSlide = index;
    
    setTimeout(() => {
        slides[currentIndex].classList.remove('anterior');
        carouselState.isTransitioning = false;
        console.log('Transición completada');
    }, 900);
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

// Actualizamos el evento de resize para recalcular dimensiones
window.addEventListener('resize', function() {
    if (animacionID) {
        // Recargar el texto cuando cambia el tamaño de la ventana
        cargarTextoMovimiento();
    }
});

// Cuando el documento esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Reiniciar manualmente cualquier intervalo existente
    if (carouselState.interval) {
        clearInterval(carouselState.interval);
        carouselState.interval = null;
    }
    
    console.log('DOM completamente cargado, iniciando funciones principales');
    
    // Cargar las diferentes secciones
    cargarHero();
    cargarAnuncios();
    cargarTextoMovimiento(); // Iniciar el marquee
});

// Agregar listener para mensajes
window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'textoMovimientoActualizado') {
        console.log('Mensaje recibido del admin:', event.data);
        cargarTextoMovimiento(); // Recargar el texto
    }
});

// Agregar listener para el evento personalizado
window.addEventListener('textoMovimientoActualizado', function() {
    cargarTextoMovimiento(); // Recargar el texto
});

// Listener para cambios en localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'heroData') {
        cargarHero();
    } else if (e.key === 'anuncios') {
        cargarAnuncios();
    } else if (e.key === 'textoMovimiento' || e.key === 'textoMovimientoTimestamp') {
        cargarTextoMovimiento(); // Recargar el texto
    }
});

// Exponer las funciones necesarias globalmente
window.cargarBanner = cargarBanner;
window.cargarProductos = cargarProductos;
window.mostrarDetallesProducto = mostrarDetallesProducto;
window.cambiarImagenPrincipal = cambiarImagenPrincipal;
window.cambiarImagenProducto = cambiarImagenProducto;
window.cambiarSlide = cambiarSlide;
window.cargarHero = cargarHero;
window.cargarAnuncios = cargarAnuncios;
window.iniciarCarrusel = iniciarCarruselDirecto;
window.cargarTextoMovimiento = cargarTextoMovimiento;

