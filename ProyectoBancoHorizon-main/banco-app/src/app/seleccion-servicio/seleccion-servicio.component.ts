import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';
import { UsuarioService } from '../services/usuario.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-seleccion-servicio',
  templateUrl: './seleccion-servicio.component.html',
  styleUrls: ['./seleccion-servicio.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule]
})
export class SeleccionServicioComponent implements OnInit {
  servicioSeleccionado: string | null = null;
  valorFactura: number | null = null;
  estado: string | null = null;
  facturas: any[] = [];
  cedula: string | null = null;

  constructor(
    private comparticionParametrosService: ComparticionParametrosService,
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    this.cedula = this.comparticionParametrosService.getCedula();
  }

  ngOnInit(): void {
    const cedula = this.comparticionParametrosService.getCedula();
    if (cedula) {
      this.usuarioService.getFacturasPorCedula(cedula).subscribe(facturas => {
        this.facturas = facturas;
      });
    }
  }

  seleccionarServicio(servicio: string): void {
    if (this.cedula) {  // Verifica que cedula no sea null
      this.servicioSeleccionado = servicio;
      this.comparticionParametrosService.setServicioSeleccionado(servicio);
      this.usuarioService.getFacturaPorServicioYUsuario(this.cedula, servicio).subscribe(
        (factura: any) => {
          if (factura) {
            this.valorFactura = factura.valor;
            this.estado = factura.pagado ? 'Pagado' : 'Por pagar';
            this.comparticionParametrosService.setValorFactura(this.valorFactura ?? 0);
          } else {
            alert('No existe una factura para este servicio. Por favor, intente más tarde.');
          }
        },
        (error: any) => {
          console.error('Error al obtener la factura:', error);
          alert('No existe una factura para este servicio. Por favor, intente más tarde.');
        }
      );
    } else {
      console.error('Cédula no está disponible');
      alert('Cédula no está disponible. Por favor, intente más tarde.');
    }
  }

  pagarConPayPal(): void {
    if (this.valorFactura) {
      this.router.navigate(['/paypal']);
    } else {
      alert('Debe seleccionar un servicio para pagar.');
    }
  }

  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');

    if (sidebar && overlay) {
      sidebar.classList.toggle('active');
      overlay.classList.toggle('active');
    }
  }
  
  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}
