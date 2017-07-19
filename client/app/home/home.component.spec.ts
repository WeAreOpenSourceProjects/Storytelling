/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { SlidesModule } from '../slides';
import { RouterTestingModule } from '@angular/router/testing';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import {SessionActions} from '../core';
import { MaterialModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { SlidesService } from 'app/slides';
import { Observable } from 'rxjs/Observable';

describe('HomeComponent', () => {
  class SlidesServiceMock {
    getSlideToSearch (): Observable<any>  {
      return Observable.of([]);
    }
  }
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        SlidesModule,
        RouterTestingModule,
        NgReduxTestingModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers : [ SessionActions,
        {provide: SlidesService, useClass : SlidesServiceMock}]
    })
      .compileComponents();
    MockNgRedux.reset();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
