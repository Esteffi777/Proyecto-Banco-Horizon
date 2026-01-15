import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CuentaService } from '../services/cuenta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';
import { AuthService } from '../services/autenticacion.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-agregar-cuentas',
  templateUrl: './agregar-cuentas.component.html',
  styleUrls: ['./agregar-cuentas.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class AgregarCuentasComponent implements OnInit {
  cuentaForm: FormGroup;
  cedula: string | null = null;
  isProcessing: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private fb: FormBuilder,
    private cuentaService: CuentaService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private comparticionParametrosService: ComparticionParametrosService
  ) {
    this.cuentaForm = this.fb.group({
      tipo: ['', Validators.required],
      saldoInicial: [{value: 0, disabled: true}, [Validators.required, Validators.min(0)]],
      cedula: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.cedula = this.comparticionParametrosService.getCedula();
      if (this.cedula) {
        this.cuentaForm.patchValue({ cedula: this.cedula });
      }
    });
  }

  generateUniqueAccountNumber(callback: (numeroCuenta: string) => void): void {
    const numeroCuenta = this.generateAccountNumber();
    this.cuentaService.verificarNumeroCuenta(numeroCuenta).subscribe(
      exists => {
        if (exists) {
          this.generateUniqueAccountNumber(callback); // Recursivamente genera un nuevo número si ya existe
        } else {
          callback(numeroCuenta);
        }
      },
      error => {
        this.snackBar.open('Error al verificar el número de cuenta', 'Cerrar', {
          duration: 3000
        });
      }
    );
  }

  generateAccountNumber(): string {
    const randomDigits = Math.floor(100000000 + Math.random() * 900000000).toString();
    return `22${randomDigits}`;
  }

  onSubmit(): void {
    if (this.cuentaForm.valid) {
      this.isProcessing = true;
      this.generateUniqueAccountNumber((numeroCuenta) => {
        const cuentaData = {
          tipo: this.cuentaForm.value.tipo,
          cedula: this.cedula,
          saldo: 0, // Saldo inicial predeterminado a 0
          numeroCuenta: numeroCuenta
        };
        this.cuentaService.crearCuenta(cuentaData).subscribe(
          response => {
            this.snackBar.open('Cuenta creada con éxito.', 'Cerrar', {
              duration: 3000
            });
            this.router.navigate(['/visualizacion-saldo'], { queryParams: { cedula: this.cedula } }); // Redirigir a la página de visualización de saldo
          },
          error => {
            this.snackBar.open('Error al crear la cuenta', 'Cerrar', {
              duration: 3000
            });
          }
        );
      });
    } else {
      this.snackBar.open('Por favor complete todos los campos correctamente', 'Cerrar', { duration: 3000 });
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

  redirectTo(route: string): void {
    if (this.cedula) {
      this.comparticionParametrosService.setCedula(this.cedula);
      this.router.navigate([route]);
    } else {
      console.error('Cedula no proporcionada');
    }
  }
}
