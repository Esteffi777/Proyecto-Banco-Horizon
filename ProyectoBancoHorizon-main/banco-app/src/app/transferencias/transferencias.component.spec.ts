import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransferenciasComponent } from './transferencias.component';
import { UsuarioService } from '../services/usuario.service';
import { TransferenciaService } from '../services/transferencia.service';
import { EmailService } from '../services/email-validation.service';
import { ComparticionParametrosService } from '../services/comparticion-parametros.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('TransferenciasComponent', () => {
  let component: TransferenciasComponent;
  let fixture: ComponentFixture<TransferenciasComponent>;
  let usuarioServiceSpy: jasmine.SpyObj<UsuarioService>;
  let transferenciaServiceSpy: jasmine.SpyObj<TransferenciaService>;
  let emailServiceSpy: jasmine.SpyObj<EmailService>;
  let comparticionParametrosServiceSpy: jasmine.SpyObj<ComparticionParametrosService>;

  beforeEach(async () => {
    // Crear los spies para los servicios
    usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', [
      'getCuentasByCedula',
      'obtenerEmailPorCedula',
      'getClienteByNumeroCuenta',
      'realizarTransferencia'
    ]);
    transferenciaServiceSpy = jasmine.createSpyObj('TransferenciaService', ['realizarTransferencia']);
    emailServiceSpy = jasmine.createSpyObj('EmailService', ['sendVerificationEmail', 'verifyCode', 'sendTransferNotification']);
    comparticionParametrosServiceSpy = jasmine.createSpyObj('ComparticionParametrosService', ['getCedula', 'setTransferenciaData']);

    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, HttpClientTestingModule, TransferenciasComponent],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: TransferenciaService, useValue: transferenciaServiceSpy },
        { provide: EmailService, useValue: emailServiceSpy },
        { provide: ComparticionParametrosService, useValue: comparticionParametrosServiceSpy },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferenciasComponent);
    component = fixture.componentInstance;

    // Configurar los valores de retorno de los espías antes de ejecutar ngOnInit
    const cuentasMock = [{ numeroCuenta: '12345', saldo: 1000 }];
    usuarioServiceSpy.getCuentasByCedula.and.returnValue(of({ cuentas: cuentasMock }));
    usuarioServiceSpy.obtenerEmailPorCedula.and.returnValue(of({ email: 'test@example.com' }));
  });

  it('Actualizar el saldo de la cuenta cuando se produce un cambio de cuenta.', () => {
    component.cuentas = [{ numeroCuenta: '12345', saldo: 1000 }];
    component.cuentaOrigen = '12345';

    component.onCuentaOrigenChange();

    expect(component.saldoCuentaOrigen).toBe(1000);
  });

  it('Buscar titular de la cuenta destino por número de cuenta', () => {
    const titularMock = { nombreCliente: 'John', apellidosCliente: 'Doe' };
    usuarioServiceSpy.getClienteByNumeroCuenta.and.returnValue(of(titularMock));

    component.cuentaDestino = '54321';
    component.buscarTitularCuentaDestino();

    expect(usuarioServiceSpy.getClienteByNumeroCuenta).toHaveBeenCalledWith('54321');
    expect(component.nombreTitular).toBe('John');
    expect(component.apellidoTitular).toBe('Doe');
  });

  it('Mostrar error si no se encuentra el titular de la cuenta destino', () => {
    usuarioServiceSpy.getClienteByNumeroCuenta.and.returnValue(of(null));
    const snackBarSpy = spyOn(component['snackBar'], 'open');

    component.cuentaDestino = '54321';
    component.buscarTitularCuentaDestino();

    expect(component.nombreTitular).toBe('Cuenta no encontrada');
    expect(snackBarSpy).toHaveBeenCalledWith('La cuenta destino no existe', 'Cerrar', { duration: 3000 });
  });

  it('No proceder si el monto de la transferencia excede el saldo disponible', () => {
    component.cuentas = [{ numeroCuenta: '12345', saldo: 1000 }];
    component.cuentaOrigen = '12345';
    component.monto = 2000;
    const snackBarSpy = spyOn(component['snackBar'], 'open');

    component.realizarTransferencia();

    expect(snackBarSpy).toHaveBeenCalledWith('Monto excede el saldo disponible', 'Cerrar', { duration: 3000 });
    expect(component.isProcessing).toBeFalse();
  });
});
