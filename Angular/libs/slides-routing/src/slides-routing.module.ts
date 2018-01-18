import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SlidesListComponent } from '@labdat/slides/src/containers/slides-list/slides-list.component';
import { SlideDetailComponent } from '@labdat/slides/src/containers/slide-detail/slide-detail.component';

const slidesRoutes: Routes = [
  {
    path: '',
    component: SlidesListComponent,
    // canActivate: [ SlidesGuardService ],
    data: {
      roles: ['user', 'admin'],
      title: 'Slides List'
    },
    pathMatch: 'full'
  },
  {
    path: ':id',
    component: SlideDetailComponent,
    // canActivate: [ SlidesGuardService ],
    data: {
      roles: ['user', 'admin'],
      title: 'Slide Detail'
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
  imports: [RouterModule.forChild(slidesRoutes)],
  exports: [RouterModule]
})
export class SlidesRoutingModule {}

@NgModule({})
export class RootSlidesRoutingModule {
public static forRoot() {
  return {
      ngModule: RootSlidesRoutingModule
    }
  };
}
