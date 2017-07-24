import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidesEditorFormComponent } from './slides-editor-form.component';
import { SlidesEditorComponent } from './slides-editor/slides-editor.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SlidesService } from '../../services/slides.service';
import { ValidService } from '../../services/valid.service';
import {NotifBarService} from 'app/core';
import { MaterialModule } from '@angular/material';
import {SlideComponent} from './slides-editor/slide/slide.component';
import {SlidesSettingComponent} from './slides-editor/slides-setting/slides-setting.component'
import {DragulaModule , DragulaService} from 'ng2-dragula/ng2-dragula';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ChartsBuilderComponent} from './slides-editor/slide/charts-builder';
import { DataTableComponent } from './slides-editor/slide/charts-builder/data-table';
import { CodemirrorModule } from 'ng2-codemirror';
import { DndModule } from 'ng2-dnd';
import { HotTableModule } from 'ng2-handsontable';
import { ImageUploadComponent } from './slides-editor/slide/image-upload/image-upload.component';
import { BarChartComponent, BubbleChartComponent, DendogramComponent, ForceDirectedGraphComponent, HierarchicalEdgeBundlingComponent,
  LineChartComponent, PieChartComponent, SunburstChartComponent,
  WordCloudComponent, ZoomableTreemapChartComponent, AdvancedPieChartComponent, AreaChartComponent, GaugeChartComponent, NumberCardComponent,
  PieGridChartComponent, TreemapChartComponent
} from '../../../charts';
import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import { CodeEditorComponent } from './slides-editor/slide/charts-builder/code-editor';
import {NgxChartsModule } from '@swimlane/ngx-charts';
import { APP_BASE_HREF } from '@angular/common';
import {HttpModule} from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SlidesEditorFormComponent', () => {
  let component: SlidesEditorFormComponent;
  let fixture: ComponentFixture<SlidesEditorFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidesEditorFormComponent, ImageUploadComponent, DataTableComponent, CodeEditorComponent, SlidesEditorComponent , SlideComponent, SlidesSettingComponent,
        ChartsBuilderComponent, BarChartComponent, BubbleChartComponent, DendogramComponent, ForceDirectedGraphComponent, HierarchicalEdgeBundlingComponent,
        LineChartComponent, PieChartComponent, SunburstChartComponent,
        WordCloudComponent, ZoomableTreemapChartComponent, AdvancedPieChartComponent, AreaChartComponent, GaugeChartComponent, NumberCardComponent,
        PieGridChartComponent, TreemapChartComponent],
      imports: [RouterTestingModule, MaterialModule, BrowserAnimationsModule, HttpModule, ReactiveFormsModule, FroalaEditorModule, FroalaViewModule, DragulaModule, NgxChartsModule, FormsModule, HotTableModule, DndModule, CodemirrorModule],
      providers: [ SlidesService, ValidService, NotifBarService, DragulaService, {provide: APP_BASE_HREF, useValue: '/'}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidesEditorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
