import { TestBed } from '@angular/core/testing';

import { AuthService } from './autenticacion.service';


describe('AutenticacionService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
