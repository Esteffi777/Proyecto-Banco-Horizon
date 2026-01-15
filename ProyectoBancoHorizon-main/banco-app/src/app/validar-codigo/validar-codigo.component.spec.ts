import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarCodigoComponent } from './validar-codigo.component';

describe('ValidarCodigoComponent', () => {
  let component: VerificarCodigoComponent;
  let fixture: ComponentFixture<VerificarCodigoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificarCodigoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificarCodigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
