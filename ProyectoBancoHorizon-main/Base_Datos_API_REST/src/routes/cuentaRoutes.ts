import { Router } from 'express';
import { getCuentas, crearCuenta, verificarNumeroCuenta, actualizarSaldoCuenta, getClienteByNumeroCuenta, actualizarSaldo, obtenerSaldo  } from '../controllers/cuentaController';

const router = Router();

router.get('/cuenta', getCuentas);
router.post('/crear-cuenta', crearCuenta);
router.get('/verificar-numero-cuenta/:numeroCuenta', verificarNumeroCuenta);
router.put('/actualizar-saldo-cuenta', actualizarSaldoCuenta);
router.get('/cuentas/cliente/:numeroCuenta', getClienteByNumeroCuenta);
router.post('/actualizarSaldo', actualizarSaldo);
router.get('/saldo/:cedula', obtenerSaldo);

export default router;
