import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { PresentationsApiService } from './services/presentations.api.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { presentationsReducer } from './+state/presentations.reducer';
import { presentationsInitialState } from './+state/presentations.init';
import { PresentationsEffects } from './+state/presentations.effects';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PresentationsSnackComponent } from './components/presentations-snack/presentations-snack.component';

@NgModule({
  declarations: [ PresentationsSnackComponent ],
  imports: [
    HttpClientModule,
    MatSnackBarModule,
    StoreModule.forFeature('presentations', presentationsReducer),
    EffectsModule.forFeature([ PresentationsEffects ])
  ],
  entryComponents: [ PresentationsSnackComponent ]
})
export class PresentationsStateModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: PresentationsStateModule,
      providers: [ PresentationsApiService ]
    };
  }
}
