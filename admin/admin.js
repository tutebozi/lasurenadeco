// Funciones del panel admin
function editarBanner() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="panel">
            <h2>Editor de Banner</h2>
            <div class="editor-container">
                <img src="../img/banner.jpg" alt="Banner actual" style="max-width: 100%; margin-bottom: 20px;">
                <input type="file" id="bannerFile" accept="image/*">
                <button onclick="guardarBanner()" class="btn-accion">Guardar Banner</button>
            </div>
        </div>
    `;
}

function editarHero() {
    const mainContent = document.getElementById('main-content');
    
    // Cargar datos del hero desde localStorage
    let titulo = 'LA SUREÑA DECO';
    let subtitulo = 'HOME, BAZAR Y REGALERÍA';
    let imagenes = [];
    
    try {
        // Intentar cargar desde heroData (forma actualizada)
        const heroData = localStorage.getItem('heroData');
        if (heroData) {
            const data = JSON.parse(heroData);
            titulo = data.titulo || titulo;
            subtitulo = data.subtitulo || subtitulo;
            
            if (data.imagenes && Array.isArray(data.imagenes)) {
                imagenes = data.imagenes.filter(img => img && (
                    img.startsWith('data:image/') || 
                    /^https?:\/\/.+/.test(img)
                ));
            }
            console.log('Imágenes cargadas desde heroData:', imagenes.length);
        } else {
            // Intentar cargar imágenes del método antiguo como respaldo
            const heroImagenes = localStorage.getItem('heroImagenes');
            if (heroImagenes) {
                imagenes = JSON.parse(heroImagenes || '[]');
                console.log('Imágenes cargadas desde heroImagenes:', imagenes.length);
            }
        }
    } catch (error) {
        console.error('Error al cargar datos del hero:', error);
    }
    
    mainContent.innerHTML = `
        <div class="panel">
            <h2>Editor de Hero</h2>
            <div class="editor-container">
                <div class="campo">
                    <label for="heroTitulo">Título:</label>
                    <input type="text" id="heroTitulo" value="${titulo}" class="input-field">
                </div>
                <div class="campo">
                    <label for="heroSubtitulo">Subtítulo:</label>
                    <input type="text" id="heroSubtitulo" value="${subtitulo}" class="input-field">
                </div>
                <div class="imagenes-hero">
                    <h3>Imágenes del Hero (Máximo 3)</h3>
                    <div class="hero-imagenes-grid">
                        ${[0, 1, 2].map(index => `
                            <div class="imagen-hero-container">
                                <label>Imagen ${index + 1}:</label>
                                <input type="file" id="heroFile${index}" accept="image/*" class="hero-file-input">
                                <div class="preview-container">
                                    <img src="${index < imagenes.length ? imagenes[index] : ''}" 
                                         id="preview${index}" 
                                         class="hero-preview" 
                                         style="display: ${index < imagenes.length && imagenes[index] ? 'block' : 'none'}"
                                         alt="Preview ${index + 1}">
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="acciones">
                    <button onclick="guardarHero()" class="btn-guardar">Guardar Cambios</button>
                </div>
                <div id="mensajeTexto" class="mensaje" style="display: none;"></div>
                </div>
        </div>
    `;

    // Agregar eventos para previsualizar las imágenes
    [0, 1, 2].forEach(index => {
        const fileInput = document.getElementById(`heroFile${index}`);
        if (fileInput) {
            fileInput.addEventListener('change', function() {
                const preview = document.getElementById(`preview${index}`);
                if (this.files && this.files[0] && preview) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            });
        }
        
        // Mostrar las imágenes cargadas
        if (index < imagenes.length && imagenes[index]) {
            console.log(`Mostrando imagen ${index + 1} en preview`);
        }
    });
}

function editarAnuncios() {
    document.getElementById('main-content').innerHTML = `
        <div style="padding: 20px; background: white; margin: 20px; border-radius: 8px;">
            <h2>Editor de Anuncios</h2>
            <div style="margin: 20px 0;">
                <input type="text" id="nuevoAnuncio" placeholder="Nuevo anuncio" style="width: 300px;">
                <button onclick="agregarAnuncio()">Agregar</button>
            </div>
            <div id="listaAnuncios"></div>
        </div>
    `;
    mostrarAnuncios();
}

function mostrarAnuncios() {
    const anuncios = [
        "Envío gratis desde $80.000 en CABA",
        "CARNAVAL ¡4x3 EN TODA LA WEB!",
        "6 cuotas sin interés",
        "10% off con transferencia"
    ];
    
    const lista = document.getElementById('listaAnuncios');
    lista.innerHTML = anuncios.map((anuncio, index) => `
        <div style="margin: 10px 0; display: flex; gap: 10px;">
            <input type="text" value="${anuncio}" style="width: 300px;">
            <button onclick="eliminarAnuncio(this)">Eliminar</button>
        </div>
    `).join('');
}

function agregarAnuncio() {
    const input = document.getElementById('nuevoAnuncio');
    const lista = document.getElementById('listaAnuncios');
    
    if (input && input.value.trim()) {
        const div = document.createElement('div');
        div.style.margin = '10px 0';
        div.style.display = 'flex';
        div.style.gap = '10px';
        
        div.innerHTML = `
            <input type="text" value="${input.value}" style="width: 300px;">
            <button onclick="eliminarAnuncio(this)">Eliminar</button>
        `;
        
        lista.appendChild(div);
        input.value = '';
    }
}

function eliminarAnuncio(boton) {
    boton.parentElement.remove();
}

function mostrarTabla() {
    document.getElementById('main-content').innerHTML = `
        <div class="panel">
            <h2>Gestión de Productos</h2>
            <div style="margin: 20px 0;">
                <button class="btn-accion">Agregar Producto</button>
                <button class="btn-accion">Reiniciar Productos</button>
            </div>
            <table>
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Sección</th>
                    <th>Acciones</th>
                </tr>
                <tr>
                    <td>Sillón Escandinavo Gris</td>
                    <td>$199,999</td>
                    <td>10</td>
                    <td>decoracion</td>
                    <td>
                        <button class="btn-accion">Editar</button>
                        <button class="btn-accion">Eliminar</button>
                    </td>
                </tr>
                <tr>
                    <td>Sillón Bergère Vintage</td>
                    <td>$2,459,977</td>
                    <td>5</td>
                    <td>hogar</td>
                    <td>
                        <button class="btn-accion">Editar</button>
                        <button class="btn-accion">Eliminar</button>
                    </td>
                </tr>
                <tr>
                    <td>Sillón Moderno Cuero</td>
                    <td>$289,999</td>
                    <td>8</td>
                    <td>decoracion</td>
                    <td>
                        <button class="btn-accion">Editar</button>
                        <button class="btn-accion">Eliminar</button>
                    </td>
                </tr>
                <tr>
                    <td>Sillón Lounge Mid-Century</td>
                    <td>$275,999</td>
                    <td>3</td>
                    <td>decoracion</td>
                    <td>
                        <button class="btn-accion">Editar</button>
                        <button class="btn-accion">Eliminar</button>
                    </td>
                </tr>
                <tr>
                    <td>Sillón Club Clásico</td>
                    <td>$234,999</td>
                    <td>6</td>
                    <td>decoracion</td>
                    <td>
                        <button class="btn-accion">Editar</button>
                        <button class="btn-accion">Eliminar</button>
                    </td>
                </tr>
            </table>
        </div>
    `;
}

function mostrarUsuarios() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="panel">
        <h2>Gestión de Usuarios</h2>
            <table class="tabla-admin">
                <thead>
                <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>admin</td>
                        <td>admin@lasurenadeco.com</td>
                    <td>Administrador</td>
                    <td>
                        <button class="btn-accion">Editar</button>
                        <button class="btn-accion">Eliminar</button>
                </td>
            </tr>
                </tbody>
        </table>
        </div>
    `;
}

function mostrarHistorialCompras() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="panel">
        <h2>Historial de Compras</h2>
            <table class="tabla-admin">
                <thead>
                <tr>
                    <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Productos</th>
                    <th>Total</th>
                        <th>Estado</th>
                </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Sin compras registradas</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
            </tr>
                </tbody>
        </table>
        </div>
    `;
}

