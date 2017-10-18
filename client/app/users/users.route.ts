import { RouterModule, Routes } from '@angular/router';
// APP COMPONENTS
 import { SettingsComponent } from './components/settings/index';
 import { LoginComponent, RegisterComponent, UsersListComponent, ForgotPasswordComponent } from './index';
 import { AuthGuard } from './services';

const USERSROUTES: Routes = [
  { path: 'login', component: LoginComponent, data : { title : 'Login'} },
  { path: 'register', component: RegisterComponent , canActivateChild: [AuthGuard], data : { title : 'Register'}},
  { path: 'settings/profile', component: SettingsComponent, canActivateChild: [AuthGuard],
  data : {
    roles : ['user', 'admin'],
    title : 'Settings / Profile'
  } },
  { path:'users-list-users', component: UsersListComponent, canActivateChild: [AuthGuard],
  data : {
    roles : ['admin'],
    title : 'Users List'
  }}, {
    path : 'password/forgot', component : ForgotPasswordComponent, data : { title : 'Forgot password'}
}];

export const USERS_ROUTES = RouterModule.forChild(USERSROUTES);
