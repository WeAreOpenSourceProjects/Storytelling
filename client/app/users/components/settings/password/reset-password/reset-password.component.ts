import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {UsersService} from '../../../../services/users.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { SessionActions } from 'app/core/actions';
import {NotifBarService} from 'app/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  token ='';
  constructor(private usersService: UsersService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private actions: SessionActions,
              private notifBarService: NotifBarService) {
    this.form = this._buildForm();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.token = params['token'];
      console.log(this.token);
    });
  }
  private _buildForm() {
    return new FormGroup({
      newPassword: new FormControl('', Validators.required),
      verifyPassword: new FormControl('', Validators.required)
    });
  }
  changePasword(newPassword) {
    this.usersService.resetPassword(newPassword, this.token).subscribe(model => {
      this.notifBarService.showNotif('Your new password has been saved.');
      this.actions.loginUser({password : newPassword.newPassword , 'usernameOrEmail': model.user.username });
      this.router.navigate(['/']);
    });
  }


}
