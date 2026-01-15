// login.component.ts

import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/autenticacion.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RecaptchaModule, RecaptchaComponent } from 'ng-recaptcha';
import moment from 'moment';
import 'moment-timezone';
import { EmailService } from '../services/email-validation.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RecaptchaModule]
})
export class LoginComponent {
  @ViewChild('captchaRef') captchaRef!: RecaptchaComponent; 
  loginForm: FormGroup;
  errorMessage: string = '';
  isProcessing: boolean = false;
  reCaptchaSiteKey = '6LfWtSYqAAAAAHN_eH9rwHZvcDxn60Jn7bQrWV7a'; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private emailService: EmailService,
    private usuarioService: UsuarioService
  ) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contraseña: ['', Validators.required],
      recaptcha: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isProcessing = true;
      const { nombreUsuario, contraseña, recaptcha } = this.loginForm.value;

      // Obtener IP del cliente
      this.usuarioService.obtenerIP().subscribe(ipResponse => {
        const ipUsuario = ipResponse.ip; // IP del cliente

        // Obtener ubicación del cliente
        this.obtenerUbicacion().then(ubicacion => {
          const fechaEcuador = moment().tz('America/Guayaquil').format();

          this.authService.login(nombreUsuario, contraseña, recaptcha).subscribe(
            response => {
              this.usuarioService.obtenerCorreoPorNombreUsuario(nombreUsuario).subscribe(
                correoResponse => {
                  this.emailService.enviarNotificacionIngreso(correoResponse.correo, fechaEcuador, ipUsuario, ubicacion).subscribe(
                    emailResponse => {
                      console.log('Correo de notificación enviado:', emailResponse);
                    },
                    emailError => {
                      console.error('Error al enviar el correo de notificación:', emailError);
                    }
                  );
                },
                correoError => {
                  console.error('Error al obtener el correo por nombre de usuario:', correoError);
                }
              );

              this.router.navigate(['/visualizacion-saldo']);
            },
            error => {
              this.handleLoginError(error);
            }
          );
        }).catch(error => {
          console.error('Error al obtener la ubicación:', error);
          this.isProcessing = false;
        });
      });
    } else {
      this.errorMessage = 'Por favor complete todos los campos correctamente.';
    }
  }

  private obtenerUbicacion(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            resolve(`Latitud: ${position.coords.latitude}, Longitud: ${position.coords.longitude}`);
          },
          error => {
            reject('No se pudo obtener la ubicación');
          }
        );
      } else {
        reject('La geolocalización no está soportada en este navegador');
      }
    });
  }

  private handleLoginError(error: any) {
    if (error.status === 401) {
      this.errorMessage = 'Contraseña incorrecta. Intenta nuevamente.';
    } else if (error.status === 404) {
      this.errorMessage = 'Usuario no encontrado';
    } else if (error.status === 403) {
      this.errorMessage = 'Cuenta bloqueada. Intenta de nuevo más tarde.';
    } else {
      this.errorMessage = 'Error en el inicio de sesión';
    }
    console.error('Error en el login:', error);
    this.resetCaptcha();
    this.loginForm.reset();
    this.isProcessing = false;
  }

  resolved(captchaResponse: string | null) {
    if (captchaResponse) {
      this.loginForm.patchValue({ recaptcha: captchaResponse });
    } else {
      this.loginForm.patchValue({ recaptcha: '' });
    }
  }

  resetCaptcha() {
    this.captchaRef.reset(); 
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}
