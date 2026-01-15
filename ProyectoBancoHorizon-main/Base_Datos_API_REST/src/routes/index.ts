import { Router } from 'express';
import clienteRoutes from './clienteRoutes';
import cuentaRoutes from './cuentaRoutes';
import transferenciaRoutes from './transferenciaRoutes';
import loginUsuarioRoutes from './loginUsuarioRoutes';
import administradorRoutes from './administradorRoutes';
import loginAdministradorRoutes from './loginAdministradorRoutes';
import auditoriaRoutes from './auditoriaRoutes';
import emailRoutes from './emailRoutes';
import dialogflowRoutes from './dialogflowRoutes';
import paypalRoutes from './paypalRoutes'

const router = Router();

router.use(clienteRoutes);
router.use(cuentaRoutes);
router.use(transferenciaRoutes);
router.use(loginUsuarioRoutes);
router.use(administradorRoutes);
router.use(loginAdministradorRoutes);
router.use(auditoriaRoutes);
router.use(emailRoutes);
router.use(dialogflowRoutes);
router.use(paypalRoutes)

export default router;
