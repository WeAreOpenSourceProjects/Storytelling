import { TestBed, async } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NgReduxRouter } from '@angular-redux/router';
import { SessionEpics } from './core/index';
import { ToggleNavService } from './core';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import { Observable } from 'rxjs/Observable';

describe('AppComponent', () => {
  class SessionEpicsMock {
    login = () => {
      return Observable.of({
        'user': {
          'displayName': 'firstname lastname',
          'provider': 'local',
          'username': 'user01',
          'updated': '2017-04-24T11:46:39.663Z',
          'resetPasswordExpires': '2017-04-11T08:42:03.959Z',
          'resetPasswordToken': 'c71c89964befd6a16fe6565d89fe0c2d18d725b2',
          'created': '2017-03-31T08:55:11.633Z',
          'roles': ['admin'],
          'profileImageURL': 'modules/users/client/img/profile/default.png',
          'email': 'user01@mean.io',
          'lastName': 'lastname',
          'firstName': 'firstname'
        }
      });
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        NgReduxTestingModule,
        RouterTestingModule,
        HttpModule,
        MaterialModule],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        NgReduxRouter,
        { provide: SessionEpics, useClass: SessionEpicsMock },
        ToggleNavService]
    }).compileComponents();
    MockNgRedux.reset();
  });
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  }));

});
