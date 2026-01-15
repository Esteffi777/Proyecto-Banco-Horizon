"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/loginUsuarioRoutes.ts
const express_1 = require("express");
const loginUsuarioController_1 = require("../controllers/loginUsuarioController");
const router = (0, express_1.Router)();
// Definimos las rutas usando las funciones importadas
router.get('/loginUsuario', loginUsuarioController_1.getLoginUsuarios);
router.post('/loginUsuario', loginUsuarioController_1.crearLoginUsuario);
router.delete('/loginUsuarios/:cedula', loginUsuarioController_1.eliminarLoginUsuario); // Eliminar un login de usuario por cédula
router.put('/loginUsuarios/:cedula', loginUsuarioController_1.actualizarLoginUsuario); // Actualizar un login de usuario por cédula
router.post('/login', loginUsuarioController_1.loginUsuario);
router.post('/login/actualizar-password', loginUsuarioController_1.actualizarPassword); // Cambiar contraseña
router.post('/verificar-password', loginUsuarioController_1.verificarPassword);
exports.default = router;
