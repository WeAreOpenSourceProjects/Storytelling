import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import {SessionActions} from '../../../core';
import { NgReduxTestingModule } from '@angular-redux/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {UsersService} from '../../services';
import {HttpModule} from '@angular/http';
describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let usersServiceStub = {};
  let usersService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports : [FormsModule, ReactiveFormsModule, MaterialModule, NgReduxTestingModule, BrowserAnimationsModule, HttpModule],
      providers: [{provide: UsersService, useValue:usersServiceStub }, SessionActions]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
        usersService = TestBed.get(UsersService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
