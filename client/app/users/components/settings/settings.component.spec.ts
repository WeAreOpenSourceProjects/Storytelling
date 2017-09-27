import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsComponent } from './settings.component';
import {ProfileComponent} from './profile';
import {PasswordComponent} from './password';
import { MaterialModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {UsersService} from '../../services';
import {HttpModule} from '@angular/http';
import {SessionActions} from '../../../core';
import { NgReduxTestingModule } from '@angular-redux/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsComponent, ProfileComponent, PasswordComponent ],
      imports : [MaterialModule, FormsModule, ReactiveFormsModule, HttpModule, NgReduxTestingModule, BrowserAnimationsModule],
      providers : [UsersService, SessionActions]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
