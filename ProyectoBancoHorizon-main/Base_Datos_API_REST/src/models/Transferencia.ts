// models/Transferencia.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITransferencia extends Document {
  idTransferencia: string;
  monto: number;
  fecha: string;
  cuentaDestino: string;
  numeroCuenta: string;
  saldoRestante: number;
  descripcion: string;
}

const TransferenciaSchema: Schema = new Schema({
  idTransferencia: { type: String, required: true, unique: true },
  monto: { type: Number, required: true },
  fecha: { type: String, required: true },
  cuentaDestino: { type: String, required: true },
  numeroCuenta: { type: String, required: true, ref: 'Cuenta' },
  saldoRestante: { type: Number, required: true },
  descripcion: { type: String, required: true }
}, { collection: 'Transferencia' });

const Transferencia = mongoose.model<ITransferencia>('Transferencia', TransferenciaSchema);

export default Transferencia;
