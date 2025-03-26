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
let productoEditando = null;

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
    const contenedor = document.getElementById('lista-productos');
    if (!contenedor) return;

    try {
        // Obtener productos del localStorage
        let productos = [];
        const productosGuardados = localStorage.getItem('productos');
        if (productosGuardados) {
            productos = JSON.parse(productosGuardados);
        }

        // Mostrar mensaje si no hay productos
        if (!productos || !productos.length) {
            contenedor.innerHTML = `
                <div class="no-productos">
                    <p>No hay productos registrados</p>
                    <button class="btn-primary" onclick="mostrarFormularioProducto()">
                        Agregar Primer Producto
                    </button>
                </div>
            `;
            return;
        }

        // Generar HTML para los productos
        let html = '';
        productos.forEach(producto => {
            const imagenUrl = producto.imagenes && producto.imagenes[0] ? 
                producto.imagenes[0] : '../img/placeholder.jpg';
            
            html += `
                <div class="producto-card">
                    <div class="producto-imagen">
                        <img src="${imagenUrl}" 
                             alt="${producto.nombre || 'Producto'}"
                             class="producto-img">
                    </div>
                    <div class="producto-info">
                        <h3 class="producto-nombre">${producto.nombre || 'Producto sin nombre'}</h3>
                        <p class="precio">${formatearPrecio(producto.precio)}</p>
                        <p class="categoria">${producto.categoria || 'Sin categoría'}</p>
                        <p class="stock">Stock: ${producto.stock || 0}</p>
                        <div class="acciones">
                            <button onclick="mostrarFormularioProducto(${JSON.stringify(producto).replace(/"/g, '&quot;')})">
                                <i class="fas fa-edit"></i> Editar
                            </button>
                            <button onclick="eliminarProducto(${producto.id})">
                                <i class="fas fa-trash"></i> Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        contenedor.innerHTML = html;
    } catch (error) {
        console.error('Error al cargar productos:', error);
        contenedor.innerHTML = '<p>Error al cargar los productos</p>';
    }
}

// Función para mostrar el formulario de producto
function mostrarFormularioProducto(producto = null) {
    productoEditando = producto;
    const modal = document.getElementById('modal-producto');
    const form = document.getElementById('form-producto');
    
    // Limpiar formulario
    form.reset();
    document.getElementById('preview-imagen-principal').innerHTML = '';
    for (let i = 2; i <= 5; i++) {
        document.getElementById(`preview-imagen-${i}`).innerHTML = '';
    }
    
    // Si estamos editando, llenar el formulario
    if (producto) {
        form.nombre.value = producto.nombre || '';
        form.precio.value = producto.precio || '';
        form.descripcion.value = producto.descripcion || '';
        form.categoria.value = producto.categoria || '';
        form.stock.value = producto.stock || '';
        
        // Mostrar imágenes existentes
        if (producto.imagenes && producto.imagenes.length > 0) {
            // Mostrar imagen principal
            mostrarImagenPreview(producto.imagenes[0], 'preview-imagen-principal');
            
            // Mostrar imágenes adicionales
            for (let i = 1; i < producto.imagenes.length && i < 5; i++) {
                mostrarImagenPreview(producto.imagenes[i], `preview-imagen-${i+1}`);
            }
        }
    }
    
    // Configurar eventos de preview para cada input de imagen
    document.getElementById('imagen-principal').addEventListener('change', function(e) {
        handleImagePreview(e, 'preview-imagen-principal');
    });
    
    for (let i = 2; i <= 5; i++) {
        document.getElementById(`imagen-${i}`).addEventListener('change', function(e) {
            handleImagePreview(e, `preview-imagen-${i}`);
        });
    }
    
    modal.style.display = 'block';
}

// Función para mostrar preview de imagen
function mostrarImagenPreview(base64Image, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `<img src="${base64Image}" alt="Preview">`;
}

// Función para cerrar el modal
function cerrarModalProducto() {
    const modal = document.getElementById('modal-producto');
    modal.style.display = 'none';
    productoEditando = null;
}

// Función para formatear precio
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(precio || 0);
}

// Función para guardar producto
async function guardarProducto(event) {
    event.preventDefault();
    
    try {
        const form = document.getElementById('form-producto');
        const imagenPrincipalInput = document.getElementById('imagen-principal');
        
        // Procesar todas las imágenes
        let imagenes = [];
        
        // Procesar imagen principal
        if (imagenPrincipalInput.files[0]) {
            const imagenComprimida = await comprimirImagen(imagenPrincipalInput.files[0]);
            imagenes.push(imagenComprimida);
        } else if (productoEditando && productoEditando.imagenes && productoEditando.imagenes[0]) {
            imagenes.push(productoEditando.imagenes[0]);
        }
        
        // Procesar imágenes adicionales
        for (let i = 2; i <= 5; i++) {
            const input = document.getElementById(`imagen-${i}`);
            if (input.files[0]) {
                const imagenComprimida = await comprimirImagen(input.files[0]);
                imagenes.push(imagenComprimida);
            } else if (productoEditando && productoEditando.imagenes && productoEditando.imagenes[i-1]) {
                imagenes.push(productoEditando.imagenes[i-1]);
            }
        }
        
        // Crear objeto producto
        const producto = {
            id: productoEditando ? productoEditando.id : Date.now(),
            nombre: form.nombre.value.trim(),
            precio: parseFloat(form.precio.value),
            descripcion: form.descripcion.value.trim(),
            categoria: form.categoria.value.trim(),
            stock: parseInt(form.stock.value),
            imagenes: imagenes
        };
        
        // Obtener productos existentes
        let productos = [];
        const productosGuardados = localStorage.getItem('productos');
        if (productosGuardados) {
            productos = JSON.parse(productosGuardados);
        }
        
        // Actualizar o agregar producto
        if (productoEditando) {
            const index = productos.findIndex(p => p.id === productoEditando.id);
            if (index !== -1) {
                productos[index] = producto;
            }
        } else {
            productos.push(producto);
        }
        
        // Guardar en localStorage
        localStorage.setItem('productos', JSON.stringify(productos));
        
        // Cerrar modal y actualizar lista
        cerrarModalProducto();
        cargarProductos();
        
    } catch (error) {
        console.error('Error al guardar producto:', error);
        alert('Error al guardar el producto. Por favor, intente nuevamente.');
    }
}

// Función para eliminar producto
function eliminarProducto(id) {
    if (!confirm('¿Está seguro de que desea eliminar este producto?')) {
        return;
    }
    
    try {
        // Obtener productos del localStorage
        let productos = [];
        const productosGuardados = localStorage.getItem('productos');
        if (productosGuardados) {
            productos = JSON.parse(productosGuardados);
        }
        
        // Filtrar el producto a eliminar
        productos = productos.filter(producto => producto.id !== id);
        
        // Guardar productos actualizados
        localStorage.setItem('productos', JSON.stringify(productos));
        
        // Actualizar la lista de productos
        cargarProductos();
        
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto. Por favor, intente nuevamente.');
    }
}

// Inicializar la página cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarPagina);

// Hacer las funciones disponibles globalmente
window.mostrarFormularioProducto = mostrarFormularioProducto;
window.cerrarModalProducto = cerrarModalProducto;
window.eliminarProducto = eliminarProducto;
window.guardarProducto = guardarProducto;

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