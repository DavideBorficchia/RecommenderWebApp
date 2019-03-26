import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { User } from './model/user';
import { Guid } from "guid-typescript";
import { RegisterService } from 'src/app/services/register.service';
import { LayoutModule, BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Nutritionist } from 'src/app/model/nutritionist';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  //the instance must be created in the parent not in the child
  formUser: User = new User();
  isSpinnerShown: boolean;
  hide = true;
  constructor(private registerService: RegisterService, private router: Router, public snackBar: MatSnackBar) {

  }



  onLogIn() {

    // console.log(this.formUser.userName)

    if (this.formUser.email && this.formUser.password) {


      this.isSpinnerShown = true


      this.formUser.id = Guid.create().toString();


      this.registerService.doLogin(this.formUser.email).subscribe(response => {
        if (response.status == 200) {
          setTimeout(() => {
            this.isSpinnerShown = false
            // this.parentUser = this.formUser;
            var userResponse = response.body;

            this.snackBar.open("Hi " + response.body.userName + "!", "OK", {
              duration: 3000
            })
            if (!userResponse.email.includes("nutrizionista")) {
              var user = new User()
              user.id = userResponse["id"]
              user.basicMetabolicRate = userResponse["basicMetabolicRate"]
              user.birthDate = new Date(userResponse["birthDate"])
              user.email = userResponse["email"]
              user.gender = userResponse["gender"]
              user.height = userResponse["height"]
              user.userName = userResponse["userName"]
              user.weight = userResponse["weight"]
              user.imageUrl = userResponse["imageUrl"]

              sessionStorage["user"] = JSON.stringify(user);
              this.registerService.setUserBehavior(user)
              this.router.navigate(["/"])
            }
            else {
              var nutritionist = new Nutritionist();
              nutritionist.email = userResponse["email"];
              nutritionist.id = userResponse["id"];
              nutritionist.patients = []
              Object.values(userResponse["patients"]).forEach(value => {
                var patient = new User();
                patient.id = value["id"]
                patient.basicMetabolicRate = value["basicMetabolicRate"]
                patient.birthDate = new Date(value["birthDate"])
                patient.email = value["email"]
                patient.gender = value["gender"]
                patient.height = value["height"]
                patient.userName = value["userName"]
                patient.weight = value["weight"]
                patient.imageUrl = value["imageUrl"]
                nutritionist.patients.push(patient)
              })
              var currentPatient = userResponse["currentPatient"]
              if (currentPatient) {
                nutritionist.currentPatient = new User();

                nutritionist.currentPatient.id = currentPatient["id"]
                nutritionist.currentPatient.basicMetabolicRate = currentPatient["basicMetabolicRate"]
                nutritionist.currentPatient.birthDate = new Date(currentPatient["birthDate"])
                nutritionist.currentPatient.email = currentPatient["email"]
                nutritionist.currentPatient.gender = currentPatient["gender"]
                nutritionist.currentPatient.height = currentPatient["height"]
                nutritionist.currentPatient.userName = currentPatient["userName"]
                nutritionist.currentPatient.weight = currentPatient["weight"]
                nutritionist.currentPatient.imageUrl = currentPatient["imageUrl"]
              }
              nutritionist.userName = userResponse["userName"];
              sessionStorage["user"] = JSON.stringify(nutritionist);

              this.registerService.setNutritionistBehavior(nutritionist);
              this.router.navigate(["/"])

            }


          }, 500);


        }

      }, (error: HttpErrorResponse) => {
        console.log("error " + error.message)

        if (error.status == 422) {
          setTimeout(() => {

            this.isSpinnerShown = false

            this.snackBar.open(error.error.toString(), "OK", {
              duration: 3000
            })
          }, 500);
        }
        else {
          setTimeout(() => {

            this.isSpinnerShown = false

            this.snackBar.open(error.error.toString(), "OK", {
              duration: 3000
            })
          }, 500);
        }
      })

    }

  }
  ngOnInit() {
  }

}
