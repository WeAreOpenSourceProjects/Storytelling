import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BoxesApiService } from './services/boxes.api.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { boxesReducer } from './+state/boxes.reducer';
import { boxesInitialState } from './+state/boxes.init';
import { BoxesEffects } from './+state/boxes.effects';

@NgModule({
  imports: [HttpClientModule, StoreModule.forFeature('boxes', boxesReducer), EffectsModule.forFeature([BoxesEffects])]
})
export class BoxesStateModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: BoxesStateModule,
      providers: [BoxesApiService]
    };
  }
}
