import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SlidesSearchComponent } from './slides-search.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
describe('SlidesSearchComponent', () => {
  let component: SlidesSearchComponent;
  let fixture: ComponentFixture<SlidesSearchComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, BrowserAnimationsModule],
        declarations: [SlidesSearchComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
