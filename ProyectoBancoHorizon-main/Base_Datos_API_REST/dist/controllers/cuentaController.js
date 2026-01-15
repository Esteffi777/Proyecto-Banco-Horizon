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
exports.actualizarSaldoCuenta = exports.verificarNumeroCuenta = exports.crearCuenta = exports.getCuentas = void 0;
const Cuenta_1 = __importDefault(require("../models/Cuenta"));
const Cliente_1 = __importDefault(require("../models/Cliente"));
const getCuentas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cedula } = req.query;
    try {
        const cuentas = yield Cuenta_1.default.find({ cedula });
        if (cuentas.length > 0) {
            const cliente = yield Cliente_1.default.findOne({ cedula });
            if (cliente) {
                const response = {
                    nombreCliente: cliente.nombres,
                    cuentas: cuentas.map(cuenta => (Object.assign({}, cuenta.toObject())))
                };
                res.json(response);
            }
            else {
                res.status(404).json({ message: 'Cliente no encontrado' });
            }
        }
        else {
            res.status(404).json({ message: 'Cuentas no encontradas' });
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getCuentas = getCuentas;
const crearCuenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { numeroCuenta, cedula, saldo, tipo } = req.body;
        const nuevaCuenta = new Cuenta_1.default({
            numeroCuenta,
            cedula,
            saldo,
            tipo
        });
        yield nuevaCuenta.save();
        res.status(201).json({ message: 'Cuenta creada con éxito', cuenta: nuevaCuenta });
    }
    catch (error) {
        res.status(500).json({ message: 'Error al crear la cuenta', error });
    }
});
exports.crearCuenta = crearCuenta;
const verificarNumeroCuenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { numeroCuenta } = req.params;
        const cuentaExistente = yield Cuenta_1.default.findOne({ numeroCuenta });
        res.json({ exists: !!cuentaExistente });
    }
    catch (error) {
        console.error('Error al verificar el número de cuenta:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.verificarNumeroCuenta = verificarNumeroCuenta;
const actualizarSaldoCuenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { numeroCuenta, nuevoSaldo } = req.body;
        const cuentaActualizada = yield Cuenta_1.default.findOneAndUpdate({ numeroCuenta }, { saldo: nuevoSaldo }, { new: true });
        if (!cuentaActualizada) {
            return res.status(404).json({ message: 'Cuenta no encontrada' });
        }
        res.json({ message: 'Saldo de cuenta actualizado correctamente', cuenta: cuentaActualizada });
    }
    catch (error) {
        console.error('Error al actualizar saldo de cuenta:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.actualizarSaldoCuenta = actualizarSaldoCuenta;