// Variables globales
let productos = [];
let productoActual = null;
let loadingImageBase64 = 'data:image/gif;base64,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';
let errorImageBase64 = 'data:image/png;base64,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';

// Función para inicializar la página
function inicializarPagina() {
    // Mostrar la sección de productos por defecto
    mostrarSeccionProductos();
    configurarEventos();
}

// Función para mostrar la sección de productos
function mostrarSeccionProductos() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    mainContent.innerHTML = `
        <div class="panel">
            <h2>Gestión de Productos</h2>
            <button class="btn-primary" onclick="mostrarFormularioProducto()">
                Agregar Nuevo Producto
            </button>
            <div id="lista-productos" class="productos-grid"></div>
        </div>
    `;

    cargarProductos();
}

// Función para mostrar sección
function mostrarSeccion(seccion) {
    // Prevenir recargas innecesarias
    if (seccion === 'productos') {
        mostrarSeccionProductos();
    } else if (seccion === 'usuarios') {
        mostrarUsuarios();
    } else if (seccion === 'banner') {
        editarBanner();
    } else if (seccion === 'hero') {
        editarHero();
    } else if (seccion === 'anuncios') {
        editarAnuncios();
    } else if (seccion === 'historial') {
        mostrarHistorialCompras();
    }
}

// Función para configurar eventos
function configurarEventos() {
    // Eventos de navegación
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const seccion = this.dataset.section;
            if (seccion) {
                mostrarSeccion(seccion);
            }
        });
    });

    // Configurar evento para el formulario de producto
    const formProducto = document.getElementById('form-producto');
    if (formProducto) {
        formProducto.addEventListener('submit', guardarProducto);
    }
}

