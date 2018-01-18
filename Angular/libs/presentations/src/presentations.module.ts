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

import { SlidesSearchComponent } from './components/slides-list/slides-search/slides-search.component';

import { PresentationsListComponent } from './containers/presentations-list/presentations-list.component';
import { PresentationDetailComponent } from './containers/presentation-detail/presentation-detail.component';
import { PresentationCardComponent } from './components/presentation-card/presentation-card.component';
import { PresentationDialogComponent } from './components/presentation-dialog/presentation-dialog.component';
import { PresentationSettingsComponent } from './components/presentation-settings/presentation-settings.component';
import { PresentationsSearchComponent } from './components/presentations-search/presentations-search.component';

// SLIDES ROUTES MODULE
import { PresentationsRoutingModule } from '@labdat/presentations-routing';
import { FlexLayoutModule } from '@angular/flex-layout';

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
