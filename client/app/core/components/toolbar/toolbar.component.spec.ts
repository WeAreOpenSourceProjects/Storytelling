/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from '@angular/material';
import { ToolbarComponent } from './toolbar.component';
import { ToggleNavService } from '../..';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';
import {SessionActions} from '../..';
import { NgReduxTestingModule } from '@angular-redux/store/testing';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarComponent ],
      imports : [
          RouterTestingModule,
          MaterialModule,
          AngularFontAwesomeModule,
          NgReduxTestingModule],
      providers: [ToggleNavService, SessionActions]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
