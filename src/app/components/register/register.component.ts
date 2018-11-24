import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { User } from './model/user';
import { Guid } from "guid-typescript";
import { RegisterService } from 'src/app/services/register.service';
import { LayoutModule, BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //the instance must be created in the parent not in the child
  @Input() parentUser: User;
  @Output('onNeedRegister') linkClicked = new EventEmitter<boolean>();
  formUser: User = new User();
  hide = true;
  isSpinnerShown: boolean;
  isSmartphone: boolean;


  constructor(private registerService: RegisterService, private breakpointObserver: BreakpointObserver) {

  }



  onLogIn() {

    // console.log(this.formUser.userName)

    if (this.formUser.userName && this.formUser.email && this.formUser.password) {


      this.isSpinnerShown = true


      this.formUser.id = Guid.create().toString();

      this.registerService.doLogin(this.formUser).subscribe(response => {
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
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      if (result.matches && this.breakpointObserver.isMatched('(max-width:300px)')) {
        this.isSmartphone = true;

      }
      else {
        this.isSmartphone = false
      }
      console.log(this.isSmartphone)
    })
  }

}
