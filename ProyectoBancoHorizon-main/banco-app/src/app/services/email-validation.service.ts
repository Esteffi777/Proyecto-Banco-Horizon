import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  //private baseUrl = 'http://localhost:4000/api/email';
  private baseUrl = 'https://base-datos-api-rest.vercel.app/api/email'; 

  constructor(private http: HttpClient) { }

  sendVerificationEmail(correo: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/enviar-verificacion-correo`, { correo });
  }

  verifyCode(correo: string, verificationCode: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verificar-codigo`, { correo, verificationCode });
  }

  sendTransferNotification(correo: string, monto: number, cuentaOrigen: string, cuentaDestino: string, fecha: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/enviar-notificacion-transferencia`, { correo, monto, cuentaOrigen, cuentaDestino, fecha});
  }
  enviarCorreoCambioPassword(correo: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/notificacion-cambio-password`, { correo, });
  }
  sendRecuperacionUsuarioNotification(correo: string, fecha: string, nuevoNombreUsuario: string,): Observable<any> {
    return this.http.post(`${this.baseUrl}/notificacion-Recupercio-Usuario`, { correo, fecha, nuevoNombreUsuario});
  }
  enviarNotificacionIngreso(correo: string, fecha: string, ip: string, ubicacion: string) {
    const body = { correo, fecha, ip, ubicacion };
    return this.http.post(`${this.baseUrl}/notificacion-Ingreso-Sistema`, body);
  }
} 