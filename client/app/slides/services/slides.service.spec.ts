import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { SlidesService } from './slides.service';

describe('SlidesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SlidesService],
      imports: [HttpModule]
    });
  });

  it('should ...', inject([SlidesService], (service: SlidesService) => {
    expect(service).toBeTruthy();
  }));
});
