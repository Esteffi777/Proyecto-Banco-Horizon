"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const clienteController_1 = require("../controllers/clienteController");
const router = (0, express_1.Router)();
// Definimos las rutas usando las funciones importadas
router.get('/cliente', clienteController_1.getClientes);
router.post('/cliente', clienteController_1.crearCliente);
router.delete('/cliente/:cedula', clienteController_1.eliminarCliente); // Eliminar un cliente por cédula
router.put('/cliente/:cedula', clienteController_1.actualizarCliente); // Actualizar un cliente por cédula
router.get('/usuario/email', clienteController_1.obtenerEmailPorCedula);
router.get('/verificar-correo', clienteController_1.verificarCorreo);
exports.default = router;
