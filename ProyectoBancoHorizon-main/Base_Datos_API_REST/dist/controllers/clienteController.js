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
exports.verificarCorreo = exports.obtenerEmailPorCedula = exports.eliminarCliente = exports.actualizarCliente = exports.crearCliente = exports.getClientes = void 0;
const Cliente_1 = __importDefault(require("../models/Cliente"));
const getClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientes = yield Cliente_1.default.find();
        res.json(clientes);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getClientes = getClientes;
const crearCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cedula, nombres, apellidos, celular, correo, fechaNacimiento, provincia, ciudad, callePrincipal, calleSecundaria } = req.body;
    // Validación de cédula y celular
    if (!/^(\d{10})$/.test(cedula)) {
        return res.status(400).json({ message: 'La cédula debe tener 10 dígitos numéricos.' });
    }
    if (!/^(\d{10})$/.test(celular)) {
        return res.status(400).json({ message: 'El celular debe tener 10 dígitos numéricos.' });
    }
    // Validación de fecha de nacimiento
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    if (age < 18) {
        return res.status(400).json({ message: 'El cliente debe tener más de 18 años para registrarse.' });
    }
    try {
        // Verificar si la cédula ya existe
        const existingCliente = yield Cliente_1.default.findOne({ cedula });
        if (existingCliente) {
            return res.status(409).json({ message: 'La cédula ya está registrada.' });
        }
        const nuevoCliente = new Cliente_1.default({
            cedula,
            nombres,
            apellidos,
            celular,
            correo,
            fechaNacimiento,
            provincia,
            ciudad,
            callePrincipal,
            calleSecundaria
        });
        const clienteGuardado = yield nuevoCliente.save();
        res.status(201).json(clienteGuardado);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.crearCliente = crearCliente;
const actualizarCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cedula } = req.params;
    const actualizacion = req.body;
    try {
        const clienteActualizado = yield Cliente_1.default.findOneAndUpdate({ cedula }, actualizacion, { new: true });
        if (!clienteActualizado) {
            return res.status(404).json({ message: 'No se encontró el cliente' });
        }
        res.json({ message: 'Cliente actualizado correctamente' });
    }
    catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.actualizarCliente = actualizarCliente;
const eliminarCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cedula } = req.params;
    try {
        const clienteEliminado = yield Cliente_1.default.findOneAndDelete({ cedula });
        if (!clienteEliminado) {
            return res.status(404).json({ message: 'No se encontró el cliente' });
        }
        res.json({ message: 'Cliente eliminado correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar el cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.eliminarCliente = eliminarCliente;
const obtenerEmailPorCedula = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cedula } = req.query;
    try {
        const usuario = yield Cliente_1.default.findOne({ cedula });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ email: usuario.correo });
    }
    catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
});
exports.obtenerEmailPorCedula = obtenerEmailPorCedula;
const verificarCorreo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo } = req.query;
    try {
        const cliente = yield Cliente_1.default.findOne({ correo });
        if (cliente) {
            return res.status(409).json({ message: 'El correo ya está registrado.' });
        }
        res.status(200).json({ message: 'El correo está disponible.' });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.verificarCorreo = verificarCorreo;
