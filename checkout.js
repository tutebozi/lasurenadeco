// Función para iniciar el proceso de checkout
function iniciarCheckout() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        mostrarMensaje('El carrito está vacío', 'error');
        return;
    }

    // Crear el modal de checkout
    const modalCheckout = document.createElement('div');
    modalCheckout.className = 'modal-checkout';
    modalCheckout.innerHTML = `
        <div class="checkout-contenido">
            <button class="btn-cerrar-modal" onclick="cerrarCheckout()">×</button>
            <div class="checkout-pasos">
                <div class="paso activo">
                    <span class="numero">1</span>
                    <span class="texto">Carrito</span>
                </div>
                <div class="paso">
                    <span class="numero">2</span>
                    <span class="texto">Entrega</span>
                </div>
                <div class="paso">
                    <span class="numero">3</span>
                    <span class="texto">Pago</span>
                </div>
            </div>

            <div class="checkout-formulario">
                <h2>Datos de contacto</h2>
                <div class="campo-formulario">
                    <label for="email">E-mail</label>
                    <input type="email" id="email" required>
                </div>

                <div class="campo-checkbox">
                    <input type="checkbox" id="ofertas">
                    <label for="ofertas">Quiero recibir ofertas y novedades por e-mail</label>
                </div>

                <div id="datos-iniciales-envio">
                    <h3>Datos para calcular envío</h3>
                    <div class="campo-formulario">
                        <label for="codigo-postal-calculo">Código Postal</label>
                        <input type="text" id="codigo-postal-calculo">
                    </div>
                    <button type="button" class="btn-calcular-envio" onclick="calcularCostosEnvio()">Calcular costos de envío</button>
                </div>

                <h2>Entrega</h2>
                <div class="opciones-entrega" id="opciones-entrega">
                    <div class="calculando-envio" id="calculando-envio" style="display: none;">
                        <div class="spinner-small"></div>
                        <p>Calculando opciones de envío...</p>
                    </div>
                    <p id="sin-opciones-envio" style="display: none;">Ingresa tu código postal para ver las opciones de envío disponibles</p>
                </div>

                <div id="datos-envio" style="display: none;">
                    <h3>Datos de envío</h3>
                    <div class="campo-formulario">
                        <label for="nombre">Nombre</label>
                        <input type="text" id="nombre">
                    </div>
                    <div class="campo-formulario">
                        <label for="apellido">Apellido</label>
                        <input type="text" id="apellido">
                    </div>
                    <div class="campo-formulario">
                        <label for="telefono">Teléfono</label>
                        <input type="tel" id="telefono">
                    </div>
                    <div class="campo-formulario">
                        <label for="direccion">Dirección</label>
                        <input type="text" id="direccion">
                    </div>
                    <div class="campo-formulario">
                        <label for="codigo-postal">Código Postal</label>
                        <input type="text" id="codigo-postal">
                    </div>
                    <div class="campo-formulario">
                        <label for="ciudad">Ciudad</label>
                        <input type="text" id="ciudad">
                    </div>
                    <div class="campo-formulario">
                        <label for="provincia">Provincia</label>
                        <input type="text" id="provincia">
                    </div>
                </div>

                <div class="resumen-compra">
                    <h3>Resumen de compra</h3>
                    <div class="items-resumen">
                        ${generarResumenItems()}
                    </div>
                    <div class="total-resumen">
                        <span>Total</span>
                        <span class="precio-total">${calcularTotal()}</span>
                    </div>
                </div>

                <button class="btn-continuar" onclick="continuarAPago()">Continuar para el pago</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalCheckout);
    setupEventListeners();
}

// Función para generar el HTML del resumen de items
function generarResumenItems() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    return carrito.map(item => `
        <div class="item-resumen">
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="item-detalles">
                <h4>${item.nombre}</h4>
                <span class="cantidad">Cantidad: ${item.cantidad}</span>
            </div>
            <span class="precio">$${formatearPrecio(item.precio * item.cantidad)}</span>
        </div>
    `).join('');
}

// Función para calcular el total
function calcularTotal() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    return `$${formatearPrecio(subtotal)}`;
}

// Función para formatear precio
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-AR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(precio);
}

// Función para cerrar el checkout
function cerrarCheckout() {
    const modalCheckout = document.querySelector('.modal-checkout');
    if (modalCheckout) {
        modalCheckout.remove();
    }
}

// Función para configurar los event listeners
function setupEventListeners() {
    const radiosDomicilio = document.querySelector('#domicilio');
    const radiosOca = document.querySelector('#oca');
    const radiosRetiro = document.querySelector('#retiro');
    const datosEnvio = document.querySelector('#datos-envio');
    
    // Función para manejar la visibilidad de los campos de envío
    const actualizarCamposEnvio = () => {
        if (!datosEnvio) return;
        
        const domicilioSeleccionado = radiosDomicilio && radiosDomicilio.checked;
        const ocaSeleccionado = radiosOca && radiosOca.checked;
        
        // Mostrar los campos de envío solo si se seleccionó domicilio u OCA
        datosEnvio.style.display = (domicilioSeleccionado || ocaSeleccionado) ? 'block' : 'none';
    };
    
    // Configurar listeners para todos los métodos de envío
    if (radiosDomicilio) {
        radiosDomicilio.addEventListener('change', actualizarCamposEnvio);
    }
    
    if (radiosOca) {
        radiosOca.addEventListener('change', actualizarCamposEnvio);
    }
    
    if (radiosRetiro) {
        radiosRetiro.addEventListener('change', actualizarCamposEnvio);
    }
    
    // Ejecutar una vez para establecer el estado inicial
    actualizarCamposEnvio();
}

// Función para continuar al pago
function continuarAPago() {
    try {
        console.log('Iniciando validación para continuar al pago');
        
        if (!validarFormulario()) {
            console.log('Validación fallida');
            return;
        }
        
        console.log('Validación exitosa, recolectando datos del formulario');
        
        const datosCompra = recolectarDatosFormulario();
        console.log('Datos recolectados:', datosCompra);
        
        // Optimizar los datos antes de guardarlos
        const datosOptimizados = optimizarDatosCompra(datosCompra);
        
        try {
            localStorage.setItem('datosCompra', JSON.stringify(datosOptimizados));
            console.log('Datos guardados en localStorage');
        } catch (storageError) {
            console.error('Error al guardar en localStorage:', storageError);
            
            // Si el error es por quota excedida, intentamos con una versión aún más reducida
            if (storageError.name === 'QuotaExceededError') {
                console.log('Intentando con versión ultra-reducida de los datos');
                const miniDatos = {
                    email: datosCompra.email,
                    metodoEntrega: datosCompra.metodoEntrega,
                    costoEnvio: datosCompra.costoEnvio,
                    subtotal: datosCompra.subtotal,
                    total: datosCompra.total,
                    // Guardar solo IDs y cantidades del carrito
                    carrito: datosCompra.carrito.map(item => ({ 
                        id: item.id, 
                        cantidad: item.cantidad,
                        nombre: item.nombre,
                        precio: item.precio
                    }))
                };
                
                try {
                    localStorage.setItem('datosCompra', JSON.stringify(miniDatos));
                    console.log('Datos reducidos guardados exitosamente');
                } catch (reducedStorageError) {
                    console.error('Falló incluso con datos reducidos:', reducedStorageError);
                    // Continuar de todos modos, ya tenemos los datos en memoria
                }
            }
            
            // En cualquier caso, continuamos con el proceso
            console.log('Continuando con el proceso a pesar del error de almacenamiento');
            // Guardar los datos en una variable global como respaldo
            window.datosCompraTemp = datosCompra;
        }
        
        mostrarFormularioPago();
    } catch (error) {
        console.error('Error al continuar al pago:', error);
        mostrarMensaje('Ocurrió un error al procesar tu información. Por favor, intenta nuevamente.', 'error');
    }
}

// Función para optimizar los datos de compra y reducir su tamaño
function optimizarDatosCompra(datos) {
    // Crear una copia para no modificar el original
    const datosOptimizados = JSON.parse(JSON.stringify(datos));
    
    // Si hay carrito, optimizar las imágenes y datos redundantes
    if (datosOptimizados.carrito && datosOptimizados.carrito.length > 0) {
        datosOptimizados.carrito = datosOptimizados.carrito.map(item => {
            // Crear una versión optimizada del item
            const itemOptimizado = {
                id: item.id,
                nombre: item.nombre,
                precio: item.precio,
                cantidad: item.cantidad
            };
            
            // Si la imagen es una URL normal, la mantenemos
            // Si es base64, la omitimos para ahorrar espacio
            if (item.imagen && !item.imagen.startsWith('data:')) {
                itemOptimizado.imagen = item.imagen;
            }
            
            return itemOptimizado;
        });
    }
    
    return datosOptimizados;
}

// Función para validar el formulario
function validarFormulario() {
    const email = document.querySelector('.checkout-contenido #email');
    
    console.log('Validando email:', email ? email.value : 'elemento no encontrado');
    
    if (!email || !email.value) {
        mostrarMensaje('Por favor, ingresa tu email', 'error');
        return false;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        mostrarMensaje('Por favor, ingresa un email válido', 'error');
        return false;
    }

    // Comprobar que se ha seleccionado un método de envío
    const metodosEntrega = document.querySelectorAll('input[name="entrega"]');
    let entregaSeleccionada = false;
    let esRetiro = false;
    
    console.log('Métodos de entrega encontrados:', metodosEntrega.length);
    
    metodosEntrega.forEach(metodo => {
        if (metodo.checked) {
            entregaSeleccionada = true;
            if (metodo.id === 'retiro') {
                esRetiro = true;
            }
            console.log('Método seleccionado:', metodo.value, 'Es retiro:', esRetiro);
        }
    });

    if (!entregaSeleccionada) {
        mostrarMensaje('Por favor, selecciona un método de entrega', 'error');
        return false;
    }

    // Si NO es retiro y seleccionó envío a domicilio o OCA, validar campos adicionales
    if (!esRetiro) {
        const domicilioChecked = document.querySelector('#domicilio') && document.querySelector('#domicilio').checked;
        const ocaChecked = document.querySelector('#oca') && document.querySelector('#oca').checked;
        
        console.log('Envío a domicilio seleccionado:', domicilioChecked);
        console.log('OCA seleccionado:', ocaChecked);
        
        if (domicilioChecked || ocaChecked) {
            const camposObligatorios = ['nombre', 'apellido', 'telefono', 'direccion', 'codigo-postal', 'ciudad', 'provincia'];
            for (let campo of camposObligatorios) {
                const input = document.querySelector(`#${campo}`);
                if (!input || !input.value) {
                    mostrarMensaje(`Por favor, completa el campo ${campo.replace('-', ' ')}`, 'error');
                    return false;
                }
            }
        }
    }

    return true;
}

