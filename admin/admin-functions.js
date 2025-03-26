// Funciones del panel admin
const adminFunctions = {
    // Función para editar banner
    editarBanner: function() {
        document.getElementById('main-content').innerHTML = `
            <h2>Editor de Banner</h2>
            <div style="padding: 20px;">
                <img src="../img/banner.jpg" style="max-width: 100%; margin-bottom: 20px;">
                <div>
                    <input type="file" accept="image/*">
                    <button class="btn-accion">Guardar Banner</button>
                </div>
            </div>
        `;
    },

    // Función para editar hero
    editarHero: function() {
        document.getElementById('main-content').innerHTML = `
            <h2>Editor de Hero</h2>
            <div style="padding: 20px;">
                <img src="../img/hero.jpg" style="max-width: 100%; margin-bottom: 20px;">
                <div>
                    <input type="text" value="LA SUREÑA DECO" style="width: 100%; margin-bottom: 10px;">
                    <input type="text" value="HOME, BAZAR Y REGALERÍA" style="width: 100%; margin-bottom: 10px;">
                    <input type="file" accept="image/*">
                    <button class="btn-accion">Guardar Hero</button>
                </div>
            </div>
        `;
    },

    // Función para editar anuncios
    editarAnuncios: function() {
        document.getElementById('main-content').innerHTML = `
            <h2>Editor de Anuncios</h2>
            <div style="padding: 20px;">
                <input type="text" id="nuevo-anuncio" placeholder="Nuevo anuncio">
                <button onclick="adminFunctions.agregarAnuncio()">Agregar</button>
                <div id="lista-anuncios"></div>
            </div>
        `;
        this.mostrarAnuncios();
    },

    // Función para mostrar tabla de productos
    mostrarTabla: function() {
        document.getElementById('main-content').innerHTML = `
            <h2>Gestión de Productos</h2>
            <div style="padding: 20px;">
                <button class="btn-accion">Agregar Producto</button>
                <button class="btn-accion">Reiniciar Productos</button>
                <table style="width: 100%; margin-top: 20px;">
                    <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                    <tr>
                        <td><img src="../img/productos/sillon1.jpg" width="50"></td>
                        <td>Sillón Escandinavo</td>
                        <td>$199,999</td>
                        <td>10</td>
                        <td>
                            <button class="btn-accion">Editar</button>
                            <button class="btn-accion">Eliminar</button>
                        </td>
                    </tr>
                </table>
            </div>
        `;
    },

    // Función para gestionar usuarios
    gestionarUsuarios: function() {
        document.getElementById('main-content').innerHTML = `
            <h2>Gestión de Usuarios</h2>
            <div style="padding: 20px;">
                <table style="width: 100%;">
                    <tr>
                        <th>Usuario</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Acciones</th>
                    </tr>
                    <tr>
                        <td>admin</td>
                        <td>admin@lasurena.com</td>
                        <td>Administrador</td>
                        <td>
                            <button class="btn-accion">Editar</button>
                            <button class="btn-accion">Eliminar</button>
                        </td>
                    </tr>
                </table>
            </div>
        `;
    },

    // Función para mostrar historial de compras
    historialCompras: function() {
        document.getElementById('main-content').innerHTML = `
            <h2>Historial de Compras</h2>
            <div style="padding: 20px;">
                <table style="width: 100%;">
                    <tr>
                        <th>Fecha</th>
                        <th>Usuario</th>
                        <th>Producto</th>
                        <th>Total</th>
                    </tr>
                    <tr>
                        <td>2024-02-26</td>
                        <td>usuario1</td>
                        <td>Sillón Escandinavo</td>
                        <td>$199,999</td>
                    </tr>
                </table>
            </div>
        `;
    },

    // Funciones auxiliares para anuncios
    mostrarAnuncios: function() {
        const anuncios = this.obtenerAnuncios();
        const listaAnuncios = document.getElementById('lista-anuncios');
        if (listaAnuncios) {
            listaAnuncios.innerHTML = anuncios.map((anuncio, index) => `
                <div style="margin: 10px 0;">
                    <input type="text" value="${anuncio}" style="width: 300px;">
                    <button onclick="adminFunctions.eliminarAnuncio(${index})">Eliminar</button>
                </div>
            `).join('');
        }
    },

    obtenerAnuncios: function() {
        return JSON.parse(localStorage.getItem('anuncios')) || [
            "Envío gratis desde $80.000 en CABA",
            "CARNAVAL ¡4x3 EN TODA LA WEB!",
            "6 cuotas sin interés",
            "10% off con transferencia"
        ];
    },

    agregarAnuncio: function() {
        const input = document.getElementById('nuevo-anuncio');
        if (input && input.value.trim()) {
            const anuncios = this.obtenerAnuncios();
            anuncios.push(input.value.trim());
            localStorage.setItem('anuncios', JSON.stringify(anuncios));
            input.value = '';
            this.mostrarAnuncios();
        }
    },

    eliminarAnuncio: function(index) {
        const anuncios = this.obtenerAnuncios();
        anuncios.splice(index, 1);
        localStorage.setItem('anuncios', JSON.stringify(anuncios));
        this.mostrarAnuncios();
    }
};

// Hacer las funciones disponibles globalmente
window.adminFunctions = adminFunctions;

// Inicializar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando panel admin...');

    // Agregar event listeners a los botones
    document.getElementById('btnBanner').addEventListener('click', adminFunctions.editarBanner);
    document.getElementById('btnHero').addEventListener('click', adminFunctions.editarHero);
    document.getElementById('btnAnuncios').addEventListener('click', adminFunctions.editarAnuncios);
    document.getElementById('btnProductos').addEventListener('click', adminFunctions.mostrarTabla);
    document.getElementById('btnUsuarios').addEventListener('click', adminFunctions.gestionarUsuarios);
    document.getElementById('btnHistorial').addEventListener('click', adminFunctions.historialCompras);

    // Mostrar tabla por defecto
    adminFunctions.mostrarTabla();
}); 