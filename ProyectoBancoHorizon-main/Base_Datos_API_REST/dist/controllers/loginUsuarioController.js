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
exports.verificarPassword = exports.actualizarPassword = exports.loginUsuario = exports.eliminarLoginUsuario = exports.actualizarLoginUsuario = exports.crearLoginUsuario = exports.getLoginUsuarios = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
const LoginUsuario_1 = __importDefault(require("../models/LoginUsuario"));
// Obtener todos los login de usuarios
const getLoginUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginUsuarios = yield LoginUsuario_1.default.find();
        res.json(loginUsuarios);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getLoginUsuarios = getLoginUsuarios;
// Crear un nuevo login de usuario
const crearLoginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nuevoLoginUsuario = new LoginUsuario_1.default({
        idUsuario: req.body.idUsuario,
        nombreUsuario: req.body.nombreUsuario,
        contraseña: yield bcrypt_1.default.hash(req.body.contraseña, 10), // Encriptar la contraseña antes de guardarla
        cedula: req.body.cedula
    });
    try {
        const loginUsuarioGuardado = yield nuevoLoginUsuario.save();
        res.status(201).json(loginUsuarioGuardado);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.crearLoginUsuario = crearLoginUsuario;
// Actualizar un login de usuario
const actualizarLoginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cedula } = req.params;
    const actualizacion = req.body;
    try {
        const loginUsuarioActualizado = yield LoginUsuario_1.default.findOneAndUpdate({ cedula }, actualizacion, { new: true });
        if (!loginUsuarioActualizado) {
            return res.status(404).json({ message: 'No se encontró el usuario' });
        }
        res.json(loginUsuarioActualizado);
    }
    catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.actualizarLoginUsuario = actualizarLoginUsuario;
// Eliminar un login de usuario
const eliminarLoginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cedula } = req.params;
    try {
        const loginUsuarioEliminado = yield LoginUsuario_1.default.findOneAndDelete({ cedula });
        if (!loginUsuarioEliminado) {
            return res.status(404).json({ message: 'No se encontró el usuario' });
        }
        res.json({ message: 'Usuario eliminado correctamente' });
    }
    catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.eliminarLoginUsuario = eliminarLoginUsuario;
// Iniciar sesión
const loginUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombreUsuario, contraseña, recaptchaToken } = req.body;
    // Verificar el token de reCAPTCHA
    const secretKey = '6LfpXQ8qAAAAAAP62iG2moRAYa3xoXRWjiNSW1Z1'; // Reemplaza con tu clave secreta de reCAPTCHA
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;
    try {
        const response = yield axios_1.default.post(verificationUrl);
        const { success, score } = response.data;
        if (!success || score < 0.5) {
            return res.status(400).json({ message: 'reCAPTCHA verification failed' });
        }
        console.log('Intento de inicio de sesión para:', nombreUsuario); // Agrega este console.log
        // Buscar el usuario por nombreUsuario
        const usuario = yield LoginUsuario_1.default.findOne({ nombreUsuario });
        if (!usuario) {
            console.log('Usuario no encontrado para:', nombreUsuario); // Agrega este console.log
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Verificar la contraseña
        const contraseñaValida = yield bcrypt_1.default.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            console.log('Contraseña incorrecta para:', nombreUsuario); // Agrega este console.log
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        console.log('Inicio de sesión exitoso para:', nombreUsuario); // Agrega este console.log
        return res.status(200).json({ message: 'Inicio de sesión exitoso', cedula: usuario.cedula });
    }
    catch (error) {
        console.error('Error al iniciar sesión:', error.message);
        return res.status(500).json({ message: 'Error al iniciar sesión o al verificar el reCAPTCHA' });
    }
});
exports.loginUsuario = loginUsuario;
const actualizarPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombreUsuario, nuevaPassword } = req.body;
    try {
        // Buscar el usuario en base a su nombre
        const loginUsuario = yield LoginUsuario_1.default.findOne({ nombreUsuario });
        if (!loginUsuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Actualizar la contraseña en el objeto LoginUsuario
        const nuevaPasswordEncrip = yield bcrypt_1.default.hash(nuevaPassword, 10);
        loginUsuario.contraseña = nuevaPasswordEncrip;
        yield loginUsuario.save();
        return res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error al cambiar la contraseña' });
    }
});
exports.actualizarPassword = actualizarPassword;
const verificarPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombreUsuario, passwordActual } = req.body;
    try {
        // Buscar el usuario por nombreUsuario
        const usuario = yield LoginUsuario_1.default.findOne({ nombreUsuario });
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Verificar la contraseña
        const contraseñaValida = yield bcrypt_1.default.compare(passwordActual, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }
        return res.status(200).json({ message: 'Contraseña verificada exitosamente' });
    }
    catch (error) {
        console.error('Error al verificar la contraseña:', error.message);
        return res.status(500).json({ message: 'Error al verificar la contraseña' });
    }
});
exports.verificarPassword = verificarPassword;
