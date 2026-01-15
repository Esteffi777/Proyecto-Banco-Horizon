"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const administradorController_1 = require("../controllers/administradorController");
const router = (0, express_1.Router)();
// Rutas para administradores
router.get('/administradores', administradorController_1.getAdministradores); // Obtener todos los administradores
router.post('/administradores', administradorController_1.crearAdministrador); // Crear un nuevo administrador
router.delete('/administradores/:id', administradorController_1.eliminarAdministrador); // Eliminar un administrador por ID
exports.default = router;
