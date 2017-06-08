import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// MATERIAL DESIGN MODULES
import { MaterialModule, OverlayContainer } from '@angular/material';

// HOME COMPONENT
import { HomeComponent } from '.';
// HOME CONFIG
import { HomeConfig } from '.';

// SLIDES MODULE
import { SlidesModule } from 'app/slides';

export function homeFactory(config: HomeConfig) {
    return () => config.addMenu();
}

@NgModule({
    imports: [
        FormsModule,
        MaterialModule,
        CommonModule,
        SlidesModule
    ],
    declarations: [
        HomeComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [HomeConfig, OverlayContainer,
        { provide: APP_INITIALIZER, useFactory: homeFactory, deps: [HomeConfig], multi: true }
    ],

})
export class HomeModule { }
