import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SlidesCardComponent } from './slides-card.component';
import { SlidesService } from '../../../services/slides.service';
import { HttpModule } from '@angular/http';
import { Slides } from '../../../models/slides';
describe('SlidesCardComponent', () => {
  let component: SlidesCardComponent;
  let fixture: ComponentFixture<SlidesCardComponent>;
  let slidesServiceStub = {};
  let slidesService;
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule, HttpModule],
        declarations: [SlidesCardComponent],
        providers: [{ provide: SlidesService, useValue: slidesServiceStub }]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    slidesService = TestBed.get(SlidesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
