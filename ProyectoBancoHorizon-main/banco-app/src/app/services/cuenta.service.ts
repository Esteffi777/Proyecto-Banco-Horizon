import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  //private apiUrl = 'http://localhost:4000/api'; 
  private apiUrl = 'https://base-datos-api-rest.vercel.app/api'; 

  constructor(private http: HttpClient) { }

  crearCuenta(cuentaData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/crear-cuenta`, cuentaData);
  }

  verificarNumeroCuenta(numeroCuenta: string): Observable<boolean> {
    return this.http.get<{ exists: boolean }>(`${this.apiUrl}/verificar-numero-cuenta/${numeroCuenta}`)
      .pipe(
        map(response => response.exists)
      );
  }

  obtenerSaldo(cedula: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/saldo/${cedula}`);
  }

  getCuentasByCedula(cedula: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cuentas?cedula=${cedula}`);
  }

  actualizarSaldo(numeroCuenta: string, monto: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/cuentas/${numeroCuenta}/saldo`, { monto });
  }

  registrarTransaccion(transaccion: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/transacciones`, transaccion);
  }
}