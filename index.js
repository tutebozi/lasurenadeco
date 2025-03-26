// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Definir la función abrirProducto al inicio
function abrirProducto(producto) {
    console.log('Abriendo producto:', producto); // Para debug
    
    const modal = document.createElement('div');
    modal.className = 'modal-producto';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    modal.innerHTML = `
        <div class="producto-detalle" style="background: white; padding: 20px; border-radius: 8px; max-width: 90%; max-height: 90vh; overflow-y: auto; position: relative;">
            <button class="btn-cerrar" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
            <div class="producto-imagenes">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="imagen-principal" style="max-width: 100%; height: auto;">
                ${producto.imagenesAdicionales ? `
                    <div class="miniaturas" style="display: flex; gap: 10px; justify-content: center; margin-top: 10px;">
                        ${producto.imagenesAdicionales.map(img => 
                            `<img src="${img}" class="miniatura" style="width: 60px; height: 60px; object-fit: cover; cursor: pointer;">`
                        ).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="producto-info">
                <h2>${producto.nombre}</h2>
                <p class="precio">$${producto.precio.toLocaleString()}</p>
                <p class="descripcion">${producto.descripcion}</p>
                <button class="btn-agregar" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Agregar al Carrito
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Eventos
    modal.querySelector('.btn-cerrar').onclick = () => {
        modal.remove();
        document.body.style.overflow = 'auto';
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    };
    
    // Eventos de las miniaturas
    modal.querySelectorAll('.miniatura').forEach(miniatura => {
        miniatura.onclick = () => {
            modal.querySelector('.imagen-principal').src = miniatura.src;
        };
    });
    
    // Evento del botón agregar al carrito
    modal.querySelector('.btn-agregar').onclick = () => {
        agregarAlCarrito(producto);
    };
}

// Hacer la función disponible globalmente inmediatamente después de definirla
window.abrirProducto = abrirProducto;

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

// Función para cargar el hero
function cargarHero() {
    try {
        const heroImg = localStorage.getItem('heroImage');
        const heroTitulo = localStorage.getItem('heroTitulo');
        const heroSubtitulo = localStorage.getItem('heroSubtitulo');
        const heroSection = document.getElementById('hero-section');
        
        if (heroSection && heroImg) {
            console.log('Hero image:', heroImg.substring(0, 100)); // Para debug
            
            heroSection.innerHTML = `
                <img src="${heroImg}" alt="Hero image" style="width: 100%; height: auto;">
                <div class="hero-content">
                    <h1 id="hero-titulo">${heroTitulo || ''}</h1>
                    <p id="hero-subtitulo">${heroSubtitulo || ''}</p>
                </div>
            `;
            
            // Verificar que la imagen se cargó correctamente
            const imgElement = heroSection.querySelector('img');
            imgElement.onerror = () => {
                console.error('Error al cargar la imagen del hero');
            };
            imgElement.onload = () => {
                console.log('Imagen del hero cargada correctamente');
            };
        } else {
            console.log('No hay imagen de hero para cargar o no se encontró el elemento hero-section');
        }
    } catch (error) {
        console.error('Error al cargar el hero:', error);
    }
}

// Función para cargar productos
function cargarProductos(seccion = 'todos') {
    try {
        const productos = JSON.parse(localStorage.getItem('productos')) || [];
        const contenedor = document.querySelector('.productos-container');
        
        if (!contenedor) return;
        
        let productosFiltrados = productos;
        if (seccion !== 'todos') {
            productosFiltrados = productos.filter(p => p.seccion === seccion);
        }
        
        contenedor.innerHTML = '';
        
        productosFiltrados.forEach(producto => {
            const card = document.createElement('div');
            card.className = 'producto-card';
            
            // Crear una copia segura del producto
            const productoStr = JSON.stringify(producto).replace(/"/g, '&quot;');
            
            card.innerHTML = `
                <div class="producto-imagen" style="cursor: pointer;" onclick="abrirProducto(${productoStr})">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </div>
                <h3 style="cursor: pointer;" onclick="abrirProducto(${productoStr})">${producto.nombre}</h3>
                <p class="precio">$${producto.precio.toLocaleString()}</p>
                <p class="descripcion">${producto.descripcion}</p>
                <button class="btn-agregar" onclick="agregarAlCarrito(${productoStr})">
                    Agregar al Carrito
                </button>
            `;
            
            contenedor.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Función para cargar los textos en movimiento
function cargarTextoMovimiento() {
    try {
        const textos = JSON.parse(localStorage.getItem('textosMovimiento')) || [];
        const contenedor = document.getElementById('texto-banner');
        
        if (contenedor && textos.length > 0) {
            contenedor.textContent = textos.join(' | ');
        }
    } catch (error) {
        console.error('Error al cargar los textos en movimiento:', error);
    }
}

// Función para cargar los anuncios del banner
function cargarAnuncios() {
    console.log("Cargando anuncios del banner");
    
    try {
        const anuncios = JSON.parse(localStorage.getItem('anuncios')) || [
            "Envío gratis desde $80.000 en CABA",
            "CARNAVAL ¡4x3 EN TODA LA WEB!",
            "6 cuotas sin interés",
            "10% off con transferencia"
        ];
        
        console.log("Anuncios cargados:", anuncios);
        
        const bannerTextoContainer = document.querySelector('.banner-texto-container');
        if (bannerTextoContainer) {
            bannerTextoContainer.innerHTML = anuncios.map(anuncio => 
                `<span class="texto-anuncio">${anuncio}</span>`
            ).join('');
            console.log("Anuncios insertados en el banner");
        } else {
            console.error("No se encontró el contenedor del banner");
        }
    } catch (error) {
        console.error('Error al cargar los anuncios:', error);
    }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    cargarBanner();
    cargarHero();
    cargarTextoMovimiento();
    cargarProductos('todos');
    cargarAnuncios(); // Cargar los anuncios
    actualizarCarritoUI();
});

// Escuchar cambios en localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'bannerImage') {
        cargarBanner();
    } else if (e.key === 'productos') {
        cargarProductos('todos');
    } else if (e.key === 'textosMovimiento') {
        cargarTextoMovimiento();
    } else if (e.key === 'anuncios') {
        cargarAnuncios();
    }
});

// Hacer funciones disponibles globalmente
window.cargarBanner = cargarBanner;
window.cargarProductos = cargarProductos;
window.mostrarCarrito = mostrarCarrito;
window.cerrarCarrito = cerrarCarrito;
window.agregarAlCarrito = agregarAlCarrito;
window.cambiarCantidad = cambiarCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;
window.vaciarCarrito = vaciarCarrito;
window.abrirProducto = abrirProducto;

// Verificar cambios periódicamente
setInterval(cargarProductos, 5000); // Verificar cada 5 segundos

// Función para agregar al carrito
function agregarAlCarrito(producto) {
    const itemExistente = carrito.find(item => item.nombre === producto.nombre);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }
    
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarritoUI();
    mostrarMensaje('Producto agregado al carrito');
}

// Función para actualizar la UI del carrito
function actualizarCarritoUI() {
    const contador = document.getElementById('cart-counter');
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    contador.textContent = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    
    const contenidoCarrito = document.querySelector('.items-carrito');
    if (contenidoCarrito) {
        if (carrito.length === 0) {
            contenidoCarrito.innerHTML = '<p class="carrito-vacio">El carrito está vacío</p>';
            return;
        }
        
        contenidoCarrito.innerHTML = carrito.map(item => `
            <div class="item-carrito">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="item-detalles">
                    <h3>${item.nombre}</h3>
                    <p>$${item.precio.toLocaleString()}</p>
                    <div class="cantidad-controles">
                        <button onclick="cambiarCantidad('${item.nombre}', -1)">-</button>
                        <span>${item.cantidad}</span>
                        <button onclick="cambiarCantidad('${item.nombre}', 1)">+</button>
                    </div>
                </div>
                <button class="eliminar-item" onclick="eliminarDelCarrito('${item.nombre}')">×</button>
            </div>
        `).join('');
        
        contenidoCarrito.innerHTML += `
            <div class="carrito-total">
                <h3>Total: $${total.toLocaleString()}</h3>
                <button onclick="iniciarPago()" class="btn-finalizar">Pagar con Mercado Pago</button>
                <button onclick="vaciarCarrito()" class="btn-vaciar">Vaciar Carrito</button>
            </div>
        `;
    }
}

// Función para iniciar el pago con Mercado Pago
async function iniciarPago() {
    try {
        if (carrito.length === 0) {
            alert('El carrito está vacío');
            return;
        }

        const items = carrito.map(item => ({
            nombre: item.nombre,
            precio: Number(item.precio),
            cantidad: Number(item.cantidad)
        }));

        console.log('Enviando items:', items);

        const response = await fetch('http://localhost:3000/crear-preferencia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ items })
        });

        const responseText = await response.text();
        console.log('Respuesta del servidor:', responseText);

        if (!response.ok) {
            throw new Error(`Error del servidor: ${responseText}`);
        }

        const data = JSON.parse(responseText);
        
        if (data && data.init_point) {
            console.log('Redirigiendo a:', data.init_point);
            window.location.href = data.init_point;
        } else {
            throw new Error('No se recibió un punto de inicio válido');
        }
    } catch (error) {
        console.error('Error detallado:', error);
        alert('Error al procesar el pago. Por favor intenta nuevamente.');
    }
}

// Funciones auxiliares del carrito
function cambiarCantidad(nombre, delta) {
    const item = carrito.find(item => item.nombre === nombre);
    if (item) {
        item.cantidad = Math.max(1, item.cantidad + delta);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarritoUI();
    }
}

function eliminarDelCarrito(nombre) {
    carrito = carrito.filter(item => item.nombre !== nombre);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarCarritoUI();
}

function vaciarCarrito() {
    if (confirm('¿Estás seguro de querer vaciar el carrito?')) {
        carrito = [];
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarritoUI();
    }
}

function mostrarMensaje(mensaje) {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.className = 'mensaje-flotante';
    mensajeDiv.textContent = mensaje;
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        mensajeDiv.remove();
    }, 3000);
}

// Función para mostrar el carrito
function mostrarCarrito() {
    const modalCarrito = document.getElementById('modal-carrito');
    if (modalCarrito) {
        modalCarrito.style.display = 'flex';
        actualizarCarritoUI();
    }
}

// Función para cerrar el carrito
function cerrarCarrito() {
    const modalCarrito = document.getElementById('modal-carrito');
    if (modalCarrito) {
        modalCarrito.style.display = 'none';
    }
} 