// Función para cargar productos
function cargarProductos() {
    const productosContainer = document.querySelector('.productos-grid');
    if (!productosContainer) return;

    productos = JSON.parse(localStorage.getItem('productos') || '[]');
    productosContainer.innerHTML = '';

    if (productos.length === 0) {
        productosContainer.innerHTML = '<div class="no-productos">No hay productos agregados</div>';
        return;
    }

    productos.forEach(producto => {
        const imagenUrl = producto.imagenes && producto.imagenes.length > 0 
            ? producto.imagenes[0] 
            : 'img/placeholder.jpg';

        const card = document.createElement('div');
        card.className = 'producto-card';
        card.innerHTML = `
            <div class="producto-imagen">
                <img src="${imagenUrl}" alt="${producto.nombre}" class="producto-img" loading="lazy">
            </div>
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="precio">$${formatearPrecio(producto.precio)}</p>
                <p class="categoria">${producto.categoria}</p>
                <p class="stock">Stock: ${producto.stock}</p>
                <div class="acciones">
                    <button onclick="mostrarFormularioProducto(${producto.id})">Editar</button>
                    <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </div>
            </div>
        `;

        productosContainer.appendChild(card);
    });
}

// Función para mostrar el formulario de producto
function mostrarFormularioProducto(id = null) {
    const modal = document.getElementById('modal-producto');
    const form = document.getElementById('formulario-producto');
    
    productoActual = id ? productos.find(p => p.id === id) : null;
    
    if (productoActual) {
        // Modo edición
        form.nombre.value = productoActual.nombre;
        form.precio.value = productoActual.precio;
        form.descripcion.value = productoActual.descripcion;
        form.categoria.value = productoActual.categoria;
        form.stock.value = productoActual.stock;
        
        // Mostrar imágenes existentes
        if (productoActual.imagenes) {
            productoActual.imagenes.forEach((imagen, index) => {
                const preview = document.getElementById(`preview-${index + 1}`);
                if (preview) {
                    preview.src = imagen;
                    preview.style.display = 'block';
                }
            });
        }
    } else {
        // Modo nuevo producto
        form.reset();
        // Limpiar todas las previsualizaciones
        for (let i = 1; i <= 5; i++) {
            const preview = document.getElementById(`preview-${i}`);
            if (preview) {
                preview.style.display = 'none';
                preview.src = '';
            }
        }
    }
    
    modal.style.display = 'block';
}

