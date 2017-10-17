import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SlidesViewComponent } from './slides-view.component';
import {HttpModule} from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { NotifBarService } from "app/core";
import { MaterialModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SlidesViewComponent', () => {
  let component: SlidesViewComponent;
  let fixture: ComponentFixture<SlidesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidesViewComponent],
      imports : [HttpModule, RouterTestingModule, MaterialModule, BrowserAnimationsModule],
      providers : [NotifBarService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
