import { Component, OnInit } from '@angular/core';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import { MaskedAccountPipe } from '../pipes/masked-account.pipe'; // Asegúrate de la ruta correcta

@Component({
  selector: 'app-comprobante-transaccion',
  standalone: true,
  imports: [CommonModule, MaskedAccountPipe], // Incluye el pipe aquí
  templateUrl: './comprobante-transaccion.component.html',
  styleUrls: ['./comprobante-transaccion.component.css']
})
export class ComprobanteTransaccionComponent implements OnInit {
  transferenciaData: any = null;

  constructor(
    private comparticionParametrosService: ComparticionParametrosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.transferenciaData = this.comparticionParametrosService.getTransferenciaData();
    if (!this.transferenciaData) {
      this.router.navigate(['/visualizacion-saldo']);
    }
  }

  descargarPDF(): void {
    const data = document.getElementById('comprobante')!;
    html2canvas(data).then(canvas => {
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      const heightLeft = imgHeight;
      const pdf = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save('comprobante-transaccion.pdf');
    });
  }

  descargarImagen(): void {
    const data = document.getElementById('comprobante')!;
    html2canvas(data).then(canvas => {
      const img = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = img;
      link.download = 'comprobante-transaccion.png';
      link.click();
    });
  }

  regresar(): void {
    this.router.navigate(['/visualizacion-saldo']);
  }
}