// Función para recolectar datos del formulario
function recolectarDatosFormulario() {
    try {
        const metodoEntregaElement = document.querySelector('input[name="entrega"]:checked');
        if (!metodoEntregaElement) {
            throw new Error('No se ha seleccionado un método de entrega');
        }
        
        const metodoEntrega = metodoEntregaElement.value;
        const esRetiro = metodoEntregaElement.id === 'retiro';
        
        console.log('Método seleccionado para recolectar datos:', metodoEntrega, 'Es retiro:', esRetiro);
        
        // Obtener el precio directamente del elemento HTML seleccionado
        const elementoPrecio = metodoEntregaElement.closest('.opcion-entrega').querySelector('.precio');
        if (!elementoPrecio) {
            throw new Error('No se pudo encontrar el precio del método de entrega');
        }
        
        const precioTexto = elementoPrecio.textContent;
        let costoEnvio = 0;
        
        if (precioTexto !== 'Gratis') {
            // Extraer el valor numérico del texto del precio (por ejemplo, de "$5.200,00" a 5200)
            costoEnvio = parseFloat(precioTexto.replace('$', '').replace('.', '').replace(',', '.'));
        }
        
        const emailElement = document.querySelector('.checkout-contenido #email');
        if (!emailElement || !emailElement.value) {
            throw new Error('Email no encontrado o vacío');
        }
        
        const ofertasElement = document.querySelector('#ofertas');
        
        // Preparamos un objeto con los datos básicos
        const datos = {
            email: emailElement.value,
            recibirOfertas: ofertasElement ? ofertasElement.checked : false,
            metodoEntrega,
            costoEnvio,
            carrito: JSON.parse(localStorage.getItem('carrito')) || [],
            subtotal: calcularSubtotal(),
        };
        
        // Calculamos el total
        datos.total = datos.subtotal + costoEnvio;
        
        // Si seleccionó envío a domicilio o OCA (NO retiro), añadir los datos de envío
        if (!esRetiro && (metodoEntrega === 'domicilio' || metodoEntrega === 'oca')) {
            const camposObligatorios = ['nombre', 'apellido', 'telefono', 'direccion', 'codigo-postal', 'ciudad', 'provincia'];
            const datosEnvio = {};
            
            for (let campo of camposObligatorios) {
                const input = document.querySelector(`#${campo}`);
                if (!input || !input.value) {
                    throw new Error(`Campo ${campo} no encontrado o vacío`);
                }
                // Convertimos el nombre del campo de HTML (con guiones) a camelCase para JavaScript
                const campoJS = campo.replace(/-([a-z])/g, g => g[1].toUpperCase());
                datosEnvio[campoJS] = input.value;
            }
            
            datos.datosEnvio = datosEnvio;
        } else {
            datos.datosEnvio = null;
        }
        
        return datos;
    } catch (error) {
        console.error('Error al recolectar datos del formulario:', error);
        mostrarMensaje('Error al procesar los datos: ' + error.message, 'error');
        throw error;
    }
}

