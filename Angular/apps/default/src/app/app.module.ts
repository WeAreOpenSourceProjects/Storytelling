import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { NxModule } from '@nrwl/nx';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material';
import { SharedModule } from '@labdat/shared';
import {
  AuthenticationRoutingModule,
  AuthenticationStateModule
} from '@labdat/authentication';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { coreConfiguration, CoreStateModule, CoreViewModule } from '@labdat/core';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { metaReducers } from './+state/app.reducer';
import { presentationsConfiguration, PresentationsModule } from '@labdat/presentations';
import { environment } from '../environments/environment';
import { RouterStateModule } from '@labdat/common/router-state';
import { SlidesStateModule } from '@labdat/slides-state';
import { PresentationsStateModule } from '@labdat/presentations-state';
import { BoxesStateModule } from '@labdat/boxes-state';
import { PresentationsRoutingModule } from '@labdat/presentations-routing';
import { SlidesRoutingModule } from '@labdat/slides-routing';
import { BoxesRoutingModule } from '@labdat/boxes-routing';
import { UserDetailDialogComponent, UserRoutingModule, UserStateModule } from '@labdat/user';

@NgModule({
  imports: [
    NxModule.forRoot(),
    RouterModule.forRoot([], { initialNavigation: 'enabled' }),
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    StoreModule.forRoot({}, { metaReducers }),
    EffectsModule.forRoot([]),
    RouterModule,
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    SharedModule.forRoot(),
    AuthenticationRoutingModule.forRoot(),
    CoreViewModule,
    RouterStateModule.forRoot(),
    AuthenticationStateModule.forRoot(),
    CoreStateModule.forRoot([coreConfiguration.self, ...presentationsConfiguration.core]),
    PresentationsStateModule.forRoot(),
    SlidesStateModule.forRoot(),
    BoxesStateModule.forRoot(),
    PresentationsRoutingModule.forRoot(),
    SlidesRoutingModule.forRoot(),
    BoxesRoutingModule.forRoot(),
    UserStateModule.forRoot(),
    UserRoutingModule.forRoot()

  ],
  declarations: [AppComponent],
  // entryComponents: [UserDetailDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
