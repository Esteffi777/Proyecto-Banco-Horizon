// models/Cliente.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ICliente extends Document {
    cedula: string;
    nombres: string;
    apellidos: string;
    celular: string;
    correo: string;
    fechaNacimiento: Date;
    provincia: string;
    ciudad: string;
    callePrincipal: string;
    calleSecundaria: string;
    verificationCode?: string;
    isVerified?: boolean;
    recoveryCode?: string;
}

const ClienteSchema: Schema = new Schema({
    cedula: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v: any) {
                return /^\d{10}$/.test(v); // Validación para 10 dígitos numéricos
            },
            message: (props: any) => `${props.value} no es una cédula válida!`
        }
    },
    celular: {
        type: String,
        required: true,
        validate: {
            validator: function(v: any) {
                return /^\d{10}$/.test(v); // Validación para 10 dígitos numéricos
            },
            message: (props: any) => `${props.value} no es un celular válido!`
        }
    },
    nombres: { type: String, required: true },
    apellidos: { type: String, required: true },
    correo: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    provincia: { type: String, required: true },
    ciudad: { type: String, required: true },
    callePrincipal: { type: String, required: true },
    calleSecundaria: { type: String, required: true },
    verificationCode: { type: String }, // Campo para almacenar el código de verificación
    isVerified: { type: Boolean, default: false },
    recoveryCode: { type: String },
}, { collection: 'Cliente' });

const Cliente = mongoose.model<ICliente>('Cliente', ClienteSchema);

export default Cliente;