// Función para calcular el subtotal
function calcularSubtotal() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// Función para mostrar el formulario de pago
function mostrarFormularioPago() {
    const checkoutContenido = document.querySelector('.checkout-contenido');
    
    // Intentar obtener datos del localStorage, si falla usar los temporales
    let datosCompra;
    try {
        datosCompra = JSON.parse(localStorage.getItem('datosCompra'));
    } catch (error) {
        console.warn('Error al leer datosCompra de localStorage, usando datos temporales');
    }
    
    // Si no hay datos en localStorage, usar los temporales
    if (!datosCompra && window.datosCompraTemp) {
        datosCompra = window.datosCompraTemp;
    }
    
    // Si aún no hay datos, mostrar error
    if (!datosCompra) {
        mostrarMensaje('No se pudieron cargar los datos de compra', 'error');
        return;
    }

    // Actualizar indicador de paso
    document.querySelectorAll('.paso').forEach((paso, index) => {
        if (index === 2) paso.classList.add('activo');
        else paso.classList.remove('activo');
    });

    checkoutContenido.innerHTML = `
        <button class="btn-cerrar-modal" onclick="cerrarCheckout()">×</button>
        <div class="checkout-pasos">
            <div class="paso">
                <span class="numero">1</span>
                <span class="texto">Carrito</span>
            </div>
            <div class="paso">
                <span class="numero">2</span>
                <span class="texto">Entrega</span>
            </div>
            <div class="paso activo">
                <span class="numero">3</span>
                <span class="texto">Pago</span>
            </div>
        </div>

        <div class="formulario-pago">
            <h2>Método de pago</h2>
            <div class="metodos-pago">
                <div class="metodo-pago">
                    <input type="radio" name="metodoPago" id="tarjeta" value="tarjeta" checked>
                    <label for="tarjeta">Tarjeta de crédito/débito</label>
                    <div class="campos-tarjeta">
                        <div class="campo-formulario">
                            <label for="numero-tarjeta">Número de tarjeta</label>
                            <input type="text" id="numero-tarjeta" maxlength="16">
                        </div>
                        <div class="campo-formulario">
                            <label for="nombre-tarjeta">Nombre en la tarjeta</label>
                            <input type="text" id="nombre-tarjeta">
                        </div>
                        <div class="campos-tarjeta-flex">
                            <div class="campo-formulario">
                                <label for="vencimiento">Vencimiento (MM/AA)</label>
                                <input type="text" id="vencimiento" maxlength="5">
                            </div>
                            <div class="campo-formulario">
                                <label for="cvv">CVV</label>
                                <input type="text" id="cvv" maxlength="4">
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="metodo-pago">
                    <input type="radio" name="metodoPago" id="mercadopago" value="mercadopago">
                    <label for="mercadopago" class="label-mercadopago">
                        <span>Mercado Pago</span>
                        <img src="https://http2.mlstatic.com/frontend-assets/mp-web-navigation/badge.svg" alt="Mercado Pago" class="logo-mercadopago">
                    </label>
                    <div class="info-mercadopago" style="display: none;">
                        <p>Al hacer clic en "Pagar con Mercado Pago" serás redirigido a la plataforma segura de Mercado Pago para completar tu pago.</p>
                    </div>
                </div>
            </div>

            <div class="resumen-final">
                <h3>Total a pagar</h3>
                <div class="precio-final">$${formatearPrecio(datosCompra.total)}</div>
            </div>

            <button class="btn-pagar" onclick="procesarPago()">Pagar</button>
        </div>
    `;

    setupEventListenersPago();
}

