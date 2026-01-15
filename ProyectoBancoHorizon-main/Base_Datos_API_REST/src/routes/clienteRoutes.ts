import { Router } from 'express';
import { getClientes, crearCliente, actualizarCliente, eliminarCliente, obtenerEmailPorCedula, verificarCorreo  } from '../controllers/clienteController';

const router = Router();

// Definimos las rutas usando las funciones importadas
router.get('/cliente', getClientes);
router.post('/cliente', crearCliente);
router.delete('/cliente/:cedula', eliminarCliente); // Eliminar un cliente por cédula
router.put('/cliente/:cedula', actualizarCliente); // Actualizar un cliente por cédula
router.get('/usuario/email', obtenerEmailPorCedula);
router.get('/verificar-correo', verificarCorreo);

export default router;
