
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

// MATERIAL DESIGN MODULES
import { MaterialModule, OverlayContainer, TooltipPosition } from '@angular/material';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {XHRBackend, RequestOptions} from '@angular/http';

// NGX-CHARTS MODULE
import { PieChartModule, GaugeModule, NgxChartsModule } from '@swimlane/ngx-charts';
import { CodemirrorModule } from 'ng2-codemirror';

// DRAG & DROP MODULE
import { DndModule } from 'ng2-dnd';

// HANDSONTABLE MODULE
import { HotTableModule } from 'ng2-handsontable';


import {SlidesSearchComponent} from './components/slides-list/slides-search/slides-search.component';
// SLIDES COMPONENTS
import { SlidesViewComponent,
    TitleSlideComponent,
    SlidesEditorFormComponent,
    SlideCardComponent
} from '.';

// SLIDES SERVICES
import {SlidesService, ImagesService, ValidService, ChartsService} from '.';

// SLIDES ROUTES MODULE
import { SlidesRoutingModule } from '.';
import { CoreModule } from 'app/core';
import { FlexLayoutModule } from '@angular/flex-layout';


import { KeySwitchDirective } from './components/slides-view/key-switch.directive';

import { DragulaModule } from 'ng2-dragula';
import { BarChartComponent } from '../charts';
import { GaugeChartComponent } from '../charts';
import { NgGraphComponent } from '../charts';
import { TreemapChartComponent } from '../charts';
import { ZoomableTreemapChartComponent } from '../charts';
import { PieGridChartComponent } from '../charts';
import { NumberCardComponent } from '../charts';
import { SunburstChartComponent } from '../charts';
import { HierarchicalEdgeBundlingComponent } from '../charts/hierarchical-edge-bundling/hierarchical-edge-bundling.component';

import { AdvancedPieChartComponent } from '../charts';
import { ForceDirectedGraphComponent } from '../charts/force-directed-graph/force-directed-graph.component';
import { LineChartComponent } from '../charts/line-chart/line-chart.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import { DendogramComponent } from '../charts/dendogram/dendogram.component';
import { PieChartComponent } from '../charts/pie-chart/pie-chart.component';
import { BubbleChartComponent } from '../charts';
import { WordCloudComponent } from '../charts';

import { AreaChartComponent } from '../charts/ngx-charts/area-chart';

import { ImageUploadComponent } from './components/slides-editor-form/slides-editor/slide-card/slide-editor/image-upload/image-upload.component';

import { SlidesSettingComponent } from './components/slides-editor-form/slides-editor/slides-setting/slides-setting.component';
import { CodeEditorComponent, DataTableComponent } from './components/slides-editor-form/slides-editor/slide-card/slide-editor/charts-builder';
import { SlidesEditorComponent } from './components/slides-editor-form/slides-editor/slides-editor.component';
import { SlidesListComponent } from './components/slides-list/slides-list.component';
import { SlidesCardComponent } from './components/slides-list/slides-card/slides-card.component';
import { DeleteDialogComponent } from './components/slides-list/slides-card/delete-dialog/delete-dialog.component';
import { ToggleFullscreenDirective } from './components/slides-view/toggle-fullscreen.directive';

import { ValidateOnBlurDirective } from './components/slides-editor-form/slides-editor/slides-setting/validate-on-blur.directive';
import { SlideEditorComponent, ChartsBuilderComponent, TextEditorComponent, GraphComponent, TextComponent } from '.';
import { NgGridModule} from 'angular2-grid';

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        CoreModule,
        SlidesRoutingModule,
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
        NgGridModule
    ],
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
        ChartsBuilderComponent,
        TextEditorComponent
    ],

    declarations: [
        KeySwitchDirective,
        SlidesViewComponent,
        SlidesEditorFormComponent,
        SlideCardComponent,
        ImageUploadComponent,
        SlidesSearchComponent,
        BarChartComponent,
        ForceDirectedGraphComponent,
        LineChartComponent,
        SlidesSettingComponent,
        CodeEditorComponent,
        DataTableComponent,
        SlidesEditorComponent,
        SlidesListComponent,
        GaugeChartComponent,
        AdvancedPieChartComponent,
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
        ChartsBuilderComponent,
        TextEditorComponent,
        GraphComponent,
        TitleSlideComponent,
        TextComponent
    ],
    exports: [
      SlidesCardComponent,
      SlidesSearchComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [OverlayContainer, SlidesService, ImagesService, ChartsService, ValidService]

})
export class SlidesModule {
}
