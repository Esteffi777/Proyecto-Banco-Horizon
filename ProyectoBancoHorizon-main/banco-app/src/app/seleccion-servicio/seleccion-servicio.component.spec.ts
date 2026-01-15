import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionServicioComponent } from './seleccion-servicio.component';

describe('SeleccionServicioComponent', () => {
  let component: SeleccionServicioComponent;
  let fixture: ComponentFixture<SeleccionServicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionServicioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
