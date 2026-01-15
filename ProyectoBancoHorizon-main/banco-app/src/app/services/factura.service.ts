import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  //private apiUrl = 'http://localhost:4000/api/facturas';
  private apiUrl = 'https://base-datos-api-rest.vercel.app/api/facturas'; 

  constructor(private http: HttpClient) {}

  generarFactura(cedula: string, servicio: string): Observable<any> {
    const valor = Math.random() * 100; // Generar un valor aleatorio
    return this.http.post<any>(`${this.apiUrl}/generar`, { cedula, servicio, valor });
  }

  getFacturaPorPagar(cedula: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/porPagar/${cedula}`);
  }

  marcarFacturaPagada(facturaId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/marcarPagada`, { facturaId });
  }
}
