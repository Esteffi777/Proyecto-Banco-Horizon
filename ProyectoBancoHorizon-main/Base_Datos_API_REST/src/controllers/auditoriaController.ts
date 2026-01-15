// controllers/auditoriaController.ts
import { Request, Response } from 'express';
import Auditoria, { IAuditoria } from '../models/Auditoria';

// Obtener todas las auditorías
export const getAuditorias = async (req: Request, res: Response) => {
  try {
    const auditorias = await Auditoria.find();
    res.json(auditorias);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Crear una nueva auditoría
export const crearAuditoria = async (req: Request, res: Response) => {
  const nuevaAuditoria: IAuditoria = new Auditoria({
    idAuditoria: req.body.idAuditoria,
    cedula: req.body.cedula,
    fechaTransaccion: req.body.fechaTransaccion,
    accionRealizada: req.body.accionRealizada,
    idTransferencia: req.body.idTransferencia,
    idAdministrador: req.body.idAdministrador
  });

  try {
    const auditoriaGuardada = await nuevaAuditoria.save();
    res.status(201).json(auditoriaGuardada);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
