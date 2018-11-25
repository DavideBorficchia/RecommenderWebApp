import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Guid } from "guid-typescript";
import { RegisterService } from 'src/app/services/register.service';
import { LayoutModule, BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { User } from '../register/model/user';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css', '../register/register.component.css']
})
export class SignUpComponent implements OnInit {
  @Input() parentUser: User;
  @Output('onNeedRegister') linkClicked = new EventEmitter<boolean>();
  formUser: User = new User()
  hide = true;
  isSpinnerShown: boolean;
  constructor(private registerService:RegisterService) { }

  onSignUp() {
    if (this.formUser.userName && this.formUser.email && this.formUser.password) {


      this.isSpinnerShown = true


      this.formUser.id = Guid.create().toString();

      this.registerService.doSignUp(this.formUser).subscribe(response => {
        if (response.status == 201) {
          setTimeout(() => {
            this.isSpinnerShown = false
            // this.parentUser = this.formUser;
            this.parentUser.userName = this.formUser.userName
            console.log(this.parentUser.userName)
          }, 500);


        }
      })
    }
  }

  ngOnInit() {

  }
}
