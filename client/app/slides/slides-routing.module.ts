import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// SLIDES COMPONENTS
import { SlidesViewComponent, SlidesEditorFormComponent, SlidesListComponent, SlideEditorComponent } from '.';

import { AuthGuard } from 'app/users';


const slidesRoutes: Routes = [
  {
    path: '',
    component: SlidesListComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['user',  'admin'],
      title: 'slides List'
    },
    pathMatch: 'full'
  }, {
    path: 'createSlides',
    component: SlidesEditorFormComponent,
    data: { roles: ['user',  'admin'], title: 'Slides Creator' }
  }, {
    path: 'display/:id',
    component: SlidesEditorFormComponent,
    data: {
      roles: ['user',  'admin'],
      title: 'Slides Editor'
    }
  }, {
    path: 'slidesPresentation/:id',
    component: SlidesViewComponent,
    data: { title: 'Presentation' }
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(slidesRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SlidesRoutingModule { }
