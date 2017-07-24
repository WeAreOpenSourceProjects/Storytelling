import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartComponent } from './bar-chart.component';

describe('BarChartComponent', () => {
  let component: BarChartComponent;
  let fixture: ComponentFixture<BarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarChartComponent);
    component = fixture.componentInstance;
    component.dataInput =  [
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
      }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
