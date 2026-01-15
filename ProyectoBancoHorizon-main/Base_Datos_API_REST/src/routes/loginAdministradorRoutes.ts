// routes/loginAdministradorRoutes.ts
import { Router } from 'express';
import { getLoginAdministradores, crearLoginAdministrador } from '../controllers/loginAdministradorController';

const router = Router();

// Definimos las rutas usando las funciones importadas
router.get('/loginAdministrador', getLoginAdministradores);
router.post('/loginAdministrador', crearLoginAdministrador);

export default router;
