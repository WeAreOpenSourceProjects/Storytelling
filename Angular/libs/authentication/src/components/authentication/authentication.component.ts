import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  fromAuthentication,
  AuthenticationState,
  selectLoginPagePending,
  selectLoginPageError
} from '@labdat/authentication-state';
import { Store } from '@ngrx/store';
import { Authenticate } from '../../models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthenticationComponent {
  public pending$ = this.store.select(selectLoginPagePending);
  public error$ = this.store.select(selectLoginPageError);
  private forgetPassword : Boolean = false;
  constructor(private store: Store<AuthenticationState>) {}

  onLogin(authenticate: Authenticate) {
    this.store.dispatch(new fromAuthentication.Login(authenticate));
  }

  onRegister(registration: any) {
    this.store.dispatch(new fromAuthentication.Register(registration));
  }
  onForgetPassword(){
    this.forgetPassword = true;
  }
  onResetPassword(email){
    this.store.dispatch(new fromAuthentication.ForgetPassword(email));
  }
}
