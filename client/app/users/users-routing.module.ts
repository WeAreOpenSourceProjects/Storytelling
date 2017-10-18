import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// USERS COMPONENTS
import { LoginComponent, RegisterComponent, SettingsComponent, UsersListComponent, ForgotPasswordComponent, PasswordComponent, ResetPasswordComponent } from '.';

// AUTH SERVICE
import { AuthGuard } from './services';

const USERS_ROUTES: Routes = [
    { path: 'login', component: LoginComponent, data: { title: 'Login' } },
    { path: 'register', component: RegisterComponent, canActivate: [AuthGuard], data: { title: 'Register' } },
    {
        path: 'settings/profile', component: SettingsComponent, canActivate: [AuthGuard], data: {
        roles: ['user', 'admin'],
        title: 'Settings / Profile'
    }
    },
    {
        path: 'list-users', component: UsersListComponent, canActivate: [AuthGuard],
        data: {
            roles: ['admin'],
            title: 'Users List'
        }
    }, {
        path : 'password/forgot', component : ForgotPasswordComponent, data : { title : 'Password / Forgot'}, canActivate: [AuthGuard]
    },
    { path : 'password/reset/:token', component: ResetPasswordComponent,  data : { title : 'Password / Reset'}}
];

@NgModule({
    imports: [
        RouterModule.forChild(USERS_ROUTES)
    ],
    exports: [
        RouterModule
    ]
})
export class UsersRoutingModule { }
