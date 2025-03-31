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

// Estado global del carrusel
let carouselState = {
    interval: null,
    currentSlide: 0,
    isLoading: false,
    isTransitioning: false,
    defaultImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzhiNzM1NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5MQSBTVVJF0UEgREVDTzwvdGV4dD48L3N2Zz4='
};

function cargarHero() {
    // Evitar cargar si ya está en proceso
    if (carouselState.isLoading) {
        console.log('Carga del hero en progreso, ignorando solicitud');
        return;
    }
    
    carouselState.isLoading = true;
    console.log('Iniciando carga del hero');

    try {
        // Detener el carrusel existente
        if (carouselState.interval) {
            clearInterval(carouselState.interval);
            carouselState.interval = null;
            console.log('Intervalo anterior del carrusel detenido');
        }

        // Obtener datos del hero - Solo necesitamos las imágenes
        let imagenes = [];

        // Intentar cargar desde heroData (forma actualizada)
        const heroData = localStorage.getItem('heroData');

        if (heroData) {
            try {
                const data = JSON.parse(heroData);
                
                if (data.imagenes && Array.isArray(data.imagenes)) {
                    imagenes = data.imagenes.filter(img => img && (
                        img.startsWith('data:image/') ||
                        /^https?:\/\/.+/.test(img)
                    ));
                    console.log(`Filtradas ${imagenes.length} imágenes válidas de heroData`);
                }
            } catch (e) {
                console.error('Error al parsear heroData:', e);
            }
        } else {
            console.log('No se encontró heroData, buscando en heroImagenes');
            // Intentar cargar del método antiguo como respaldo
            try {
                const heroImagenes = localStorage.getItem('heroImagenes');
                if (heroImagenes) {
                    const imagenesAntiguas = JSON.parse(heroImagenes);
                    if (Array.isArray(imagenesAntiguas) && imagenesAntiguas.length > 0) {
                        imagenes = imagenesAntiguas.filter(img => img && (
                            img.startsWith('data:image/') ||
                            /^https?:\/\/.+/.test(img)
                        ));
                        console.log(`Recuperadas ${imagenes.length} imágenes desde heroImagenes`);
                    }
                }
            } catch (error) {
                console.error('Error al recuperar imágenes antiguas:', error);
            }
        }

        // Si no hay imágenes válidas, usar imagen por defecto
        if (imagenes.length === 0) {
            console.log('No se encontraron imágenes válidas, usando imagen por defecto');
            imagenes = [carouselState.defaultImage];
        }

        console.log(`Imágenes a cargar en el hero: ${imagenes.length}`);

        // Actualizar el DOM
        const heroSlides = document.querySelector('.hero-slides');
        const heroDots = document.querySelector('.hero-dots');

        // Ocultar el título y subtítulo del hero
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.display = 'none';
        }

        if (heroSlides) {
            heroSlides.innerHTML = '';
            
            // Crear los slides para cada imagen
            imagenes.forEach((imagen, index) => {
                const slide = document.createElement('div');
                slide.className = `hero-slide ${index === 0 ? 'active' : ''}`;
                slide.style.transform = `translateX(${index === 0 ? 0 : 100}%)`;
                
                const img = document.createElement('img');
                img.src = imagen;
                img.alt = `Hero imagen ${index + 1}`;
                img.onerror = function() {
                    console.error(`Error al cargar imagen ${index + 1}, usando imagen por defecto`);
                    this.onerror = null;
                    this.src = carouselState.defaultImage;
                };
                
                slide.appendChild(img);
                heroSlides.appendChild(slide);
                console.log(`Slide ${index + 1} creado`);
            });
        } else {
            console.error('No se encontró el contenedor .hero-slides');
        }

        // Iniciar el carrusel si hay más de una imagen
        if (imagenes.length > 1) {
            carouselState.currentSlide = 0;
            iniciarCarruselDirecto(imagenes.length);
        }

    } catch (error) {
        console.error('Error al cargar el hero:', error);
        const heroSlides = document.querySelector('.hero-slides');
        if (heroSlides) {
            heroSlides.innerHTML = `
                <div class="hero-slide active">
                    <img src="${carouselState.defaultImage}" alt="Hero imagen por defecto">
                </div>
            `;
            console.log('Fallback de imagen por defecto aplicado');
        }
    } finally {
        carouselState.isLoading = false;
        console.log('Carga del hero completada');
    }
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

