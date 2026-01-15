import mongoose, { Schema, Document } from 'mongoose';

export interface ICuenta extends Document {
    numeroCuenta: string;
    tipo: string;
    saldo: number;
    cedula: string;
}

const CuentaSchema: Schema = new Schema({
    numeroCuenta: { type: String, required: true, unique: true },
    tipo: { type: String, required: true },
    saldo: { type: Number, required: true },
    cedula: { type: String, required: true, ref: 'Cliente' }
}, { collection: 'Cuenta' });

const Cuenta = mongoose.model<ICuenta>('Cuenta', CuentaSchema);

export default Cuenta;
