import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { User } from '../register/model/user';
import { RegisterService } from 'src/app/services/register.service';
import { FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

export interface GenderOption {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  @ViewChild('sidenav') private sidenav: MatSidenav;

  options: GenderOption[] = [
    { value: 'male', viewValue: "Male" },
    { value: 'female', viewValue: "Female" }
  ]
  isUserUpdated: boolean;
  isSpinnerShown: boolean
  currentUser: User
  isOver: boolean;
  date = new FormControl(new Date());
  serializedDate = new FormControl((new Date()).toISOString());
  constructor(
    private service: RegisterService,
    public snackBar: MatSnackBar) {

  }

  toggleSideBar() {
    console.log("SIDENAV TOGGLED")
    this.sidenav.toggle()
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= 600) {
      this.isOver = true;
    }
  }
  updateUserDetails() {
    console.log(this.currentUser)
    this.isSpinnerShown = true;
    this.service.updateDetails(this.currentUser).subscribe(response => {
      if (response.status == 200) {
        setTimeout(() => {
          this.isSpinnerShown = false;
          this.isUserUpdated = true;
          sessionStorage["user"] = JSON.stringify(this.currentUser)
          this.snackBar.open("Your personal information have been updated", "OK", {
            duration: 3000
          })

        })
      }
    }, (error: HttpErrorResponse) => {
      console.log(error.status)
      if ( error.status<500) {
        setTimeout(() => {

          this.isSpinnerShown = false

          this.snackBar.open(error.error.toString(), "OK", {
            duration: 3000  
          })
        }, 500);
      }
      else {
        console.log("error server")
        setTimeout(() => {

          this.isSpinnerShown = false

          this.snackBar.open("Server Internal Error. Try later", "OK", {
            duration: 3000
          })
        }, 500);

      }

    })
  }
  ngOnInit() {
    if (innerWidth <= 600) {
      this.isOver = true;
    }
    this.currentUser = JSON.parse(sessionStorage["user"])
    if (this.currentUser.birthDate && this.currentUser.gender && this.currentUser.height && this.currentUser.weight) {
      this.isUserUpdated = true;
    }
  }

}
