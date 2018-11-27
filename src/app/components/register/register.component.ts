import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { User } from './model/user';
import { Guid } from "guid-typescript";
import { RegisterService } from 'src/app/services/register.service';
import { LayoutModule, BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //the instance must be created in the parent not in the child
  formUser: User = new User();
  isSpinnerShown: boolean;
  hide= true;
  constructor(private registerService: RegisterService, private router:Router,public snackBar:MatSnackBar) {

  }



  onLogIn() {

    // console.log(this.formUser.userName)

    if (this.formUser.email && this.formUser.password) {


      this.isSpinnerShown = true


      this.formUser.id = Guid.create().toString();

      this.registerService.doLogin(this.formUser.email).subscribe(response => {
        if (response.status == 200) {
          setTimeout(() => {
            this.isSpinnerShown = false
            // this.parentUser = this.formUser;
            var userResponse = response.body;
            console.log(userResponse)
            sessionStorage["user"]=JSON.stringify(response.body.id);
            this.router.navigate(["/"])

          }, 500);


        }
       
      }, (error:HttpErrorResponse)=>{
        console.log("error "+error.message)

        if(error.status==422){
          setTimeout(() => {

            this.isSpinnerShown = false
           
            this.snackBar.open(error.error.toString(),"OK", {
              duration:3000
            })
          }, 500);
        }
      })

    }

  }
  ngOnInit() {
  }

}
