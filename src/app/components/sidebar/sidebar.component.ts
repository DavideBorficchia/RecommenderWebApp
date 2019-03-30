import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { MatSidenav, MatSnackBar, MatAutocompleteSelectedEvent } from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { User } from '../register/model/user';
import { RegisterService } from 'src/app/services/register.service';
import { FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Nutritionist } from 'src/app/model/nutritionist';
import { PatientsService } from 'src/app/services/patients.service';
import { DatePipe } from '@angular/common';
import { Goal } from 'src/app/model/goal';
import { GoalsAndRecordsService } from 'src/app/services/goals-and-records.service';
import { DietService } from 'src/app/services/diet.service';
import { PhysicalActivitiesService } from 'src/app/services/physical-activities.service';
import { PhysicalActivity } from 'src/app/model/physicalactivity';

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
  currentPatient: User;
  isNutritionist = false;
  currentNutritionist: Nutritionist;
  isOver: boolean;
  date = new FormControl(new Date());
  allUsers: User[];
  userImage = false;
  serializedDate = new FormControl((new Date()).toISOString());
  nutritionistPatients: User[];
  allFilteredUsers: User[];
  currentUserGoal: Goal;
  allPhysicalActivities: PhysicalActivity[];
  constructor(
    private service: RegisterService,
    public snackBar: MatSnackBar,
    private patientService: PatientsService,
    private datePipe: DatePipe,
    private goalService: GoalsAndRecordsService,
    private dietService: DietService,
    private physicalService: PhysicalActivitiesService) {

  }
  compareForm() {
    var user = JSON.parse(sessionStorage["user"]) as User;

    if (user.birthDate !== this.currentUser.birthDate
      || user.gender !== this.currentUser.gender
      || user.height !== this.currentUser.height
      || user.weight !== this.currentUser.weight
      || user.imageUrl !== this.currentUser.imageUrl) {

      this.isUserUpdated = false;
      this.userImage = false;
    }
    else {
      this.isUserUpdated = true;
      this.userImage = false;
    }

  }
  onClick() {
    this.userImage = true;
  }
  toggleSideBar() {
    this.sidenav.toggle()
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= 600) {
      this.isOver = true;
    }
  }
  updateUserDetails() {
    this.isSpinnerShown = true;

    this.service.updateDetails(this.currentUser).subscribe(response => {
      if (response.status == 200) {
        setTimeout(() => {
          this.isSpinnerShown = false;
          this.isUserUpdated = true;
          sessionStorage["user"] = JSON.stringify(response.body)
          this.snackBar.open("Your personal information have been updated", "OK", {
            duration: 3000
          })

        })
      }
    }, (error: HttpErrorResponse) => {
      if (error.status < 500) {
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
    this.service.getUserObservable().subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.dietService.getObservableDiet().subscribe(diet => {
          if (diet) {
            this.goalService.getCurrentGoalForDiet(diet.id.toString(), this.currentUser.id).subscribe(goalResponse => {
              if (goalResponse) {
                var goal = new Goal()
                goal.adherence = goalResponse["adherence"]
                goal.id = goalResponse["id"];
                goal.physicalActivityId = goalResponse["physicalActivityId"];
                goal.userId = goalResponse["userId"];
                goal.weeklyGoal = goalResponse["weeklyGoal"];
                goal.dietId = goalResponse["dietId"];
                this.currentUserGoal = goal;
              }
              this.physicalService.getAllPhysicalActivities(this.currentUser.id).subscribe(response => {
                if (response) {
                  this.allPhysicalActivities = [];
                  response.forEach(value => {
                    var physicalActivity = new PhysicalActivity();
                    physicalActivity.name = value["name"];
                    physicalActivity.rdfOutput = value["rdfOutput"];
                    physicalActivity.imageUrl = value["imageUrl"];
                    physicalActivity.description = value["description"]
                    physicalActivity.startDate = new Date(value["startDate"]);
                    physicalActivity.endDate = new Date(value["endDate"]);
                    physicalActivity.caloriesPerHour = value["caloriesPerHour"];
                    physicalActivity.userId = value["userId"]
                    physicalActivity.id = value["id"]
                    this.allPhysicalActivities.push(physicalActivity)
                  })
                }
              })

            })
          }
        })
      }
    })
    this.isNutritionist = true;
    this.service.getNutritionistObservable().subscribe(nutritionist => {

      if (nutritionist) {
        this.isNutritionist = true;
        this.currentNutritionist = nutritionist;
        this.currentPatient = this.currentNutritionist.currentPatient;

        this.nutritionistPatients = []
        Object.assign(this.nutritionistPatients, this.currentNutritionist.patients);
        this.patientService.getAllPatients()
          .subscribe(response => {
            this.allUsers = []
            Object.keys(response).forEach(key => {
              var userResponse = response[key];
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
              this.allUsers.push(user);

            })
            this.allFilteredUsers = this.allUsers.filter(user => !this.nutritionistPatients.includes(user))

          })

      }
    })



    if (!this.isNutritionist && this.currentUser.birthDate && this.currentUser.gender && this.currentUser.height && this.currentUser.weight) {
      this.isUserUpdated = true;
    }


  }
  setCurrentPatient(event: MatAutocompleteSelectedEvent) {
    var userName: string = event.option.value
    var user = this.allFilteredUsers.find(u => u.userName === userName);
    if (user) {

      //nutritionists on server are still normal users. In order to update a nutritionist patientsId field, i need to create
      //a fake user with only the fields of interest.
      //Later on a nutritionists microservice will be needed

      var temp = this.currentNutritionist.patients.find(u => u.id === user.id)
      if (temp) {
        this.snackBar.open("Patient " + user.userName + " already present!", "OK", { duration: 3000 })
        return;
      }
      // this.currentNutritionist.patients.unshift(user)
      var nutritionistToUpdate = JSON.parse(sessionStorage["user"]) as User;
      nutritionistToUpdate.patients = this.currentNutritionist.patients;
      nutritionistToUpdate.patients.unshift(user)
      nutritionistToUpdate.currentPatient = user;


      this.service.updateDetails(nutritionistToUpdate)
        .subscribe(response => {
          var responseNutritionist = response.body;
          var nutritionist = new Nutritionist();
          nutritionist.email = responseNutritionist["email"];
          nutritionist.id = responseNutritionist["id"];
          nutritionist.patients = []
          Object.values(responseNutritionist["patients"]).forEach(value => {
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
          var currentPatient = responseNutritionist["currentPatient"]
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
            nutritionist.userName = currentPatient["userName"];
          }
          nutritionist.userName = responseNutritionist["userName"]
     
          sessionStorage["user"] = JSON.stringify(nutritionist)
          this.service.setNutritionistBehavior(nutritionist)
          this.currentPatient = user;
          this.patientService.setCurrentPatient(this.currentPatient)
        })



    }



  }

  getPhysicalActivityImage() {
    return this.allPhysicalActivities.find(pa => pa.id === this.currentUserGoal.physicalActivityId).imageUrl;
  }

  onPatientClicked(patient: User) {
    if (patient) {

      //nutritionists on server are still normal users. In order to update a nutritionist patientsId field, i need to create
      //a fake user with only the fields of interest.
      //Later on a nutritionists microservice will be needed


      if (patient.id === this.currentNutritionist.currentPatient.id) {
        this.snackBar.open("Patient " + patient.userName + " already in exam!", "OK", { duration: 3000 })
        return;
      }
      // this.currentNutritionist.patients.unshift(user)
      var nutritionistToUpdate = JSON.parse(sessionStorage["user"]) as User;
      nutritionistToUpdate.patients = this.currentNutritionist.patients;
      nutritionistToUpdate.currentPatient = patient;

      this.service.updateDetails(nutritionistToUpdate)
        .subscribe(response => {
          var responseNutritionist = response.body;
          var nutritionist = new Nutritionist();
          nutritionist.email = responseNutritionist["email"];
          nutritionist.id = responseNutritionist["id"];
          nutritionist.patients = []
          Object.values(responseNutritionist["patients"]).forEach(value => {
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
          var currentPatient = responseNutritionist["currentPatient"]
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
            nutritionist.userName = currentPatient["userName"];
          }
          nutritionist.userName = responseNutritionist["userName"]

          sessionStorage["user"] = JSON.stringify(nutritionist)
          this.service.setNutritionistBehavior(nutritionist)
          this.currentPatient = patient;
          this.patientService.setCurrentPatient(this.currentPatient)
        })



    }

  }


}
