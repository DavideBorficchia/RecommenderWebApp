import { Component, OnInit } from '@angular/core';
import { User } from './components/register/model/user';
import { Router, NavigationStart, RouterOutlet } from '@angular/router';
import { slideInAnimation } from '../animations';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations:[slideInAnimation]
})
export class AppComponent implements OnInit {

  currentLoggedInUser: User = new User();
  needRegister;
  constructor(private router: Router) { }

  onNeedRegister(event: boolean) {
    console.log(event)
    this.needRegister = event;
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log(event.url)
        if (event.url === "/") {
          this.needRegister = false;
        }
        if (event.url === "/(test:register)") {
          this.needRegister = true;
        }

      }
    })
  }




}
