// routes/auditoriaRoutes.ts
import { Router } from 'express';
import { getAuditorias, crearAuditoria } from '../controllers/auditoriaController';

const router = Router();

// Definimos las rutas usando las funciones importadas
router.get('/auditoria', getAuditorias);
router.post('/auditoria', crearAuditoria);

export default router;
