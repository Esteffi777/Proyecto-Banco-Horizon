// routes/loginUsuarioRoutes.ts
import { Router } from 'express';
import { getLoginUsuarios, crearLoginUsuario, actualizarLoginUsuario, obtenerCorreoPorNombreUsuario, eliminarLoginUsuario, loginUsuario, desbloquearUsuario, actualizarPassword, verificarPassword,cambiarNombreUsuarioPorCorreo} from '../controllers/loginUsuarioController';

const router = Router();

// Definimos las rutas usando las funciones importadas
router.get('/loginUsuario', getLoginUsuarios);
router.post('/loginUsuario', crearLoginUsuario);
router.delete('/loginUsuarios/:cedula', eliminarLoginUsuario); // Eliminar un login de usuario por cédula
router.put('/loginUsuarios/:cedula', actualizarLoginUsuario); // Actualizar un login de usuario por cédula
router.post('/login', loginUsuario);
router.post('/login/actualizar-password', actualizarPassword);// Cambiar contraseña
router.post('/verificar-password', verificarPassword);
router.post('/desbloquear-cuenta', desbloquearUsuario);
router.patch('/usuarios/cambiar-nombre-por-correo', cambiarNombreUsuarioPorCorreo);
router.get('/obtener-correo', obtenerCorreoPorNombreUsuario);
export default router;
