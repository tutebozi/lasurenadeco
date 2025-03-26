const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const app = express();

// Configurar CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
}));

app.use(express.json());

// Configurar Mercado Pago
mercadopago.configure({
    access_token: 'TEST-7068091123030334-020618-d4a0e5d8d26d8c69a7ed58891a2077e7-413696470'
});

// Ruta de prueba
app.get('/test', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente' });
});

// Ruta para crear preferencia de pago
app.post('/crear-preferencia', async (req, res) => {
    try {
        console.log('Recibiendo request:', req.body);
        
        const preference = {
            items: req.body.items.map(item => ({
                title: item.nombre,
                unit_price: Number(item.precio),
                quantity: Number(item.cantidad),
                currency_id: "ARS"
            })),
            back_urls: {
                success: "http://localhost:8000/success",
                failure: "http://localhost:8000/failure",
                pending: "http://localhost:8000/pending"
            },
            auto_return: "approved"
        };

        const response = await mercadopago.preferences.create(preference);
        res.json({ id: response.body.id, init_point: response.body.init_point });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al crear la preferencia de pago' });
    }
});

// Rutas para manejar el retorno
app.get('/success', (req, res) => {
    console.log('Pago exitoso:', req.query);
    res.send("Pago exitoso");
});

app.get('/failure', (req, res) => {
    console.log('Pago fallido:', req.query);
    res.send("Pago fallido");
});

app.get('/pending', (req, res) => {
    console.log('Pago pendiente:', req.query);
    res.send("Pago pendiente");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log('Endpoints disponibles:');
    console.log('- GET /test');
    console.log('- POST /crear-preferencia');
    console.log('- GET /success');
    console.log('- GET /failure');
    console.log('- GET /pending');
}); 