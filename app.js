const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();

// Configurar CORS
app.use(cors());
app.use(express.json());

// Configurar Mercado Pago con tu access token
mercadopago.configure({
    access_token: 'TU_ACCESS_TOKEN_DE_MERCADO_PAGO'
});

// Ruta para crear preferencia de pago
app.post('/crear-preferencia', async (req, res) => {
    try {
        const preference = {
            items: req.body.items,
            back_urls: {
                success: "http://localhost:8000/success",
                failure: "http://localhost:8000/failure",
                pending: "http://localhost:8000/pending"
            },
            auto_return: "approved"
        };

        const response = await mercadopago.preferences.create(preference);
        res.json(response.body);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Error al crear la preferencia de pago'
        });
    }
});

// Rutas para manejar el retorno de Mercado Pago
app.get('/success', (req, res) => {
    res.send('Pago exitoso');
});

app.get('/failure', (req, res) => {
    res.send('Pago fallido');
});

app.get('/pending', (req, res) => {
    res.send('Pago pendiente');
});

// Iniciar el servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

function mostrarProductos() {
    const heroSection = document.querySelector('.hero-section');
    const productosSection = document.getElementById('productos-section');
    
    heroSection.style.display = 'none';
    productosSection.style.display = 'grid';
    
    // Aquí puedes cargar los productos si no están cargados
    cargarProductos(); // Tu función existente
} 