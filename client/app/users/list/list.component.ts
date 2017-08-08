import { Component, OnInit } from '@angular/core';
import { SessionActions } from '../../core/actions';
import { NgRedux } from '@angular-redux/store';
import { IAppState } from '../../core/store';
import {UsersService} from '../services/users.service';
@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
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
