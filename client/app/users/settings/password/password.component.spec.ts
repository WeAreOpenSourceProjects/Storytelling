import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordComponent } from './password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import {SessionActions} from '../../../core';
import { NgReduxTestingModule } from '@angular-redux/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('PasswordComponent', () => {
  let component: PasswordComponent;
  let fixture: ComponentFixture<PasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordComponent ],
      imports : [FormsModule, ReactiveFormsModule, MaterialModule, NgReduxTestingModule, BrowserAnimationsModule],
      providers: [SessionActions]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
