import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

// MATERIAL DESIGN MODULES
import { MaterialModule } from '@angular/material';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';

// HTTP PROVIDER
import { HttpModule, Http, XHRBackend, RequestOptions } from "@angular/http";

// CORE COMPONENTS
import { ToolbarComponent, SidenavComponent, NotFoundPageComponent, BadRequestPageComponent, ForbidenComponent } from '.';

// CORE SERVICES
import { SessionActions, MenuService, NotifBarService, ToggleNavService, InterceptedHttp } from '.';
import { HelpComponent } from './components/toolbar/help/help.component';

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
    ToolbarComponent,
    SidenavComponent,
    NotFoundPageComponent,
    BadRequestPageComponent,
    HelpComponent,
    ForbidenComponent
  ],
  entryComponents: [
    HelpComponent
  ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    NotifBarService,
    MenuService,
    ToggleNavService,
    { provide: Http,  useFactory: httpFactory, deps: [XHRBackend, RequestOptions, Router, SessionActions]}
  ],
  exports: [
    ToolbarComponent,
    SidenavComponent,
    NotFoundPageComponent,
    BadRequestPageComponent,
    ForbidenComponent
  ]
})

export class CoreModule {}
