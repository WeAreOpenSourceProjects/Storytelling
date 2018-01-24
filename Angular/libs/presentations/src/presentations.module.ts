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
  MatDialogModule,
  MatCheckboxModule,
  MatPaginatorModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SlidesModule } from '@labdat/slides';

import { PresentationsListComponent } from './containers/presentations-list/presentations-list.component';
import { PresentationEditComponent } from './containers/presentation-edit/presentation-edit.component';
import { PresentationsViewComponent } from './containers/presentations-view/presentations-view.component';

import { PresentationCardComponent } from './components/presentation-card/presentation-card.component';
import { PresentationDialogComponent } from './components/presentation-dialog/presentation-dialog.component';
import { PresentationSettingsComponent } from './components/presentation-settings/presentation-settings.component';
import { PresentationsSearchComponent } from './components/presentations-search/presentations-search.component';
import { TitleSlideComponent } from './components/title-slide/title-slide.component';
import { GraphComponent } from './components/graph/graph.component';
import { FroalaViewModule } from 'angular-froala-wysiwyg';


import { GridsterModule } from 'angular-gridster2';
import {
  BarChartComponent,
  LineChartComponent,
  ForceDirectedGraphComponent,
  HierarchicalEdgeBundlingComponent,
  PieChartComponent,
  PieGridChartComponent,
  NumberCardComponent,
  GaugeChartComponent,
  AdvancedPieChartComponent,
  DendogramComponent,
  NgGraphComponent,
  TreemapChartComponent,
  ZoomableTreemapChartComponent,
  BubbleChartComponent,
  WordCloudComponent,
  SunburstChartComponent,
  AreaChartComponent,
  ChartsModule
} from '@labdat/charts'
import { PieChartModule, GaugeModule, NgxChartsModule } from '@swimlane/ngx-charts';

// SLIDES ROUTES MODULE
import { PresentationsRoutingModule } from '@labdat/presentations-routing/src/presentations-routing.module';

//import { ToggleFullscreenDirective } from './components/slides-view/toggle-fullscreen.directive';
//import { ValidateOnBlurDirective } from './components/slides-editor-form/slides-setting/validate-on-blur.directive';

import { environment } from '../../../apps/default/src/environments/environment';
import { SlidesStateModule } from '@labdat/slides-state';
import { PresentationsStateModule } from '@labdat/presentations-state';
import { ChartsService } from '@labdat/charts/src/services/charts.service';



@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatToolbarModule,
    MatInputModule,
    MatDialogModule,
    MatPaginatorModule,
    RouterModule,
    SlidesModule,
    GridsterModule,
    FroalaViewModule,
    PieChartModule,
    GaugeModule,
    ChartsModule
  ],
  entryComponents: [
    PresentationDialogComponent,
    BarChartComponent,
    LineChartComponent,
    ForceDirectedGraphComponent,
    HierarchicalEdgeBundlingComponent,
    PieChartComponent,
    PieGridChartComponent,
    NumberCardComponent,
    GaugeChartComponent,
    AdvancedPieChartComponent,
    DendogramComponent,
    NgGraphComponent,
    TreemapChartComponent,
    ZoomableTreemapChartComponent,
    BubbleChartComponent,
    WordCloudComponent,
    SunburstChartComponent,
    AreaChartComponent
  ],
  declarations: [
    PresentationsListComponent,
    PresentationEditComponent,
    PresentationCardComponent,
    PresentationDialogComponent,
    PresentationSettingsComponent,
    PresentationsSearchComponent,
    PresentationsViewComponent,
    TitleSlideComponent
  ],
  exports: [
    PresentationsListComponent,
    PresentationEditComponent,
    PresentationsSearchComponent,
    PresentationCardComponent,
  ]
})
export class PresentationsModule { }

@NgModule({
  imports: [ PresentationsModule, PresentationsRoutingModule, SlidesStateModule ],
  providers: [ChartsService]
})
export class RootPresentationsModule {}
