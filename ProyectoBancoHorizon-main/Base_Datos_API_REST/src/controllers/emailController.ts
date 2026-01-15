import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Cliente from '../models/Cliente';
import LoginUsuario from '../models/LoginUsuario';
import * as path from 'path';
import * as fs from 'fs';

// const htmlWithVariables = (htmlTemplate: string, variables: { [key: string]: string }) => {
//   return Object.keys(variables).reduce((html, key) => {
//     const regex = new RegExp(`{{${key}}}`, 'g');
//     return html.replace(regex, variables[key]);
//   }, htmlTemplate);
// };

export const htmlWithVariables = (template: string, variables: { [key: string]: string }): string => {
  let result = template;
  for (const key in variables) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, variables[key]);
  }
  return result;
};


// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Configuración de OAuth2
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID, // Client ID
  process.env.GOOGLE_CLIENT_SECRET, // Client Secret
  'https://developers.google.com/oauthplayground' // URL de redirección de OAuth2
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN // Refresh Token
});

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Genera un código de 6 dígitos
};

export const enviarCodigoVerificacion = async (req: Request, res: Response) => {
  const { correo } = req.body;

  const verificationCode = generateVerificationCode();

  try {
    // Guarda el código de verificación en el documento del cliente
    const cliente = await Cliente.findOneAndUpdate(
      { correo },
      { verificationCode, isVerified: false },
      { new: true, upsert: true }
    );

    // Obtener el access token
    const accessToken = await oauth2Client.getAccessToken();

    if (typeof accessToken.token !== 'string') {
      throw new Error('No se pudo obtener el Access Token');
    }

    // Configuración del transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER, // Dirección de correo Gmail
        clientId: process.env.GOOGLE_CLIENT_ID, // Client ID
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Client Secret
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN, // Refresh Token
        accessToken: accessToken.token, // El token de acceso obtenido
      },
    });

    // Configuración del correo
    const mailOptions = {
      from: `Horizon Bank <${process.env.GMAIL_USER}>`, // Nombre y dirección de correo remitente
      to: correo, // Dirección de correo destinatario
      subject: 'Código de Verificación',
      html: `<strong>Tu código de verificación es: ${verificationCode}</strong>`,
    };

    // Envía el correo usando nodemailer
    const result = await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Correo de verificación enviado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al enviar el correo de verificación' });
  }
};

