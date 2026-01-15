import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/autenticacion.service';
import { CommonModule } from '@angular/common';
import { EmailService } from '../services/email-validation.service';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';

@Component({
  selector: 'app-cambio-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './cambio-password.component.html',
  styleUrls: ['./cambio-password.component.css'],
})
export class CambioPasswordComponent implements OnInit {
  form: FormGroup;
  cedula: string | null = null;
  emailUsuario: string = '';
  errorMessage: string = '';
  isProcessing: boolean = false;
  passwordCriteria = {
    length: false,
    uppercase: false,
    number: false,
    specialChar: false
  };

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private emailService: EmailService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private comparticionParametrosService: ComparticionParametrosService
  ) {
    this.form = this.fb.group({
      passwordActual: ['', Validators.required],
      passwordNueva: ['', [Validators.required, this.passwordValidator.bind(this)]],
      passwordConf: ['', Validators.required]
    }, {
      validator: this.passwordMatchValidator
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
    const password = form.get('passwordNueva');
    const confirmPassword = form.get('passwordConf');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null : { 'mismatch': true };
  }

  ngOnInit() {
    this.form.get('passwordNueva')?.valueChanges.subscribe(value => {
      this.passwordCriteria = {
        length: value.length >= 6,
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      };
    });
    this.route.queryParams.subscribe(params => {
      this.cedula = this.comparticionParametrosService.getCedula();
      if (this.cedula) {
        // Obtener email por cédula
        this.usuarioService.obtenerEmailPorCedula(this.cedula).subscribe(
          (response) => {
            this.emailUsuario = response.email;
          },
          (error) => {
            console.error('Error al obtener email:', error);
          }
        );
      }
    });
  }
  
  onSubmit() {
    if (this.form.valid) {
      this.isProcessing = true;
      const { passwordActual } = this.form.value;
      // Verificar la contraseña actual
      const nombreUsuario = this.authService.getUserNombre();
      if (nombreUsuario) {
        this.authService.verificarPassword(nombreUsuario, passwordActual).subscribe(
          response => {
            if (this.form && this.form.get('passwordNueva') && this.form.valid) {
              const formData = {
                nombreUsuario,
                nuevaPassword: this.form.get('passwordNueva')!.value
              };
              this.usuarioService.actualizarPassword(formData).subscribe({
                next: (response) => {
                  this.snackBar.open('Contraseña restablecida con éxito', 'Cerrar', {
                    duration: 3000
                  });
                  // Enviar el correo electrónico de alerta
                  this.emailService.enviarCorreoCambioPassword(this.emailUsuario).subscribe(
                    () => {
                    },
                    (error: any) => {
                      this.isProcessing = false;
                      console.error('Error al enviar el correo electrónico:', error);
                    }
                  );

                  this.router.navigate(['']);
                },
                error: (error: any) => {
                  this.isProcessing = false;
                  this.snackBar.open('Error al cambiar contraseña', 'Cerrar', {
                    duration: 3000
                  });
                  console.error('Error al cambiar contraseña:', error);
                }
              });
            } else {
              console.error('Formulario no válido o control no encontrado.');
            }
          },
          (error: any) => {
            this.isProcessing = false;
            if (error.status === 401) {
              this.snackBar.open('Contraseña Incorrecta', 'Cerrar', {
                duration: 3000
              });
              this.errorMessage = 'Contraseña incorrecta';
            } else if (error.status == 404) {
              this.errorMessage = 'Usuario incorrecto';
            } else {
              this.errorMessage = 'Error en la verificación de la contraseña';
            }
            console.error('Error en la verificación de la contraseña:', error);
          }
        );
      } else {
        this.snackBar.open('Usuario no encontrado', 'Cerrar', {
          duration: 3000
        });
        console.error('Usuario no encontrado.');
      }
    } else {
      this.snackBar.open('Por favor complete todos los campos correctamente.', 'Cerrar', {
        duration: 3000
      });
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
