import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidesSettingComponent } from './slides-setting.component';

describe('SlidesSettingComponent', () => {
  let component: SlidesSettingComponent;
  let fixture: ComponentFixture<SlidesSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidesSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidesSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
