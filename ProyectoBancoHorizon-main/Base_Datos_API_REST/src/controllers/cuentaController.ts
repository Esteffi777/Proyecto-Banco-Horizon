import { Request, Response } from 'express';
import Cuenta from '../models/Cuenta';
import Cliente from '../models/Cliente';

export const getCuentas = async (req: Request, res: Response) => {
  const { cedula } = req.query;
  try {
    const cuentas = await Cuenta.find({ cedula });
    if (cuentas.length > 0) {
      const cliente = await Cliente.findOne({ cedula });
      if (cliente) {
        const response = {
          nombreCliente: cliente.nombres,
          cuentas: cuentas.map(cuenta => ({
            ...cuenta.toObject()
          }))
        };
        res.json(response);
      } else {
        res.status(404).json({ message: 'Cliente no encontrado' });
      }
    } else {
      res.status(404).json({ message: 'Cuentas no encontradas' });
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const crearCuenta = async (req: Request, res: Response) => {
    try {
      const { numeroCuenta, cedula, saldo, tipo } = req.body;
      const nuevaCuenta = new Cuenta({
        numeroCuenta,
        cedula,
        saldo,
        tipo
      });
  
      await nuevaCuenta.save();
      res.status(201).json({ message: 'Cuenta creada con éxito', cuenta: nuevaCuenta });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la cuenta', error });
    }
};

export const verificarNumeroCuenta = async (req: Request, res: Response) => {
    try {
      const { numeroCuenta } = req.params;
      const cuentaExistente = await Cuenta.findOne({ numeroCuenta });
      res.json({ exists: !!cuentaExistente });
    } catch (error) {
      console.error('Error al verificar el número de cuenta:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const actualizarSaldoCuenta = async (req: Request, res: Response) => {
  try {
    const { numeroCuenta, nuevoSaldo } = req.body;

    const cuentaActualizada = await Cuenta.findOneAndUpdate(
      { numeroCuenta },
      { saldo: nuevoSaldo },
      { new: true }
    );

    if (!cuentaActualizada) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    res.json({ message: 'Saldo de cuenta actualizado correctamente', cuenta: cuentaActualizada });
  } catch (error) {
    console.error('Error al actualizar saldo de cuenta:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getClienteByNumeroCuenta = async (req: Request, res: Response) => {
  const { numeroCuenta } = req.params;
  try {
    const cuenta = await Cuenta.findOne({ numeroCuenta });
    if (!cuenta) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    const cliente = await Cliente.findOne({ cedula: cuenta.cedula });
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const response = {
      nombreCliente: cliente.nombres,
      apellidosCliente: cliente.apellidos,
      cuenta: cuenta.toObject()
    };

    res.json(response);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const actualizarSaldo = async (req: Request, res: Response) => {
  const { cedula, monto } = req.body;

  try {
    const cuenta = await Cuenta.findOne({ cedula });
    if (!cuenta) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    cuenta.saldo += monto;
    await cuenta.save();

    res.json({ message: 'Saldo actualizado correctamente', saldo: cuenta.saldo });
  } catch (error) {
    console.error('Error al actualizar saldo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const obtenerSaldo = async (req: Request, res: Response) => {
  const { cedula } = req.params;

  try {
    const cuenta = await Cuenta.findOne({ cedula });
    if (!cuenta) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    res.json({ saldo: cuenta.saldo });
  } catch (error) {
    console.error('Error al obtener saldo:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};