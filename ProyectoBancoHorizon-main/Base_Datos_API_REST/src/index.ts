import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import clienteRoutes from './routes/clienteRoutes';
import administradorRoutes from './routes/administradorRoutes';
import loginAdministradorRoutes from './routes/loginAdministradorRoutes';
import loginUsuarioRoutes from './routes/loginUsuarioRoutes';
import transferenciaRoutes from './routes/transferenciaRoutes';
import auditoriaRoutes from './routes/auditoriaRoutes';
import cuentaRoutes from './routes/cuentaRoutes';
import emailRoutes from './routes/emailRoutes';
import dialogflowRoutes from './routes/dialogflowRoutes';
import paypalRoutes from './routes/paypalRoutes';
import facturaRoutes from './routes/facturaRoutes';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://angelabedon:PoliBanco@banco.2zv7hpl.mongodb.net/?appName=Banco';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Conectado a MongoDB');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error conectando a MongoDB', error);
    });

// Rutas
app.use('/api', clienteRoutes);
app.use('/api', administradorRoutes);
app.use('/api', loginAdministradorRoutes);
app.use('/api', loginUsuarioRoutes);
app.use('/api', transferenciaRoutes);
app.use('/api', auditoriaRoutes);
app.use('/api', cuentaRoutes);
app.use('/api/email', emailRoutes);
app.use('/api', dialogflowRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api', facturaRoutes);

export default app;