// Función para configurar los event listeners del formulario de pago
function setupEventListenersPago() {
    const numeroTarjeta = document.querySelector('#numero-tarjeta');
    if (numeroTarjeta) {
        numeroTarjeta.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    const vencimiento = document.querySelector('#vencimiento');
    if (vencimiento) {
        vencimiento.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            e.target.value = value;
        });
    }

    const cvv = document.querySelector('#cvv');
    if (cvv) {
        cvv.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    
    // Agregar listeners para mostrar/ocultar información de Mercado Pago
    const radioTarjeta = document.querySelector('#tarjeta');
    const radioMercadoPago = document.querySelector('#mercadopago');
    const camposTarjeta = document.querySelector('.campos-tarjeta');
    const infoMercadoPago = document.querySelector('.info-mercadopago');
    
    if (radioTarjeta && radioMercadoPago && camposTarjeta && infoMercadoPago) {
        radioTarjeta.addEventListener('change', () => {
            camposTarjeta.style.display = 'block';
            infoMercadoPago.style.display = 'none';
            document.querySelector('.btn-pagar').textContent = 'Pagar';
        });
        
        radioMercadoPago.addEventListener('change', () => {
            camposTarjeta.style.display = 'none';
            infoMercadoPago.style.display = 'block';
            document.querySelector('.btn-pagar').textContent = 'Pagar con Mercado Pago';
        });
    }
}

