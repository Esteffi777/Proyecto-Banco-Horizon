import { Router } from 'express';
import { cambiarPassword, enviarCodigoRecuperacion, enviarCodigoVerificacion, verificarCodigo, enviarNotificacionIngresoSistema, verificarCodigoRecuperacion, enviarNotificacionTransferencia, enviarNotificacionCambioPassword, enviarNotificacionRecuperacionUsuario  } from '../controllers/emailController';

const router = Router();

router.post('/enviar-verificacion-correo', enviarCodigoVerificacion);
router.post('/verificar-codigo', verificarCodigo);
router.post('/enviar-codigo-recuperacion', enviarCodigoRecuperacion);
router.post('/verificar-codigo-recuperacion', verificarCodigoRecuperacion);
router.post('/cambiar-password', cambiarPassword);
router.post('/enviar-notificacion-transferencia', enviarNotificacionTransferencia);
router.post('/notificacion-cambio-password', enviarNotificacionCambioPassword);
router.post('/notificacion-Recupercio-Usuario', enviarNotificacionRecuperacionUsuario);
router.post('/notificacion-Ingreso-Sistema', enviarNotificacionIngresoSistema);

export default router;
