import { Component, OnInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.component.html',
  styleUrls: ['./paypal.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule]
})
export class PaypalComponent implements OnInit {
  cedula: string | null = null;
  selectedAccount: any = null;
  cuentas: any[] = [];
  valorFactura: number = 0;
  factura: any = {};
  estado: string = 'Por pagar'; 
  public fechaPago: Date | null = null;
  servicioSeleccionado: string | null = null;

  constructor(
    private renderer: Renderer2,
    private comparticionParametrosService: ComparticionParametrosService,
    private usuarioService: UsuarioService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object  // Inyección del platformId para verificar el entorno
  ) {}

  ngOnInit(): void {
    this.valorFactura = this.comparticionParametrosService.getValorFactura();
    this.cedula = this.comparticionParametrosService.getCedula();
    this.servicioSeleccionado = this.comparticionParametrosService.getServicioSeleccionado();

    this.loadUserAccounts();
    this.verificarEstadoPago();

    if (isPlatformBrowser(this.platformId)) {  // Verificación del entorno
      this.loadPaypalScript().then(() => {
        console.log('PayPal script loaded successfully');
        this.setupPayPalButton();
      }).catch(error => {
        console.error('Error loading PayPal script', error);
      });
    }
  }

  verificarEstadoPago(): void {
    const servicioSeleccionado = this.comparticionParametrosService.getServicioSeleccionado();
  
    if (this.selectedAccount && servicioSeleccionado) {
      this.usuarioService.verificarPagoServicio(this.selectedAccount.numeroCuenta, servicioSeleccionado).subscribe(response => {
        if (response.pagado) {
          this.estado = 'Pagado';
          this.valorFactura = response.monto;
        } else {
          this.estado = 'Por pagar';
        }
      });
    }
  }

  loadUserAccounts(): void {
    if (this.cedula) {
      this.usuarioService.getCuentasByCedula(this.cedula).subscribe(response => {
        this.cuentas = response.cuentas;
        if (this.cuentas.length > 0) {
          this.selectedAccount = this.cuentas[0];
        }
      });
    }
  }

  onAccountChange(event: any): void {
    this.selectedAccount = this.cuentas.find(cuenta => cuenta.numeroCuenta === event.target.value);
    this.comparticionParametrosService.setNumeroCuenta(this.selectedAccount.numeroCuenta);
  }

  loadPaypalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = this.renderer.createElement('script');
      script.src = 'https://www.paypal.com/sdk/js?client-id=AZR0cJV1E3SIEhbq3FaxBaujQavDGZ6kekz73uygMZkB1-RADBtkYCUsw1P7fSgM6LdqMpl6Mip2_vJp&currency=USD';
      script.onload = () => resolve();
      script.onerror = (error: any) => reject(error);
      this.renderer.appendChild(document.body, script);
    });
  }

  actualizarSaldoCuenta(valor: number): void {
    if (this.selectedAccount) {
      const nuevoSaldo = this.selectedAccount.saldo - valor;
      if (nuevoSaldo < 0) {
        // Si no hay suficientes fondos, muestra una alerta y cancela el proceso
        alert('Fondos insuficientes, no se puede realizar el pago.');
        return; // Salir de la función sin procesar la transacción
      }
  
      // Si hay fondos suficientes, procede a actualizar el saldo
      this.usuarioService.actualizarSaldoCuenta(this.selectedAccount.numeroCuenta, nuevoSaldo).subscribe(
        response => {
          console.log('Saldo actualizado:', response);
          this.router.navigate(['/visualizacion-saldo']);
        },
        error => {
          console.error('Error al actualizar saldo:', error);
        }
      );
    }
  }
  
  setupPayPalButton(): void {
    if ((window as any).paypal) {
      (window as any).paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: this.valorFactura.toFixed(2)
              }
            }]
          });
        },
        onApprove: (data: any, actions: any) => {
          // Antes de capturar, verifica si hay fondos suficientes
          const nuevoSaldo = this.selectedAccount.saldo - this.valorFactura;
          if (nuevoSaldo < 0) {
            alert('Fondos insuficientes, no se puede realizar el pago.');
            actions.reject(); // Cancelar la captura de la orden
            return;
          }
  
          return actions.order.capture().then((details: any) => {
            this.actualizarSaldoCuenta(this.valorFactura);
            this.registrarTransaccion(details);
            this.actualizarEstadoFactura();
            actions.close();
            this.mostrarModalExito();
          });
        }
      }).render('#paypal-button-container');
    } else {
      console.error('PayPal SDK not loaded');
    }
  }

  actualizarEstadoFactura(): void {
    if (!this.cedula ) {
        console.error('Cédula no está definida');
        return;
    }

    if (!this.servicioSeleccionado){
      console.error('Servicio no está definido');
      return;
    }

    const facturaActualizada = {
        cedula: this.cedula,
        servicio: this.servicioSeleccionado,
        pagado: true
    };

    this.usuarioService.actualizarEstadoFactura(facturaActualizada).subscribe(
        response => {
            console.log('Estado de la factura actualizado:', response);
        },
        error => {
            console.error('Error al actualizar el estado de la factura:', error);
        }
    );
  }
  
  mostrarModalExito(): void {
    // Crea un modal en el DOM (puedes personalizar el contenido y el estilo)
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <h2>Pago Exitoso</h2>
        <p>Gracias por su pago.</p>
        <button id="closeModalButton">Aceptar</button>
      </div>
    `;
    document.body.appendChild(modal);
  
    // Manejar el cierre del modal y redirigir
    const closeModalButton = modal.querySelector('#closeModalButton') as HTMLElement;
    closeModalButton.addEventListener('click', () => {
      document.body.removeChild(modal);
      this.router.navigate(['/historial-transferencias']);
    });
  }

  registrarTransaccion(details: any): void {
    const transaccion = {
      cedula: this.cedula,
      numeroCuenta: this.selectedAccount.numeroCuenta,
      tipo: 'Pago de servicio',
      monto: this.valorFactura,
      fecha: new Date(),
      detalles: `Pago del servicio de ${this.comparticionParametrosService.getServicioSeleccionado()}`
    };
    
    console.log('Datos enviados al backend:', transaccion);

    this.usuarioService.registrarTransaccion(transaccion).subscribe(
      response => {
        console.log('Transacción registrada:', response);
      },
      error => {
        console.error('Error al registrar transacción:', error);
      }
    );
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}