// Función para procesar el pago
function procesarPago() {
    try {
        const metodoPago = document.querySelector('input[name="metodoPago"]:checked');
        if (!metodoPago) {
            mostrarMensaje('Por favor, selecciona un método de pago', 'error');
            return;
        }
        
        // Si el método es Mercado Pago, redirigir a MP
        if (metodoPago.value === 'mercadopago') {
            procesarPagoMercadoPago();
            return;
        }
        
        // Para tarjeta normal, validar los datos
        if (!validarDatosPago()) {
            return;
        }

        mostrarMensajeProcesando();

        setTimeout(() => {
            try {
                // Limpiar localStorage y variables globales
                localStorage.removeItem('carrito');
                localStorage.removeItem('datosCompra');
                
                if (typeof carrito !== 'undefined') {
                    carrito = [];
                }
                
                // Limpiar datos temporales
                if (window.datosCompraTemp) {
                    delete window.datosCompraTemp;
                }
                
                if (typeof actualizarContadorCarrito === 'function') {
                    actualizarContadorCarrito();
                }
                
                mostrarConfirmacion();
            } catch (error) {
                console.error('Error al finalizar el pago:', error);
                mostrarMensaje('Hubo un problema al procesar el pago. Tu pedido fue recibido pero contacta con soporte.', 'error');
            }
        }, 2000);
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        mostrarMensaje('Ocurrió un error al procesar el pago. Por favor, intenta nuevamente.', 'error');
    }
}

// Función para procesar el pago con Mercado Pago
function procesarPagoMercadoPago() {
    try {
        // Obtener datos de compra
        let datosCompra;
        try {
            datosCompra = JSON.parse(localStorage.getItem('datosCompra'));
        } catch (error) {
            console.warn('Error al leer datosCompra de localStorage, usando datos temporales');
        }
        
        if (!datosCompra && window.datosCompraTemp) {
            datosCompra = window.datosCompraTemp;
        }
        
        // Mostrar mensaje procesando
        mostrarMensajeProcesando('Preparando redirección a Mercado Pago...');
        
        // Crear una página intermedia que simule la redirección a Mercado Pago
        setTimeout(() => {
            const checkoutContenido = document.querySelector('.checkout-contenido');
            
            checkoutContenido.innerHTML = `
                <div class="redireccion-mercadopago">
                    <img src="https://http2.mlstatic.com/frontend-assets/mp-web-navigation/badge.svg" alt="Mercado Pago" class="logo-mercadopago-grande">
                    <h2>Redirigiendo a Mercado Pago</h2>
                    <p>Estás siendo redirigido a la plataforma segura de Mercado Pago...</p>
                    <div class="spinner"></div>
                    <p class="texto-secundario">No cierres esta ventana. Serás redirigido automáticamente en unos segundos.</p>
                    
                    <div class="botones-redireccion">
                        <button class="btn-simular-pago" onclick="simularPagoExitoso()">Simular pago exitoso</button>
                        <button class="btn-simular-cancelacion" onclick="simularPagoCancelado()">Simular cancelación</button>
                    </div>
                    
                    <p class="nota-demo">Nota: En un entorno real, serías redirigido automáticamente a la página de pago de Mercado Pago.</p>
                </div>
            `;
            
            // Agregar estilos específicos para la página de redirección
            const style = document.createElement('style');
            style.textContent = `
                .redireccion-mercadopago {
                    text-align: center;
                    padding: 2rem;
                }
                
                .logo-mercadopago-grande {
                    height: 50px;
                    margin-bottom: 1.5rem;
                }
                
                .botones-redireccion {
                    margin-top: 2rem;
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                }
                
                .btn-simular-pago {
                    background-color: #009ee3;
                    color: white;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                }
                
                .btn-simular-cancelacion {
                    background-color: #f5f5f5;
                    color: #333;
                    border: 1px solid #ddd;
                    padding: 0.8rem 1.5rem;
                    border-radius: 4px;
                    cursor: pointer;
                }
                
                .texto-secundario {
                    color: #666;
                    margin-top: 1rem;
                }
                
                .nota-demo {
                    margin-top: 2rem;
                    font-size: 0.9rem;
                    color: #888;
                    font-style: italic;
                }
            `;
            document.head.appendChild(style);
            
        }, 1500);
    } catch (error) {
        console.error('Error al procesar el pago con Mercado Pago:', error);
        mostrarMensaje('Ocurrió un error al procesar el pago. Por favor, intenta nuevamente.', 'error');
    }
}

