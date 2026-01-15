import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from '../services/usuario.service';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';

@Component({
  selector: 'app-envio-usuario-recuperacion-usuario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './envio-usuario-recuperacion-usuario.component.html',
  styleUrls: ['./envio-usuario-recuperacion-usuario.component.css']
})
export class EnvioUsuarioRecuperacionUsuarioComponent {
  form: FormGroup;
  isProcessing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private snackBar: MatSnackBar,
    private comparticionParametrosService: ComparticionParametrosService
  ) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.isProcessing = true;
      const correo = this.form.value.correo;
      this.usuarioService.enviarCodigoRecuperacion({ correo }).subscribe({
        next: (response) => {
          this.snackBar.open('Código de recuperación enviado al correo', 'Cerrar', {
            duration: 3000
          });
          this.comparticionParametrosService.setCorreo(correo); // Almacena el correo
          this.comparticionParametrosService.setFrom('envio-usuario-recuperacion-usuario'); // Mantiene el flujo
          this.router.navigate(['/verificar-codigo-recuperacion']);
        },
        error: (error) => {
          this.isProcessing = false;
          this.snackBar.open('Error al enviar el correo de recuperación', 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }

  redirectTo(route: string) {
    this.router.navigate([route]);
  }
}
