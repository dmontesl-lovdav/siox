/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DomicilioService } from './domicilio.service';

describe('Service: Domicilio', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DomicilioService]
    });
  });

  it('should ...', inject([DomicilioService], (service: DomicilioService) => {
    expect(service).toBeTruthy();
  }));
});
