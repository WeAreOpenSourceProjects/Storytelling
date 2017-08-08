import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from "rxjs";
import { ListComponent } from './list.component';
import { MaterialModule } from '@angular/material';
import {UsersService} from '../services';
import {HttpModule} from '@angular/http';
class UsersServiceStub {
    getUsers():Observable<any>{
      return Observable.of([{
        username : 'cherifa',
        fistname : 'ghersi'
      }])
  }
}
describe('ListComponent', () => {
    let component: ListComponent;
    let fixture: ComponentFixture<ListComponent>;
    let usersService: UsersService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ListComponent],
            imports: [MaterialModule, HttpModule],
            providers: [{ provide: UsersService, useClass: UsersServiceStub }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        usersService = TestBed.get(UsersService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
