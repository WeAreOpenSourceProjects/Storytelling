import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableComponent } from '../data-table/data-table.component';
//import { HotTableModule } from 'ng2-handsontable';
describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [DataTableComponent],
        imports: []
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
