import { TestBed } from '@angular/core/testing';

import { EmailService } from './email-validation.service';


describe('EmailValidationService', () => {
  let service: EmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