export const enviarCodigoRecuperacion = async (req: Request, res: Response) => {
  const { correo } = req.body;
  console.log('Solicitud recibida para enviar código de recuperación a:', correo);

  const recoveryCode = generateVerificationCode();
  console.log('Código de recuperación generado:', recoveryCode);

  try {
    const cliente = await Cliente.findOneAndUpdate(
      { correo },
      { recoveryCode },
      { new: true }
    );

    if (!cliente) {
      console.log('Cliente no encontrado para el correo:', correo);
      return res.status(404).json({ message: 'Correo no encontrado' });
    }

    const accessToken = await oauth2Client.getAccessToken();
    if (typeof accessToken.token !== 'string') {
      throw new Error('No se pudo obtener el Access Token');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: `Horizon Bank <${process.env.GMAIL_USER}>`,
      to: correo,
      subject: 'Código de Recuperación de Contraseña',
      html: `<strong>Tu código de recuperación de contraseña es: ${recoveryCode}</strong>`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Correo de recuperación enviado:', result);

    return res.status(200).json({ message: 'Correo de recuperación enviado' });
  } catch (error) {
    console.log('Error al enviar el correo de recuperación:', error);
    return res.status(500).json({ message: 'Error al enviar el correo de recuperación' });
  }
};

export const verificarCodigoRecuperacion = async (req: Request, res: Response) => {
  const { correo, verificationCode } = req.body;
  console.log('Solicitud recibida para verificar código de recuperación:', { correo, verificationCode });

  try {
    const cliente = await Cliente.findOne({ correo });
    console.log('Cliente encontrado:', cliente);

    if (!cliente) {
      console.log('Cliente no encontrado para el correo:', correo);
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    console.log('Codigo de recuperación almacenado:', cliente.recoveryCode);
    console.log('Codigo ingresado por el cliente:', verificationCode);

    if (cliente.recoveryCode === verificationCode) {
      console.log('Código de recuperación verificado correctamente para el correo:', correo);
      cliente.recoveryCode = undefined;
      await cliente.save();

      return res.status(200).json({ message: 'Código de recuperación verificado correctamente' });
    } else {
      console.log('Código de verificación incorrecto para el correo:', correo);
      return res.status(400).json({ message: 'Código de verificación incorrecto' });
    }
  } catch (error) {
    console.log('Error al verificar el código de recuperación:', error);
    return res.status(500).json({ message: 'Error al verificar el código de recuperación' });
  }
};

export const verificarCodigo = async (req: Request, res: Response) => {
  const { correo, verificationCode } = req.body;

  try {
    const cliente = await Cliente.findOne({ correo });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    if (cliente.verificationCode === verificationCode) {
      cliente.isVerified = true;
      cliente.verificationCode = undefined;

      await cliente.save();

      return res.status(200).json({ message: 'Código verificado con éxito' });
    } else {
      return res.status(400).json({ message: 'Código de verificación incorrecto' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error al verificar el código' });
  }
};

export const cambiarPassword = async (req: Request, res: Response) => {
  const { correo, nuevaPassword } = req.body;

  try {
    // Buscar el usuario en base a su correo en la tabla Cliente
    const cliente = await Cliente.findOne({ correo });
    console.log('Cliente: ', cliente);
    if (!cliente) {
      console.log('Cliente no encontrado para el correo:', correo);
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Encontrar el registro del usuario en la tabla LoginUsuario basado en la cédula
    const loginUsuario = await LoginUsuario.findOne({ cedula: cliente.cedula });

    if (!loginUsuario) {
      console.log('Usuario de login no encontrado para la cédula:', cliente.cedula);
      return res.status(404).json({ message: 'Usuario de login no encontrado' });
    }

    // Actualizar la contraseña en el objeto LoginUsuario
    const nuevaPasswordEncrip = await bcrypt.hash(nuevaPassword,10);
    loginUsuario.contraseña = nuevaPasswordEncrip;
    await loginUsuario.save();

    return res.status(200).json({ message: 'Contraseña actualizada con éxito' });
  } catch (error) {
    console.log('Error al cambiar la contraseña:', error);
    return res.status(500).json({ message: 'Error al cambiar la contraseña' });
  }
};
export const enviarNotificacionTransferencia = async (req: Request, res: Response) => {
  const { correo, monto, cuentaOrigen, cuentaDestino, fecha } = req.body;

  try {
    const accessToken = await oauth2Client.getAccessToken();
    if (!accessToken.token) {
      throw new Error('No se pudo obtener el Access Token');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const filePath = path.join(__dirname, '../templates/notificacionTransferencia.html');
    const htmlTemplate = fs.readFileSync(filePath, 'utf-8');

    const htmlContent = htmlWithVariables(htmlTemplate, {
      monto: monto.toFixed(2),
      cuentaOrigen,
      cuentaDestino,
      fecha
    });

    const mailOptions = {
      from: `Horizon Bank <${process.env.GMAIL_USER}>`,
      to: correo,
      subject: 'Notificación de Transferencia',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Correo de notificación enviado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al enviar el correo de notificación' });
  }
};

export const enviarNotificacionCambioPassword = async (req: Request, res: Response) => {
  const { correo} = req.body;

  try {
    // Obtener el access token
    const accessToken = await oauth2Client.getAccessToken();
    if (typeof accessToken.token !== 'string') {
      throw new Error('No se pudo obtener el Access Token');
    }

    // Configuración del transporte de correo
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER, // Dirección de correo Gmail
        clientId: process.env.GOOGLE_CLIENT_ID, // Client ID
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Client Secret
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN, // Refresh Token
        accessToken: accessToken.token, // El token de acceso obtenido
      },
    });

    // Configuración del correo
    const mailOptions = {
      from: `Horizon Bank <${process.env.GMAIL_USER}>`, // Nombre y dirección de correo remitente
      to: correo, // Dirección de correo destinatario
      subject: 'Notificación de Cambio de Contraseña',
      html: `<strong>Su contraseña ha sido cambiada con éxito.</strong>`,
    };

    // Envía el correo usando nodemailer
    const result = await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Correo de notificación enviado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al enviar el correo de notificación' });
  }
};
export const enviarNotificacionRecuperacionUsuario = async (req: Request, res: Response) => {
  const { correo, fecha, nuevoNombreUsuario } = req.body;
  try {
    const accessToken = await oauth2Client.getAccessToken();
    if (!accessToken.token) {
      throw new Error('No se pudo obtener el Access Token');
    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });
    const filePath = path.join(__dirname, '../templates/notificacionRecupercionUsuario.html');
    const htmlTemplate = fs.readFileSync(filePath, 'utf-8');
    const htmlContent = htmlWithVariables(htmlTemplate, {
      fecha,
      nuevoNombreUsuario
    });
    const mailOptions = {
      from: `Horizon Bank <${process.env.GMAIL_USER}>`,
      to: correo,
      subject: 'Notificación de Cambio de Nombre de Usuario',
      html: htmlContent,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Correo de notificación enviado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al enviar el correo de notificación' });
  }
};

export const enviarNotificacionIngresoSistema = async (req: Request, res: Response) => {
  const { correo, fecha, ip, ubicacion } = req.body;

  try {
    const accessToken = await oauth2Client.getAccessToken();
    if (!accessToken.token) {
      throw new Error('No se pudo obtener el Access Token');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const filePath = path.join(__dirname, '../templates/notificacionIngresoSistema.html');
    const htmlTemplate = fs.readFileSync(filePath, 'utf-8');
    const htmlContent = htmlWithVariables(htmlTemplate, {
      fecha,
      ip,
      ubicacion
    });

    const mailOptions = {
      from: `Horizon Bank <${process.env.GMAIL_USER}>`,
      to: correo,
      subject: 'Notificación de Ingreso al Sistema',
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Correo de notificación enviado' });
  } catch (error) {
    return res.status(500).json({ message: 'Error al enviar el correo de notificación'});
  }
};