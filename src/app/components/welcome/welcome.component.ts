import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, ActivatedRoute, RouterOutlet } from '@angular/router';
import { slideInAnimation } from './animations'

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  animations: [slideInAnimation]
})
export class WelcomeComponent implements OnInit {


  constructor(private route: ActivatedRoute) { }

  getAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }


  ngOnInit(): void {
 
  }
}
