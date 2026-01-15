import { Component, OnInit } from '@angular/core';  // Asegúrate de importar OnInit
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../services/usuario.service';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';
import { EmailService } from '../services/email-validation.service';
import moment from 'moment';
import 'moment-timezone';

@Component({
  selector: 'app-ingresar-correo-recuperacion-usuario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './ingresar-correo-recuperacion-usuario.component.html',
  styleUrls: ['./ingresar-correo-recuperacion-usuario.component.css']
})
export class IngresarCorreoRecuperacionUsuarioComponent implements OnInit {
  correo: string = '';  // Cambiado a string sin null
  form: FormGroup;
  isProcessing = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    private emailService: EmailService,
    private comparticionParametrosService: ComparticionParametrosService,
    private router: Router
  ) {
    this.form = this.fb.group({
      nuevoNombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      confirmarNombreUsuario: ['', [Validators.required]]
    }, { validators: this.mustMatch('nuevoNombreUsuario', 'confirmarNombreUsuario') });
  }

  ngOnInit(): void {
    const correo = this.comparticionParametrosService.getCorreo();
    if (!correo) {
      this.snackBar.open('No se proporcionó un correo válido.', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/']);
    } else {
      this.correo = correo;
    }
  }

  onSubmit() {
    const fecha = moment().tz('America/Guayaquil').format();
    if (this.form.valid && this.correo) {
      this.isProcessing = true;
      const nuevoNombreUsuario = this.form.value.nuevoNombreUsuario;

      this.usuarioService.cambiarNombreUsuarioPorCorreo(this.correo, nuevoNombreUsuario).subscribe({
        next: () => {
          this.emailService.sendRecuperacionUsuarioNotification(this.correo, fecha, nuevoNombreUsuario).subscribe(
            (response) => {
              console.log('Notificación de Cambio de Usuario con éxito', response);
              this.snackBar.open('Nombre de usuario actualizado con éxito', 'Cerrar', {
                duration: 3000
              });
              this.isProcessing = false;
              this.router.navigate(['']);
            },
            (error) => {
              this.isProcessing = false;
              console.error('Error al enviar la notificación de transferencia', error);
              this.snackBar.open('Error al enviar la notificación de transferencia', 'Cerrar', {
                duration: 3000, // Duración de la notificación
              });
            }
          );
        },
        error: () => {
          this.snackBar.open('Error al actualizar el nombre de usuario', 'Cerrar', {
            duration: 3000
          });
          this.isProcessing = false;
        }
      });
    } else {
      this.snackBar.open('Por favor, complete todos los campos requeridos correctamente.', 'Cerrar', {
        duration: 3000
      });
    }
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
