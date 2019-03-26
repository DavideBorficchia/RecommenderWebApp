import { Component, OnInit, ViewChild, Output, EventEmitter, HostListener } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenav } from '@angular/material';
import { User } from '../register/model/user';
import { RegisterService } from 'src/app/services/register.service';
// import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Output() sidenavToggled = new EventEmitter<boolean>();

  isMobile = false;
  userName: string;
  isNutritionist = false;
  constructor(private registerService: RegisterService) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= 600) {
      this.isMobile = true;
    }
    else{
      this.isMobile = false;
    }
  }

  ngOnInit() {
    if (innerWidth <= 600) {
      this.isMobile = true;
    }
    else{
      this.isMobile = false;
    }
    this.registerService.getUserObservable()
      .subscribe(user => {
        if (user) {
          this.userName = user.id;
          this.isNutritionist = false;
        }
      
      })
      this.registerService.getNutritionistObservable()
      .subscribe(nutritionist=>{
        if(nutritionist){
          this.userName = nutritionist.userName
          this.isNutritionist = true;
        }
      })

  }

}
