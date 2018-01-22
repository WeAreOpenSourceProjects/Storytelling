import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDialogComponent } from './delete-dialog.component';
import { MatDialogRef } from '@angular/material';
describe('DeleteDialogComponent', () => {
  let component: DeleteDialogComponent;
  let fixture: ComponentFixture<DeleteDialogComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [DeleteDialogComponent],
        providers: [{ provide: MatDialogRef }]
      })
      .compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*  it('should create', () => {
    //expect(component).toBeTruthy();
  });*/
});
