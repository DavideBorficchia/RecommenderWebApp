import { Component, OnInit } from '@angular/core';
import { Guid } from "guid-typescript";
import { RegisterService } from 'src/app/services/register.service';
import { User } from '../register/model/user';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { Nutritionist } from 'src/app/model/nutritionist';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css', '../register/register.component.css']
})
export class SignUpComponent implements OnInit {
  // @Output('onNeedRegister') linkClicked = new EventEmitter<boolean>();
  // @Output('onSignUpDone') signUpCompleted = new EventEmitter<boolean>();
  formUser: User = new User()
  isSpinnerShown: boolean;
  hide = true;
  constructor(private registerService: RegisterService, private router: Router, public snackBar: MatSnackBar) { }


  onSignUp() {
    if (this.formUser.userName && this.formUser.email && this.formUser.password) {


      this.isSpinnerShown = true


      this.formUser.id = Guid.create().toString();
      this.formUser.imageUrl = "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png";
      this.registerService.doSignUp(this.formUser).subscribe(response => {
        if (response.status == 201) {
          setTimeout(() => {
            this.isSpinnerShown = false
            // this.parentUser = this.formUser;
            var userResponse = response.body
            sessionStorage["user"] = JSON.stringify(response.body);
            this.snackBar.open("Hi " + response.body.userName + "!", "OK", {
              duration: 3000
            })
            if (!userResponse.email.includes("nutrizionista")) {
              var user = new User()
              user.id = userResponse["id"]
              user.basicMetabolicRate = userResponse["basicMetabolicRate"]
              user.birthDate = userResponse["birthDate"]
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
        setTimeout(() => {
          this.isSpinnerShown = false;
          this.snackBar.open(error.error.toString(), "OK", {
            duration: 3000
          })
        }, 500)
      })
    }
  }

  ngOnInit() {

  }
}