// Función para guardar producto
async function guardarProducto(event) {
    event.preventDefault();
    
    const form = event.target;
    let imagenes = [];
    
    try {
        // Limitar a máximo 5 imágenes y procesarlas con compresión
        for (let i = 0; i < 5; i++) {
            const input = form.querySelector(`input[type="file"][data-index="${i}"]`);
            
            if (input.files && input.files[0]) {
                // Comprimir la imagen antes de guardarla
                try {
                    const imagenComprimida = await comprimirImagen(input.files[0]);
                    if (imagenComprimida) {
                        imagenes.push(imagenComprimida);
                        console.log(`Imagen ${i+1} comprimida correctamente`);
                    }
                } catch (error) {
                    console.error(`Error al comprimir la imagen ${i+1}:`, error);
                }
            } else if (productoActual && productoActual.imagenes && productoActual.imagenes[i]) {
                // Mantener la imagen existente si no se seleccionó una nueva
                imagenes.push(productoActual.imagenes[i]);
            }
            
            // Si ya tenemos 5 imágenes, salir del bucle
            if (imagenes.length >= 5) {
                break;
            }
        }
        
        const producto = {
            id: productoActual ? productoActual.id : Date.now(),
            nombre: form.nombre.value,
            precio: parseFloat(form.precio.value),
            descripcion: form.descripcion.value,
            categoria: form.categoria.value,
            stock: parseInt(form.stock.value),
            imagenes: imagenes
        };
        
        try {
            if (productoActual) {
                // Actualizar producto existente
                const index = productos.findIndex(p => p.id === productoActual.id);
                productos[index] = producto;
            } else {
                // Agregar nuevo producto
                productos.push(producto);
            }
            
            // Guardar en localStorage con manejo de errores
            localStorage.setItem('productos', JSON.stringify(productos));
            cerrarModal();
            cargarProductos();
            
            // Mostrar mensaje de éxito
            alert('Producto guardado correctamente');
        } catch (error) {
            console.error('Error al guardar el producto:', error);
            alert('Error al guardar el producto. El almacenamiento puede estar lleno.');
            
            // Intentar guardar sin imágenes como respaldo
            try {
                producto.imagenes = producto.imagenes.length > 0 ? [producto.imagenes[0]] : [];
                
                if (productoActual) {
                    const index = productos.findIndex(p => p.id === productoActual.id);
                    productos[index] = producto;
                } else {
                    productos.push(producto);
                }
                
                localStorage.setItem('productos', JSON.stringify(productos));
                cerrarModal();
                cargarProductos();
                
                alert('Producto guardado con imagen reducida debido a limitaciones de almacenamiento');
            } catch (fallbackError) {
                console.error('Error al guardar con imagen reducida:', fallbackError);
                alert('No se pudo guardar el producto ni siquiera con imagen reducida');
            }
        }
    } catch (error) {
        console.error('Error general al procesar el producto:', error);
        alert('Error al procesar el producto. Por favor, intente nuevamente.');
    }
}

// Función para comprimir imagen
async function comprimirImagen(file) {
    return new Promise((resolve, reject) => {
        try {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    try {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        // Calcular dimensiones manteniendo proporción
                        let width = img.width;
                        let height = img.height;
                        const maxSize = 800; // Reducir tamaño máximo para ahorrar espacio
                        
                        if (width > height && width > maxSize) {
                            height = (height * maxSize) / width;
                            width = maxSize;
                        } else if (height > maxSize) {
                            width = (width * maxSize) / height;
                            height = maxSize;
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        
                        // Dibujar y comprimir
                        ctx.drawImage(img, 0, 0, width, height);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // Mayor compresión (0.7 en lugar de 0.8)
                        
                        resolve(dataUrl);
                    } catch (error) {
                        console.error('Error al procesar la imagen en canvas:', error);
                        reject(error);
                    }
                };
                img.onerror = function() {
                    console.error('Error al cargar la imagen');
                    reject(new Error('Error al cargar la imagen'));
                };
                img.src = e.target.result;
            };
            reader.onerror = function(error) {
                console.error('Error al leer el archivo:', error);
                reject(error);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error en comprimirImagen:', error);
            reject(error);
        }
    });
}

// Función para eliminar producto
function eliminarProducto(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        productos = productos.filter(p => p.id !== id);
        localStorage.setItem('productos', JSON.stringify(productos));
        cargarProductos();
    }
}

// Función para cerrar el modal
function cerrarModal() {
    const modal = document.getElementById('modal-producto');
    if (modal) {
        modal.style.display = 'none';
        productoActual = null;
        
        // Limpiar el formulario y las previsualizaciones
        const form = document.getElementById('formulario-producto');
        if (form) {
            form.reset();
            for (let i = 1; i <= 5; i++) {
                const preview = document.getElementById(`preview-${i}`);
                if (preview) {
                    preview.style.display = 'none';
                    preview.src = '';
                }
            }
        }
    }
}

