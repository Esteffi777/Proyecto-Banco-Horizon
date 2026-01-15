import { TestBed } from '@angular/core/testing';

import { ComparticionParametrosService } from './comparticion-parametros.service';

describe('ComparticionParametrosService', () => {
  let service: ComparticionParametrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComparticionParametrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
