// Variables globales
let usuarioActual = JSON.parse(localStorage.getItem('usuarioActual')) || null;

// Funciones para mostrar/ocultar modales
function mostrarModalLogin() {
    cerrarCarrito(); // Cerrar el carrito si está abierto
    document.getElementById('modal-login').classList.add('mostrar');
}

function cerrarModalLogin() {
    document.getElementById('modal-login').classList.remove('mostrar');
}

function mostrarModalRegistro() {
    cerrarModalLogin();
    document.getElementById('modal-registro').classList.add('mostrar');
}

function cerrarModalRegistro() {
    document.getElementById('modal-registro').classList.remove('mostrar');
}

function mostrarRegistro() {
    document.getElementById('modal-login').classList.remove('mostrar');
    setTimeout(() => {
        document.getElementById('modal-registro').classList.add('mostrar');
    }, 300);
}

function mostrarLogin() {
    document.getElementById('modal-registro').classList.remove('mostrar');
    setTimeout(() => {
        document.getElementById('modal-login').classList.add('mostrar');
    }, 300);
}

// Función para iniciar sesión
async function iniciarSesion(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    
    if (usuario) {
        usuarioActual = {
            nombre: usuario.nombre,
            email: usuario.email
        };
        localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
        actualizarInterfazUsuario();
        cerrarModalLogin();
        mostrarMensaje('¡Bienvenido/a ' + usuario.nombre + '!', 'success');
    } else {
        mostrarMensaje('Email o contraseña incorrectos', 'error');
    }
}

// Función para registrar usuario
async function registrarUsuario(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre-registro').value;
    const email = document.getElementById('email-registro').value;
    const password = document.getElementById('password-registro').value;
    
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    if (usuarios.some(u => u.email === email)) {
        mostrarMensaje('Este email ya está registrado', 'error');
        return;
    }
    
    const nuevoUsuario = {
        nombre,
        email,
        password
    };
    
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    usuarioActual = {
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email
    };
    localStorage.setItem('usuarioActual', JSON.stringify(usuarioActual));
    
    actualizarInterfazUsuario();
    cerrarModalRegistro();
    mostrarMensaje('¡Registro exitoso! Bienvenido/a ' + nombre, 'success');
}

// Función para cerrar sesión
function cerrarSesion() {
    usuarioActual = null;
    localStorage.removeItem('usuarioActual');
    actualizarInterfazUsuario();
    mostrarMensaje('Has cerrado sesión', 'info');
}

// Función para actualizar la interfaz según el estado del usuario
function actualizarInterfazUsuario() {
    const userIcon = document.querySelector('.user-icon');
    
    if (usuarioActual) {
        userIcon.innerHTML = `
            <div class="user-menu-container">
                <i class="fas fa-user-circle"></i>
                <div class="user-menu">
                    <span class="user-name">${usuarioActual.nombre}</span>
                    <a href="#" onclick="cerrarSesion(); return false;">Cerrar sesión</a>
                </div>
            </div>
        `;
    } else {
        userIcon.innerHTML = '<i class="fas fa-user"></i>';
    }
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    const div = document.createElement('div');
    div.className = `mensaje mensaje-${tipo}`;
    div.textContent = mensaje;
    
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.classList.add('mostrar');
    }, 100);
    
    setTimeout(() => {
        div.classList.remove('mostrar');
        setTimeout(() => {
            div.remove();
        }, 300);
    }, 3000);
}

// Estilos para los mensajes
const styles = document.createElement('style');
styles.textContent = `
    .mensaje {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 4px;
        color: white;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
        z-index: 2100;
    }
    
    .mensaje.mostrar {
        opacity: 1;
        transform: translateY(0);
    }
    
    .mensaje-success {
        background-color: #4caf50;
    }
    
    .mensaje-error {
        background-color: #f44336;
    }
    
    .mensaje-info {
        background-color: #2196f3;
    }
    
    .user-menu-container {
        position: relative;
        cursor: pointer;
    }
    
    .user-menu {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 1rem;
        min-width: 150px;
        display: none;
    }
    
    .user-menu-container:hover .user-menu {
        display: block;
    }
    
    .user-name {
        display: block;
        margin-bottom: 0.5rem;
        color: #333;
        font-weight: 500;
    }
    
    .user-menu a {
        color: #666;
        text-decoration: none;
        display: block;
        padding: 0.5rem 0;
    }
    
    .user-menu a:hover {
        color: #8b7355;
    }
`;

document.head.appendChild(styles);

// Inicializar la interfaz cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    actualizarInterfazUsuario();
}); 