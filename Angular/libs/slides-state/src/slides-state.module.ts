import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { SlidesApiService } from './services/slides.api.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { slidesReducer } from './+state/slides.reducer';
import { slidesInitialState } from './+state/slides.init';
import { SlidesEffects } from './+state/slides.effects';
import { SlidesSnackComponent } from './components/slides-snack/slides-snack.component';

@NgModule({
  imports: [
    HttpClientModule,
    StoreModule.forFeature('slides', slidesReducer),
    EffectsModule.forFeature([ SlidesEffects ])
  ],
  declarations: [ SlidesSnackComponent ],
  entryComponents: [ SlidesSnackComponent ]
})
export class SlidesStateModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SlidesStateModule,
      providers: [ SlidesApiService ]
    };
  }
}
