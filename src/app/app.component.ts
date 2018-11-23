import { Component, OnInit } from '@angular/core';
import { User } from './components/register/model/user';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  currentLoggedInUser: User = new User();
  needRegister = false;
  constructor() { }

  ngOnInit(): void {
  }

  onNeedRegisterClick(event:boolean){
    console.log(event)
    this.needRegister = event;
  }


}
