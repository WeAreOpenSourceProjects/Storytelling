import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AdvancedPieChartComponent } from './advanced-pie-chart.component';
import {APP_BASE_HREF} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
describe('AdvancedPieChartComponent', () => {
    let component: AdvancedPieChartComponent;
    let fixture: ComponentFixture<AdvancedPieChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AdvancedPieChartComponent],
            imports: [NgxChartsModule, BrowserAnimationsModule],
            providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdvancedPieChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
