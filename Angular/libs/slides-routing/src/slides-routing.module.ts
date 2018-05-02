import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoxesGridComponent } from '@labdat/boxes/src/containers/boxes-grid/boxes-grid.component';
import { BoxesModule } from '@labdat/boxes/src/boxes.module';
import { BoxesGuardService } from '@labdat/boxes-routing/src/services/boxes.guard.service';
import { BoxesResolve } from './services/boxes.resolve';
import { SlidesGuardService } from './services/slides.guard.service';
import { SlideGuardService } from './services/slide.guard.service';

const slidesRoutes: Routes = [
  {
    path: ':id',
    component: BoxesGridComponent,
    canActivate: [BoxesGuardService, SlideGuardService],
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
      providers: [SlidesGuardService, SlideGuardService, BoxesResolve]
    };
  }
}

@NgModule()
export class RootSlidesRoutingModule {}
