import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// SLIDES COMPONENTS
import { SlidesViewComponent, SlidesEditorFormComponent, SlidesListComponent} from '.';

import { Auth } from 'app/users';


const slidesRoutes: Routes = [
  {
    path: '',
    component: SlidesListComponent,
    canActivate: [Auth],
    data: {
      roles: ['*'],
      title: 'slides Manager'
    },
    pathMatch: 'full'
  }, {
    path: 'createSlides',
    component: SlidesEditorFormComponent,
    data: { title: 'Slides Creator' }
  }, {
    path: 'slides/:id',
    component: SlidesEditorFormComponent,
    data: {
      roles: ['user'],
      title: 'Slides Editor'
    }
  }, {
    path: 'slidesPresentation/:id',
    component: SlidesViewComponent,
    data: { title: 'Presentation' }
  }
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
