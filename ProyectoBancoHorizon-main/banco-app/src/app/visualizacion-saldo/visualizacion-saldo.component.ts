import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/autenticacion.service';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';

@Component({
  selector: 'app-visualizacion-saldo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './visualizacion-saldo.component.html',
  styleUrls: ['./visualizacion-saldo.component.css']
})
export class VisualizacionSaldoComponent implements OnInit {
  nombreCliente: string = '';
  nombreClienteIniciales: string = '';
  cuentas: any[] = [];
  cedula: string | null = null;
  selectedAccount: any = null;
  showAccounts: boolean = false;
  mostrarSaldo: boolean = false; // Inicialmente, el saldo no se muestra
  amount: number = 0;
  currency: string = 'USD';
  result: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router,
    private comparticionParametrosService: ComparticionParametrosService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    const cedula = this.authService.getUserCedula();
    if (cedula) {
      this.cedula = cedula;
      this.usuarioService.getCuentasByCedula(cedula).subscribe(
        (response) => {
          this.nombreCliente = response.nombreCliente;
          this.cuentas = response.cuentas;
          this.selectedAccount = this.cuentas[0]; // Selección inicial de cuenta
        },
        (error) => {
          console.error('Error al obtener cuentas:', error);
        }
      );
    } else {
      console.error('No se pudo obtener la cédula del usuario autenticado');
    }
  }

  getIniciales(nombre: string): string {
    return nombre.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  convertCurrency(): void {
    let rate = 0;

    if (this.currency === "EUR") {
      rate = 0.85; // Tipo de cambio ejemplo
    } else if (this.currency === "GBP") {
      rate = 0.75; // Tipo de cambio ejemplo
    } else {
      rate = 1; // USD
    }

    const resultValue = this.amount * rate;
    this.result = `Resultado: ${resultValue.toFixed(2)} ${this.currency}`;
  }

  toggleAccounts(): void {
    this.showAccounts = !this.showAccounts;
  }

  toggleSaldo(): void {
    this.mostrarSaldo = !this.mostrarSaldo;
  }

  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');

    if (sidebar && overlay) {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    }
  }

  viewTransferHistory(numeroCuenta: string, cedula: string | null): void {
    if (cedula) {
      this.comparticionParametrosService.setNumeroCuenta(numeroCuenta);
      this.comparticionParametrosService.setCedula(cedula);
      this.router.navigate(['/historial-transferencias']);
    } else {
      console.error('Cedula no proporcionada');
    }
  }

  onAccountClick(cuenta: any): void {
    if (this.selectedAccount === cuenta) {
      if (this.cedula) {
        this.viewTransferHistory(cuenta.numeroCuenta, this.cedula);
      } else {
        console.error('Cedula no proporcionada');
      }
    } else {
      this.selectedAccount = cuenta;
    }
  }

  redirectTo(route: string): void {
    if (this.cedula) {
      this.comparticionParametrosService.setCedula(this.cedula);
      this.router.navigate([route]);
    } else {
      console.error('Cedula no proporcionada');
    }
  }

  redirectToHistorialTransferencias(): void {
    if (this.selectedAccount && this.cedula) {
      this.comparticionParametrosService.setNumeroCuenta(this.selectedAccount.numeroCuenta);
      this.comparticionParametrosService.setCedula(this.cedula);
      this.router.navigate(['/historial-transferencias']);
    } else {
      console.error('No se pudo redirigir al historial de transferencias. Verifica que la cuenta seleccionada y la cédula estén disponibles.');
    }
  }

  redirectToPayPal(): void {
    if (this.cedula) {
      this.comparticionParametrosService.setCedula(this.cedula);
      this.router.navigate(['/paypal']);
    } else {
      console.error('Cedula no proporcionada');
    }
  }
}
