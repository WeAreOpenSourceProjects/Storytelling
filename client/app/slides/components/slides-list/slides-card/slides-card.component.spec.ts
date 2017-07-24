import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SlidesCardComponent } from './slides-card.component';
import { MaterialModule } from '@angular/material';
import { SlidesService } from '../../../services/slides.service';
import {NotifBarService} from 'app/core';
import { HttpModule } from '@angular/http';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import { Slides } from '../../../models/slides';
describe('SlidesCardComponent', () => {
    let component: SlidesCardComponent;
    let fixture: ComponentFixture<SlidesCardComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                MaterialModule,
                HttpModule,
                NgReduxTestingModule
            ],
            declarations: [SlidesCardComponent],
            providers: [SlidesService,NotifBarService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SlidesCardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
