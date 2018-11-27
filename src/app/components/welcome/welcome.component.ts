import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute, RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations'

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  animations:[slideInAnimation]
})
export class WelcomeComponent implements OnInit {

  isSignUpDone: boolean
  isLoginDone: boolean;
  needRegister = true;
  constructor(private route: ActivatedRoute) { }
  
  getAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  onSignUpDone(event: boolean) {
    console.log("successful sign up " + event)
    this.isSignUpDone = event
  }
  onLoginDone(event: boolean) {
    this.isLoginDone = event
  }
  onNeedRegister(event: boolean) {
    this.needRegister = event;
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      // this.needRegister = queryParams["frocio"];
    })
  }
}
