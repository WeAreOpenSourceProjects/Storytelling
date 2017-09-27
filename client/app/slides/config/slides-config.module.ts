import { NgModule, APP_INITIALIZER, ModuleWithProviders, Injectable } from '@angular/core';
import { MenuService } from 'app/core';

@Injectable()
export class SlidesConfig {
  constructor(private menuService: MenuService) {
  }
  addMenu() {
    this.menuService.addMenuItem('sideNav', {
      state: 'slides',
      title: 'slides',
      icon: 'fa-desktop',
      roles: ['user', 'admin'],
    });
  }
}

export function slidesFactory(config: SlidesConfig) {
  return () => config.addMenu() ;
}
@NgModule({
  providers: [ SlidesConfig ]
})

export class SlidesConfigModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SlidesConfigModule,
      providers: [{ provide: APP_INITIALIZER, useFactory: slidesFactory, deps: [SlidesConfig], multi: true }]
    }
  }
}
