import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprobanteTransaccionComponent } from './comprobante-transaccion.component';

describe('ComprobanteTransaccionComponent', () => {
  let component: ComprobanteTransaccionComponent;
  let fixture: ComponentFixture<ComprobanteTransaccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprobanteTransaccionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprobanteTransaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
