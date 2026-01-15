import mongoose, { Schema, Document } from 'mongoose';

export interface IAdministrador extends Document {
    idAdministrador: string;
    nombres: string;
    apellidos: string;
    correo: string;
    celular: string;
}

const AdministradorSchema: Schema = new Schema({
    idAdministrador: { type: String, required: true, unique: true },
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    correo: { type: String, required: true },
    celular: { type: String, required: true }
}, { collection: 'Administrador' });

const Administrador = mongoose.model<IAdministrador>('Administrador', AdministradorSchema);

export default Administrador;
