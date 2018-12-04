import { Component, OnInit, ViewChild, Output, EventEmitter, HostListener } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatSidenav } from '@angular/material';
// import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Output() sidenavToggled = new EventEmitter<boolean>();

  isMobile = false;
  constructor() { }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= 600) {
      this.isMobile = true;
    }
  }
  ngOnInit() {
    if (innerWidth <= 600) {
      this.isMobile = true;
    }
    console.log("ismobile "+this.isMobile)
  }

}
