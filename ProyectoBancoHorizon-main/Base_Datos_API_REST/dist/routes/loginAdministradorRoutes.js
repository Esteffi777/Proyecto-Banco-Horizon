"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/loginAdministradorRoutes.ts
const express_1 = require("express");
const loginAdministradorController_1 = require("../controllers/loginAdministradorController");
const router = (0, express_1.Router)();
// Definimos las rutas usando las funciones importadas
router.get('/loginAdministrador', loginAdministradorController_1.getLoginAdministradores);
router.post('/loginAdministrador', loginAdministradorController_1.crearLoginAdministrador);
exports.default = router;
