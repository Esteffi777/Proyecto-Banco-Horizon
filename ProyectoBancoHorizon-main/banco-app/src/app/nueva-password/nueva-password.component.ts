import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';

@Component({
  selector: 'app-nueva-password',
  templateUrl: './nueva-password.component.html',
  styleUrls: ['./nueva-password.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class NuevaPasswordComponent implements OnInit {
  form: FormGroup;
  correo: string = '';
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
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private comparticionParametrosService: ComparticionParametrosService
  ) {
    this.form = this.fb.group({
      password: ['', [Validators.required, this.passwordValidator.bind(this)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.mustMatch('password', 'confirmPassword')});
  }

  passwordValidator(control: AbstractControl) {
    const value = control.value;
    if (!value) {
      this.passwordCriteria = {
        length: false,
        uppercase: false,
        number: false,
        specialChar: false
      };
      return null;
    }

    const lengthValid = value.length >= 6;
    const uppercaseValid = /[A-Z]/.test(value);
    const numberValid = /[0-9]/.test(value);
    const specialCharValid = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    this.passwordCriteria = {
      length: lengthValid,
      uppercase: uppercaseValid,
      number: numberValid,
      specialChar: specialCharValid
    };

    if (lengthValid && uppercaseValid && numberValid && specialCharValid) {
      return null;
    } else {
      return { passwordInvalid: true };
    }
  }

  ngOnInit(): void {
    this.correo = this.comparticionParametrosService.getCorreo() || '';
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

  onSubmit() {
    if (this.form.valid) {
      const formData = {
        correo: this.correo,
        nuevaPassword: this.form.get('password')!.value
      };

      this.isProcessing = true;

      this.usuarioService.cambiarPassword(formData).subscribe({
        next: (response) => {
          this.snackBar.open('Contraseña restablecida con éxito', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isProcessing = false;
          this.snackBar.open('Error al cambiar contraseña', 'Cerrar', {
            duration: 3000
          });
          this.isProcessing = false;
        }
      });
    } else {
      console.error('Formulario no válido o control no encontrado.');
    }
  }  

  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}