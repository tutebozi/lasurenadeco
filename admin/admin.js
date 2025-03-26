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
    mainContent.innerHTML = `
        <div class="panel">
            <h2>Editor de Hero</h2>
            <div class="editor-container">
                <img src="../img/hero.jpg" alt="Hero actual" style="max-width: 100%; margin-bottom: 20px;">
                <input type="text" id="heroTitulo" value="LA SUREÑA DECO" class="input-field">
                <input type="text" id="heroSubtitulo" value="HOME, BAZAR Y REGALERÍA" class="input-field">
                <input type="file" id="heroFile" accept="image/*">
                <button onclick="guardarHero()" class="btn-accion">Guardar Hero</button>
                </div>
        </div>
    `;
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
    
    // Procesar todas las imágenes
    for (let i = 0; i < 5; i++) {
        const input = form.querySelector(`input[type="file"][data-index="${i}"]`);
        const preview = document.getElementById(`preview-${i + 1}`);
        
        if (input.files && input.files[0]) {
            // Si hay una nueva imagen seleccionada
            const imagenBase64 = await procesarImagen(input.files[0]);
            imagenes.push(imagenBase64);
        } else if (productoActual && productoActual.imagenes && productoActual.imagenes[i]) {
            // Mantener la imagen existente si no se seleccionó una nueva
            imagenes.push(productoActual.imagenes[i]);
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
    
    if (productoActual) {
        // Actualizar producto existente
        const index = productos.findIndex(p => p.id === productoActual.id);
        productos[index] = producto;
    } else {
        // Agregar nuevo producto
        productos.push(producto);
    }
    
    localStorage.setItem('productos', JSON.stringify(productos));
    cerrarModal();
    cargarProductos();
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

// Función para procesar imagen
async function procesarImagen(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Función para previsualizar imagen
function previewImagen(input, previewId) {
    const preview = document.getElementById(previewId);
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
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
        case 'banner':
            // Implementar carga de sección banner
            break;
        case 'hero':
            // Implementar carga de sección hero
            break;
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