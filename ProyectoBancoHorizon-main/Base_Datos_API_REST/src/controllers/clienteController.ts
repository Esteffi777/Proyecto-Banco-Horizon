import { Request, Response } from 'express';
import Cliente from '../models/Cliente';

export const getClientes = async (req: Request, res: Response) => {
    try {
        const clientes = await Cliente.find();
        res.json(clientes);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
 
export const crearCliente = async (req: Request, res: Response) => {
    const { cedula, nombres, apellidos, celular, correo, fechaNacimiento, provincia, ciudad, callePrincipal, calleSecundaria } = req.body;

    // Validación de cédula y celular
    if (!/^(\d{10})$/.test(cedula)) {
        return res.status(400).json({ message: 'La cédula debe tener 10 dígitos numéricos.' });
    }

    if (!/^(\d{10})$/.test(celular)) {
        return res.status(400).json({ message: 'El celular debe tener 10 dígitos numéricos.' });
    }

    // Validación de fecha de nacimiento
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    let age: number = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 18) {
        return res.status(400).json({ message: 'El cliente debe tener más de 18 años para registrarse.' });
    }

    try {
        // Verificar si la cédula ya existe
        const existingCliente = await Cliente.findOne({ cedula });
        if (existingCliente) {
            return res.status(409).json({ message: 'La cédula ya está registrada.' });
        }

    const nuevoCliente = new Cliente({
        cedula,
        nombres,
        apellidos,
        celular,
        correo,
        fechaNacimiento,
        provincia,
        ciudad,
        callePrincipal,
        calleSecundaria
    });

    
        const clienteGuardado = await nuevoCliente.save();
        res.status(201).json(clienteGuardado);
    } catch (err: any) {
        res.status(400).json({ message: err.message });
    }
};

export const actualizarCliente = async (req: Request, res: Response) => {
    const { cedula } = req.params;
    const actualizacion = req.body;

    try {
        const clienteActualizado = await Cliente.findOneAndUpdate({ cedula }, actualizacion, { new: true });

        if (!clienteActualizado) {
            return res.status(404).json({ message: 'No se encontró el cliente' });
        }

        res.json({ message: 'Cliente actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const eliminarCliente = async (req: Request, res: Response) => {
    const { cedula } = req.params;

    try {
        const clienteEliminado = await Cliente.findOneAndDelete({ cedula });

        if (!clienteEliminado) {
            return res.status(404).json({ message: 'No se encontró el cliente' });
        }

        res.json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const obtenerEmailPorCedula = async (req: Request, res: Response) => {
    const { cedula } = req.query;
    try {
        const usuario = await Cliente.findOne({ cedula });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json({ email: usuario.correo });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
};

export const verificarCorreo = async (req: Request, res: Response) => {
    const { correo } = req.query;
    try {
      const cliente = await Cliente.findOne({ correo });
      if (cliente) {
        return res.status(409).json({ message: 'El correo ya está registrado.' });
      }
      res.status(200).json({ message: 'El correo está disponible.' });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
};