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
let productoEditando = null;

// Función para cambiar entre secciones
document.querySelectorAll('.sidebar a').forEach(enlace => {
    enlace.addEventListener('click', (e) => {
        e.preventDefault();
        const seccion = e.target.closest('a').dataset.section;
        mostrarSeccion(seccion);
    });
});

function mostrarSeccion(seccion) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar a').forEach(a => a.classList.remove('active'));
    
    document.getElementById(seccion).classList.add('active');
    document.querySelector(`[data-section="${seccion}"]`).classList.add('active');
}

// Función para guardar banner
async function guardarBanner() {
    const input = document.getElementById('bannerFile');
    if (input.files && input.files[0]) {
        const file = input.files[0];
        try {
            const imagenComprimida = await comprimirImagen(file);
            localStorage.setItem('bannerImage', imagenComprimida);
            alert('Banner actualizado exitosamente');
        } catch (error) {
            console.error('Error al guardar el banner:', error);
            alert('Error al guardar el banner. Por favor, intenta de nuevo.');
        }
    }
}

// Función para guardar hero
async function guardarHero() {
    const input = document.getElementById('heroFile');
    const titulo = document.getElementById('heroTitulo');
    const subtitulo = document.getElementById('heroSubtitulo');
    
    try {
        let heroData = {
            titulo: titulo.value,
            subtitulo: subtitulo.value,
            imagen: null
        };
        
        if (input.files && input.files[0]) {
            const imagenComprimida = await comprimirImagen(input.files[0]);
            heroData.imagen = imagenComprimida;
        }
        
        localStorage.setItem('heroData', JSON.stringify(heroData));
        alert('Hero actualizado exitosamente');
    } catch (error) {
        console.error('Error al guardar el hero:', error);
        alert('Error al guardar el hero. Por favor, intenta de nuevo.');
    }
}

// Función para comprimir imagen
function comprimirImagen(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calcular nuevas dimensiones manteniendo proporción
                const MAX_WIDTH = 800;
                const MAX_HEIGHT = 800;
                
                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convertir a JPEG con calidad reducida
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                resolve(compressedDataUrl);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// Funciones para gestión de productos
function mostrarFormularioProducto(producto = null) {
    productoEditando = producto;
    const modal = document.getElementById('modal-producto');
    const titulo = document.getElementById('modal-titulo');
    const form = document.getElementById('form-producto');
    
    titulo.textContent = producto ? 'Editar Producto' : 'Nuevo Producto';
    
    if (producto) {
        form.producto_id.value = producto.id;
        form.nombre.value = producto.nombre;
        form.precio.value = producto.precio;
        form.descripcion.value = producto.descripcion;
        form.categoria.value = producto.categoria;
        form.stock.value = producto.stock;
        
        if (producto.imagen) {
            const preview = document.getElementById('preview-imagen');
            preview.innerHTML = `<img src="${producto.imagen}" alt="Preview">`;
        }
    } else {
        form.reset();
        document.getElementById('preview-imagen').innerHTML = '';
    }
    
    modal.style.display = 'block';
}

function cerrarModalProducto() {
    const modal = document.getElementById('modal-producto');
    modal.style.display = 'none';
    productoEditando = null;
}

async function guardarProducto(event) {
    event.preventDefault();
    
    try {
        const form = event.target;
        
        const producto = {
            id: productoEditando ? productoEditando.id : Date.now(),
            nombre: form.nombre.value,
            precio: parseFloat(form.precio.value),
            descripcion: form.descripcion.value,
            categoria: form.categoria.value,
            stock: parseInt(form.stock.value)
        };
        
        const imagenFile = form.imagen.files[0];
        if (imagenFile) {
            try {
                const imagenComprimida = await comprimirImagen(imagenFile);
                producto.imagen = imagenComprimida;
            } catch (error) {
                console.error('Error al comprimir la imagen:', error);
                alert('Error al procesar la imagen. Por favor, intenta con una imagen más pequeña.');
                return;
            }
        } else if (productoEditando && productoEditando.imagen) {
            producto.imagen = productoEditando.imagen;
        }
        
        // Intentar guardar con manejo de errores de cuota
        try {
            await finalizarGuardado(producto);
            cerrarModalProducto();
            cargarProductos();
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                alert('No hay suficiente espacio para guardar la imagen. Por favor, usa una imagen más pequeña o libera espacio eliminando algunos productos.');
            } else {
                console.error('Error al guardar el producto:', error);
                alert('Error al guardar el producto. Por favor, intenta de nuevo.');
            }
        }
    } catch (error) {
        console.error('Error en guardarProducto:', error);
        alert('Error al procesar el producto. Por favor, intenta de nuevo.');
    }
}

async function finalizarGuardado(producto) {
    return new Promise((resolve, reject) => {
        try {
            productos = JSON.parse(localStorage.getItem('productos')) || [];
            
            const index = productos.findIndex(p => p.id === producto.id);
            if (index !== -1) {
                productos[index] = producto;
            } else {
                productos.push(producto);
            }
            
            localStorage.setItem('productos', JSON.stringify(productos));
            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

function eliminarProducto(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        try {
            // Obtener productos actuales
            productos = JSON.parse(localStorage.getItem('productos')) || [];
            
            // Filtrar el producto a eliminar usando toString() para comparación segura
            productos = productos.filter(p => p.id.toString() !== id.toString());
            
            // Guardar la lista actualizada
            localStorage.setItem('productos', JSON.stringify(productos));
            
            // Recargar la lista de productos
            cargarProductos();
            
            alert('Producto eliminado exitosamente');
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert('Error al eliminar el producto. Por favor, intenta de nuevo.');
        }
    }
}

function cargarProductos() {
    productos = JSON.parse(localStorage.getItem('productos')) || [];
    const contenedor = document.getElementById('lista-productos');
    
    if (productos.length === 0) {
        contenedor.innerHTML = '<p class="no-productos">No hay productos registrados</p>';
        return;
    }
    
    contenedor.innerHTML = productos.map(producto => `
        <div class="producto-card">
            <img src="${producto.imagen || '../img/placeholder.jpg'}" alt="${producto.nombre}"
                 onerror="this.src='../img/placeholder.jpg'">
            <div class="producto-info">
                <h3>${producto.nombre}</h3>
                <p class="precio">$${producto.precio.toLocaleString()}</p>
                <p class="categoria">${producto.categoria}</p>
                <p class="stock">Stock: ${producto.stock}</p>
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
    `).join('');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
});

// Preview de imagen
document.getElementById('imagen').addEventListener('change', function(e) {
    const preview = document.getElementById('preview-imagen');
    const file = e.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    } else {
        preview.innerHTML = '';
    }
});

// Hacer las funciones disponibles globalmente
window.guardarBanner = guardarBanner;
window.guardarHero = guardarHero;
window.mostrarSeccion = mostrarSeccion;
window.mostrarFormularioProducto = mostrarFormularioProducto;
window.cerrarModalProducto = cerrarModalProducto;
window.guardarProducto = guardarProducto;
window.eliminarProducto = eliminarProducto;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
});

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