// Función para formatear precio
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CL').format(precio || 0);
}

// Función para previsualizar imagen
async function previewImagen(input, previewId) {
    const preview = document.getElementById(previewId);
    if (input.files && input.files[0]) {
        // Mostrar indicador de carga
        preview.src = loadingImageBase64;
        preview.style.display = 'block';
        
        try {
            // Comprimir la imagen para la vista previa
            const imagenComprimida = await comprimirImagen(input.files[0]);
            preview.src = imagenComprimida;
            preview.style.display = 'block';
        } catch (error) {
            console.error('Error al comprimir la imagen para vista previa:', error);
            
            // Si falla la compresión, mostrar la imagen original
            const reader = new FileReader();
            reader.onload = function(e) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.onerror = function() {
                preview.src = errorImageBase64;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(input.files[0]);
        }
    }
}

// Función para previsualizar imágenes adicionales
function previewImagenesAdicionales(input) {
    const previewContainer = document.getElementById('preview-adicionales');
    previewContainer.innerHTML = '';
    
    if (input.files) {
        Array.from(input.files).forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgContainer = document.createElement('div');
                imgContainer.style.position = 'relative';
                imgContainer.innerHTML = `
                    <img src="${e.target.result}" style="width: 100px; height: 100px; object-fit: cover;">
                    <button type="button" onclick="this.parentElement.remove()" style="position: absolute; top: 0; right: 0;">×</button>
                `;
                previewContainer.appendChild(imgContainer);
            };
            reader.readAsDataURL(file);
        });
    }
}

// Función para cargar la sección de productos
function cargarSeccionProductos() {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = `
        <div class="section-header">
            <h2>Gestión de Productos</h2>
            <button class="btn-primary" onclick="mostrarFormularioProducto()">
                <i class="fas fa-plus"></i> Agregar Nuevo Producto
            </button>
        </div>
        <div class="productos-grid"></div>
    `;
    cargarProductos();
}

// Función para cambiar sección
function cambiarSeccion(seccion) {
    // Remover clase activa de todos los enlaces
    document.querySelectorAll('.sidebar nav a').forEach(a => a.classList.remove('active'));
    
    // Agregar clase activa al enlace seleccionado
    const enlaceActivo = document.querySelector(`.sidebar nav a[data-section="${seccion}"]`);
    if (enlaceActivo) enlaceActivo.classList.add('active');
    
    // Cargar el contenido de la sección
    switch(seccion) {
        case 'productos':
            cargarSeccionProductos();
            break;
        case 'hero':
            editarHero();
            break;
        case 'texto-movimiento':
            mostrarSeccionTextoMovimiento();
            break;
    }
}

function mostrarSeccionTextoMovimiento() {
    const mainContent = document.getElementById('main-content');
    const textoGuardado = localStorage.getItem('textoMovimiento') || '';
    
    mainContent.innerHTML = `
        <div class="seccion-texto-movimiento">
            <h2>Texto en Movimiento</h2>
            <div class="campo-texto-movimiento">
                <p class="descripcion">Este texto aparecerá en movimiento en la línea beige de la página principal.</p>
                <textarea id="textoMovimiento" rows="3" placeholder="Ingresa el texto para el banner en movimiento...">${textoGuardado}</textarea>
                <button id="btnGuardarTexto" class="btn-guardar">Guardar Texto</button>
                <div id="mensajeTexto" class="mensaje" style="display: none;"></div>
            </div>
            <div class="preview-banner">
                <h3>Vista previa:</h3>
                <div class="banner-preview">
                    <div class="texto-movimiento-preview">${textoGuardado || '¡Bienvenidos a LA SUREÑA DECO! 🌟 Descuentos especiales en todos nuestros productos'}</div>
                </div>
            </div>
        </div>
    `;

    // Agregar evento al botón de guardar
    const btnGuardarTexto = document.getElementById('btnGuardarTexto');
    if (btnGuardarTexto) {
        btnGuardarTexto.addEventListener('click', guardarTextoMovimiento);
    }

    // Agregar evento para actualizar la vista previa mientras se escribe
    const textarea = document.getElementById('textoMovimiento');
    if (textarea) {
        textarea.addEventListener('input', function() {
            const preview = document.querySelector('.texto-movimiento-preview');
            if (preview) {
                preview.textContent = this.value || '¡Bienvenidos a LA SUREÑA DECO! 🌟 Descuentos especiales en todos nuestros productos';
            }
        });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Cargar sección de productos por defecto
    cargarSeccionProductos();
    
    // Configurar navegación del sidebar
    document.querySelectorAll('.sidebar nav a').forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            e.preventDefault();
            const seccion = e.target.closest('a').dataset.section;
            cambiarSeccion(seccion);
        });
    });
});

