import { Request, Response } from 'express';
import Factura, { IFactura } from '../models/Factura';

// Crear una nueva factura para un usuario si no tiene una ya existente
export const crearFactura = async (req: Request, res: Response) => {
  const { cedula, servicio } = req.body;

  try {
    // Verificar si ya existe una factura para este servicio y usuario
    const facturaExistente = await Factura.findOne({ cedula, servicio, pagado: false });
    if (facturaExistente) {
      return res.status(409).json({ message: 'Ya existe una factura pendiente para este servicio.' });
    }

    // Generar un valor aleatorio entre 4 y 15
    const valor = Math.random() * (15 - 4) + 4;

    // Crear la nueva factura
    const nuevaFactura: IFactura = new Factura({
      cedula,
      servicio,
      valor,
      pagado: false,
      fechaVencimiento: new Date(new Date().setMonth(new Date().getMonth() + 1)) // Validez de un mes
    });

    const facturaGuardada = await nuevaFactura.save();
    res.status(201).json(facturaGuardada);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la factura.', error });
  }
};

export const getFacturaPorServicioYUsuario = async (req: Request, res: Response) => {
  const { cedula, servicio } = req.params;
  try {
      const factura = await Factura.findOne({ cedula, servicio });
      if (factura) {
          res.json(factura);
      } else {
          res.status(404).json({ message: 'Factura no encontrada' });
      }
  } catch (err:any) {
      res.status(500).json({ message: err.message });
  }
};


// Obtener todas las facturas de un usuario
export const obtenerFacturasPorCedula = async (req: Request, res: Response) => {
  const { cedula } = req.params;
  try {
    const facturas = await Factura.find({ cedula });
    res.json(facturas);
  } catch (err:any) {
    res.status(500).json({ message: err.message });
  }
};

// Actualizar el estado de una factura a pagado
export const pagarFactura = async (req: Request, res: Response) => {
  const { idFactura } = req.params;

  try {
    const factura = await Factura.findById(idFactura);
    if (!factura) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    factura.pagado = true;
    await factura.save();

    res.json({ message: 'Factura pagada exitosamente', factura });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la factura.', error });
  }
};

export const generarFacturasSiNoExisten = async (cedula: string) => {
  const servicios = ['Agua', 'Luz', 'Internet'];
  const facturasCreadas = [];

  for (const servicio of servicios) {
      const facturaExistente = await Factura.findOne({ cedula, servicio });

      if (!facturaExistente) {
          const valorFactura = parseFloat((Math.random() * (15 - 4) + 4).toFixed(2)); // Valor aleatorio entre 4 y 15
          const fechaVencimiento = new Date();
          fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1); // Validez de un mes

          const nuevaFactura = new Factura({
              cedula,
              servicio,
              valor: valorFactura,
              pagado: false,
              fechaVencimiento
          });

          const facturaGuardada = await nuevaFactura.save();
          facturasCreadas.push(facturaGuardada);
      }
  }

  return facturasCreadas;
};

export const actualizarEstadoFactura = async (req: Request, res: Response) => {
  const { cedula, servicio } = req.body;

  try {
    const factura = await Factura.findOneAndUpdate(
      { cedula, servicio },
      { pagado: true, fechaPago: new Date() },
      { new: true } // Esto devuelve la factura actualizada
    );

    if (!factura) {
      return res.status(404).json({ message: 'Factura no encontrada' });
    }

    res.json({ message: 'Estado de la factura actualizado', factura });
  } catch (error) {
    console.error('Error al actualizar el estado de la factura:', error);
    res.status(500).json({ message: 'Error al actualizar el estado de la factura' });
  }
};
