import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaChartComponent } from './area-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {APP_BASE_HREF} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
describe('AreaChartComponent', () => {
    let component: AreaChartComponent;
    let fixture: ComponentFixture<AreaChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AreaChartComponent],
            imports: [NgxChartsModule, BrowserAnimationsModule],
            providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AreaChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
