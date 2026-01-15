// routes/transferenciaRoutes.ts
import { Router } from 'express';
import { getTransferencias, crearTransferencia, realizarTransferencia, getTransferenciasByCuenta, registrarTransaccion, getTransaccionesByCuenta } from '../controllers/transferenciaController';

const router = Router();

// Definimos las rutas usando las funciones importadas
router.get('/transferencia', getTransferencias);
router.post('/transferencia', crearTransferencia);
router.post('/realizar-transferencia', realizarTransferencia);
router.get('/transferencia/:numeroCuenta', getTransferenciasByCuenta);
router.post('/transacciones', registrarTransaccion);
router.get('/transacciones/:numeroCuenta', getTransaccionesByCuenta);

export default router;