// Función para simular un pago exitoso
function simularPagoExitoso() {
    try {
        // Mostrar mensaje de procesamiento directamente en el contenido principal
        const checkoutContenido = document.querySelector('.checkout-contenido');
        if (!checkoutContenido) {
            throw new Error('No se encontró el contenedor del checkout');
        }
        
        checkoutContenido.innerHTML = `
            <div class="procesando-pago">
                <div class="spinner"></div>
                <h2>Verificando pago...</h2>
                <p>Por favor, no cierres esta ventana</p>
            </div>
        `;
        
        setTimeout(() => {
            // Limpiar datos
            localStorage.removeItem('carrito');
            localStorage.removeItem('datosCompra');
            
            if (typeof carrito !== 'undefined') {
                carrito = [];
            }
            
            // Limpiar datos temporales
            if (window.datosCompraTemp) {
                delete window.datosCompraTemp;
            }
            
            if (typeof actualizarContadorCarrito === 'function') {
                actualizarContadorCarrito();
            }
            
            // Mostrar confirmación
            mostrarConfirmacion('mercadopago');
        }, 1500);
    } catch (error) {
        console.error('Error al finalizar el pago:', error);
        mostrarMensaje('Hubo un problema al procesar el pago. Tu pedido fue recibido pero contacta con soporte.', 'error');
    }
}

