import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// import { SlidesService } from '../../../../../../services/slides.service';
import { ImageUploadComponent } from './image-upload.component';
//import { NotifBarService } from 'app/core';
describe('ImageUploadComponent', () => {
  let component: ImageUploadComponent;
  let fixture: ComponentFixture<ImageUploadComponent>;
  let slidesServiceStub = {};
  let slidesService;
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ImageUploadComponent],
        imports: [FormsModule, HttpModule]
        // providers: [{ provide: SlidesService, useValue: slidesServiceStub } /*, NotifBarService*/]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // slidesService = TestBed.get(SlidesService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
