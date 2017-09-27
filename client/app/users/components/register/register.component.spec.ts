/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import {SessionActions} from '../../../core';
import { RegisterComponent } from './register.component';
import {UsersService} from '../../services';
import { NgReduxTestingModule } from '@angular-redux/store/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpModule} from '@angular/http';
describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let usersServiceStub = {};
  let usersService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports : [FormsModule, ReactiveFormsModule, MaterialModule, RouterTestingModule, HttpModule, NgReduxTestingModule, BrowserAnimationsModule],
      providers: [SessionActions, {provide: UsersService, useValue:usersServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    usersService = TestBed.get(UsersService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
