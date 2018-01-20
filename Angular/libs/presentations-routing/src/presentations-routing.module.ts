import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// SlidesViewComponent
import { PresentationsListComponent } from '@labdat/presentations/src/containers/presentations-list/presentations-list.component';
import { PresentationDetailComponent } from '@labdat/presentations/src/containers/presentation-detail/presentation-detail.component';

import { PresentationsGuardService } from './services/presentations.guard.service';
export { PresentationsGuardService }


const prenstationsRoutes: Routes = [
  {
    path: '',
    component: PresentationsListComponent,
    canActivate: [ PresentationsGuardService ],
    data: {
      roles: ['user', 'admin'],
      title: 'Presentations List'
    },
    pathMatch: 'full'
  },
  {
    path: ':id/edit',
    component: PresentationDetailComponent,
    canActivate: [ PresentationsGuardService ],
    data: {
      roles: ['user', 'admin'],
      title: 'Presentation Detail'
    }
  },
/*
  {
    path: 'createSlides',
    component: SlidesEditorFormComponent,
    data: { roles: ['user', 'admin'], title: 'Slides Creator' }
  },
  {
    path: 'display/:id',
    component: SlidesEditorFormComponent,
    data: {
      roles: ['user', 'admin'],
      title: 'Slides Editor'
    }
  },
  {
    path: 'slidesPresentation/:id',
    component: SlidesViewComponent,
    data: { title: 'Presentation' }
  },
  {
    path: ':idSlides/slide/:id',
    component: SlideEditorComponent,
    data: { title: 'Slide editor' },
   resolve: {
     slide: SlideResolve
   }
  }
  */
];

@NgModule({
  imports: [RouterModule.forChild(prenstationsRoutes)],
  exports: [RouterModule]
})
export class PresentationsRoutingModule {}

@NgModule({})
export class RootPresentationsRoutingModule {
public static forRoot() {
  return {
      ngModule: RootPresentationsRoutingModule,
      providers: [ PresentationsGuardService ]
    }
  };
}
