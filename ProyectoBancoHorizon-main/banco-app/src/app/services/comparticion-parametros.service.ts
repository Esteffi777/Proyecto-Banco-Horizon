import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComparticionParametrosService {
  private numeroCuenta: string | null = null;
  private cedula: string | null = null;
  private saldo: number | null = null;
  private tipoCuenta: string | null = null;
  private correo: string | null = null;
  private from: string | null = null;
  private formData: any = null;
  private transferenciaData: any = {};
  private valorFactura: number = 0;
  private servicioSeleccionado: string | null = null;

  setTransferenciaData(data: any): void {
    this.transferenciaData = data;
  }

  getTransferenciaData(): any {
    return this.transferenciaData;
  }

  setNumeroCuenta(numeroCuenta: string): void {
    this.numeroCuenta = numeroCuenta;
  }

  getNumeroCuenta(): string | null {
    return this.numeroCuenta;
  }

  setCedula(cedula: string): void {
    this.cedula = cedula;
  }

  getCedula(): string | null {
    return this.cedula;
  }

  setSaldo(saldo: number): void {
    this.saldo = saldo;
  }

  getSaldo(): number | null {
    return this.saldo;
  }

  setTipoCuenta(tipoCuenta: string): void {
    this.tipoCuenta = tipoCuenta;
  }

  getTipoCuenta(): string | null {
    return this.tipoCuenta;
  }

  setCorreo(correo: string): void {
    this.correo = correo;
  }

  getCorreo(): string | null {
    return this.correo;
  }

  setFrom(from: string): void {
    this.from = from;
  }

  getFrom(): string | null {
    return this.from;
  }

  setFormData(data: any): void {
    this.formData = data;
  }

  getFormData(): any {
    return this.formData;
  }

  clearFormData(): void {
    this.formData = null;
  }

  setValorFactura(valor: number): void {
    this.valorFactura = valor;
  }

  getValorFactura(): number {
    return this.valorFactura;
  }

  setServicioSeleccionado(servicio: string): void {
    this.servicioSeleccionado = servicio;
  }
  
  getServicioSeleccionado(): string | null {
    return this.servicioSeleccionado;
  }
}