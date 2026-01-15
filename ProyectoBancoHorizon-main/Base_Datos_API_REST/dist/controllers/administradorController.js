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
exports.eliminarAdministrador = exports.crearAdministrador = exports.getAdministradores = void 0;
const Administrador_1 = __importDefault(require("../models/Administrador"));
const getAdministradores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const administradores = yield Administrador_1.default.find();
        res.json(administradores);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getAdministradores = getAdministradores;
const crearAdministrador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nuevoAdministrador = new Administrador_1.default({
        idAdministrador: req.body.idAdministrador,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        correo: req.body.correo,
        celular: req.body.celular
    });
    try {
        const administradorGuardado = yield nuevoAdministrador.save();
        res.status(201).json(administradorGuardado);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.crearAdministrador = crearAdministrador;
// Controlador para eliminar un administrador por ID
const eliminarAdministrador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const administradorEliminado = yield Administrador_1.default.findOneAndDelete({ idAdministrador: id });
        if (!administradorEliminado) {
            return res.status(404).json({ message: 'No se encontró el administrador' });
        }
        res.json({ message: 'Administrador eliminado correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar el administrador:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.eliminarAdministrador = eliminarAdministrador;
