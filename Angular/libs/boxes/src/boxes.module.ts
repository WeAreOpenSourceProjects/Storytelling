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
  MatStepperModule,
  MatTabsModule
} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
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
  GraphComponent,
  TreemapChartComponent,
  ZoomableTreemapChartComponent,
  BubbleChartComponent,
  WordCloudComponent,
  SunburstChartComponent,
  AreaChartComponent,
  ChartsModule
} from '@labdat/charts';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';

import { PieChartModule, GaugeModule, NgxChartsModule } from '@swimlane/ngx-charts';

import { CodemirrorModule } from 'ng4-codemirror/src';
import { DndModule } from 'ng2-dnd';
import { HotTableModule } from 'angular-handsontable';

// import '../../../node_modules/froala-editor/js/froala_editor.pkgd.min.js';
// import { SlidesSearchComponent } from './components/slides-list/slides-search/slides-search.component';

import { TinyEditorComponent } from '@labdat/tiny-editor';
import { ImageUploadComponent } from '@labdat/image-upload';

import { ChartsBuilderComponent } from './components/charts-builder/charts-builder.component';
import { BoxesBackgroundComponent } from './components/boxes-background/boxes-background.component';
import { MenuBarComponent } from './components/menu-bar/menu-bar.component';
import { GridsterModule } from 'angular-gridster2';

import { FlexLayoutModule } from '@angular/flex-layout';

import { DragulaModule } from 'ng2-dragula';
//import { ToggleFullscreenDirective } from './components/slides-view/toggle-fullscreen.directive';
//import { ValidateOnBlurDirective } from './components/slides-editor-form/slides-setting/validate-on-blur.directive';
import { environment } from '../../../apps/default/src/environments/environment';
import { BoxesGridComponent } from './containers/boxes-grid/boxes-grid.component';
import { ChartsService } from '@labdat/charts/src/services/charts.service';
import { BoxDialogComponent } from './components/box-dialog/box-dialog.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { CodeEditorComponent } from './components/code-editor';
import { TinyEditorModule } from '@labdat/tiny-editor';
import { ImageUploadModule } from '@labdat/image-upload';
import { ColorPickerModule } from 'ngx-color-picker';
import { GridModule } from '@labdat/grid'
@NgModule({
  imports: [
    DragulaModule,
    CommonModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    PieChartModule,
    GaugeModule,
    NgxChartsModule,
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
    MatTabsModule,
    HttpModule,
    MatDialogModule,
    RouterModule,
    GridsterModule,
    MatStepperModule,
    ChartsModule,
    TinyEditorModule,
    ImageUploadModule,
    ColorPickerModule,
    GridModule
  ],
  declarations: [
    BoxesGridComponent,
    MenuBarComponent,
    BoxDialogComponent,
    ChartsBuilderComponent,
    DataTableComponent,
    CodeEditorComponent,
    BoxesBackgroundComponent
  ],
  exports: [BoxesGridComponent],
  entryComponents: [
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
    MenuBarComponent,
    ChartsBuilderComponent,
    BoxDialogComponent,
    TinyEditorComponent,
    ImageUploadComponent,
    GraphComponent,
    BoxesBackgroundComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [OverlayContainer, ChartsService]
  //  SlidesService, SlideService, SlideResolve, ImagesService, ChartsService, ValidService
})
export class BoxesModule {
  public static forRoot() {
    return {
      ngModule: BoxesModule,
      providers: [OverlayContainer]
      // , SlidesService, ImagesService, ChartsService, ValidService, SlideResolve
    };
  }
}

@NgModule({
  imports: [BoxesModule]
})
export class RootBoxesModule {}