// Funciones para el texto en movimiento
document.addEventListener('DOMContentLoaded', function() {
    cargarTextoMovimiento();
    
    const btnGuardarTexto = document.getElementById('btnGuardarTexto');
    if (btnGuardarTexto) {
        btnGuardarTexto.addEventListener('click', guardarTextoMovimiento);
    }
});

function cargarTextoMovimiento() {
    const textoGuardado = localStorage.getItem('textoMovimiento') || '';
    const textarea = document.getElementById('textoMovimiento');
    if (textarea) {
        textarea.value = textoGuardado;
    }
}

function mostrarMensaje(texto, tipo) {
    const mensajeElement = document.getElementById('mensajeTexto');
    if (mensajeElement) {
        mensajeElement.textContent = texto;
        mensajeElement.className = `mensaje ${tipo}`;
        mensajeElement.style.display = 'block';
        
        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
            mensajeElement.style.display = 'none';
        }, 3000);
    }
}

function guardarTextoMovimiento() {
    const textarea = document.getElementById('textoMovimiento');
    const texto = textarea.value.trim();
    
    if (texto === '') {
        mostrarMensaje('Por favor, ingresa un texto para el banner', 'error');
        return;
    }
    
    // Guardar el texto en localStorage
    localStorage.setItem('textoMovimiento', texto);
    
    // Forzar una actualización en localStorage
    const timestamp = Date.now();
    localStorage.setItem('textoMovimientoTimestamp', timestamp);
    
    // Actualizar la vista previa
    const preview = document.querySelector('.texto-movimiento-preview');
    if (preview) {
        preview.textContent = texto;
    }
    
    // Disparar un evento personalizado
    const event = new CustomEvent('textoMovimientoActualizado', { 
        detail: { texto, timestamp } 
    });
    window.dispatchEvent(event);
    
    // Notificar a la página principal si está abierta
    if (window.opener) {
        window.opener.postMessage({
            type: 'textoMovimientoActualizado',
            texto: texto,
            timestamp: timestamp
        }, '*');
    }
    
    // Forzar una actualización en localStorage para otras ventanas
    const tempKey = 'temp_' + Date.now();
    localStorage.setItem(tempKey, '1');
    setTimeout(() => localStorage.removeItem(tempKey), 100);
    
    mostrarMensaje('Texto guardado exitosamente', 'success');
}

async function guardarHero() {
    const titulo = document.getElementById('heroTitulo').value;
    const subtitulo = document.getElementById('heroSubtitulo').value;
    const imagenesComprimidas = [];
    const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzhiNzM1NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5MQSBTVVJF0UEgREVDTzwvdGV4dD48L3N2Zz4=';
    
    try {
        // Limpiar localStorage de datos antiguos
        localStorage.removeItem('heroImagenes');
        
        // Procesar cada imagen
        for (let i = 0; i < 3; i++) {
            const fileInput = document.getElementById(`heroFile${i}`);
            const preview = document.getElementById(`preview${i}`);
            
            if (fileInput && fileInput.files && fileInput.files[0]) {
                try {
                    const imagenComprimida = await comprimirImagen(fileInput.files[0]);
                    if (imagenComprimida && imagenComprimida.startsWith('data:image/')) {
                        imagenesComprimidas.push(imagenComprimida);
                    }
                } catch (error) {
                    console.error(`Error al comprimir imagen ${i}:`, error);
                }
            } else if (preview && 
                      preview.src && 
                      preview.style.display !== 'none' && 
                      preview.src.startsWith('data:image/')) {
                imagenesComprimidas.push(preview.src);
            }
        }
        
        // Si no hay imágenes válidas, usar imagen por defecto
        if (imagenesComprimidas.length === 0) {
            imagenesComprimidas.push(defaultImage);
        }
        
        // Crear el objeto heroData
        const heroData = {
            id: Date.now(),
            titulo,
            subtitulo,
            imagenes: imagenesComprimidas
        };
        
        // Guardar solo en heroData
        localStorage.setItem('heroData', JSON.stringify(heroData));
        
        // Limpiar los previews y inputs
        for (let i = 0; i < 3; i++) {
            const fileInput = document.getElementById(`heroFile${i}`);
            const preview = document.getElementById(`preview${i}`);
            if (fileInput) fileInput.value = '';
            if (preview) {
                preview.src = defaultImage;
                preview.style.display = 'none';
            }
        }
        
        mostrarMensaje('Hero guardado exitosamente', 'success');
        
        // Notificar a la página principal
        if (window.opener) {
            window.opener.postMessage({
                type: 'heroUpdated',
                heroData: heroData
            }, '*');
        }
        
    } catch (error) {
        console.error('Error al guardar el hero:', error);
        mostrarMensaje('Error al guardar el hero: ' + error.message, 'error');
    }
}

