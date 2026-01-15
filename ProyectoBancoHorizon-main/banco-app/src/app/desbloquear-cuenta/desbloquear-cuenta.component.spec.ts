import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesbloquearCuentaComponent } from './desbloquear-cuenta.component';

describe('DesbloquearCuentaComponent', () => {
  let component: DesbloquearCuentaComponent;
  let fixture: ComponentFixture<DesbloquearCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesbloquearCuentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesbloquearCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
