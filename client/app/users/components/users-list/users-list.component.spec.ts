import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from "rxjs";
import { UsersListComponent } from './users-list.component';
import { MaterialModule } from '@angular/material';
import {UsersService} from '../../services';
import {HttpModule} from '@angular/http';
class UsersServiceStub {
    getUsers():Observable<any>{
      return Observable.of([{
        username : 'cherifa',
        fistname : 'ghersi'
      }])
  }
}
describe('UsersListComponent', () => {
    let component: UsersListComponent;
    let fixture: ComponentFixture<UsersListComponent>;
    let usersService: UsersService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UsersListComponent],
            imports: [MaterialModule, HttpModule],
            providers: [{ provide: UsersService, useClass: UsersServiceStub }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UsersListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        usersService = TestBed.get(UsersService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
