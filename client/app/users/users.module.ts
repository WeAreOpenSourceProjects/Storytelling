import { NgModule,CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';

// MATERIAL DESIGN MODULES
import { MaterialModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// LOGIN COMPONENTS
import { LoginComponent, RegisterComponent, SettingsComponent, ProfileComponent,
   PasswordComponent, ForgotPasswordComponent, UsersListComponent, EqualValidator, ResetPasswordComponent} from './index';

// LOGIN ROUTES
import { UsersRoutingModule } from './users-routing.module';

import { AuthGuard } from './services';

// LOGIN SERVICES
import { UsersConfig, UsersService } from './index';


export function usersFactory(config: UsersConfig) {
  return () => config.addMenu() ;
}

@NgModule({
  imports: [
    UsersRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    SettingsComponent,
    ProfileComponent,
    PasswordComponent,
    EqualValidator,
    UsersListComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [ UsersConfig, UsersService,
    { provide: APP_INITIALIZER, useFactory: usersFactory, deps: [UsersConfig], multi: true }
  ]
})
export class UsersModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: UsersModule,
      providers: [AuthGuard]
    }
  }

}
