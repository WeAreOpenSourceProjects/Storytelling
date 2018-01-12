import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// SLIDES COMPONENTS
import {
  SlidesViewComponent,
  SlidesEditorFormComponent,
  SlidesListComponent,
  SlideEditorComponent
} from '@labdat/slides/components';
import { SlideResolve } from '@labdat/slides/src/services/slide.resolve';
//import { AuthGuard } from 'app/users';

const slidesRoutes: Routes = [
  {
    path: '',
    component: SlidesListComponent,
    //    canActivate: [AuthGuard],
    data: {
      roles: ['user', 'admin'],
      title: 'slides List'
    },
    pathMatch: 'full'
  },
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
];

@NgModule({
  imports: [RouterModule.forChild(slidesRoutes)],
  exports: [RouterModule]
})
export class SlidesRoutingModule {}