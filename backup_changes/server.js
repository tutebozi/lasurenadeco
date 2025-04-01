const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para el panel de administración
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin/index.html'));
});

// Configurar Mercado Pago de la nueva forma
const client = new MercadoPagoConfig({
    accessToken: 'TEST-7068091123030334-020618-d4a0e5d8d26d8c69a7ed58891a2077e7-413696470'
});

// Ruta de prueba
app.get('/test', (req, res) => {
    res.json({ message: 'Servidor funcionando correctamente' });
});

// Ruta para crear preferencia de pago
app.post('/crear-preferencia', async (req, res) => {
    try {
        const preference = new Preference(client);
        const preferenceData = {
            items: req.body.items.map(item => ({
                title: item.nombre,
                unit_price: Number(item.precio),
                quantity: Number(item.cantidad),
                currency_id: "ARS"
            })),
            back_urls: {
                success: "http://localhost:3000/success",
                failure: "http://localhost:3000/failure",
                pending: "http://localhost:3000/pending"
            },
            auto_return: "approved"
        };

        const response = await preference.create({ body: preferenceData });
        res.json(response);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al crear la preferencia de pago' });
    }
});

// Rutas para manejar el retorno de Mercado Pago
app.get('/success', (req, res) => {
    res.send("Pago exitoso");
});

app.get('/failure', (req, res) => {
    res.send("Pago fallido");
});

app.get('/pending', (req, res) => {
    res.send("Pago pendiente");
});

app.post('/webhook', (req, res) => {
    console.log('Webhook recibido:', req.body);
    res.status(200).send('OK');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log('CORS habilitado para todas las origenes');
    console.log('Endpoints disponibles:');
    console.log('- GET /test');
    console.log('- POST /crear-preferencia');
}); 