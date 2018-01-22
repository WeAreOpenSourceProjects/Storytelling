import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SlidesApiService } from '@labdat/slides-state';

@Injectable()
export class BoxesResolve implements Resolve<any> {
  constructor(private slidesApiService: SlidesApiService) {}

  resolve(route: ActivatedRouteSnapshot) {
    console.log('boxes resolve');
    return this.slidesApiService.getAllBoxes(route.params['id']);
  }
}
