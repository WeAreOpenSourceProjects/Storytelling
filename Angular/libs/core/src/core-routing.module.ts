import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './containers/layout/layout.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreGuardService } from './services/core.guard.service';
import { AuthenticationGuardService } from '@labdat/authentication';

const coreRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        data: {
          page: 'home'
        }
      },
      {
        path: 'auth',
        loadChildren: '../../authentication/src/routing-authentication.module#RoutingAuthenticationModule',
        data: {
          page: 'authentication'
        }
      },
      {
        path: 'user',
        loadChildren: '../../authentication/src/routing-authentication.module#RoutingAuthenticationModule',
        canActivate: [AuthenticationGuardService],
        data: {
          page: 'authentication'
        }
      },
      {
        path: 'users',
        loadChildren: '../../user/src/routing-user.module#RoutingUserModule'
      },
      // {
      //   path: 'auth/:token',
      //   component: ResetPasswordComponent
      // },
      {
        path: 'presentations',
        // canActivate: [AuthenticationGuardService],
        // canLoad: [AuthenticationGuardService],
        loadChildren: '../../presentations/src/presentations.module#RootPresentationsModule'
      },
      {
        path: 'slides',
        // canActivate: [AuthenticationGuardService],
        // canLoad: [AuthenticationGuardService],
        loadChildren: '../../slides/src/slides.module#RootSlidesModule'
      },
      {
        path: '**',
        component: NotFoundComponent,
        data: {
          title: 'Not-Found'
        }
      }
    ]
  }
];
//  { path: 'forbiden', component: ForbidenComponent, data: { title: 'Forbiden'} },
/*
if (!isEmpty(taskConfiguration.self.roles)) {
  Object.assign(tasksRoutes[0], {
    data: {
      expectedRoles: taskConfiguration.self.roles
    }
  });
}
*/

@NgModule({
  imports: [RouterModule.forChild(coreRoutes)],
  providers: [CoreGuardService]
})
export class CoreRoutingModule { }
