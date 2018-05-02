import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { Authenticate } from '../../models/user.model';
import { fromAuthentication, AuthenticationState } from '@labdat/authentication-state';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  token = '';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store<AuthenticationState>
  ) {
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
    this.store.dispatch(new fromAuthentication.ResetPassword({ password: newPassword, token: this.token }));
  }
}
