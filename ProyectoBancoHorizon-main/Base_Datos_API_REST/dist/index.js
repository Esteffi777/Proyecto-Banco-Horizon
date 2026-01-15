"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const clienteRoutes_1 = __importDefault(require("./routes/clienteRoutes"));
const administradorRoutes_1 = __importDefault(require("./routes/administradorRoutes"));
const loginAdministradorRoutes_1 = __importDefault(require("./routes/loginAdministradorRoutes"));
const loginUsuarioRoutes_1 = __importDefault(require("./routes/loginUsuarioRoutes"));
const transferenciaRoutes_1 = __importDefault(require("./routes/transferenciaRoutes"));
const auditoriaRoutes_1 = __importDefault(require("./routes/auditoriaRoutes"));
const cuentaRoutes_1 = __importDefault(require("./routes/cuentaRoutes"));
const emailRoutes_1 = __importDefault(require("./routes/emailRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://angelabedon:PoliBanco@banco.2zv7hpl.mongodb.net/?appName=Banco';
mongoose_1.default.connect(MONGO_URI)
    .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error('Error conectando a MongoDB', error);
});
// Rutas
app.use('/api', clienteRoutes_1.default);
app.use('/api', administradorRoutes_1.default);
app.use('/api', loginAdministradorRoutes_1.default);
app.use('/api', loginUsuarioRoutes_1.default);
app.use('/api', transferenciaRoutes_1.default);
app.use('/api', auditoriaRoutes_1.default);
app.use('/api', cuentaRoutes_1.default);
app.use('/api/email', emailRoutes_1.default);
exports.default = app;