// Función para cargar el hero al iniciar
function cargarHero() {
    // Obtener datos del hero desde localStorage
    let titulo = 'LA SUREÑA DECO';
    let subtitulo = 'HOME, BAZAR Y REGALERÍA';
    let imagenes = [];
    
    try {
        // Intentar cargar desde heroData (forma actualizada)
        const heroData = localStorage.getItem('heroData');
        if (heroData) {
            const data = JSON.parse(heroData);
            titulo = data.titulo || titulo;
            subtitulo = data.subtitulo || subtitulo;
            
            if (data.imagenes && Array.isArray(data.imagenes)) {
                imagenes = data.imagenes.filter(img => img && (
                    img.startsWith('data:image/') || 
                    /^https?:\/\/.+/.test(img)
                ));
            }
            console.log('Imágenes cargadas desde heroData:', imagenes.length);
        } else {
            // Intentar cargar imágenes del método antiguo como respaldo
            const heroImagenes = localStorage.getItem('heroImagenes');
            if (heroImagenes) {
                imagenes = JSON.parse(heroImagenes);
                console.log('Imágenes cargadas desde heroImagenes:', imagenes.length);
            }
        }
    } catch (error) {
        console.error('Error al cargar datos del hero:', error);
    }
    
    // Actualizar los campos en la interfaz
    const heroTituloInput = document.getElementById('heroTitulo');
    const heroSubtituloInput = document.getElementById('heroSubtitulo');
    
    if (heroTituloInput) heroTituloInput.value = titulo;
    if (heroSubtituloInput) heroSubtituloInput.value = subtitulo;
    
    // Actualizar las previsualizaciones de imágenes
    for (let i = 0; i < 3; i++) {
        const preview = document.getElementById(`preview${i}`);
        if (preview) {
            if (i < imagenes.length && imagenes[i]) {
                preview.src = imagenes[i];
                preview.style.display = 'block';
                console.log(`Imagen ${i + 1} cargada:`, preview.src.substring(0, 50) + '...');
            } else {
                preview.style.display = 'none';
            }
        }
    }
    
    console.log('Hero cargado con éxito');
}

// Hacer las funciones disponibles globalmente
window.mostrarFormularioProducto = mostrarFormularioProducto;
window.guardarProducto = guardarProducto;
window.eliminarProducto = eliminarProducto;
window.cerrarModal = cerrarModal;
window.previewImagen = previewImagen;
window.previewImagenesAdicionales = previewImagenesAdicionales;

// Agregar estilos
const styles = document.createElement('style');
styles.textContent = `
    .panel {
        padding: 20px;
        background: white;
        margin: 20px;
        border-radius: 8px;
    }
    .form-group {
        margin: 20px 0;
    }
    .form-group input {
        width: 300px;
        padding: 5px;
        margin-right: 10px;
    }
    .anuncio {
        margin: 10px 0;
        display: flex;
        gap: 10px;
    }
    .anuncio input {
        width: 300px;
        padding: 5px;
    }
    button {
        padding: 5px 10px;
        cursor: pointer;
    }
`;
document.head.appendChild(styles); 