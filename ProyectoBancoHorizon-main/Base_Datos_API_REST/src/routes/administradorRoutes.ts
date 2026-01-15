import { Router } from 'express';
import { getAdministradores, crearAdministrador, eliminarAdministrador } from '../controllers/administradorController';

const router = Router();

// Rutas para administradores
router.get('/administradores', getAdministradores); // Obtener todos los administradores
router.post('/administradores', crearAdministrador); // Crear un nuevo administrador
router.delete('/administradores/:id', eliminarAdministrador); // Eliminar un administrador por ID

export default router;
