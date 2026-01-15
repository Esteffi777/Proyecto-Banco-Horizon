"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Cliente.ts
const mongoose_1 = __importStar(require("mongoose"));
const ClienteSchema = new mongoose_1.Schema({
    cedula: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); // Validación para 10 dígitos numéricos
            },
            message: (props) => `${props.value} no es una cédula válida!`
        }
    },
    celular: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v); // Validación para 10 dígitos numéricos
            },
            message: (props) => `${props.value} no es un celular válido!`
        }
    },
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    correo: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    provincia: { type: String, required: true },
    ciudad: { type: String, required: true },
    callePrincipal: { type: String, required: true },
    calleSecundaria: { type: String, required: true },
    verificationCode: { type: String }, // Campo para almacenar el código de verificación
    isVerified: { type: Boolean, default: false },
    recoveryCode: { type: String },
}, { collection: 'Cliente' });
const Cliente = mongoose_1.default.model('Cliente', ClienteSchema);
exports.default = Cliente;
