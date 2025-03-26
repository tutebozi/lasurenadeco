// Variables globales
let usuarioActual = null;

// Función para mostrar el modal de login
function mostrarModalLogin() {
    const modalHTML = `
        <div id="modal-login" class="modal-login">
            <div class="modal-contenido-login">
                <button class="btn-cerrar" onclick="cerrarModalLogin()">&times;</button>
                <div class="tabs">
                    <button class="tab-btn active" onclick="cambiarTab('login')">Iniciar Sesión</button>
                    <button class="tab-btn" onclick="cambiarTab('registro')">Registrarse</button>
                </div>
                <div id="tab-login" class="tab-content active">
                    <form id="form-login" onsubmit="iniciarSesion(event)">
                        <input type="email" placeholder="Email" required>
                        <input type="password" placeholder="Contraseña" required>
                        <button type="submit">Iniciar Sesión</button>
                    </form>
                </div>
                <div id="tab-registro" class="tab-content">
                    <form id="form-registro" onsubmit="registrarUsuario(event)">
                        <input type="text" placeholder="Nombre" required>
                        <input type="email" placeholder="Email" required>
                        <input type="password" placeholder="Contraseña" required>
                        <button type="submit">Registrarse</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Función para cerrar el modal de login
function cerrarModalLogin() {
    const modal = document.getElementById('modal-login');
    if (modal) {
        modal.remove();
    }
}

// Función para cambiar entre tabs
function cambiarTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.querySelector(`[onclick="cambiarTab('${tab}')"]`).classList.add('active');
    document.getElementById(`tab-${tab}`).classList.add('active');
}

// Función para iniciar sesión
async function iniciarSesion(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    try {
        // Obtener usuarios del localStorage
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        
        // Buscar usuario
        const usuario = usuarios.find(u => u.email === email && u.password === password);
        
        if (usuario) {
            // Guardar sesión
            usuarioActual = {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email
            };
            localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
            
            // Actualizar interfaz
            actualizarInterfazUsuario();
            
            // Cerrar modal
            cerrarModalLogin();
            
            alert('¡Bienvenido de vuelta!');
        } else {
            alert('Email o contraseña incorrectos');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión');
    }
}

// Función para registrar usuario
async function registrarUsuario(event) {
    event.preventDefault();
    
    const form = event.target;
    const nombre = form.querySelector('input[type="text"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    
    try {
        // Obtener usuarios existentes
        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        
        // Verificar si el email ya está registrado
        if (usuarios.some(u => u.email === email)) {
            alert('Este email ya está registrado');
            return;
        }
        
        // Crear nuevo usuario
        const nuevoUsuario = {
            id: Date.now(),
            nombre,
            email,
            password,
            fechaRegistro: new Date().toISOString()
        };
        
        // Guardar usuario
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        // Iniciar sesión automáticamente
        usuarioActual = {
            id: nuevoUsuario.id,
            nombre: nuevoUsuario.nombre,
            email: nuevoUsuario.email
        };
        localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
        
        // Actualizar interfaz
        actualizarInterfazUsuario();
        
        // Cerrar modal
        cerrarModalLogin();
        
        alert('¡Registro exitoso!');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar usuario');
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    usuarioActual = null;
    localStorage.removeItem('usuarioActual');
    actualizarInterfazUsuario();
}

// Función para actualizar la interfaz según el estado de la sesión
function actualizarInterfazUsuario() {
    const userIcon = document.querySelector('.user-icon');
    
    if (usuarioActual) {
        // Usuario logueado
        userIcon.innerHTML = `
            <div class="user-menu-container">
                <i class="fas fa-user"></i>
                <div class="user-menu">
                    <span class="user-name">${usuarioActual.nombre}</span>
                    <a href="#" onclick="verPerfil()">Mi Perfil</a>
                    <a href="#" onclick="verPedidos()">Mis Pedidos</a>
                    <a href="#" onclick="cerrarSesion()">Cerrar Sesión</a>
                </div>
            </div>
        `;
    } else {
        // Usuario no logueado
        userIcon.innerHTML = '<i class="fas fa-user"></i>';
        userIcon.onclick = () => mostrarModalLogin();
    }
}

// Función para ver perfil (placeholder)
function verPerfil() {
    alert('Función de perfil en desarrollo');
}

// Función para ver pedidos (placeholder)
function verPedidos() {
    alert('Función de pedidos en desarrollo');
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay una sesión activa
    const sesionGuardada = localStorage.getItem('usuarioActual');
    if (sesionGuardada) {
        try {
            usuarioActual = JSON.parse(sesionGuardada);
            actualizarInterfazUsuario();
        } catch (error) {
            console.error('Error al cargar la sesión:', error);
            localStorage.removeItem('usuarioActual');
        }
    }
}); 