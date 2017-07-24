import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { NgRedux, select } from '@angular-redux/store';
import { IAppState } from '../../../core/store';
import { IMessage } from "../../../core/store/session";
import {EqualValidator} from './equal-validator.directive';
import { SessionActions } from '../../../core/actions';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
  form: FormGroup;
  state :IAppState;

  @select(['session', 'isLoading']) isLoading$: Observable<boolean>;
  @select(['session', 'hasMessage']) hasMessage$: Observable<IMessage>;


  constructor(private actions: SessionActions, private ngRedux: NgRedux<IAppState>) {
    this.ngRedux.subscribe(() =>{
      this.state = this.ngRedux.getState();
    })
    this.form = this._buildForm();
  }

  ngOnInit() {
  }

  /**
  * Function to handle component update
  *
  * @param record
  */
  ngOnChanges(record) {
  }
  
  private _buildForm() {
    return new FormGroup({
      currentPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      verifyPassword: new FormControl('', Validators.required)
    });
  }
  changePasword(value){
    console.log(value);
    this.actions.changePassword(value);
  }
}
