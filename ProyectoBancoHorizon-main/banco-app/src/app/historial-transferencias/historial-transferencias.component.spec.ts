import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialTransferenciasComponent } from './historial-transferencias.component';

describe('HistorialTransferenciasComponent', () => {
  let component: HistorialTransferenciasComponent;
  let fixture: ComponentFixture<HistorialTransferenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialTransferenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialTransferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
