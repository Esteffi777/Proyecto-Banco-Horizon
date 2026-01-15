import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { CuentaService } from '../services/cuenta.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';

@Component({
  selector: 'app-ingresar-credenciales',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './ingresar-credenciales.component.html',
  styleUrl: './ingresar-credenciales.component.css'
})
export class IngresarCredencialesComponent implements OnInit{
  loginForm: FormGroup;
  cedula: string = '';
  isProcessing: boolean = false;
  passwordCriteria = {
    length: false,
    uppercase: false,
    number: false,
    specialChar: false
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private cuentaService: CuentaService,
    private snackBar: MatSnackBar,
    private router: Router,
    private comparticionParametrosService: ComparticionParametrosService
  ) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contraseña: ['', [Validators.required, this.passwordValidator.bind(this)]],
      confirmarContraseña: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.cedula = this.comparticionParametrosService.getCedula() || '';

    this.loginForm.get('contraseña')?.valueChanges.subscribe(value => {
      this.passwordCriteria = {
        length: value.length >= 6,
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      };
    });
  }

  passwordValidator(control: any) {
    const value = control.value;
    if (!value) return null;

    const lengthValid = value.length >= 6;
    const uppercaseValid = /[A-Z]/.test(value);
    const numberValid = /[0-9]/.test(value);
    const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (lengthValid && uppercaseValid && numberValid && specialCharValid) {
      return null;
    } else {
      return { passwordInvalid: true };
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('contraseña');
    const confirmPassword = form.get('confirmarContraseña');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null : { 'mismatch': true };
  }

  generateUniqueAccountNumber(callback: (numeroCuenta: string) => void) {
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

  onSubmit() {
    if (this.loginForm.valid) {
      this.isProcessing = true;
      const idUsuario = Math.floor(Math.random() * 1000000000).toString();   // Generar ID aleatorio
      const loginData = {
        idUsuario,
        nombreUsuario: this.loginForm.value.nombreUsuario,
        cedula: this.cedula,
        contraseña: this.loginForm.value.contraseña
      };
      
      this.usuarioService.crearLoginUsuario(loginData).subscribe(
        response => {
          this.snackBar.open('Login de usuario creado con éxito.', 'Cerrar', {
            duration: 3000
          });
          // Crear la cuenta automáticamente después de crear el login
          const accountData = {
            numeroCuenta: this.generateAccountNumber(),
            cedula: this.cedula,
            saldo: 100,
            tipo: 'Ahorro'
          };

          this.cuentaService.crearCuenta(accountData).subscribe(
            accountResponse => {
              this.snackBar.open('Cuenta creada con éxito.', 'Cerrar', {
                duration: 3000
              });
              this.router.navigate(['/']); // Redirigir a la página de inicio o donde desees
            },
            accountError => {
              this.snackBar.open('Error al crear la cuenta', 'Cerrar', {
                duration: 3000
              });
              this.isProcessing = false;
            }
          );
        },
        error => {
          this.snackBar.open('Error al crear el login del usuario', 'Cerrar', {
            duration: 3000
          });
          this.isProcessing = false;
        }
      );
    } else {
      this.snackBar.open('Por favor complete todos los campos correctamente.', 'Cerrar', {
        duration: 3000
      });
    }
  }
  
  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}
