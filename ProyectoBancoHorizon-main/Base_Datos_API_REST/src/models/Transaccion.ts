import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaccion extends Document {
    cedula: string;
    numeroCuenta: string;
    tipo: string;
    monto: number;
    fecha: Date;
    detalles: any;
    servicio:string;
}

const TransaccionSchema: Schema = new Schema({
    cedula: { type: String, required: true },
    numeroCuenta: { type: String, required: true },
    tipo: { type: String, required: true },
    monto: { type: Number, required: true },
    fecha: { type: Date, default: Date.now },
    detalles: { type: Object, required: true },
    servicio: { type: String, required: false }
}, { collection: 'Transaccion' });

const Transaccion = mongoose.model<ITransaccion>('Transaccion', TransaccionSchema);

export default Transaccion;
