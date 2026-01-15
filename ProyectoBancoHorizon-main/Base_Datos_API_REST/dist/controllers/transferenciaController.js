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
exports.getTransferenciasByCuenta = exports.realizarTransferencia = exports.crearTransferencia = exports.getTransferencias = void 0;
const Transferencia_1 = __importDefault(require("../models/Transferencia"));
const Cuenta_1 = __importDefault(require("../models/Cuenta"));
// Obtener todas las transferencias
const getTransferencias = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transferencias = yield Transferencia_1.default.find();
        res.json(transferencias);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getTransferencias = getTransferencias;
// Crear una nueva transferencia
const crearTransferencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nuevaTransferencia = new Transferencia_1.default({
        idTransferencia: req.body.idTransferencia,
        monto: req.body.monto,
        fecha: req.body.fecha,
        cuentaDestino: req.body.cuentaDestino,
        numeroCuenta: req.body.numeroCuenta,
        saldoRestante: req.body.saldoRestante,
        descripcion: req.body.descripcion
    });
    try {
        const transferenciaGuardada = yield nuevaTransferencia.save();
        res.status(201).json(transferenciaGuardada);
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
});
exports.crearTransferencia = crearTransferencia;
const realizarTransferencia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cuentaOrigen, cuentaDestino, monto } = req.body;
    try {
        // Obtener las cuentas origen y destino
        const cuentaOrigenDB = yield Cuenta_1.default.findOne({ numeroCuenta: cuentaOrigen });
        const cuentaDestinoDB = yield Cuenta_1.default.findOne({ numeroCuenta: cuentaDestino });
        if (!cuentaOrigenDB || !cuentaDestinoDB) {
            return res.status(404).json({ message: 'Cuenta origen o destino no encontrada' });
        }
        // Verificar si hay suficiente saldo en la cuenta origen
        if (cuentaOrigenDB.saldo < monto) {
            return res.status(400).json({ message: 'Saldo insuficiente en la cuenta origen' });
        }
        // Actualizar los saldos de las cuentas
        cuentaOrigenDB.saldo -= monto;
        cuentaDestinoDB.saldo += monto;
        // Guardar los cambios en la base de datos
        yield cuentaOrigenDB.save();
        yield cuentaDestinoDB.save();
        res.json({ message: 'Transferencia realizada con éxito' });
    }
    catch (error) {
        console.error('Error al realizar transferencia:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});
exports.realizarTransferencia = realizarTransferencia;
const getTransferenciasByCuenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { numeroCuenta } = req.params;
    try {
        // Obtener transferencias salientes e ingresadas
        const transferenciasSalientes = yield Transferencia_1.default.find({ numeroCuenta });
        const transferenciasIngresadas = yield Transferencia_1.default.find({ cuentaDestino: numeroCuenta });
        // Combinar ambas listas
        const transferencias = [...transferenciasSalientes, ...transferenciasIngresadas];
        // Ordenar por fecha en orden descendente
        transferencias.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        res.json(transferencias);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.getTransferenciasByCuenta = getTransferenciasByCuenta;
