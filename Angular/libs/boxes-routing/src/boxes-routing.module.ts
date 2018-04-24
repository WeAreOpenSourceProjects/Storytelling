import { NgModule } from '@angular/core';
import { BoxesGuardService } from './services/boxes.guard.service';



@NgModule()
export class BoxesRoutingModule {
  public static forRoot() {
    return {
      ngModule: BoxesRoutingModule,
      providers: [BoxesGuardService]
    };
  }
}