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
    MatStepperModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule, XHRBackend, RequestOptions } from '@angular/http';

// NGX-CHARTS MODULE
import { PieChartModule, GaugeModule, NgxChartsModule } from '@swimlane/ngx-charts';

// DRAG & DROP MODULE
import { CodemirrorModule } from 'ng4-codemirror/src';
import { DndModule } from 'ng2-dnd';

// HANDSONTABLE MODULE
import { HotTableModule } from 'angular-handsontable';

import { SlidesSearchComponent } from './components/slides-list/slides-search/slides-search.component';
// SLIDES COMPONENTS

import {
  SlidesViewComponent,
  TitleSlideComponent,
  SlidesEditorFormComponent,
  SlideCardComponent,
  MenuBarComponent,
  SlideEditorComponent
} from './components';
export {
  SlidesViewComponent,
  TitleSlideComponent,
  SlidesEditorFormComponent,
  SlideCardComponent,
  MenuBarComponent,
  SlideEditorComponent
} from './components';

// SLIDES SERVICES
import { SlideService, SlideResolve, SlidesService, ImagesService, ValidService, ChartsService } from './services';

// SLIDES ROUTES MODULE
import { SlidesRoutingModule } from '@labdat/slides-routing';
import { FlexLayoutModule } from '@angular/flex-layout';

import {  } from './components/slides-view/key-switch.directive';

import { DragulaModule } from 'ng2-dragula';
import {
  BarChartComponent,
  GaugeChartComponent,
  NgGraphComponent,
  TreemapChartComponent,
  ZoomableTreemapChartComponent,
  PieGridChartComponent,
  NumberCardComponent,
  SunburstChartComponent,
  AdvancedPieChartComponent,
  ForceDirectedGraphComponent,
  LineChartComponent,
  DendogramComponent,
  PieChartComponent,
  HierarchicalEdgeBundlingComponent,
  BubbleChartComponent,
  WordCloudComponent,
  AreaChartComponent
} from '@labdat/charts';
import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';

import { SlidesSettingComponent } from './components/slides-editor-form/slides-editor/slides-setting/slides-setting.component';
import {
  CodeEditorComponent,
  DataTableComponent
} from './components/slides-editor-form/slides-editor/slide-editor/charts-builder';
import { SlidesEditorComponent } from './components/slides-editor-form/slides-editor/slides-editor.component';

import { KeySwitchDirective } from './components/slides-view/key-switch.directive';
import { SlidesListComponent } from './components/slides-list/slides-list.component';
export { SlidesListComponent };
import { SlidesCardComponent } from './components/slides-list/slides-card/slides-card.component';
import { DeleteDialogComponent } from './components/slides-list/delete-dialog/delete-dialog.component';
import { ToggleFullscreenDirective } from './components/slides-view/toggle-fullscreen.directive';

import { ValidateOnBlurDirective } from './components/slides-editor-form/slides-editor/slides-setting/validate-on-blur.directive';
import { GridsterModule } from 'angular-gridster2';

import {
  ChartsBuilderComponent,
  GraphComponent,
  TextEditorComponent,
  ImageUploadComponent
} from './components/slides-editor-form/slides-editor/slide-editor';
import { environment } from '../../../apps/default/src/environments/environment';
import { DisableControlDirective } from './directives/disable-control/disable-control.directive';

@NgModule({
    imports: [
        CommonModule,
        MatTooltipModule,
        MatCheckboxModule,
        FormsModule,
        ReactiveFormsModule,
        DragulaModule,
        PieChartModule,
        GaugeModule,
        NgxChartsModule,
        CodemirrorModule,
        FlexLayoutModule,
        DndModule.forRoot(),
        HotTableModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
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
        RouterModule,
        GridsterModule,
        MatStepperModule ],
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
        DeleteDialogComponent,
        DendogramComponent,
        NgGraphComponent,
        TreemapChartComponent,
        ZoomableTreemapChartComponent,
        BubbleChartComponent,
        WordCloudComponent,
        SunburstChartComponent,
        AreaChartComponent,
        SlideEditorComponent,
        TextEditorComponent,
        ChartsBuilderComponent,
        MenuBarComponent,
        GraphComponent

      ],

    declarations: [
        KeySwitchDirective,
        SlidesViewComponent,
        SlidesEditorFormComponent,
        SlideCardComponent,
        SlidesSearchComponent,
        BarChartComponent,
        ForceDirectedGraphComponent,
        LineChartComponent,
        SlidesSettingComponent,
        CodeEditorComponent,
        DataTableComponent,
        ChartsBuilderComponent,
        SlidesEditorComponent,
        SlidesListComponent,
        GaugeChartComponent,
        AdvancedPieChartComponent,
        TitleSlideComponent,
        PieChartComponent,
        SlidesCardComponent,
        HierarchicalEdgeBundlingComponent,
        AreaChartComponent,
        PieGridChartComponent,
        NumberCardComponent,
        DeleteDialogComponent,
        NgGraphComponent,
        TreemapChartComponent,
        ZoomableTreemapChartComponent,
        DendogramComponent,
        BubbleChartComponent,
        WordCloudComponent,
        SunburstChartComponent,
        KeySwitchDirective,
        ToggleFullscreenDirective,
        ValidateOnBlurDirective,
        SlideEditorComponent,
        GraphComponent,
        TextEditorComponent,
        ImageUploadComponent,
        MenuBarComponent,
        DisableControlDirective
    ],
    exports: [
      SlidesCardComponent,
      SlidesSearchComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [OverlayContainer, SlidesService, SlideService, SlideResolve, ImagesService, ChartsService, ValidService]
})
export class SlidesModule {
  public static forRoot() {
    return {
      ngModule: SlidesModule,
      providers: [OverlayContainer, SlidesService, ImagesService, ChartsService, ValidService, SlideResolve]
    };
  }
}

@NgModule({
  imports: [SlidesModule, SlidesRoutingModule]
})
export class RootSlidesModule {}
