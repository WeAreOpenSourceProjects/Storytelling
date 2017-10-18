import { Component, OnInit } from '@angular/core';
import {UsersService} from '../../../../services/users.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  username: string;
  message : string;
  error : string;
  constructor(private usersService : UsersService) { }
  ngOnInit() {
  }
  askForPasswordReset(username) {
    this.usersService.forgotPassword({username : username}).subscribe((resp) => {
      this.message = resp.message;
      this.error = resp.error;
    });

  }
}
