import { TestBed, inject } from '@angular/core/testing';

import { ChartsService } from './charts.service';

describe('ChartsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartsService]
    });
  });

  it('should ...', inject([ChartsService], (service: ChartsService) => {
    expect(service).toBeTruthy();
  }));
});
