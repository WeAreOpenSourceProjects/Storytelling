import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartsService } from 'app/slides/services';
import { LeftGraphRightTextSlideComponent } from '../left-graph-right-text-slide/left-graph-right-text-slide.component';
import { BarChartComponent, GaugeChartComponent, NgGraphComponent, TreemapChartComponent, ZoomableTreemapChartComponent } from 'app/charts';
import { PieGridChartComponent, NumberCardComponent, SunburstChartComponent, HierarchicalEdgeBundlingComponent } from 'app/charts';
import { AdvancedPieChartComponent, ForceDirectedGraphComponent, LineChartComponent} from 'app/charts';
import { DendogramComponent, PieChartComponent, BubbleChartComponent, WordCloudComponent, AreaChartComponent } from 'app/charts';
import { DeleteDialogComponent } from '../../../slides-list/slides-card/delete-dialog/delete-dialog.component';
import { ImageComponent } from '../../../../';
import { FullScreenGraphSlideComponent } from '../full-screen-graph-slide/full-screen-graph-slide.component';
import { NgModule } from '@angular/core';
import {NgxChartsModule } from '@swimlane/ngx-charts';
import { RightGraphLeftTextSlideComponent } from './right-graph-left-text-slide.component';
import {APP_BASE_HREF} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RightGraphLeftTextSlideComponent', () => {
  let component: RightGraphLeftTextSlideComponent;
  let fixture: ComponentFixture<RightGraphLeftTextSlideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightGraphLeftTextSlideComponent, LeftGraphRightTextSlideComponent, FullScreenGraphSlideComponent, BarChartComponent,
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
        ImageComponent ],
      providers : [ChartsService, {provide: APP_BASE_HREF , useValue: '/'}],
      imports: [NgxChartsModule, FakeTestGraphModule, BrowserAnimationsModule]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightGraphLeftTextSlideComponent);
    component = fixture.componentInstance;
    component.slide =   {
      "pageTitle" : {
        "align" : "",
        "title" : "line chart"
      },
      "hasText" : true,
      "hasGraph" : true,
      "config" : {
        "showSeriesOnHover" : true,
        "tooltipDisabled" : false,
        "roundDomains" : false,
        "rangeFillOpacity" : 0.5,
        "showGridLines" : true,
        "autoScale" : true,
        "xAxisLabel" : "",
        "yAxisLabel" : "",
        "showYAxisLabel" : true,
        "showXAxisLabel" : true,
        "showYAxis" : true,
        "showXAxis" : true,
        "gradient" : false,
        "legendTitle" : "Legend",
        "showLegend" : true,
        "schemeType" : "ordinal",
        "colorScheme" : {
          "domain" : [
            "#a8385d",
            "#7aa3e5",
            "#a27ea8",
            "#aae3f5",
            "#adcded",
            "#a95963",
            "#8796c0",
            "#7ed3ed",
            "#50abcc",
            "#ad6886"
          ],
          "group" : "Ordinal",
          "selectable" : true,
          "name" : "cool"
        },
        "view" : [
          900,
          600
        ],
        "dataDims" : [
          [
            "continent"
          ],
          [
            "country"
          ],
          [
            "pop"
          ],
          null
        ],
        "headerValues" : [
          {
            "type" : "string",
            "name" : "country"
          },
          {
            "type" : "number",
            "name" : "year"
          },
          {
            "type" : "number",
            "name" : "gdpPercap"
          },
          {
            "type" : "number",
            "name" : "lifeExp"
          },
          {
            "type" : "number",
            "name" : "pop"
          },
          {
            "type" : "string",
            "name" : "continent"
          }
        ],
        "chartType" : {
          "image" : "assets/img-graph/line-chart.jpg",
          "categorie" : "Comparison",
          "description" : "Is an interactive line chart that can be configured for multiple axes. The multi-axis line chart is a special type of chart that allows multiple y-axes to be rendered in the same chart. The advantage of using a multi-axis line chart is that you can plot multiple data sets with different types of units and different scale ranges  on the same chart.",
          "dimLabels" : [
            {
              "maxSize" : 1,
              "column" : "GroupBy"
            },
            {
              "maxSize" : 1,
              "column" : "x-Values"
            },
            {
              "maxSize" : 1,
              "column" : "y-Values"
            }
          ],
          "name" : "line-chart",
          "title" : "Line Chart"
        }
      },
      "data" : [
        {
          "continent" : "Oceania",
          "pop" : 8691212,
          "lifeExp" : 69.12,
          "gdpPercap" : 10039.59564,
          "year" : 1952,
          "country" : "Australia"
        },
        {
          "continent" : "Oceania",
          "pop" : 9712569,
          "lifeExp" : 70.33,
          "gdpPercap" : 10949.64959,
          "year" : 1957,
          "country" : "Australia"
        },
        {
          "continent" : "Oceania",
          "pop" : 10794968,
          "lifeExp" : 70.93,
          "gdpPercap" : 12217.22686,
          "year" : 1962,
          "country" : "Australia"
        },
        {
          "continent": "Oceania",
          "pop": 11872264,
          "lifeExp": 71.1,
          "gdpPercap": 14526.12465,
          "year": 1967,
          "country": "Australia"
        }],
      "pageLayout" : "LeftGraphRightText",
      "graph" : "ngGraph",
      "textVerAlign" : "TOP",
      "text" : "<p>dsgfgdg</p>",
      "index" : 1,
      fullScreenHtml: false,
      slideImage : null
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
@NgModule({
  entryComponents: [BarChartComponent,
    LineChartComponent,
    ForceDirectedGraphComponent,
    HierarchicalEdgeBundlingComponent,
    PieChartComponent,
    PieGridChartComponent,
    NumberCardComponent,
    FullScreenGraphSlideComponent,
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
    ImageComponent]
})
export class FakeTestGraphModule {}
