import mongoose, { Schema, Document } from 'mongoose';

export interface IFactura extends Document {
    cedula: string;
    servicio: string;
    valor: number;
    pagado: boolean;
    fechaCreacion: Date;
    fechaVencimiento: Date;
}

const FacturaSchema: Schema = new Schema({
    cedula: { type: String, required: true },
    servicio: { type: String, required: true },
    valor: { type: Number, required: true },
    pagado: { type: Boolean, default: false },
    fechaCreacion: { type: Date, default: Date.now },
    fechaVencimiento: { type: Date, required: true },
});

const Factura = mongoose.model<IFactura>('Factura', FacturaSchema);

export default Factura;
