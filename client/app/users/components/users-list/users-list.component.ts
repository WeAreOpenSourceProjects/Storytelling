import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../services';
@Component({
    selector: 'app-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
    users = [];
    state: Object;
    constructor(private usersService: UsersService) {

    }

    ngOnInit() {
        this.usersService.getUsers().subscribe(users => {
            this.users = users;
        });
    }

}
