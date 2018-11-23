import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { User } from './model/user';
import { Guid } from "guid-typescript";
import { RegisterService } from 'src/app/services/register.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //the instance must be created in the parent not in the child
  @Input('currentLoggedInUser') parentUserToShow: User;
  private formUser: User = new User();
  hide = true;
  isSpinnerShown: boolean;

  constructor(private registerService: RegisterService) { }



  onLogIn() {
    console.log(this.formUser.userName)
    // if (name && email && password) {


    //   this.isSpinnerShown = true

    //   var userToPost = new User();
    //   userToPost.id = Guid.create().toString();
    //   userToPost.email = email = email;
    //   userToPost.password = password;
    //   userToPost.userName = name;
    //   this.registerService.doLogin(userToPost).subscribe(response => {
    //     if (response.status == 201) {
    //       setTimeout(() => {
    //         // this.isSpinnerShown = false
    //         this.parentUserToShow.email = email;
    //         this.parentUserToShow.userName = name;
    //       }, 500);


    //     }
    //   })

    // }

  }



  ngOnInit() {

  }

}