// Función para simular un pago cancelado
function simularPagoCancelado() {
    const checkoutContenido = document.querySelector('.checkout-contenido');
    
    checkoutContenido.innerHTML = `
        <button class="btn-cerrar-modal" onclick="cerrarCheckout()">×</button>
        <div class="pago-cancelado">
            <div class="icono-cancelado">×</div>
            <h2>Pago cancelado</h2>
            <p>Has cancelado el proceso de pago con Mercado Pago.</p>
            <p>Tu carrito se ha guardado y puedes intentar nuevamente cuando quieras.</p>
            <div class="botones-cancelado">
                <button class="btn-volver-pago" onclick="mostrarFormularioPago()">Volver a métodos de pago</button>
                <button class="btn-volver-tienda" onclick="cerrarCheckout()">Volver a la tienda</button>
            </div>
        </div>
    `;
    
    // Agregar estilos específicos para la cancelación
    const style = document.createElement('style');
    style.textContent = `
        .pago-cancelado {
            text-align: center;
            padding: 2rem;
        }
        
        .icono-cancelado {
            width: 80px;
            height: 80px;
            background-color: #dc3545;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            margin: 0 auto 1.5rem;
        }
        
        .botones-cancelado {
            margin-top: 2rem;
            display: flex;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
        }
        
        .btn-volver-pago {
            background-color: var(--accent-color);
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .btn-volver-tienda {
            background-color: #f5f5f5;
            color: #333;
            border: 1px solid #ddd;
            padding: 0.8rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
}

// Función para validar los datos de pago
function validarDatosPago() {
    const numeroTarjeta = document.querySelector('#numero-tarjeta');
    const nombreTarjeta = document.querySelector('#nombre-tarjeta');
    const vencimiento = document.querySelector('#vencimiento');
    const cvv = document.querySelector('#cvv');

    if (!numeroTarjeta.value || numeroTarjeta.value.length !== 16) {
        mostrarMensaje('Número de tarjeta inválido', 'error');
        return false;
    }

    if (!nombreTarjeta.value) {
        mostrarMensaje('Ingresa el nombre como aparece en la tarjeta', 'error');
        return false;
    }

    if (!vencimiento.value || !vencimiento.value.includes('/')) {
        mostrarMensaje('Fecha de vencimiento inválida', 'error');
        return false;
    }

    if (!cvv.value || cvv.value.length < 3) {
        mostrarMensaje('CVV inválido', 'error');
        return false;
    }

    return true;
}

// Función para mostrar mensaje de procesamiento con texto personalizable
function mostrarMensajeProcesando(mensaje = 'Procesando tu pago...') {
    // Intentar primero con el contenedor de formulario de pago
    const contenidoPago = document.querySelector('.formulario-pago');
    
    if (contenidoPago) {
        // Si existe el contenedor del formulario de pago, actualizamos ese
        contenidoPago.innerHTML = `
            <div class="procesando-pago">
                <div class="spinner"></div>
                <h2>${mensaje}</h2>
                <p>Por favor, no cierres esta ventana</p>
            </div>
        `;
    } else {
        // Si no, buscamos el contenedor principal del checkout
        const checkoutContenido = document.querySelector('.checkout-contenido');
        if (checkoutContenido) {
            checkoutContenido.innerHTML = `
                <div class="procesando-pago">
                    <div class="spinner"></div>
                    <h2>${mensaje}</h2>
                    <p>Por favor, no cierres esta ventana</p>
                </div>
            `;
        } else {
            // Si no encontramos ninguno, mostramos un mensaje de error
            console.error('No se pudo encontrar el contenedor para mostrar el mensaje de procesamiento');
            mostrarMensaje('Error al procesar el pago. Por favor, intenta nuevamente.', 'error');
        }
    }
}

// Función para mostrar la confirmación
function mostrarConfirmacion(metodoPago = 'tarjeta') {
    const checkoutContenido = document.querySelector('.checkout-contenido');
    
    // Intentar obtener datos del localStorage, si falla usar los temporales
    let datosCompra;
    try {
        datosCompra = JSON.parse(localStorage.getItem('datosCompra'));
    } catch (error) {
        console.warn('Error al leer datosCompra de localStorage, usando datos temporales');
    }
    
    // Si no hay datos en localStorage, usar los temporales
    if (!datosCompra && window.datosCompraTemp) {
        datosCompra = window.datosCompraTemp;
    }
    
    // Email por defecto si no lo encontramos en los datos
    const email = datosCompra && datosCompra.email ? datosCompra.email : 'tu correo registrado';
    
    // Texto adicional según método de pago
    const textoMetodoPago = metodoPago === 'mercadopago' 
        ? '<p>Tu pago ha sido procesado a través de Mercado Pago</p>' 
        : '';

    checkoutContenido.innerHTML = `
        <div class="confirmacion-compra">
            <div class="icono-exito">✓</div>
            <h2>¡Gracias por tu compra!</h2>
            <p>Tu pedido ha sido confirmado</p>
            ${textoMetodoPago}
            <div class="detalles-confirmacion">
                <p>Hemos enviado un email a ${email} con los detalles de tu compra</p>
                <p>Número de orden: ${generarNumeroOrden()}</p>
            </div>
            <button class="btn-volver" onclick="volverALaTienda()">Volver a la tienda</button>
        </div>
    `;
}

// Función para generar un número de orden
function generarNumeroOrden() {
    return 'ORD-' + Date.now().toString().slice(-8);
}

// Función para volver a la tienda
function volverALaTienda() {
    cerrarCheckout();
    window.location.reload();
}

// Función para mostrar mensajes al usuario
function mostrarMensaje(mensaje, tipo) {
    // Verificar si existe un mensaje anterior y eliminarlo
    const mensajeAnterior = document.querySelector('.mensaje-checkout');
    if (mensajeAnterior) {
        mensajeAnterior.remove();
    }
    
    // Crear el elemento de mensaje
    const mensajeElement = document.createElement('div');
    mensajeElement.className = `mensaje-checkout mensaje-${tipo}`;
    mensajeElement.innerHTML = `
        <div class="mensaje-contenido">
            <span>${mensaje}</span>
            <button class="cerrar-mensaje" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Añadir a la página
    document.body.appendChild(mensajeElement);
    
    // Eliminar automáticamente después de 5 segundos
    setTimeout(() => {
        if (mensajeElement.parentElement) {
            mensajeElement.remove();
        }
    }, 5000);
}

// Agrega estilos para los mensajes
document.addEventListener('DOMContentLoaded', function() {
    // Crear estilos para los mensajes
    const style = document.createElement('style');
    style.textContent += `
        .mensaje-checkout {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 2000;
            min-width: 300px;
            animation: fadeIn 0.3s ease-out;
        }
        
        .mensaje-contenido {
            padding: 15px 20px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .mensaje-error .mensaje-contenido {
            background-color: #f8d7da;
            color: #721c24;
            border-left: 4px solid #dc3545;
        }
        
        .mensaje-success .mensaje-contenido {
            background-color: #d4edda;
            color: #155724;
            border-left: 4px solid #28a745;
        }
        
        .mensaje-info .mensaje-contenido {
            background-color: #d1ecf1;
            color: #0c5460;
            border-left: 4px solid #17a2b8;
        }
        
        .cerrar-mensaje {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            margin-left: 15px;
            opacity: 0.7;
        }
        
        .cerrar-mensaje:hover {
            opacity: 1;
        }
        
        @keyframes fadeIn {
            0% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
            100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
    `;
    document.head.appendChild(style);
});

