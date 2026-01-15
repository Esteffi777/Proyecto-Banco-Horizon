import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioUsuarioRecuperacionUsuarioComponent } from './envio-usuario-recuperacion-usuario.component';

describe('EnvioUsuarioRecuperacionUsuarioComponent', () => {
  let component: EnvioUsuarioRecuperacionUsuarioComponent;
  let fixture: ComponentFixture<EnvioUsuarioRecuperacionUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvioUsuarioRecuperacionUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvioUsuarioRecuperacionUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
