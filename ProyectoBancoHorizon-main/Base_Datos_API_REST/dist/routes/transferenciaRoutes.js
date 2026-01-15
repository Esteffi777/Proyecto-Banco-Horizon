"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/transferenciaRoutes.ts
const express_1 = require("express");
const transferenciaController_1 = require("../controllers/transferenciaController");
const router = (0, express_1.Router)();
// Definimos las rutas usando las funciones importadas
router.get('/transferencia', transferenciaController_1.getTransferencias);
router.post('/transferencia', transferenciaController_1.crearTransferencia);
router.post('/realizar-transferencia', transferenciaController_1.realizarTransferencia);
router.get('/transferencia/:numeroCuenta', transferenciaController_1.getTransferenciasByCuenta);
exports.default = router;
