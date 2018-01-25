import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER, ModuleWithProviders } from '@angular/core';
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
  MatDialogModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';
import { CodemirrorModule } from 'ng4-codemirror/src';
import { DndModule } from 'ng2-dnd';
import { HotTableModule } from 'angular-handsontable';
import { SlidesListComponent } from './containers/slides-list/slides-list.component';
import { SlidesRoutingModule } from '@labdat/slides-routing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DragulaModule } from 'ng2-dragula';
import { environment } from '../../../apps/default/src/environments/environment';
import { SlideCardComponent } from './components/slide-card/slide-card.component';
import { SlideDialogComponent } from './components/slide-dialog/slide-dialog.component';
import { OrderBy } from './pipes/order-by/order-by.pipe';

@NgModule({
    imports: [
      DragulaModule,
      CommonModule,
      MatTooltipModule,
      FormsModule,
      ReactiveFormsModule,
      CodemirrorModule,
      FlexLayoutModule,
      DndModule.forRoot(),
      HotTableModule,
      MatTooltipModule,
      MatCardModule,
      MatSelectModule,
      MatIconModule,
      MatButtonModule,
      MatChipsModule,
      MatToolbarModule,
      MatInputModule,
      HttpModule,
      MatDialogModule,
      RouterModule
    ],
    declarations: [
      OrderBy,
      SlidesListComponent,
      SlideDialogComponent,
      SlideCardComponent
    ],
    entryComponents: [ SlideDialogComponent ],
    exports: [
      SlidesListComponent
    ],
    providers: [OverlayContainer
      //  SlidesService, SlideService, SlideResolve, ChartsService, ValidService
    ]
})
export class SlidesModule {
  public static forRoot() {
    return {
      ngModule: SlidesModule,
      providers: [OverlayContainer
        // , SlidesService, ChartsService, ValidService, SlideResolve
      ]
    };
  }
}

@NgModule({
  imports: [SlidesModule, SlidesRoutingModule ]
})
export class RootSlidesModule {}
