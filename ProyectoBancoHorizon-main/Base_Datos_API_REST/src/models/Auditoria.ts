// models/Auditoria.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditoria extends Document {
  idAuditoria: string;
  cedula: string;
  fechaTransaccion: Date;
  accionRealizada: string;
  idTransferencia: string;
  idAdministrador: string;
}

const AuditoriaSchema: Schema = new Schema({
  idAuditoria: { type: String, required: true, unique: true },
  cedula: { type: String, required: true, ref: 'Cliente' },
  fechaTransaccion: { type: Date, required: true },
  accionRealizada: { type: String, required: true },
  idTransferencia: { type: String, required: true, ref: 'Transferencia' },
  idAdministrador: { type: String, required: true, ref: 'Administrador' }
}, { collection: 'Auditoria' });

const Auditoria = mongoose.model<IAuditoria>('Auditoria', AuditoriaSchema);

export default Auditoria;
