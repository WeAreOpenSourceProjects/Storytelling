import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// SLIDES COMPONENTS
import { SlidesPresentationComponent, SlidesCreatorComponent, SlidesListComponent, SlidesEditorComponent} from '.';

import { Auth } from 'app/users';


const slidesRoutes: Routes = [{
    path: '',
    component: SlidesListComponent,
    canActivate: [Auth],
    data: {
        roles: ['*'],
        title: 'Slides'
    },
},
    {
        path: 'createSlides',
        component: SlidesCreatorComponent,
        data: { title: 'Slides Creator' }
    },
    {
        path: 'slidesPresentation/:id',
        component: SlidesPresentationComponent,
        data: { title: 'Presentation' }
    },
    {
        path: 'slides/:id',
        component: SlidesEditorComponent,
        data: {
            roles: ['user'],
            title: 'Slides Editor'
        }
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
