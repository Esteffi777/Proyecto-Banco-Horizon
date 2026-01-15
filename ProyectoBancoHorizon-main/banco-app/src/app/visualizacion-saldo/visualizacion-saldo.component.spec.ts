import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizacionSaldoComponent } from './visualizacion-saldo.component';

describe('VisualizacionSaldoComponent', () => {
  let component: VisualizacionSaldoComponent;
  let fixture: ComponentFixture<VisualizacionSaldoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizacionSaldoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizacionSaldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
