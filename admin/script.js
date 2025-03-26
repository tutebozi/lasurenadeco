// Namespace para el admin
window.admin = {
    // Variables globales
    productos: [],
    categorias: JSON.parse(localStorage.getItem('categorias')) || {
        'hogar': ['Mesas', 'Sillas', 'Sofás', 'Estanterías'],
        'decoracion': ['Cuadros', 'Espejos', 'Alfombras', 'Cojines'],
        'iluminacion': ['Lámparas', 'Apliques', 'Techo', 'Pie'],
        'cocina': ['Vajilla', 'Cubiertos', 'Copas', 'Accesorios']
    },

    // Función para mostrar la tabla principal
    mostrarInicio: function() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="panel">
                <h2>Panel de Administración</h2>
                <p>Seleccione una opción del menú lateral para comenzar.</p>
            </div>
        `;
    },

    // Función para editar hero
    editarHero: function() {
        const mainContent = document.getElementById('main-content');
        const heroData = JSON.parse(localStorage.getItem('heroData')) || {
            titulo: 'LA SUREÑA DECO',
            subtitulo: 'Decoración para tu hogar',
            imagenes: []
        };

        mainContent.innerHTML = `
            <div class="panel">
                <h2>Editar Hero</h2>
                <form id="formulario-hero">
                    <div class="campo-formulario">
                        <label>Título:</label>
                        <input type="text" id="titulo-hero" value="${heroData.titulo}" required>
                    </div>
                    <div class="campo-formulario">
                        <label>Subtítulo:</label>
                        <input type="text" id="subtitulo-hero" value="${heroData.subtitulo}" required>
                    </div>
                    <div class="campo-formulario">
                        <label>Imágenes del Hero:</label>
                        ${[1, 2, 3].map(i => `
                            <div style="margin: 10px 0;">
                                <label>Imagen ${i}:</label>
                                <input type="file" id="imagen-hero-${i}" accept="image/*">
                                <img id="preview-${i}" src="${heroData.imagenes[i-1] || ''}" 
                                     class="preview-image" style="display: ${heroData.imagenes[i-1] ? 'block' : 'none'}">
                            </div>
                        `).join('')}
                    </div>
                    <div class="botones">
                        <button type="button" onclick="window.admin.guardarHero()" class="btn-accion">Guardar</button>
                        <button type="button" onclick="window.admin.mostrarInicio()" class="btn-accion">Cancelar</button>
                    </div>
                </form>
            </div>
        `;

        // Agregar preview de imágenes
        [1, 2, 3].forEach(i => {
            const input = document.getElementById(`imagen-hero-${i}`);
            const preview = document.getElementById(`preview-${i}`);
            
            input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    },

    // Función para guardar hero
    guardarHero: async function() {
        try {
            const titulo = document.getElementById('titulo-hero').value.trim();
            const subtitulo = document.getElementById('subtitulo-hero').value.trim();
            
            if (!titulo || !subtitulo) {
                alert('Por favor complete todos los campos');
                return;
            }
            
            const imagenes = [];
            let hayAlMenosUnaImagen = false;
            
            for (let i = 1; i <= 3; i++) {
                const input = document.getElementById(`imagen-hero-${i}`);
                const preview = document.getElementById(`preview-${i}`);
                
                if (input.files && input.files[0]) {
                    const base64 = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target.result);
                        reader.onerror = (e) => reject(e);
                        reader.readAsDataURL(input.files[0]);
                    });
                    imagenes.push(base64);
                    hayAlMenosUnaImagen = true;
                } else if (preview && preview.src && !preview.src.includes('data:image/svg+xml')) {
                    imagenes.push(preview.src);
                    hayAlMenosUnaImagen = true;
                }
            }

            if (!hayAlMenosUnaImagen) {
                alert('Por favor seleccione al menos una imagen');
                return;
            }
            
            const heroData = { titulo, subtitulo, imagenes };
            localStorage.setItem('heroData', JSON.stringify(heroData));
            
            alert('Hero actualizado exitosamente');
            this.mostrarInicio();
        } catch (error) {
            console.error('Error al guardar hero:', error);
            alert('Error al guardar los cambios del hero: ' + error.message);
        }
    },

    // Función para editar anuncios
    editarAnuncios: function() {
        const mainContent = document.getElementById('main-content');
        const anuncios = JSON.parse(localStorage.getItem('anuncios')) || ['', '', ''];
        
        mainContent.innerHTML = `
            <div class="panel">
                <h2>Editar Anuncios</h2>
                <div class="campo-formulario">
                    <label>Anuncio 1:</label>
                    <input type="text" id="anuncio1" value="${anuncios[0] || ''}" placeholder="Ingrese el texto del anuncio">
                </div>
                <div class="campo-formulario">
                    <label>Anuncio 2:</label>
                    <input type="text" id="anuncio2" value="${anuncios[1] || ''}" placeholder="Ingrese el texto del anuncio">
                </div>
                <div class="campo-formulario">
                    <label>Anuncio 3:</label>
                    <input type="text" id="anuncio3" value="${anuncios[2] || ''}" placeholder="Ingrese el texto del anuncio">
                </div>
                <div class="botones">
                    <button onclick="window.admin.guardarAnuncios()" class="btn-accion">Guardar</button>
                    <button onclick="window.admin.mostrarInicio()" class="btn-accion">Cancelar</button>
                </div>
            </div>
        `;
    },

    // Función para guardar anuncios
    guardarAnuncios: function() {
        try {
            const anuncio1 = document.getElementById('anuncio1').value.trim();
            const anuncio2 = document.getElementById('anuncio2').value.trim();
            const anuncio3 = document.getElementById('anuncio3').value.trim();

            const anuncios = [anuncio1, anuncio2, anuncio3].filter(a => a !== '');
            
            localStorage.setItem('anuncios', JSON.stringify(anuncios));
            
            alert('Anuncios guardados correctamente');
            this.mostrarInicio();
        } catch (error) {
            console.error('Error al guardar anuncios:', error);
            alert('Error al guardar los anuncios');
        }
    },

    // Función para gestionar categorías
    gestionarCategorias: function() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="panel">
                <h2>Gestionar Categorías</h2>
                <button onclick="window.admin.mostrarFormularioCategoria()" class="btn-accion">Nueva Categoría</button>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Subcategorías</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Object.entries(this.categorias).map(([categoria, subcategorias]) => `
                            <tr>
                                <td>${categoria}</td>
                                <td>${subcategorias.join(', ')}</td>
                                <td>
                                    <button onclick="window.admin.editarCategoria('${categoria}')" class="btn-accion">Editar</button>
                                    <button onclick="window.admin.eliminarCategoria('${categoria}')" class="btn-accion">Eliminar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Función para gestionar productos
    gestionarProductos: function() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="panel">
                <h2>Gestionar Productos</h2>
                <div class="botones">
                    <button onclick="window.admin.mostrarFormularioProducto()" class="btn-accion">Nuevo Producto</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.productos.map(p => `
                            <tr>
                                <td><img src="${p.imagen}" alt="${p.nombre}" style="width: 50px;"></td>
                                <td>${p.nombre}</td>
                                <td>$${p.precio}</td>
                                <td>${p.stock}</td>
                                <td>${p.categoria}</td>
                                <td>
                                    <button onclick="window.admin.editarProducto(${p.id})" class="btn-accion">Editar</button>
                                    <button onclick="window.admin.eliminarProducto(${p.id})" class="btn-accion">Eliminar</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    },

    // Función para gestionar usuarios
    gestionarUsuarios: function() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="panel">
                <h2>Gestionar Usuarios</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Admin</td>
                            <td>admin@lasurenadeco.com</td>
                            <td>Administrador</td>
                            <td>
                                <button class="btn-accion">Editar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    },

    // Función para historial de compras
    historialCompras: function() {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = `
            <div class="panel">
                <h2>Historial de Compras</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1001</td>
                            <td>Juan Pérez</td>
                            <td>2024-03-15</td>
                            <td>$45,000</td>
                            <td>Entregado</td>
                            <td>
                                <button onclick="window.admin.verDetalleCompra(1001)" class="btn-accion">Ver Detalle</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    },

    // Función para volver a la tienda
    volverTienda: function() {
        window.location.href = '../index.html';
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.admin.mostrarInicio();
}); 