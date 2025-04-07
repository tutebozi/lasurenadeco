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
    console.log('Mostrando sección de productos');
    const mainContent = document.getElementById('main-content');
    
    mainContent.innerHTML = `
        <div class="panel">
            <h2>Gestión de Productos</h2>
            <div class="section-actions">
                <button onclick="mostrarFormularioProducto()" class="btn-accion">Agregar Producto</button>
            </div>
            <div class="productos-container">
                <!-- Los productos se cargarán dinámicamente aquí -->
                <div class="loading" id="loading-productos">Cargando productos...</div>
            </div>
        </div>
    `;
    
    cargarProductos();
}

// Función para mostrar la sección de Hero
function mostrarSeccionHero() {
    console.log('Mostrando sección de Hero');
    
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

// Función para mostrar la sección de Texto Movimiento
function mostrarSeccionTextoMovimiento() {
    console.log('Mostrando sección de Texto Movimiento');
    const mainContent = document.getElementById('main-content');
    
    // Obtener el texto actual del localStorage
    let textoActual = '';
    try {
        const anuncios = localStorage.getItem('anuncios');
        if (anuncios) {
            const anunciosArray = JSON.parse(anuncios);
            textoActual = anunciosArray.join('\n');
        }
    } catch (error) {
        console.error('Error al cargar anuncios:', error);
    }
    
    mainContent.innerHTML = `
        <div class="panel">
            <h2>Editor de Texto en Movimiento</h2>
            <div class="editor-container">
                <p class="instruccion">Ingresa cada anuncio en una línea separada. Se mostrarán en rotación en el banner superior.</p>
                <div class="campo">
                    <textarea id="textoMovimiento" rows="6" class="input-field" placeholder="Ejemplo: Envío gratis a partir de $80.000">${textoActual}</textarea>
                </div>
                <div class="ejemplo-banner">
                    <h3>Vista previa:</h3>
                    <div class="banner-preview">
                        <div class="texto-movimiento-preview">${textoActual.split('\n')[0] || 'Sin anuncios configurados'}</div>
                    </div>
                </div>
                <div class="acciones">
                    <button onclick="guardarTextoMovimiento()" class="btn-guardar">Guardar Cambios</button>
                </div>
                <div id="mensajeAnuncios" class="mensaje" style="display: none;"></div>
            </div>
        </div>
    `;
    
    // Actualizar vista previa cuando se edita el texto
    const textarea = document.getElementById('textoMovimiento');
    if (textarea) {
        textarea.addEventListener('input', function() {
            const lineas = this.value.split('\n').filter(linea => linea.trim() !== '');
            const preview = document.querySelector('.texto-movimiento-preview');
            if (preview) {
                preview.textContent = lineas.length > 0 ? lineas[0] : 'Sin anuncios configurados';
            }
        });
    }
}

// Función para guardar el texto en movimiento
function guardarTextoMovimiento() {
    const textarea = document.getElementById('textoMovimiento');
    if (!textarea) return;
    
    const texto = textarea.value;
    const anuncios = texto.split('\n')
                         .map(linea => linea.trim())
                         .filter(linea => linea !== '');
    
    try {
        localStorage.setItem('anuncios', JSON.stringify(anuncios));
        mostrarMensaje('mensajeAnuncios', 'Los anuncios se han guardado correctamente', 'success');
    } catch (error) {
        console.error('Error al guardar anuncios:', error);
        mostrarMensaje('mensajeAnuncios', 'Error al guardar los anuncios', 'error');
    }
}

// Función para mostrar mensajes
function mostrarMensaje(elementId, texto, tipo) {
    const mensajeElement = document.getElementById(elementId);
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
        mostrarSeccionHero();
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
    const productosContainer = document.querySelector('.productos-container');
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
function mostrarFormularioProducto(productoId = null) {
    const modalProducto = document.getElementById('modal-producto');
    if (!modalProducto) return;
    
    // Limpiar el formulario
    const formulario = document.getElementById('formulario-producto');
    if (formulario) formulario.reset();
    
    // Cargar categorías actualizadas
    const categorias = JSON.parse(localStorage.getItem('categorias')) || ['MESA', 'DECORACIÓN', 'HOGAR', 'COCINA', 'BAÑO', 'AROMAS', 'REGALOS'];
    
    // Si se está editando un producto, cargar sus datos
    if (productoId !== null) {
        const productos = JSON.parse(localStorage.getItem('productos') || '[]');
        const producto = productos.find(p => p.id === productoId);
        
        if (producto) {
            document.getElementById('nombre').value = producto.nombre || '';
            document.getElementById('precio').value = producto.precio || '';
            document.getElementById('descripcion').value = producto.descripcion || '';
            document.getElementById('categoria').value = producto.categoria || '';
            document.getElementById('stock').value = producto.stock || 0;
            
            // Mostrar imágenes existentes
            if (producto.imagenes && Array.isArray(producto.imagenes)) {
                producto.imagenes.forEach((imagen, index) => {
                    if (index < 5 && imagen) {
                        const preview = document.getElementById(`preview-${index + 1}`);
                        if (preview) {
                            preview.src = imagen;
                            preview.style.display = 'block';
                        }
                    }
                });
            }
        }
    }
    
    // Actualizar el select de categorías
    const selectCategoria = document.getElementById('categoria');
    if (selectCategoria) {
        selectCategoria.innerHTML = categorias.map(categoria => 
            `<option value="${categoria}">${categoria}</option>`
        ).join('');
    }
    
    // Establecer el ID del producto en un atributo data para uso posterior
    formulario.setAttribute('data-producto-id', productoId || '');
    
    // Mostrar el modal
    modalProducto.style.display = 'block';
}

// Función para guardar producto
async function guardarProducto(event) {
    event.preventDefault();
    
    const formulario = document.getElementById('formulario-producto');
    if (!formulario) return;
    
    const productoId = formulario.getAttribute('data-producto-id');
    const nombre = document.getElementById('nombre').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const descripcion = document.getElementById('descripcion').value;
    const categoria = document.getElementById('categoria').value;
    const stock = parseInt(document.getElementById('stock').value);
    
    // Validar campos
    if (!nombre || isNaN(precio) || !descripcion || !categoria || isNaN(stock)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }
    
    // Recopilar imágenes
    const imagenes = [];
    for (let i = 0; i < 5; i++) {
        const fileInput = document.querySelector(`input[data-index="${i}"]`);
        const preview = document.getElementById(`preview-${i + 1}`);
        
        if (fileInput && fileInput.files && fileInput.files[0]) {
            try {
                const imagen = await comprimirImagen(fileInput.files[0]);
                imagenes.push(imagen);
            } catch (error) {
                console.error(`Error al procesar imagen ${i + 1}:`, error);
            }
        } else if (preview && preview.style.display === 'block' && preview.src) {
            imagenes.push(preview.src);
        }
    }
    
    // Obtener productos existentes
    const productos = JSON.parse(localStorage.getItem('productos') || '[]');
    
    // Crear o actualizar producto
    const producto = {
        id: productoId ? parseInt(productoId) : Date.now(),
        nombre,
        precio,
        descripcion,
        categoria,
        stock,
        imagenes
    };
    
    if (productoId) {
        // Actualizar producto existente
        const index = productos.findIndex(p => p.id === parseInt(productoId));
        if (index !== -1) {
            productos[index] = producto;
        }
    } else {
        // Agregar nuevo producto
        productos.push(producto);
    }
    
    // Guardar en localStorage
    localStorage.setItem('productos', JSON.stringify(productos));
    
    // Cerrar modal y recargar productos
    cerrarModal();
    cargarProductos();
}

// Función para comprimir una imagen
function comprimirImagen(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calcular dimensiones
                let width = img.width;
                let height = img.height;
                const maxWidth = 1200;
                const maxHeight = 800;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convertir a base64 con calidad reducida
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                resolve(compressedDataUrl);
            };
            img.onerror = function() {
                reject(new Error('Error al cargar la imagen'));
            };
        };
        reader.onerror = function() {
            reject(new Error('Error al leer el archivo'));
        };
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
    const modalProducto = document.getElementById('modal-producto');
    if (modalProducto) {
        modalProducto.style.display = 'none';
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
    console.log('Cambiando a sección:', seccion);
    
    // Primero, remover clase activa de todos los enlaces
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Agregar clase activa al enlace de la sección seleccionada
    const enlaceActivo = document.querySelector(`.nav-link[data-section="${seccion}"]`);
    if (enlaceActivo) {
        enlaceActivo.classList.add('active');
    }
    
    // Cargar el contenido de la sección
    switch(seccion) {
        case 'productos':
            mostrarSeccionProductos();
            break;
        case 'categorias':
            mostrarSeccionCategorias();
            break;
        case 'hero':
            mostrarSeccionHero();
            break;
        case 'texto-movimiento':
            mostrarSeccionTextoMovimiento();
            break;
        case 'pagos':
            mostrarSeccionPagos();
            break;
        default:
            console.error('Sección no reconocida:', seccion);
            mostrarSeccionProductos(); // Por defecto, mostrar productos
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

// Función para mostrar la sección de configuración de pagos
function mostrarSeccionPagos() {
    console.log('Mostrando sección de configuración de pagos');
    const mainContent = document.getElementById('main-content');
    
    // Cargar datos de configuración de pagos desde localStorage
    let configPagos = {
        mercadoPago: {
            habilitado: false,
            cuentaMP: '',
            tokenAcceso: ''
        },
        tarjeta: {
            habilitado: false,
            titular: '',
            banco: '',
            numeroCuenta: ''
        },
        transferencia: {
            habilitado: false,
            titular: '',
            banco: '',
            numeroCuenta: '',
            cbu: '',
            alias: ''
        }
    };
    
    try {
        const configGuardada = localStorage.getItem('configPagos');
        if (configGuardada) {
            configPagos = { ...configPagos, ...JSON.parse(configGuardada) };
        }
    } catch (error) {
        console.error('Error al cargar configuración de pagos:', error);
    }
    
    mainContent.innerHTML = `
        <div class="panel">
            <h2>Configuración de Métodos de Pago</h2>
            <div class="config-pagos-container">
                <!-- Mercado Pago -->
                <div class="metodo-pago-card">
                    <div class="metodo-header">
                        <h3>
                            <i class="fab fa-cc-visa"></i> Mercado Pago
                        </h3>
                        <label class="switch">
                            <input type="checkbox" id="mp-habilitado" ${configPagos.mercadoPago.habilitado ? 'checked' : ''}>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="metodo-form">
                        <div class="campo">
                            <label for="mp-cuenta">Email/Usuario de Mercado Pago:</label>
                            <input type="text" id="mp-cuenta" class="input-field" value="${configPagos.mercadoPago.cuentaMP || ''}">
                        </div>
                        <div class="campo">
                            <label for="mp-token">Token de Acceso:</label>
                            <input type="password" id="mp-token" class="input-field" value="${configPagos.mercadoPago.tokenAcceso || ''}">
                        </div>
                    </div>
                </div>
                
                <!-- Tarjeta de Crédito/Débito -->
                <div class="metodo-pago-card">
                    <div class="metodo-header">
                        <h3>
                            <i class="fas fa-credit-card"></i> Tarjetas
                        </h3>
                        <label class="switch">
                            <input type="checkbox" id="tarjeta-habilitado" ${configPagos.tarjeta.habilitado ? 'checked' : ''}>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="metodo-form">
                        <div class="campo">
                            <label for="tarjeta-titular">Nombre del Titular:</label>
                            <input type="text" id="tarjeta-titular" class="input-field" value="${configPagos.tarjeta.titular || ''}">
                        </div>
                        <div class="campo">
                            <label for="tarjeta-banco">Banco:</label>
                            <input type="text" id="tarjeta-banco" class="input-field" value="${configPagos.tarjeta.banco || ''}">
                        </div>
                        <div class="campo">
                            <label for="tarjeta-numero">Número de Cuenta (últimos 4 dígitos):</label>
                            <input type="text" id="tarjeta-numero" class="input-field" maxlength="4" value="${configPagos.tarjeta.numeroCuenta || ''}">
                        </div>
                    </div>
                </div>
                
                <!-- Transferencia Bancaria -->
                <div class="metodo-pago-card">
                    <div class="metodo-header">
                        <h3>
                            <i class="fas fa-university"></i> Transferencia Bancaria
                        </h3>
                        <label class="switch">
                            <input type="checkbox" id="transferencia-habilitado" ${configPagos.transferencia.habilitado ? 'checked' : ''}>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="metodo-form">
                        <div class="campo">
                            <label for="transferencia-titular">Nombre del Titular:</label>
                            <input type="text" id="transferencia-titular" class="input-field" value="${configPagos.transferencia.titular || ''}">
                        </div>
                        <div class="campo">
                            <label for="transferencia-banco">Banco:</label>
                            <input type="text" id="transferencia-banco" class="input-field" value="${configPagos.transferencia.banco || ''}">
                        </div>
                        <div class="campo">
                            <label for="transferencia-cuenta">Número de Cuenta:</label>
                            <input type="text" id="transferencia-cuenta" class="input-field" value="${configPagos.transferencia.numeroCuenta || ''}">
                        </div>
                        <div class="campo">
                            <label for="transferencia-cbu">CBU:</label>
                            <input type="text" id="transferencia-cbu" class="input-field" value="${configPagos.transferencia.cbu || ''}">
                        </div>
                        <div class="campo">
                            <label for="transferencia-alias">Alias:</label>
                            <input type="text" id="transferencia-alias" class="input-field" value="${configPagos.transferencia.alias || ''}">
                        </div>
                    </div>
                </div>
                
                <div class="botones-config">
                    <button onclick="guardarConfiguracionPagos()" class="btn-guardar">Guardar Configuración</button>
                </div>
                <div id="mensaje-config-pagos" class="mensaje" style="display: none;"></div>
            </div>
        </div>
    `;
}

// Función para guardar la configuración de pagos
function guardarConfiguracionPagos() {
    const configPagos = {
        mercadoPago: {
            habilitado: document.getElementById('mp-habilitado').checked,
            cuentaMP: document.getElementById('mp-cuenta').value.trim(),
            tokenAcceso: document.getElementById('mp-token').value.trim()
        },
        tarjeta: {
            habilitado: document.getElementById('tarjeta-habilitado').checked,
            titular: document.getElementById('tarjeta-titular').value.trim(),
            banco: document.getElementById('tarjeta-banco').value.trim(),
            numeroCuenta: document.getElementById('tarjeta-numero').value.trim()
        },
        transferencia: {
            habilitado: document.getElementById('transferencia-habilitado').checked,
            titular: document.getElementById('transferencia-titular').value.trim(),
            banco: document.getElementById('transferencia-banco').value.trim(),
            numeroCuenta: document.getElementById('transferencia-cuenta').value.trim(),
            cbu: document.getElementById('transferencia-cbu').value.trim(),
            alias: document.getElementById('transferencia-alias').value.trim()
        }
    };
    
    try {
        localStorage.setItem('configPagos', JSON.stringify(configPagos));
        mostrarMensajeConfigPagos('Configuración de pagos guardada correctamente', 'success');
    } catch (error) {
        console.error('Error al guardar configuración de pagos:', error);
        mostrarMensajeConfigPagos('Error al guardar la configuración', 'error');
    }
}

// Función para mostrar mensajes en la sección de configuración de pagos
function mostrarMensajeConfigPagos(texto, tipo) {
    const mensajeElement = document.getElementById('mensaje-config-pagos');
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

// Función para guardar el hero
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
        
        mostrarMensaje('mensajeTexto', 'Hero guardado exitosamente', 'success');
        
        // Notificar a la página principal
        if (window.opener) {
            window.opener.postMessage({
                type: 'heroUpdated',
                heroData: heroData
            }, '*');
        }
        
    } catch (error) {
        console.error('Error al guardar el hero:', error);
        mostrarMensaje('mensajeTexto', 'Error al guardar el hero: ' + error.message, 'error');
    }
}

// Función para mostrar la sección de categorías
function mostrarSeccionCategorias() {
    console.log('Mostrando sección de categorías');
    const mainContent = document.getElementById('main-content');
    
    // Cargar categorías desde localStorage
    let categorias = [];
    try {
        const categoriasGuardadas = localStorage.getItem('categorias');
        if (categoriasGuardadas) {
            categorias = JSON.parse(categoriasGuardadas);
        } else {
            // Si no hay categorías guardadas, usar las predeterminadas
            categorias = ['MESA', 'DECORACIÓN', 'HOGAR', 'COCINA', 'BAÑO', 'AROMAS', 'REGALOS'];
        }
    } catch (error) {
        console.error('Error al cargar categorías:', error);
        categorias = ['MESA', 'DECORACIÓN', 'HOGAR', 'COCINA', 'BAÑO', 'AROMAS', 'REGALOS'];
    }
    
    mainContent.innerHTML = `
        <div class="panel">
            <h2>Gestión de Categorías</h2>
            <div class="categorias-container">
                <div class="categorias-header">
                    <h3>Categorías Actuales</h3>
                    <button onclick="mostrarFormularioCategoria()" class="btn-accion">
                        <i class="fas fa-plus"></i> Agregar Categoría
                    </button>
                </div>
                <div class="categorias-list">
                    ${categorias.map((categoria, index) => `
                        <div class="categoria-item">
                            <span>${categoria}</span>
                            <div class="categoria-actions">
                                <button onclick="editarCategoria(${index})" class="btn-accion">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="eliminarCategoria(${index})" class="btn-accion">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// Función para mostrar el formulario de categoría
function mostrarFormularioCategoria(categoriaIndex = null) {
    const mainContent = document.getElementById('main-content');
    const categorias = JSON.parse(localStorage.getItem('categorias')) || ['MESA', 'DECORACIÓN', 'HOGAR', 'COCINA', 'BAÑO', 'AROMAS', 'REGALOS'];
    const categoria = categoriaIndex !== null ? categorias[categoriaIndex] : '';
    
    mainContent.innerHTML = `
        <div class="panel">
            <h2>${categoriaIndex !== null ? 'Editar' : 'Agregar'} Categoría</h2>
            <div class="form-container">
                <form id="form-categoria" onsubmit="guardarCategoria(event, ${categoriaIndex})">
                    <div class="campo">
                        <label for="nombre-categoria">Nombre de la Categoría:</label>
                        <input type="text" id="nombre-categoria" class="input-field" value="${categoria}" required>
                    </div>
                    <div class="botones">
                        <button type="submit" class="btn-guardar">Guardar</button>
                        <button type="button" onclick="mostrarSeccionCategorias()" class="btn-cancelar">Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

// Función para guardar una categoría
function guardarCategoria(event, categoriaIndex) {
    event.preventDefault();
    const nombreCategoria = document.getElementById('nombre-categoria').value.trim().toUpperCase();
    
    if (!nombreCategoria) {
        mostrarMensaje('El nombre de la categoría no puede estar vacío', 'error');
        return;
    }
    
    let categorias = JSON.parse(localStorage.getItem('categorias')) || ['MESA', 'DECORACIÓN', 'HOGAR', 'COCINA', 'BAÑO', 'AROMAS', 'REGALOS'];
    
    if (categoriaIndex !== null) {
        // Editar categoría existente
        categorias[categoriaIndex] = nombreCategoria;
    } else {
        // Agregar nueva categoría
        if (categorias.includes(nombreCategoria)) {
            mostrarMensaje('Esta categoría ya existe', 'error');
            return;
        }
        categorias.push(nombreCategoria);
    }
    
    try {
        // Guardar en localStorage
        localStorage.setItem('categorias', JSON.stringify(categorias));
        
        // Notificar a todas las ventanas abiertas
        window.postMessage({
            type: 'categoriasUpdated',
            categorias: categorias
        }, '*');
        
        // Notificar a la ventana principal si existe
        if (window.opener) {
            window.opener.postMessage({
                type: 'categoriasUpdated',
                categorias: categorias
            }, '*');
        }
        
        mostrarMensaje(`Categoría ${categoriaIndex !== null ? 'editada' : 'agregada'} correctamente`, 'success');
        mostrarSeccionCategorias();
    } catch (error) {
        console.error('Error al guardar categoría:', error);
        mostrarMensaje('Error al guardar la categoría', 'error');
    }
}

// Función para eliminar una categoría
function eliminarCategoria(index) {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
        let categorias = JSON.parse(localStorage.getItem('categorias')) || ['MESA', 'DECORACIÓN', 'HOGAR', 'COCINA', 'BAÑO', 'AROMAS', 'REGALOS'];
        categorias.splice(index, 1);
        
        try {
            localStorage.setItem('categorias', JSON.stringify(categorias));
            mostrarMensaje('Categoría eliminada correctamente', 'success');
            mostrarSeccionCategorias();
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            mostrarMensaje('Error al eliminar la categoría', 'error');
        }
    }
}

// Función para editar una categoría
function editarCategoria(index) {
    mostrarFormularioCategoria(index);
}

// Escuchar mensajes del panel de administración
window.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'categoriasUpdated') {
        // Actualizar el select de categorías si está visible
        const selectCategoria = document.getElementById('categoria');
        if (selectCategoria) {
            const categorias = event.data.categorias;
            selectCategoria.innerHTML = categorias.map(categoria => 
                `<option value="${categoria}">${categoria}</option>`
            ).join('');
        }
    }
}); 