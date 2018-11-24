import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { User } from '../register/model/user';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css', '../register/register.component.css']
})
export class SignUpComponent implements OnInit {

  formUser: User = new User()
  hide: boolean;
  isSpinnerShown:boolean;
  constructor() { }

  onLogIn(){

  }

  ngOnInit() {
   
  }
}
