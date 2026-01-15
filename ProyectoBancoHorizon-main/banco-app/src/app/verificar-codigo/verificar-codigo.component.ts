import { Component, OnInit, ViewChild, QueryList, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';

@Component({
  selector: 'app-verificar-codigo',
  templateUrl: './verificar-codigo.component.html',
  styleUrls: ['./verificar-codigo.component.css'],
  standalone: true,
  imports:[ReactiveFormsModule]
})
export class VerificarCodigoRecuperacionComponent implements OnInit {
  form: FormGroup;
  correo: string = '';
  from: string = '';
  isProcessing: boolean = false;
  
  @ViewChild('code1') code1Input!: ElementRef;
  @ViewChild('code2') code2Input!: ElementRef;
  @ViewChild('code3') code3Input!: ElementRef;
  @ViewChild('code4') code4Input!: ElementRef;
  @ViewChild('code5') code5Input!: ElementRef;
  @ViewChild('code6') code6Input!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private snackBar: MatSnackBar,
    private comparticionParametrosService: ComparticionParametrosService
  ) {
    this.form = this.fb.group({
      code1: ['', [Validators.required, Validators.maxLength(1)]],
      code2: ['', [Validators.required, Validators.maxLength(1)]],
      code3: ['', [Validators.required, Validators.maxLength(1)]],
      code4: ['', [Validators.required, Validators.maxLength(1)]],
      code5: ['', [Validators.required, Validators.maxLength(1)]],
      code6: ['', [Validators.required, Validators.maxLength(1)]],
    });
  }

  ngOnInit(): void {
    this.correo = this.comparticionParametrosService.getCorreo() || '';
    this.from = this.comparticionParametrosService.getFrom() || '';
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
    if (this.form.valid) {
      this.isProcessing = true;
      const verificationCode = this.combineCodeInputs();
      const data = {
        correo: this.correo,
        verificationCode: verificationCode
      };
      this.usuarioService.verificarCodigoRecuperacion(data).subscribe({
        next: (response) => {
          this.snackBar.open('Código verificado correctamente', 'Cerrar', {
            duration: 3000
          });

          if (this.from === 'recuperar-password') {
            this.router.navigate(['/nueva-contraseña']);
          } else if (this.from === 'desbloquear-cuenta') {
            this.usuarioService.desbloquearUsuario(this.correo).subscribe({
              next: (response) => {
                this.snackBar.open('Usuario desbloqueado con éxito', 'Cerrar', {
                  duration: 3000
                });
                this.router.navigate(['']);
              },
              error: (error) => {
                this.snackBar.open('Error al desbloquear el usuario', 'Cerrar', {
                  duration: 3000
                });
                this.isProcessing = false;
              }
            });
          } else if (this.from === 'envio-usuario-recuperacion-usuario') {
            this.router.navigate(['/recuperacion-usuario']);
          }
        },
        error: (error) => {
          this.snackBar.open('Código incorrecto', 'Cerrar', {
            duration: 3000
          });
          this.isProcessing = false;
        }
      });
    }
  }


  combineCodeInputs(): string {
    return [
      this.form.value.code1,
      this.form.value.code2,
      this.form.value.code3,
      this.form.value.code4,
      this.form.value.code5,
      this.form.value.code6
    ].join('');
  }
}