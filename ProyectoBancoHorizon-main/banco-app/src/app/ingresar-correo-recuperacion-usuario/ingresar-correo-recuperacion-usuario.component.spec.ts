import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarCorreoRecuperacionUsuarioComponent } from './ingresar-correo-recuperacion-usuario.component';

describe('IngresarCorreoRecuperacionUsuarioComponent', () => {
  let component: IngresarCorreoRecuperacionUsuarioComponent;
  let fixture: ComponentFixture<IngresarCorreoRecuperacionUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresarCorreoRecuperacionUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngresarCorreoRecuperacionUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
