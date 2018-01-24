import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PresentationsListComponent } from '@labdat/presentations/src/containers/presentations-list/presentations-list.component';
import { PresentationEditComponent } from '@labdat/presentations/src/containers/presentation-edit/presentation-edit.component';
import { PresentationsViewComponent } from '@labdat/presentations/src/containers/presentations-view/presentations-view.component';
import { PresentationsGuardService } from './services/presentations.guard.service';
export { PresentationsGuardService }
import { PresentationGuardService } from './services/presentation.guard.service';
import { SlidesGuardService } from '@labdat/slides-routing/src/services/slides.guard.service';
import { HttpClientModule } from '@angular/common/http';
export { PresentationGuardService }

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
    component: PresentationEditComponent,
    canActivate: [ PresentationGuardService, SlidesGuardService ],
    data: {
      roles: ['user', 'admin'],
      title: 'Presentation Detail'
    }
  },
  {
    path: ':id/view',
    component: PresentationsViewComponent,
    canActivate: [ PresentationGuardService, SlidesGuardService ],
    data: {
      roles: ['user', 'admin'],
      title: 'Presentation'
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
export class PresentationsRoutingModule {
  public static forRoot(): ModuleWithProviders {
    return {
        ngModule: RootPresentationsRoutingModule,
        providers: [
          PresentationsGuardService,
          PresentationGuardService
        ]
      }
    };
}

@NgModule({
  imports: [ HttpClientModule ],
})
export class RootPresentationsRoutingModule {

}
