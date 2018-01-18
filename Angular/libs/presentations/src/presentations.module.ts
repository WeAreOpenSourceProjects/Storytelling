import { NgModule, APP_INITIALIZER, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import {
  MatTooltipModule,
  MatInputModule,
  MatCardModule,
  MatSelectModule,
  MatIconModule,
  MatButtonModule,
  MatChipsModule,
  MatToolbarModule,
  MatDialogModule,
  MatCheckboxModule,
  MatPaginatorModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PresentationsListComponent } from './containers/presentations-list/presentations-list.component';
import { PresentationDetailComponent } from './containers/presentation-detail/presentation-detail.component';
import { PresentationCardComponent } from './components/presentation-card/presentation-card.component';
import { PresentationDialogComponent } from './components/presentation-dialog/presentation-dialog.component';
import { PresentationSettingsComponent } from './components/presentation-settings/presentation-settings.component';
import { PresentationsSearchComponent } from './components/presentations-search/presentations-search.component';

// SLIDES ROUTES MODULE
import { PresentationsRoutingModule } from '@labdat/presentations-routing/src/presentations-routing.module';

//import { ToggleFullscreenDirective } from './components/slides-view/toggle-fullscreen.directive';
//import { ValidateOnBlurDirective } from './components/slides-editor-form/slides-setting/validate-on-blur.directive';

import { environment } from '../../../apps/default/src/environments/environment';

@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatToolbarModule,
    MatInputModule,
    MatDialogModule,
    MatPaginatorModule,
    RouterModule
  ],
  entryComponents: [
    PresentationDialogComponent
  ],
  declarations: [
    PresentationsListComponent,
    PresentationDetailComponent,
    PresentationCardComponent,
    PresentationDialogComponent,
    PresentationSettingsComponent,
    PresentationsSearchComponent
  ],
  exports: [
    PresentationsListComponent,
    PresentationDetailComponent,
    PresentationsSearchComponent,
    PresentationCardComponent,
  ]
})
export class PresentationsModule { }

@NgModule({
  imports: [ PresentationsModule, PresentationsRoutingModule ]
})
export class RootPresentationsModule {}
