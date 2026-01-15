import { Request, Response } from 'express';
import Transferencia, { ITransferencia } from '../models/Transferencia';
import Cuenta from '../models/Cuenta';
import Transaccion from '../models/Transaccion';
import moment from 'moment';

// Obtener todas las transferencias
export const getTransferencias = async (req: Request, res: Response) => {
  try {
    const transferencias = await Transferencia.find();
    res.json(transferencias);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Crear una nueva transferencia
export const crearTransferencia = async (req: Request, res: Response) => {
  const fechaStr = req.body.fecha; // La fecha recibida como string en formato ISO 8601

  // No convertir la fecha, almacenarla directamente como string
  const nuevaTransferencia: ITransferencia = new Transferencia({
    idTransferencia: req.body.idTransferencia,
    monto: req.body.monto,
    fecha: fechaStr, // Guardar directamente el string
    cuentaDestino: req.body.cuentaDestino,
    numeroCuenta: req.body.numeroCuenta,
    saldoRestante: req.body.saldoRestante,
    descripcion: req.body.descripcion
  }); 

  try {
    const transferenciaGuardada = await nuevaTransferencia.save();
    console.log('Transferencia guardada en la base de datos:', transferenciaGuardada);
    res.status(201).json(transferenciaGuardada);
  } catch (err: any) {
    console.log('Error al guardar la transferencia:', err);
    res.status(400).json({ message: err.message });
  }
};
export const realizarTransferencia = async (req: Request, res: Response) => {
  const { cuentaOrigen, cuentaDestino, monto } = req.body;

  try {
    // Obtener las cuentas origen y destino
    const cuentaOrigenDB = await Cuenta.findOne({ numeroCuenta: cuentaOrigen });
    const cuentaDestinoDB = await Cuenta.findOne({ numeroCuenta: cuentaDestino });

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
    await cuentaOrigenDB.save();
    await cuentaDestinoDB.save();

    res.json({ message: 'Transferencia realizada con éxito' });
  } catch (error) {
    console.error('Error al realizar transferencia:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getTransferenciasByCuenta = async (req: Request, res: Response) => {
  const { numeroCuenta } = req.params;
  try {
    // Obtener transferencias salientes e ingresadas
    const transferenciasSalientes = await Transferencia.find({ numeroCuenta });
    const transferenciasIngresadas = await Transferencia.find({ cuentaDestino: numeroCuenta });

    // Combinar ambas listas
    const transferencias = [...transferenciasSalientes, ...transferenciasIngresadas];

    // Ordenar por fecha en orden descendente
    transferencias.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    res.json(transferencias);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const registrarTransaccion = async (req: Request, res: Response) => {
  const { cedula, numeroCuenta, tipo, monto, fecha, detalles } = req.body;

  try {
      const nuevaTransaccion = new Transaccion({
          cedula,
          numeroCuenta,
          tipo,
          monto,
          fecha,
          detalles
      });

      const transaccionGuardada = await nuevaTransaccion.save();
      console.log('Transacción guardada en la base de datos:', transaccionGuardada);
      res.status(201).json(transaccionGuardada);
  } catch (error) {
      console.error('Error al registrar la transacción:', error);
      res.status(500).json({ message: 'Error al registrar la transacción', error });
  }
};

export const getTransaccionesByCuenta = async (req: Request, res: Response) => {
  const { numeroCuenta } = req.params;
  try {
    const transacciones = await Transaccion.find({ numeroCuenta });
    res.json(transacciones);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};