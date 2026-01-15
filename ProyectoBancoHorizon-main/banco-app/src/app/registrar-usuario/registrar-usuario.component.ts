import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UsuarioService } from '../services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import moment from 'moment';
import { Router } from '@angular/router';
import { EmailService } from '../services/email-validation.service';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class RegistrarUsuarioComponent {
  registroForm: FormGroup;
  isProcessing: boolean = false;

  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService, 
    private snackBar: MatSnackBar, 
    private router: Router, 
    private emailService: EmailService,
    private comparticionParametrosService: ComparticionParametrosService
  ){
    this.registroForm = this.fb.group({
      cedula: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      nombres: ['', [Validators.required, this.multipleWordsValidator]],
      apellidos: ['', [Validators.required, this.multipleWordsValidator]],
      correo: ['', [Validators.required, Validators.email]],
      celular: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      fechaNacimiento: ['', [Validators.required, this.validateAge]],
      provincia: ['', Validators.required],
      ciudad: ['', Validators.required],
      callePrincipal: ['', Validators.required],
      calleSecundaria: ['', Validators.required]
    });

    const savedData = this.comparticionParametrosService.getFormData();
    if (savedData) {
      this.registroForm.patchValue(savedData);
    }

  }

  multipleWordsValidator(control: FormControl) {
    const value = control.value ? control.value.trim() : '';
    const hasMultipleWords = value.split(' ').length > 1;
    return hasMultipleWords ? null : { singleWord: true };
  }
  
  validateAge(control: FormControl) {
    const today = moment().startOf('day'); // La fecha de hoy a las 00:00
    const inputDate = moment(control.value).startOf('day'); // La fecha de nacimiento a las 00:00
    let age = today.diff(inputDate, 'years'); // Diferencia en años
    return age >= 18 ? null : { ageInvalid: true };
  }

  onSubmit() {
    if (this.registroForm.valid) {
      this.isProcessing = true;
      const formData = this.registroForm.value;
      const correo = formData.correo;
      const cedula = formData.cedula;

      this.usuarioService.verificarCorreo(correo).subscribe(
        response => {
          this.usuarioService.registrarUsuario(formData).subscribe(
            response => {
              this.emailService.sendVerificationEmail(correo).subscribe(
                () => {
                  this.snackBar.open('Usuario registrado con éxito. Verifique su correo.', 'Cerrar', {
                    duration: 3000
                  });
                  // Guardar los datos en el servicio
                  this.comparticionParametrosService.setCorreo(correo);
                  this.comparticionParametrosService.setCedula(cedula);
                  this.router.navigate(['/verificar-codigo']);
                  this.comparticionParametrosService.clearFormData();  // Limpiar los datos guardados
                  this.isProcessing = false;
                },
                error => {
                  this.showError('Error al enviar el correo de verificación');
                }
              );
              this.registroForm.reset();
            },
            error => {
              this.showError(error);
            }
          );
        },
        error => {
          this.showError('El correo ya está registrado.');
        }
      );
    } else {
      this.showFormErrors();
    }
  }

  showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000
    });
    this.isProcessing = false;
  }

  showFormErrors() {
    this.registroForm.markAllAsTouched(); // Marcar todos los campos como tocados para mostrar errores
    let mensaje = 'Por favor complete todos los campos correctamente:';
    Object.keys(this.registroForm.controls).forEach(key => {
      const control = this.registroForm.get(key);
      if (control && control.invalid) {
        mensaje += `\n- ${key.charAt(0).toUpperCase() + key.slice(1)}`;
      }
    });
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000
    });
    this.isProcessing = false;
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}