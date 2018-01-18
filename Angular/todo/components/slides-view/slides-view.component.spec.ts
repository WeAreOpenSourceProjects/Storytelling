import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SlidesViewComponent } from './slides-view.component';
import { HttpModule } from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SlidesViewComponent', () => {
  let component: SlidesViewComponent;
  let fixture: ComponentFixture<SlidesViewComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [SlidesViewComponent],
        imports: [HttpModule, RouterTestingModule, BrowserAnimationsModule],
        providers: []
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
