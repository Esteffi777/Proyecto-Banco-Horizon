import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarCodigoRecuperacionComponent } from './verificar-codigo.component';


describe('VerificarCodigoComponent', () => {
  let component: VerificarCodigoRecuperacionComponent;
  let fixture: ComponentFixture<VerificarCodigoRecuperacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificarCodigoRecuperacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerificarCodigoRecuperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
