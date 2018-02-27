import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
   message : string;
   error : string;
   show : boolean;
   @Output() public submitted = new EventEmitter<string>();

   public form = this.formBuilder.group({
     email: this.formBuilder.control(''),
   });
   constructor(private formBuilder: FormBuilder) { }
   ngOnInit() {
   }
   askForPasswordReset(email) {
     this.submitted.emit(this.form.value);
     
   }
}
