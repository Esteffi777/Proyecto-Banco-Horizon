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
exports.enviarNotificacionCambioPassword = exports.enviarNotificacionTransferencia = exports.cambiarPassword = exports.verificarCodigo = exports.verificarCodigoRecuperacion = exports.enviarCodigoRecuperacion = exports.enviarCodigoVerificacion = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const googleapis_1 = require("googleapis");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const Cliente_1 = __importDefault(require("../models/Cliente"));
const LoginUsuario_1 = __importDefault(require("../models/LoginUsuario"));
// Cargar las variables de entorno desde el archivo .env
dotenv_1.default.config();
// Configuración de OAuth2
const OAuth2 = googleapis_1.google.auth.OAuth2;
const oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, // Client ID
process.env.GOOGLE_CLIENT_SECRET, // Client Secret
'https://developers.google.com/oauthplayground' // URL de redirección de OAuth2
);
oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN // Refresh Token
});
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Genera un código de 6 dígitos
};
const enviarCodigoVerificacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo } = req.body;
    const verificationCode = generateVerificationCode();
    try {
        // Guarda el código de verificación en el documento del cliente
        const cliente = yield Cliente_1.default.findOneAndUpdate({ correo }, { verificationCode, isVerified: false }, { new: true, upsert: true });
        // Obtener el access token
        const accessToken = yield oauth2Client.getAccessToken();
        if (typeof accessToken.token !== 'string') {
            throw new Error('No se pudo obtener el Access Token');
        }
        // Configuración del transporte de correo
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_USER, // Dirección de correo Gmail
                clientId: process.env.GOOGLE_CLIENT_ID, // Client ID
                clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Client Secret
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN, // Refresh Token
                accessToken: accessToken.token, // El token de acceso obtenido
            },
        });
        // Configuración del correo
        const mailOptions = {
            from: `Horizon Bank <${process.env.GMAIL_USER}>`, // Nombre y dirección de correo remitente
            to: correo, // Dirección de correo destinatario
            subject: 'Código de Verificación',
            html: `<strong>Tu código de verificación es: ${verificationCode}</strong>`,
        };
        // Envía el correo usando nodemailer
        const result = yield transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Correo de verificación enviado' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error al enviar el correo de verificación' });
    }
});
exports.enviarCodigoVerificacion = enviarCodigoVerificacion;
const enviarCodigoRecuperacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo } = req.body;
    console.log('Solicitud recibida para enviar código de recuperación a:', correo);
    const recoveryCode = generateVerificationCode();
    console.log('Código de recuperación generado:', recoveryCode);
    try {
        const cliente = yield Cliente_1.default.findOneAndUpdate({ correo }, { recoveryCode }, { new: true });
        if (!cliente) {
            console.log('Cliente no encontrado para el correo:', correo);
            return res.status(404).json({ message: 'Correo no encontrado' });
        }
        const accessToken = yield oauth2Client.getAccessToken();
        if (typeof accessToken.token !== 'string') {
            throw new Error('No se pudo obtener el Access Token');
        }
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_USER,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });
        const mailOptions = {
            from: `Horizon Bank <${process.env.GMAIL_USER}>`,
            to: correo,
            subject: 'Código de Recuperación de Contraseña',
            html: `<strong>Tu código de recuperación de contraseña es: ${recoveryCode}</strong>`,
        };
        const result = yield transporter.sendMail(mailOptions);
        console.log('Correo de recuperación enviado:', result);
        return res.status(200).json({ message: 'Correo de recuperación enviado' });
    }
    catch (error) {
        console.log('Error al enviar el correo de recuperación:', error);
        return res.status(500).json({ message: 'Error al enviar el correo de recuperación' });
    }
});
exports.enviarCodigoRecuperacion = enviarCodigoRecuperacion;
const verificarCodigoRecuperacion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, verificationCode } = req.body;
    console.log('Solicitud recibida para verificar código de recuperación:', { correo, verificationCode });
    try {
        const cliente = yield Cliente_1.default.findOne({ correo });
        console.log('Cliente encontrado:', cliente);
        if (!cliente) {
            console.log('Cliente no encontrado para el correo:', correo);
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        console.log('Codigo de recuperación almacenado:', cliente.recoveryCode);
        console.log('Codigo ingresado por el cliente:', verificationCode);
        if (cliente.recoveryCode === verificationCode) {
            console.log('Código de recuperación verificado correctamente para el correo:', correo);
            cliente.recoveryCode = undefined;
            yield cliente.save();
            return res.status(200).json({ message: 'Código de recuperación verificado correctamente' });
        }
        else {
            console.log('Código de verificación incorrecto para el correo:', correo);
            return res.status(400).json({ message: 'Código de verificación incorrecto' });
        }
    }
    catch (error) {
        console.log('Error al verificar el código de recuperación:', error);
        return res.status(500).json({ message: 'Error al verificar el código de recuperación' });
    }
});
exports.verificarCodigoRecuperacion = verificarCodigoRecuperacion;
const verificarCodigo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, verificationCode } = req.body;
    try {
        const cliente = yield Cliente_1.default.findOne({ correo });
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        if (cliente.verificationCode === verificationCode) {
            cliente.isVerified = true;
            cliente.verificationCode = undefined;
            yield cliente.save();
            return res.status(200).json({ message: 'Código verificado con éxito' });
        }
        else {
            return res.status(400).json({ message: 'Código de verificación incorrecto' });
        }
    }
    catch (error) {
        return res.status(500).json({ message: 'Error al verificar el código' });
    }
});
exports.verificarCodigo = verificarCodigo;
const cambiarPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, nuevaPassword } = req.body;
    try {
        // Buscar el usuario en base a su correo en la tabla Cliente
        const cliente = yield Cliente_1.default.findOne({ correo });
        console.log('Cliente: ', cliente);
        if (!cliente) {
            console.log('Cliente no encontrado para el correo:', correo);
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        // Encontrar el registro del usuario en la tabla LoginUsuario basado en la cédula
        const loginUsuario = yield LoginUsuario_1.default.findOne({ cedula: cliente.cedula });
        if (!loginUsuario) {
            console.log('Usuario de login no encontrado para la cédula:', cliente.cedula);
            return res.status(404).json({ message: 'Usuario de login no encontrado' });
        }
        // Actualizar la contraseña en el objeto LoginUsuario
        const nuevaPasswordEncrip = yield bcrypt_1.default.hash(nuevaPassword, 10);
        loginUsuario.contraseña = nuevaPasswordEncrip;
        yield loginUsuario.save();
        return res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    }
    catch (error) {
        console.log('Error al cambiar la contraseña:', error);
        return res.status(500).json({ message: 'Error al cambiar la contraseña' });
    }
});
exports.cambiarPassword = cambiarPassword;
const enviarNotificacionTransferencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo, monto, cuentaOrigen, cuentaDestino } = req.body;
    try {
        // Obtener el access token
        const accessToken = yield oauth2Client.getAccessToken();
        if (typeof accessToken.token !== 'string') {
            throw new Error('No se pudo obtener el Access Token');
        }
        // Configuración del transporte de correo
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_USER, // Dirección de correo Gmail
                clientId: process.env.GOOGLE_CLIENT_ID, // Client ID
                clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Client Secret
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN, // Refresh Token
                accessToken: accessToken.token, // El token de acceso obtenido
            },
        });
        // Configuración del correo
        const mailOptions = {
            from: `Horizon Bank <${process.env.GMAIL_USER}>`, // Nombre y dirección de correo remitente
            to: correo, // Dirección de correo destinatario
            subject: 'Notificación de Transferencia',
            html: `<strong>Se ha transferido un monto de ${monto}$ desde la cuenta ${cuentaOrigen} a la cuenta ${cuentaDestino}</strong>`,
        };
        // Envía el correo usando nodemailer
        const result = yield transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Correo de notificación enviado' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error al enviar el correo de notificación' });
    }
});
exports.enviarNotificacionTransferencia = enviarNotificacionTransferencia;
const enviarNotificacionCambioPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { correo } = req.body;
    try {
        // Obtener el access token
        const accessToken = yield oauth2Client.getAccessToken();
        if (typeof accessToken.token !== 'string') {
            throw new Error('No se pudo obtener el Access Token');
        }
        // Configuración del transporte de correo
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_USER, // Dirección de correo Gmail
                clientId: process.env.GOOGLE_CLIENT_ID, // Client ID
                clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Client Secret
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN, // Refresh Token
                accessToken: accessToken.token, // El token de acceso obtenido
            },
        });
        // Configuración del correo
        const mailOptions = {
            from: `Horizon Bank <${process.env.GMAIL_USER}>`, // Nombre y dirección de correo remitente
            to: correo, // Dirección de correo destinatario
            subject: 'Notificación de Cambio de Contraseña',
            html: `<strong>Su contraseña ha sido cambiada con éxito.</strong>`,
        };
        // Envía el correo usando nodemailer
        const result = yield transporter.sendMail(mailOptions);
        return res.status(200).json({ message: 'Correo de notificación enviado' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error al enviar el correo de notificación' });
    }
});
exports.enviarNotificacionCambioPassword = enviarNotificacionCambioPassword;
