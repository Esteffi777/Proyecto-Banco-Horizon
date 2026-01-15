// models/LoginAdministrador.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ILoginAdministrador extends Document {
  idAdministrador: string;
  usuario: string;
  contraseña: string;
}

const LoginAdministradorSchema: Schema = new Schema({
  idAdministrador: { type: String, required: true, ref: 'Administrador' },
  usuario: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true }
}, { collection: 'LoginAdministrador' });

const LoginAdministrador = mongoose.model<ILoginAdministrador>('LoginAdministrador', LoginAdministradorSchema);

export default LoginAdministrador;
