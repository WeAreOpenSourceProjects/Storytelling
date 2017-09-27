import { Component, OnInit, OnChanges } from '@angular/core';
import { FormControl, Validators, FormGroup } from "@angular/forms";
import {UsersService} from '../../../index';
import { Observable } from 'rxjs/Observable';
import { select } from '@angular-redux/store';
import { SessionActions } from '../../../../core/actions';
import { NgRedux } from '@angular-redux/store';
import { IAppState, ISessionRecord } from '../../../../core/store';
import { IUser, IMessage } from "../../../../core/store/session";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnChanges {
  
  form: FormGroup;
  private model: any;
  state :IAppState;
  
  @select(['session', 'isLoading']) isLoading$: Observable<boolean>;
  @select(['session', 'hasMessage']) hasMessage$: Observable<IMessage>;


  constructor(private usersService : UsersService,
                private actions : SessionActions, private ngRedux: NgRedux<IAppState> ) {

    this.ngRedux.subscribe(() =>{
      this.state=this.ngRedux.getState();
    })
    
    this.form = this._buildForm();

  }
  /**
  * OnInit implementation
  */
  ngOnInit() {
    this.ngRedux.select(['session','user']).first().subscribe((user: IUser) =>{
       var  {firstName, lastName, email, username} = this.model = user ;
       this.form.patchValue({firstName, lastName, email, username});
       this.form.controls['email'].disable();
       this.form.controls['username'].disable();
    });
  }

  /**
  * Function to handle component update
  *
  * @param record
  */
  ngOnChanges(record) {
    if(record.model && record.model.currentValue) {
      this.model = record.model.currentValue;
      this.form.patchValue(this.model);
    }
  }


  saveProfile(user){
    this.actions.editProfile(user);
  }

  /**
  * Function to build our form
  *
  * @returns {FormGroup}
  *
  * @private
  */
    private _buildForm() {
      return new FormGroup({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        username: new FormControl('', Validators.required),
        email: new FormControl('', Validators.required)
      });
    }

}
