import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartsBuilderComponent} from './charts-builder';
import { ImageUploadComponent } from '../slide/image-upload/image-upload.component';
import { SlidesService } from '../../../../services/slides.service';
import { ValidService } from '../../../../services/valid.service';
import {NotifBarService} from 'app/core';
import { MaterialModule } from '@angular/material';
import {DragulaModule , DragulaService} from 'ng2-dragula/ng2-dragula';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableComponent } from './charts-builder/data-table';
import { CodemirrorModule } from 'ng2-codemirror';
import { DndModule } from 'ng2-dnd';
import { HotTableModule } from 'ng2-handsontable';
import { BarChartComponent, BubbleChartComponent, DendogramComponent, ForceDirectedGraphComponent, HierarchicalEdgeBundlingComponent,
  LineChartComponent, PieChartComponent, SunburstChartComponent,
  WordCloudComponent, ZoomableTreemapChartComponent, AdvancedPieChartComponent, AreaChartComponent, GaugeChartComponent, NumberCardComponent,
  PieGridChartComponent, TreemapChartComponent
} from '../../../../../charts';
import {SlideComponent} from './slide.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import { CodeEditorComponent } from './charts-builder/code-editor';
import {NgxChartsModule } from '@swimlane/ngx-charts';
import {HttpModule} from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SlideComponent', () => {
  let component: SlideComponent;
  let fixture: ComponentFixture<SlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [ SlideComponent, ImageUploadComponent, DataTableComponent, CodeEditorComponent , SlideComponent,
      ChartsBuilderComponent, BarChartComponent, BubbleChartComponent, DendogramComponent, ForceDirectedGraphComponent, HierarchicalEdgeBundlingComponent,
      LineChartComponent, PieChartComponent, SunburstChartComponent,
      WordCloudComponent, ZoomableTreemapChartComponent, AdvancedPieChartComponent, AreaChartComponent, GaugeChartComponent, NumberCardComponent,
      PieGridChartComponent, TreemapChartComponent],
        imports: [ MaterialModule, BrowserAnimationsModule, HttpModule, ReactiveFormsModule, FroalaEditorModule, FroalaViewModule, DragulaModule, NgxChartsModule, FormsModule, HotTableModule, DndModule, CodemirrorModule],
        providers: [ SlidesService, ValidService, NotifBarService, DragulaService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
