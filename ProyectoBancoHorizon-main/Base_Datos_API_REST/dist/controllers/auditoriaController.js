"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearAuditoria = exports.getAuditorias = void 0;
const Auditoria_1 = __importDefault(require("../models/Auditoria"));
// Obtener todas las auditorías
const getAuditorias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const auditorias = yield Auditoria_1.default.find();
        res.json(auditorias);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getAuditorias = getAuditorias;
// Crear una nueva auditoría
const crearAuditoria = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nuevaAuditoria = new Auditoria_1.default({
        idAuditoria: req.body.idAuditoria,
        cedula: req.body.cedula,
        fechaTransaccion: req.body.fechaTransaccion,
        accionRealizada: req.body.accionRealizada,
        idTransferencia: req.body.idTransferencia,
        idAdministrador: req.body.idAdministrador
    });
    try {
        const auditoriaGuardada = yield nuevaAuditoria.save();
        res.status(201).json(auditoriaGuardada);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.crearAuditoria = crearAuditoria;
