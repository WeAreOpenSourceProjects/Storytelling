import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SessionActions } from '../../core/actions';
import { UsersService } from '../services/index';
import { User } from '../models/index';


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
    form: FormGroup;
    model: any = {};
    errMessage: string;
    loading = false;

    constructor(
        private router: Router,
        private usersService: UsersService, private actions: SessionActions) {
        this.form = this._buildForm();

    }

    ngOnInit() {
        this.model = new User();
        this.loading = false;
    }

    ngOnChange(record) {
        //this.model = new User();
        console.log('record:', record);
    }

    register(model) {
        console.log("hi");
        this.loading = true;
        this.usersService.signup(model)
            .subscribe(
            data => {
                if (data.ok != undefined && data.ok == false) {
                    this.errMessage = data.message;
                    this.loading = false;
                }
                else {
                    this.actions.loginUser({ password: model.password, 'usernameOrEmail': model.username });
                    this.router.navigate(['/']);
                }

            },
            error => {
                this.errMessage = error.json().message;
                this.loading = false;
            });
    }

    private _buildForm() {
        return new FormGroup({
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            username: new FormControl('', Validators.required),
            email: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }

}
