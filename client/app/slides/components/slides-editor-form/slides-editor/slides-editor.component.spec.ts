import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {SlidesSettingComponent} from './slides-setting/slides-setting.component'
import { SlidesEditorComponent } from './slides-editor.component';
import { DragulaModule, DragulaService } from 'ng2-dragula/ng2-dragula';
import { MaterialModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ChartsBuilderComponent} from './slide-card/slide-editor/charts-builder';
import { ImageUploadComponent } from './slide-card/slide-editor/image-upload/image-upload.component';
import { DataTableComponent } from './slide-card/slide-editor/charts-builder/data-table';
import { CodemirrorModule } from 'ng2-codemirror';
import { DndModule } from 'ng2-dnd';
import { HotTableModule } from 'ng2-handsontable';
import { BarChartComponent, BubbleChartComponent, DendogramComponent, ForceDirectedGraphComponent, HierarchicalEdgeBundlingComponent,
  LineChartComponent, PieChartComponent, SunburstChartComponent,
  WordCloudComponent, ZoomableTreemapChartComponent, AdvancedPieChartComponent, AreaChartComponent, GaugeChartComponent, NumberCardComponent,
  PieGridChartComponent, TreemapChartComponent
} from '../../../../charts';
import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import { CodeEditorComponent } from './slide-card/slide-editor/charts-builder/code-editor';
import {NgxChartsModule } from '@swimlane/ngx-charts';
import {ValidService} from '../../../services/valid.service';
import {NotifBarService} from 'app/core';
import { SlidesService } from '../../../services/slides.service';
import {HttpModule} from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


describe('SlidesEditorComponent', () => {
  let component: SlidesEditorComponent;
  let fixture: ComponentFixture<SlidesEditorComponent>;
  let slidesServiceStub = {};
  let slidesService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidesEditorComponent, CodeEditorComponent,  BarChartComponent, BubbleChartComponent, DendogramComponent, ForceDirectedGraphComponent, HierarchicalEdgeBundlingComponent,
        LineChartComponent, PieChartComponent, SunburstChartComponent,
        WordCloudComponent, ZoomableTreemapChartComponent, AdvancedPieChartComponent, AreaChartComponent, GaugeChartComponent, NumberCardComponent,
        PieGridChartComponent, TreemapChartComponent, DataTableComponent, SlidesSettingComponent, ChartsBuilderComponent, ImageUploadComponent ],
      providers: [DragulaService, ValidService, NotifBarService, {provide: SlidesService, useValue:slidesServiceStub }],
      imports : [DragulaModule, BrowserAnimationsModule, HttpModule, MaterialModule, NgxChartsModule, CodemirrorModule, DndModule, HotTableModule, FormsModule, ReactiveFormsModule, FroalaEditorModule, FroalaViewModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidesEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
      slidesService = TestBed.get(SlidesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
