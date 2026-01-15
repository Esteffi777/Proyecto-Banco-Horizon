import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EmailService } from '../services/email-validation.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verificar-codigo',
  templateUrl: './validar-codigo.component.html',
  styleUrls: ['./validar-codigo.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class VerificarCodigoComponent implements OnInit {
  verifyForm: FormGroup;
  correo: string = '';
  cedula: string = '';
  isProcessing: boolean = false;

  @ViewChild('code1') code1Input!: ElementRef;
  @ViewChild('code2') code2Input!: ElementRef;
  @ViewChild('code3') code3Input!: ElementRef;
  @ViewChild('code4') code4Input!: ElementRef;
  @ViewChild('code5') code5Input!: ElementRef;
  @ViewChild('code6') code6Input!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private snackBar: MatSnackBar,
    private router: Router,
    private comparticionParametrosService: ComparticionParametrosService
  ) {
    this.verifyForm = this.fb.group({
      code1: ['', [Validators.required, Validators.maxLength(1), this.singleCharValidator]],
      code2: ['', [Validators.required, Validators.maxLength(1), this.singleCharValidator]],
      code3: ['', [Validators.required, Validators.maxLength(1), this.singleCharValidator]],
      code4: ['', [Validators.required, Validators.maxLength(1), this.singleCharValidator]],
      code5: ['', [Validators.required, Validators.maxLength(1), this.singleCharValidator]],
      code6: ['', [Validators.required, Validators.maxLength(1), this.singleCharValidator]]
    });
  }

  ngOnInit(): void {
    this.correo = this.comparticionParametrosService.getCorreo() || '';
    this.cedula = this.comparticionParametrosService.getCedula() || '';
  }

  singleCharValidator(control: FormControl) {
    const value = control.value ? control.value.trim() : '';
    return value.length === 1 ? null : { invalidChar: true };
  }

  autoFocusNext(event: Event, nextInputId: string) {
    const input = event.target as HTMLInputElement;
    if (input.value.length === 1) {
      switch (nextInputId) {
        case 'code2':
          this.code2Input.nativeElement.focus();
          break;
        case 'code3':
          this.code3Input.nativeElement.focus();
          break;
        case 'code4':
          this.code4Input.nativeElement.focus();
          break;
        case 'code5':
          this.code5Input.nativeElement.focus();
          break;
        case 'code6':
          this.code6Input.nativeElement.focus();
          break;
        default:
          break;
      }
    }
  }

  onSubmit() {
    if (this.verifyForm.valid) {
      this.isProcessing = true;
      const verificationCode = this.verifyForm.value.code1 +
                               this.verifyForm.value.code2 +
                               this.verifyForm.value.code3 +
                               this.verifyForm.value.code4 +
                               this.verifyForm.value.code5 +
                               this.verifyForm.value.code6;
      this.emailService.verifyCode(this.correo, verificationCode).subscribe(
        () => {
          this.snackBar.open('Código verificado con éxito', 'Cerrar', {
            duration: 3000
          });
          this.comparticionParametrosService.setCedula(this.cedula);
          this.router.navigate(['/ingresar-credenciales']);
          this.comparticionParametrosService.clearFormData(); 
        },
        error => {
          this.snackBar.open('Código de verificación incorrecto', 'Cerrar', {
            duration: 3000
          });
          this.isProcessing = false;
        }
      );
    } else {
      this.snackBar.open('Por favor, ingrese el código de verificación', 'Cerrar', {
        duration: 3000
      });
    }
  }
}
