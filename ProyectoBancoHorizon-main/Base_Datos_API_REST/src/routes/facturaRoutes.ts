import { Router } from 'express';
import { crearFactura, generarFacturasSiNoExisten, getFacturaPorServicioYUsuario, obtenerFacturasPorCedula, pagarFactura, actualizarEstadoFactura } from '../controllers/facturaController';

const router = Router();

// Crear una nueva factura si no existe
router.post('/crear-factura', crearFactura);

// Obtener todas las facturas de un usuario por cédula
router.get('/facturas/:cedula', obtenerFacturasPorCedula);

// Actualizar el estado de una factura a pagado
router.put('/pagar-factura/:idFactura', pagarFactura);

router.get('/facturas/:cedula', generarFacturasSiNoExisten);

router.get('/facturas/:cedula/:servicio', getFacturaPorServicioYUsuario);

router.put('/facturas/actualizar-estado', actualizarEstadoFactura);


export default router;
