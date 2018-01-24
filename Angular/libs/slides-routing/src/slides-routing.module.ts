import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoxesGridComponent } from '@labdat/boxes/src/containers/boxes-grid/boxes-grid.component';
import { BoxesModule } from '@labdat/boxes/src/boxes.module';
import { SlidesGuardService } from '@labdat/slides-routing/src/services/slides.guard.service';

const slidesRoutes: Routes = [{
  path: ':id',
  component: BoxesGridComponent,
  // canActivate: [ SlidesGuardService ],
  data: {
    roles: ['user', 'admin'],
    title: 'Slide Detail'
  }
}
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
  imports: [RouterModule.forChild(slidesRoutes), BoxesModule],
  exports: [RouterModule]
})
export class SlidesRoutingModule {
  public static forRoot() {
    return {
      ngModule: RootSlidesRoutingModule,
      providers: [ SlidesGuardService ]
    }
  }
}

@NgModule()
export class RootSlidesRoutingModule { }
