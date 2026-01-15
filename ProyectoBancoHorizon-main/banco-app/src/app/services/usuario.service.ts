import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  //private baseUrl = 'http://localhost:4000/api'; 
  private ipifyUrl = 'https://api.ipify.org?format=json';
  private baseUrl = 'https://base-datos-api-rest.vercel.app/api'; 

  constructor(private http: HttpClient) { }

  registrarUsuario(usuario: any): Observable<any> {
    const url = `${this.baseUrl}/cliente`;
    return this.http.post<any>(url, usuario).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) { // Error 409: Conflict (usuario ya existe)
          return throwError('La cédula ingresada ya está registrada.');
        }
        return throwError('Error desconocido al registrar usuario.');
      })
    );
  }

  crearLoginUsuario(loginData: any): Observable<any> {
    const url = `${this.baseUrl}/loginUsuario`;
    return this.http.post<any>(url, loginData).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error al crear el login del usuario.');
      })
    );
  }

  loginUsuario(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  getCuentasByCedula(cedula: string): Observable<any> {
    const url = `${this.baseUrl}/cuenta?cedula=${cedula}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }

  getTransferenciasByNumeroCuenta(numeroCuenta: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/transferencia/${numeroCuenta}`).pipe(
      catchError(this.handleError)
    );
  }

  getCurrentUser(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/usuario`); 
  }

  sendVerificationEmail(correo: string): Observable<any> {
    const url = `${this.baseUrl}/email/enviar-verificacion-correo`; // Endpoint para enviar correo de verificación
    return this.http.post(url, { correo });
  }

  verifyCode(correo: string, verificationCode: string): Observable<any> {
    const url = `${this.baseUrl}/email/verificar-codigo`; // Endpoint para verificar código de verificación
    return this.http.post(url, { correo, verificationCode });
  }

  enviarCodigoRecuperacion(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/email/enviar-codigo-recuperacion`, data);
  }

  verificarCodigoRecuperacion(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/email/verificar-codigo-recuperacion`, data);
  }

  cambiarPassword(formData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/email/cambiar-password`, formData);
  }

  obtenerEmailPorCedula(cedula: string): Observable<{ email: string }> {
    return this.http.get<{ email: string }>(`${this.baseUrl}/usuario/email?cedula=${cedula}`);
  }

  actualizarSaldoCuenta(numeroCuenta: string, nuevoSaldo: number): Observable<any> {
    const url = `${this.baseUrl}/actualizar-saldo-cuenta`;
    const body = { numeroCuenta, nuevoSaldo };
    return this.http.put<any>(url, body).pipe(
      catchError(this.handleError)
    );
  }
  
  realizarTransferencia(cuentaOrigen: string, cuentaDestino: string, monto: number): Observable<any> {
    const url = `${this.baseUrl}/realizar-transferencia`;
    const body = { cuentaOrigen, cuentaDestino, monto };
    return this.http.post<any>(url, body).pipe(
      catchError(this.handleError)
    );
  }
  
  actualizarPassword(formData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login/actualizar-password`,formData);
  }

  verificarCorreo(correo: string): Observable<any> {
    const url = `${this.baseUrl}/verificar-correo?correo=${correo}`;
    return this.http.get<any>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError('Error al verificar el correo.');
      })
    );
  }

  obtenerTransferenciasPaginadas(numeroCuenta: string, pagina: number): Observable<any[]> {
    const url = `${this.baseUrl}/transferencias?numeroCuenta=${numeroCuenta}&pagina=${pagina}`;
    return this.http.get<any[]>(url);
  }

  verificarIngresos(numeroCuenta: string): Observable<any[]> {
    const url = `${this.baseUrl}/ingresos?numeroCuenta=${numeroCuenta}`;
    return this.http.get<any[]>(url);
  }

  desbloquearUsuario(correo: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/desbloquear-cuenta`, { correo });
  }

  getClienteByNumeroCuenta(numeroCuenta: string): Observable<any> {
    const url = `${this.baseUrl}/cuentas/cliente/${numeroCuenta}`;
    return this.http.get<any>(url).pipe(
      catchError(this.handleError)
    );
  }
  cambiarNombreUsuarioPorCorreo(correo: string, nuevoNombreUsuario: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/usuarios/cambiar-nombre-por-correo`, { correo, nuevoNombreUsuario });
  }

  obtenerIP(): Observable<any> {
    return this.http.get<any>(this.ipifyUrl);
  }

  obtenerCorreoPorNombreUsuario(nombreUsuario: string): Observable<{ correo: string }> {
    const url = `${this.baseUrl}/obtener-correo?nombreUsuario=${nombreUsuario}`;
    return this.http.get<{ correo: string }>(url).pipe(
      catchError(this.handleError)
    );
  }

  registrarTransaccion(transaccion: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/transacciones`, transaccion);
  }

  getTransaccionesByNumeroCuenta(numeroCuenta: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/transacciones/${numeroCuenta}`);
  }  
  
  verificarPagoServicio(numeroCuenta: string, servicio: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/verificar-pago-servicio/${numeroCuenta}/${servicio}`).pipe(
      catchError(this.handleError)
    );
  }
  
  getFacturasPorCedula(cedula: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/facturas/${cedula}`);
  }

  crearFactura(factura: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/crear-factura`, factura);
  }

  pagarFactura(idFactura: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/pagar-factura/${idFactura}`, {});
  }

  getFacturaPorServicioYUsuario(cedula: string, servicio: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/facturas/${cedula}/${servicio}`);
  }
  
  actualizarEstadoFactura(facturaActualizada: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/facturas/actualizar-estado`, facturaActualizada).pipe(
        catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido!';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Error: ${error.error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}