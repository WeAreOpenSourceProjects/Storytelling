import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

// MATERIAL DESIGN MODULES
import { MaterialModule } from '@angular/material';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';

// HTTP PROVIDER
import { HttpModule, Http, XHRBackend, RequestOptions } from "@angular/http";

// CORE COMPONENTS
import { AppToolbarComponent, AppSidenavComponent, NotFoundPageComponent, BadRequestPageComponent } from '.';

// CORE SERVICES
import { SessionActions, MenuService, ToggleNavService, InterceptedHttp } from '.';

export function httpFactory(xhrBackend: XHRBackend, requestOptions: RequestOptions,  router: Router, actions: SessionActions): Http {
    return new InterceptedHttp(xhrBackend, requestOptions, router, actions);
 }



@NgModule({
  imports: [
    RouterModule,
    AngularFontAwesomeModule,
    HttpModule,
    MaterialModule,
    CommonModule
  ],
  declarations: [
    AppToolbarComponent,
    AppSidenavComponent,
    NotFoundPageComponent,
    BadRequestPageComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    MenuService,
    ToggleNavService,
    { provide: Http,  useFactory: httpFactory, deps: [XHRBackend, RequestOptions, Router, SessionActions]}
  ], 
  exports: [ 
    AppToolbarComponent,
    AppSidenavComponent,
    NotFoundPageComponent,
    BadRequestPageComponent
  ]
})

export class CoreModule {}