import { Routes } from '@angular/router';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';
import { HomeComponent } from './home/home.component';
import { VerificarCodigoComponent } from './validar-codigo/validar-codigo.component';
import { IngresarCredencialesComponent } from './ingresar-credenciales/ingresar-credenciales.component';
import { LoginComponent } from './login/login.component';
import { VisualizacionSaldoComponent } from './visualizacion-saldo/visualizacion-saldo.component';
import { RecuperarPasswordComponent } from './recuperar-password/recuperar-password.component';
import { VerificarCodigoRecuperacionComponent } from './verificar-codigo/verificar-codigo.component';
import { NuevaPasswordComponent } from './nueva-password/nueva-password.component';
import { AgregarCuentasComponent } from './agregar-cuentas/agregar-cuentas.component';
import { TransferenciasComponent } from './transferencias/transferencias.component';
import {CambioPasswordComponent} from './cambio-password/cambio-password.component';
import { HistorialTransferenciasComponent } from './historial-transferencias/historial-transferencias.component';
import { DesbloquearCuentaComponent } from './desbloquear-cuenta/desbloquear-cuenta.component';
import { EnvioUsuarioRecuperacionUsuarioComponent } from './envio-usuario-recuperacion-usuario/envio-usuario-recuperacion-usuario.component';
import { IngresarCorreoRecuperacionUsuarioComponent } from './ingresar-correo-recuperacion-usuario/ingresar-correo-recuperacion-usuario.component';
import { ComprobanteTransaccionComponent } from './comprobante-transaccion/comprobante-transaccion.component';
import { PaypalComponent } from './paypal/paypal.component';
import { SeleccionServicioComponent } from './seleccion-servicio/seleccion-servicio.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'registrar-usuario', component: RegistrarUsuarioComponent},
    { path: 'verificar-codigo', component: VerificarCodigoComponent },
    { path: 'ingresar-credenciales', component: IngresarCredencialesComponent},
    { path: 'login', component: LoginComponent},
    { path: 'visualizacion-saldo', component: VisualizacionSaldoComponent},
    { path: 'recuperar-contraseña', component: RecuperarPasswordComponent },
    { path: 'verificar-codigo-recuperacion', component: VerificarCodigoRecuperacionComponent },
    { path: 'nueva-contraseña', component: NuevaPasswordComponent },
    { path: 'verificar-codigo-recuperacion/:correo', component: VerificarCodigoRecuperacionComponent },
    { path: 'crear-cuenta', component: AgregarCuentasComponent },
    { path: 'cambio-contraseña', component: CambioPasswordComponent },
    { path: 'transferencia', component: TransferenciasComponent },
    { path: 'historial-transferencias', component: HistorialTransferenciasComponent},
    { path: 'desbloquear-cuenta', component: DesbloquearCuentaComponent},
    { path: 'Correo-recuperacion-usuario', component: EnvioUsuarioRecuperacionUsuarioComponent},
    { path: 'recuperacion-usuario', component: IngresarCorreoRecuperacionUsuarioComponent},
    { path: 'comprobante-transaccion', component: ComprobanteTransaccionComponent },
    { path: 'paypal', component: PaypalComponent},
    { path: 'seleccion-servicio', component: SeleccionServicioComponent}
];

