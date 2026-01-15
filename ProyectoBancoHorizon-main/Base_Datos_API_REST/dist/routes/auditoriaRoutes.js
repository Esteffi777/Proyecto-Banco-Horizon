"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes/auditoriaRoutes.ts
const express_1 = require("express");
const auditoriaController_1 = require("../controllers/auditoriaController");
const router = (0, express_1.Router)();
// Definimos las rutas usando las funciones importadas
router.get('/auditoria', auditoriaController_1.getAuditorias);
router.post('/auditoria', auditoriaController_1.crearAuditoria);
exports.default = router;
