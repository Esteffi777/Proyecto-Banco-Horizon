import { Request, Response } from 'express';
import Administrador from '../models/Administrador';

export const getAdministradores = async (req: Request, res: Response) => {
    try {
        const administradores = await Administrador.find();
        res.json(administradores);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const crearAdministrador = async (req: Request, res: Response) => {
    const nuevoAdministrador = new Administrador({
        idAdministrador: req.body.idAdministrador,
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        correo: req.body.correo,
        celular: req.body.celular
    });

    try {
        const administradorGuardado = await nuevoAdministrador.save();
        res.status(201).json(administradorGuardado);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

// Controlador para eliminar un administrador por ID
export const eliminarAdministrador = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const administradorEliminado = await Administrador.findOneAndDelete({ idAdministrador: id });

        if (!administradorEliminado) {
            return res.status(404).json({ message: 'No se encontró el administrador' });
        }

        res.json({ message: 'Administrador eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el administrador:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

