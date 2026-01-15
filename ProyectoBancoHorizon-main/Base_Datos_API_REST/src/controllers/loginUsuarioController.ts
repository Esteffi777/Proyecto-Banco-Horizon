import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import axios from 'axios';
import LoginUsuario, { ILoginUsuario } from '../models/LoginUsuario';
import Cliente from '../models/Cliente';
import { generarFacturasSiNoExisten } from './facturaController';

const MAX_INTENTOS_FALLIDOS = 3;
// Obtener todos los login de usuarios
export const getLoginUsuarios = async (req: Request, res: Response) => {
  try {
    const loginUsuarios = await LoginUsuario.find();
    res.json(loginUsuarios);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Crear un nuevo login de usuario
export const crearLoginUsuario = async (req: Request, res: Response) => {
  const nuevoLoginUsuario: ILoginUsuario = new LoginUsuario({
    idUsuario: req.body.idUsuario,
    nombreUsuario: req.body.nombreUsuario,
    contraseña: await bcrypt.hash(req.body.contraseña, 10), // Encriptar la contraseña antes de guardarla
    cedula: req.body.cedula
  });

  try {
    const loginUsuarioGuardado = await nuevoLoginUsuario.save();
    res.status(201).json(loginUsuarioGuardado);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Actualizar un login de usuario
export const actualizarLoginUsuario = async (req: Request, res: Response) => {
  const { cedula } = req.params;
  const actualizacion = req.body;

  try {
    const loginUsuarioActualizado = await LoginUsuario.findOneAndUpdate({ cedula }, actualizacion, { new: true });

    if (!loginUsuarioActualizado) {
      return res.status(404).json({ message: 'No se encontró el usuario' });
    }

    res.json(loginUsuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar un login de usuario
export const eliminarLoginUsuario = async (req: Request, res: Response) => {
  const { cedula } = req.params;

  try {
    const loginUsuarioEliminado = await LoginUsuario.findOneAndDelete({ cedula });

    if (!loginUsuarioEliminado) {
      return res.status(404).json({ message: 'No se encontró el usuario' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Iniciar sesión
export const loginUsuario = async (req: Request, res: Response) => {
  const { nombreUsuario, contraseña, recaptchaToken } = req.body;

  // Verificar el token de reCAPTCHA
  const secretKey = '6LfpXQ8qAAAAAAP62iG2moRAYa3xoXRWjiNSW1Z1';
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

  try {
    const response = await axios.post(verificationUrl);
    const { success, score } = response.data;

    if (!success || score < 0.5) {
      return res.status(400).json({ message: 'reCAPTCHA verification failed' });
    }

    const usuario = await LoginUsuario.findOne({ nombreUsuario });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si la cuenta está bloqueada
    if (usuario.bloqueado) {
      return res.status(403).json({ message: 'Cuenta bloqueada. Contacta al soporte.' });
    }

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      // Incrementar el contador de intentos fallidos
      usuario.intentosFallidos += 1;

      // Bloquear la cuenta si se alcanzan los intentos fallidos
      if (usuario.intentosFallidos >= MAX_INTENTOS_FALLIDOS) {
        usuario.bloqueado = true;
        usuario.intentosFallidos = 0; // Resetear intentos fallidos después de bloquear
      }

      await usuario.save();
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Reiniciar intentos fallidos en caso de éxito
    usuario.intentosFallidos = 0;
    await usuario.save();

    // Generar facturas si no existen
    try {
      await generarFacturasSiNoExisten(usuario.cedula);
    } catch (facturaError) {
      console.error('Error al generar facturas:', (facturaError as Error).message);
      return res.status(500).json({ message: 'Error al generar facturas' });
    }

    return res.status(200).json({ message: 'Inicio de sesión exitoso', cedula: usuario.cedula });
  } catch (error) {
    console.error('Error al iniciar sesión:', (error as Error).message);
    return res.status(500).json({ message: 'Error al iniciar sesión o al verificar el reCAPTCHA' });
  }
};

export const actualizarPassword = async (req: Request, res: Response) => {
  const { nombreUsuario, nuevaPassword } = req.body;

  try {
    // Buscar el usuario en base a su nombre
    const loginUsuario = await LoginUsuario.findOne({ nombreUsuario });
    if (!loginUsuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    // Actualizar la contraseña en el objeto LoginUsuario
    const nuevaPasswordEncrip = await bcrypt.hash(nuevaPassword, 10);
    loginUsuario.contraseña = nuevaPasswordEncrip;
    await loginUsuario.save();

    return res.status(200).json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al cambiar la contraseña' });
  }
};

export const verificarPassword = async (req: Request, res: Response) => {
  const { nombreUsuario, passwordActual } = req.body;

  try {
    // Buscar el usuario por nombreUsuario
    const usuario = await LoginUsuario.findOne({ nombreUsuario });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña
    const contraseñaValida = await bcrypt.compare(passwordActual, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    return res.status(200).json({ message: 'Contraseña verificada exitosamente' });
  } catch (error) {
    console.error('Error al verificar la contraseña:', (error as Error).message);
    return res.status(500).json({ message: 'Error al verificar la contraseña' });
  }
};

export const desbloquearUsuario = async (req: Request, res: Response) => {
  const { correo } = req.body;

  try {
    const cliente = await Cliente.findOne({ correo });
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    const usuario = await LoginUsuario.findOne({ cedula: cliente.cedula });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Desbloquear el usuario
    usuario.bloqueado = false;
    await usuario.save();

    return res.status(200).json({ message: 'Usuario desbloqueado con éxito' });
  } catch (error) {
    console.error('Error al desbloquear el usuario:', (error as Error).message);
    return res.status(500).json({ message: 'Error al desbloquear el usuario' });
  }
};

export const cambiarNombreUsuarioPorCorreo = async (req: Request, res: Response) => {
  const { correo, nuevoNombreUsuario } = req.body;

  try {
    // Buscar el cliente por correo para obtener la cédula
    const cliente = await Cliente.findOne({ correo });
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Buscar el usuario de login por cédula
    const usuario = await LoginUsuario.findOne({ cedula: cliente.cedula });
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizar el nombre de usuario
    usuario.nombreUsuario = nuevoNombreUsuario;

    // Guardar los cambios en la base de datos
    await usuario.save();

    return res.status(200).json({ message: 'Nombre de usuario actualizado con éxito', usuario });
  } catch (error) {
    console.error('Error al cambiar el nombre de usuario:', (error as Error).message);
    return res.status(500).json({ message: 'Error al cambiar el nombre de usuario' });
  }
};
export const obtenerCorreoPorNombreUsuario = async (req: Request, res: Response) => {
  const { nombreUsuario } = req.query;

  try {
    // Buscar el LoginUsuario por nombreUsuario
    const loginUsuario = await LoginUsuario.findOne({ nombreUsuario });

    if (!loginUsuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Buscar el Cliente por cedula obtenida del LoginUsuario
    const cliente = await Cliente.findOne({ cedula: loginUsuario.cedula });

    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    return res.status(200).json({ correo: cliente.correo });
  } catch (error) {
    console.error('Error al obtener el correo por nombre de usuario:', (error as Error).message);
    return res.status(500).json({ message: 'Error al obtener el correo' });
  }
};