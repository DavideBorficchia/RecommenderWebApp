import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Guid } from "guid-typescript";
import { RegisterService } from 'src/app/services/register.service';
import { LayoutModule, BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { User } from '../register/model/user';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css', '../register/register.component.css']
})
export class SignUpComponent implements OnInit {
  // @Output('onNeedRegister') linkClicked = new EventEmitter<boolean>();
  // @Output('onSignUpDone') signUpCompleted = new EventEmitter<boolean>();
  formUser: User = new User()
  isSpinnerShown: boolean;
  hide = true;
  constructor(private registerService: RegisterService, private router: Router, public snackBar: MatSnackBar) { }


  onSignUp() {
    if (this.formUser.userName && this.formUser.email && this.formUser.password) {


      this.isSpinnerShown = true


      this.formUser.id = Guid.create().toString();

      this.registerService.doSignUp(this.formUser).subscribe(response => {
        if (response.status == 201) {
          setTimeout(() => {
            this.isSpinnerShown = false
            // this.parentUser = this.formUser;

            sessionStorage["user"] = JSON.stringify(response.body);
            this.snackBar.open("Hi "+response.body.userName +"!", "OK", {
              duration: 3000
            })
            this.router.navigate(["/"])
          }, 500);


        }
      }, (error: HttpErrorResponse) => {
        if (error.status == 422) {
          setTimeout(() => {
            this.isSpinnerShown = false;
            this.snackBar.open(error.error.toString(), "OK", {
              duration: 3000
            })
          }, 500)
        }
      })
    }
  }

  ngOnInit() {

  }
}