// Función para calcular costos de envío
function calcularCostosEnvio() {
    const codigoPostal = document.querySelector('#codigo-postal-calculo').value;
    
    if (!codigoPostal) {
        mostrarMensaje('Por favor, ingresa tu código postal', 'error');
        return;
    }
    
    // Mostrar spinner de carga
    const opcionesEnvio = document.querySelector('#opciones-entrega');
    if (!opcionesEnvio) {
        console.error('No se encontró el elemento #opciones-entrega');
        return;
    }
    
    // Limpiar opciones anteriores
    opcionesEnvio.innerHTML = `
        <div class="calculando-envio" id="calculando-envio">
            <div class="spinner-small"></div>
            <p>Calculando opciones de envío...</p>
        </div>
        <p id="sin-opciones-envio" style="display: none;">Ingresa tu código postal para ver las opciones de envío disponibles</p>
    `;
    
    const calculandoEnvio = document.querySelector('#calculando-envio');
    if (!calculandoEnvio) {
        console.error('No se encontró el elemento #calculando-envio');
        return;
    }
    
    // Simular llamada a API con un setTimeout (en producción, aquí irían las llamadas reales a las APIs)
    setTimeout(() => {
        if (calculandoEnvio) {
            calculandoEnvio.style.display = 'none';
        }
        
        // Generar opciones de envío basadas en el código postal
        // Estos precios serían los devueltos por la API real
        const opciones = generarOpcionesEnvio(codigoPostal);
        
        const sinOpcionesEnvio = document.querySelector('#sin-opciones-envio');
        if (opciones.length === 0 && sinOpcionesEnvio) {
            sinOpcionesEnvio.style.display = 'block';
            return;
        }
        
        // Agregar opciones al DOM
        opciones.forEach(opcion => {
            const opcionElement = document.createElement('div');
            opcionElement.className = 'opcion-entrega';
            opcionElement.innerHTML = `
                <input type="radio" name="entrega" id="${opcion.id}" value="${opcion.id}">
                <label for="${opcion.id}">
                    <span class="titulo">${opcion.titulo}</span>
                    ${opcion.detalle ? `<span class="detalle">${opcion.detalle}</span>` : ''}
                </label>
                <span class="precio">${opcion.precio === 0 ? 'Gratis' : '$' + formatearPrecio(opcion.precio)}</span>
            `;
            opcionesEnvio.appendChild(opcionElement);
        });
        
        // Configurar event listeners para las nuevas opciones
        setupEventListeners();
    }, 1500); // Simulación de 1.5 segundos
}

// Función para generar opciones de envío basadas en código postal
function generarOpcionesEnvio(codigoPostal) {
    // En una implementación real, estos datos vendrían de una API
    // Por ahora simulamos diferentes precios basados en el código postal
    
    let opciones = [];
    
    // Simular diferentes precios según rango de código postal
    const cp = parseInt(codigoPostal);
    
    // Simular si está en CABA (códigos postales 1000-1499)
    if (cp >= 1000 && cp <= 1499) {
        opciones.push({
            id: 'domicilio',
            titulo: 'EXPRESS (Entrega sólo en CABA. Lo recibís en 1 a 3 días hábiles)',
            detalle: 'Llega entre hoy y 3 días hábiles',
            precio: 4800 + (cp % 100) * 10 // Variación basada en el CP
        });
    }
    
    // Opciones disponibles para cualquier CP válido entre 1000-9999
    if (cp >= 1000 && cp <= 9999) {
        // Precio OCA basado en distancia (simulada por el CP)
        let precioOca = 8000;
        
        // Simular mayor precio para CP más lejanos
        if (cp >= 7000) {
            precioOca += 1500; // CP más lejanos, más caro
        } else if (cp >= 5000) {
            precioOca += 1000;
        } else if (cp >= 3000) {
            precioOca += 500;
        }
        
        // Agregar variación aleatoria para simular cálculo real
        precioOca += (cp % 100) * 15;
        
        opciones.push({
            id: 'oca',
            titulo: 'OCA ENVÍO A DOMICILIO',
            detalle: 'Llega en 2 días hábiles',
            precio: precioOca
        });
    }
    
    // Opción de retiro siempre disponible
    opciones.push({
        id: 'retiro',
        titulo: 'Acordar con el vendedor',
        detalle: '',
        precio: 0
    });
    
    return opciones;
}

// Agrega estilos para spinner pequeño
document.addEventListener('DOMContentLoaded', function() {
    // Crear estilos para el spinner pequeño
    const style = document.createElement('style');
    style.textContent = `
        .calculando-envio {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            text-align: center;
        }
        
        .spinner-small {
            width: 30px;
            height: 30px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid var(--accent-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }
        
        .btn-calcular-envio {
            background-color: var(--accent-color);
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 0.5rem;
        }
        
        .btn-calcular-envio:hover {
            background-color: var(--light-accent);
        }
    `;
    document.head.appendChild(style);
});