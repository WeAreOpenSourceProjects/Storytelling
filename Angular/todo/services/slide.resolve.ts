import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SlideService } from './slide.service';

@Injectable()
export class SlideResolve implements Resolve<any> {
  constructor(private slideService: SlideService) {}

  resolve(route: ActivatedRouteSnapshot) {
    return this.slideService.getSlide(route.params['idSlides'], route.params['id']);
  }
}
