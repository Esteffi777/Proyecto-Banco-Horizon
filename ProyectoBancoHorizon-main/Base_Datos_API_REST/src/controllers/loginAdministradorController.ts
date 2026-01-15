// controllers/loginAdministradorController.ts
import { Request, Response } from 'express';
import LoginAdministrador, { ILoginAdministrador } from '../models/LoginAdministrador';

// Obtener todos los login de administradores
export const getLoginAdministradores = async (req: Request, res: Response) => {
  try {
    const loginAdministradores = await LoginAdministrador.find();
    res.json(loginAdministradores);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Crear un nuevo login de administrador
export const crearLoginAdministrador = async (req: Request, res: Response) => {
  const nuevoLoginAdministrador: ILoginAdministrador = new LoginAdministrador({
    idAdministrador: req.body.idAdministrador,
    usuario: req.body.usuario,
    contraseña: req.body.contraseña
  });

  try {
    const loginAdministradorGuardado = await nuevoLoginAdministrador.save();
    res.status(201).json(loginAdministradorGuardado);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
