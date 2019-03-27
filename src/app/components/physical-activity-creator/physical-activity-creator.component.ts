import { Component, OnInit, HostListener } from '@angular/core';
import { DietService } from 'src/app/services/diet.service';
import { Diet } from 'src/app/model/diet';
import { User } from '../register/model/user';
import { DayOfWeek } from 'src/app/model/daysofweek';
import { Meal } from 'src/app/model/abstarctmeal';
import { Food } from 'src/app/model/food';
import { Goal } from 'src/app/model/goal';
import { PhysicalActivity } from 'src/app/model/physicalactivity';
import { MatSlideToggleChange, MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import * as $ from 'jquery';
import { PhysicalActivityRecord } from 'src/app/model/physicalactivityrecord';
import { Guid } from 'guid-typescript';
import { RegisterService } from 'src/app/services/register.service';
import { PatientsService } from 'src/app/services/patients.service';
import { PhysicalActivitiesService } from 'src/app/services/physical-activities.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PARENT } from '@angular/core/src/render3/interfaces/view';

@Component({
  selector: 'app-physical-activity-creator',
  templateUrl: './physical-activity-creator.component.html',
  styleUrls: ['./physical-activity-creator.component.css']
})
export class PhysicalActivityCreatorComponent implements OnInit {

  currentPhysicalActivity: PhysicalActivity
  currentGoal: Goal;
  currentDiet: Diet;
  nameIsChanging: boolean = false;
  showRdf: boolean = false;
  descriptionIsChanging = false;
  currentGoalIsChanging = false;
  imageIsClicked = false;
  isUpdating = false;
  isSend = false;
  serializedStartDate: FormControl;
  serializedEndDate: FormControl;
  tempPhysicalActivity: PhysicalActivity = new PhysicalActivity();
  tempGoal: Goal = new Goal();
  allPhysicalActivityRecords: PhysicalActivityRecord[];
  allPhysicalActivities: PhysicalActivity[];
  records: PhysicalActivityRecord[];
  image: string | ArrayBuffer;
  currentPatient: User;
  isAlreadyAdded:boolean;
  constructor(private dietService: DietService, public snackBar: MatSnackBar,
    private registerService: RegisterService,
    private patientService: PatientsService,
    private physicaActivityService: PhysicalActivitiesService) { }

  ngOnInit() {





    this.patientService.getSelectedPatientObservable().subscribe(patient => {
      if (patient) {

        this.allPhysicalActivities = [];
        this.records = [];
        this.currentPatient = patient;
        var defaultPhysicalActivity = new PhysicalActivity();
        defaultPhysicalActivity.name = "Create new activity"
        defaultPhysicalActivity.description = "Create a cool rdf physical activity!"
        defaultPhysicalActivity.startDate = new Date();
        defaultPhysicalActivity.endDate = new Date();
        defaultPhysicalActivity.caloriesPerHour = 0;
        defaultPhysicalActivity.rdfOutput = "";
        defaultPhysicalActivity.id = Guid.create().toString();
        defaultPhysicalActivity.userId = this.currentPatient.id;
        defaultPhysicalActivity.imageUrl = "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png";
        this.dietService.getObservableDiet().subscribe(diet => {
          if (diet && diet.userId === this.currentPatient.id) {
            this.currentDiet = diet;
            this.currentGoal = new Goal()
            this.currentGoal.weeklyGoal = 0
            if(diet.physicalActivity){
              this.currentPhysicalActivity = diet.physicalActivity;
              
              this.isAlreadyAdded = true;
            }
            else{
              this.currentPhysicalActivity = defaultPhysicalActivity;
              this.isAlreadyAdded = false;
            }
            this.physicaActivityService.getAllPhysicalActivities(this.currentPatient.id).subscribe(response => {
              console.log(response)

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
            this.currentPhysicalActivity = diet.physicalActivity;
            if (!this.currentPhysicalActivity) {
              this.currentPhysicalActivity = defaultPhysicalActivity;
            }
            this.serializedStartDate = new FormControl(this.currentPhysicalActivity.startDate);
            this.serializedEndDate = new FormControl(this.currentPhysicalActivity.endDate)
            this.serializedStartDate.valueChanges.subscribe((value: string | number | Date) => {
              if (value !== this.currentPhysicalActivity.startDate) {

                this.currentPhysicalActivity.startDate = new Date(value)
                this.onTextAreaDeselect()
              }

            })
            this.serializedEndDate.valueChanges.subscribe(value => {
              if (value !== this.currentPhysicalActivity.endDate) {

                this.currentPhysicalActivity.endDate = new Date(value)
                this.onTextAreaDeselect()
              }
            })
            Object.assign(this.tempPhysicalActivity, this.currentPhysicalActivity)
            Object.assign(this.tempGoal, this.currentGoal);
            // this.allPhysicalActivities = [];
            // this.allPhysicalActivities.unshift(this.currentPhysicalActivity)
            // this.allPhysicalActivities.unshift({ id: Guid.create().toString(), rdfOutput: '', dietId: '', startDate: new Date(), description: "beautiful!", endDate: new Date(), caloriesPerHour: 75.356, name: "Treadmill", imageUrl: "./assets/treadmill.svg", userId: this.currentPatient.id })
            // this.allPhysicalActivities.unshift({ id: Guid.create().toString(), rdfOutput: '', dietId: '', startDate: new Date(), description: "beautiful!", endDate: new Date(), caloriesPerHour: 123.356, name: "Box", imageUrl: "./assets/box.svg", userId: this.currentPatient.id })
            this.allPhysicalActivityRecords = []
            // this.allPhysicalActivityRecords = [{ burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.tempPhysicalActivity.id },
            // { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.tempPhysicalActivity.id },
            // { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.tempPhysicalActivity.id },
            // { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.tempPhysicalActivity.id },
            // { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.tempPhysicalActivity.id },
            // { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.tempPhysicalActivity.id },
            // { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.tempPhysicalActivity.id },
            // { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.tempPhysicalActivity.id },
            // { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.tempPhysicalActivity.id },
            // { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.tempPhysicalActivity.id },
            // { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.tempPhysicalActivity.id }];

            this.records = []
            // this.records = this.allPhysicalActivityRecords.filter(r => r.dietId === this.currentDiet.id)


            this.columnsSameHeight();
          }
          else {
            this.dietService.getDiet(patient.id)
            .subscribe(response => {
              var map: Map<DayOfWeek, Meal[]> = new Map();

              Object.keys(response.body.dailyFood).forEach(key => {
                var meals: Meal[] = []
                Object.values(response.body.dailyFood[key]).forEach(mealValue => {
                  var meal = new Meal();
                  var foodArray = mealValue["allFoodEntries"];
                  Object.values(foodArray).forEach(value => {
                    var food = new Food();

                    food.calories = value["calories"];
                    food.caloriesPer100 = value["caloriesPer100"]
                    food.carbs = value["carbs"]
                    food.fats = value["fats"]
                    // food.mealTypes = value["mealTypes"]
                    food.name = value["name"]
                    food.proteins = value["proteins"]
                    food.quantity = value["quantity"]
                    food.vitamins = value["vitamins"];
                    food.salts = value["salts"]
                    food.type = value["type"]
                    food.id = value["id"]
                    food.saltsPer100 = value["saltsPer100"]
                    food.vitaminsPer100 = value["vitaminsPer100"]
                    food.fatsPer100 = value["fatsPer100"]
                    food.proteinsPer100 = value["proteinsPer100"]
                    food.carbsPer100 = value["carbsPer100"]
                    food.calories = value["calories"]
                    meal.addFood(food);
                  });
                  meal.mealType = mealValue["mealType"];
                  meals.push(meal)
                });
                map.set(DayOfWeek[key], meals)


              });
              var caloriesPerDay: Map<DayOfWeek, number> = new Map()
              Object.keys(response.body.caloriesPerDay).forEach(key => {
                caloriesPerDay.set(DayOfWeek[key], response.body.caloriesPerDay[key])
              });

              var diet = new Diet(map, caloriesPerDay, response.body.name, response.body.userId)
              diet.totalCalories = response.body.totalCalories
              diet.id = response.body.id
              var currentPhysicalActivity = new PhysicalActivity();

              var value = response.body["physicalActivity"]
              if (value) {
                currentPhysicalActivity.name = value["name"]
                currentPhysicalActivity.rdfOutput = value["rdfOutput"];
                currentPhysicalActivity.imageUrl = value["imageUrl"]
                currentPhysicalActivity.description = value["description"]
                currentPhysicalActivity.startDate = new Date(value["startDate"])
                currentPhysicalActivity.endDate = new Date(value["endDate"])
                currentPhysicalActivity.userId = value["userId"]
                currentPhysicalActivity.caloriesPerHour = value["caloriesPerHour"];
                currentPhysicalActivity.id = value["id"]
              }
              diet.physicalActivity = currentPhysicalActivity;


              this.dietService.setDiet(diet);
            },(error:HttpErrorResponse)=>{
              this.snackBar.open(error.message,"OK",{duration:3000});
              console.log(this.currentDiet)
              
            });



          }
        });
      }
    })



  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth > 960) {
      this.columnsSameHeight();
    }

  }
  onPaClicked(pa: PhysicalActivity) {
    if (this.isUpdating) {
      this.snackBar.open("Updating physical activity " + this.currentPhysicalActivity.name + ", wait a bit!", "OK", { duration: 3000 })
      return
    }
    else {
      this.currentPhysicalActivity = pa;
      this.serializedStartDate = new FormControl(this.currentPhysicalActivity.startDate);
      this.serializedEndDate = new FormControl(this.currentPhysicalActivity.endDate)
      this.isSend = false;
      this.nameIsChanging = false;
      this.descriptionIsChanging = false;
      Object.assign(this.tempPhysicalActivity, this.currentPhysicalActivity)
    }
    this.columnsSameHeight();
    if(this.currentDiet.physicalActivity.id !== this.currentPhysicalActivity.id){
      this.isAlreadyAdded = false;
    }
    else{
      this.isAlreadyAdded = true;
    }
  }
  isToday(record: PhysicalActivityRecord) {
    return record.date.getDay() === new Date().getDay()
  }
  getRecordImage(record: PhysicalActivityRecord) {
    return this.allPhysicalActivities.find(pa => pa.id === record.physicalActivityId).imageUrl;
  }
  onTextAreaDeselect() {
    this.nameIsChanging = false;
    this.descriptionIsChanging = false;
    this.imageIsClicked = false;
    this.compareTempAndCurrentPhysicalActivity()
    if (!this.tempPhysicalActivity.name.includes("Create") && this.isSend) {
      this.isUpdating = true;
      this.physicaActivityService.updatePhysicalActivity(this.currentPhysicalActivity, this.currentPatient.id)
        .subscribe(paResponse => {
          if (paResponse) {
            var updatePhysicalActivity = new PhysicalActivity();
            updatePhysicalActivity.name = paResponse["name"]
            updatePhysicalActivity.rdfOutput = paResponse["rdfOutput"];
            updatePhysicalActivity.imageUrl = paResponse["imageUrl"]
            updatePhysicalActivity.description = paResponse["description"]
            updatePhysicalActivity.startDate = new Date(paResponse["startDate"])
            updatePhysicalActivity.endDate = new Date(paResponse["endDate"])
            updatePhysicalActivity.caloriesPerHour = paResponse["caloriesPerHour"];
            updatePhysicalActivity.id = paResponse["id"];
            updatePhysicalActivity.userId = paResponse["userId"]
            this.currentPhysicalActivity = updatePhysicalActivity;
            Object.assign(this.tempPhysicalActivity, this.currentPhysicalActivity)
            this.isSend = false;
            this.isUpdating = false
            const index = this.allPhysicalActivities.indexOf(this.currentPhysicalActivity);

            if (index >= 0) {
              this.allPhysicalActivities.splice(index, 1);
              this.columnsSameHeight()
              this.allPhysicalActivities.push(this.currentPhysicalActivity)
  
            }
            else {
              this.allPhysicalActivities.push(this.currentPhysicalActivity)
            }
            this.snackBar.open(this.currentPhysicalActivity.name +" successfully updated!","OK",{duration:3000})
          }
        })

    }
    else if (this.tempPhysicalActivity.name.includes("Create")) {
      this.isSend = true;
      return
    }
    else {
      this.isSend = false;

    }
  }
  onGoalDeselect() {
    this.currentGoalIsChanging = false;
    if (this.compareGoals()) {

    }

  }
  getPhysicalActivityName(activityId: string) {
    return this.allPhysicalActivities.find(pa => pa.id === activityId).name;

  }
  onToggleChange(event: MatSlideToggleChange) {
    if (event.checked) {
      this.showRdf = true;

    }
    else {
      this.showRdf = false
    }

    this.columnsSameHeight();
  }
  onImageLoad() {
    this.columnsSameHeight()
  }

  onNewPAClicked() {
    this.currentPhysicalActivity = {
      name: "Create new activity", description: "Create a new Physical Actvity", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png",
      caloriesPerHour: 0, endDate: new Date(), startDate: new Date(), dietId: this.currentDiet.id.toString(), id: Guid.create().toString(), rdfOutput: '', userId: this.currentPatient.id
    }
    Object.assign(this.tempPhysicalActivity, this.currentPhysicalActivity);
    this.isSend = true;
    this.isAlreadyAdded = false;
    this.columnsSameHeight();

  }
  onNewPAPosted() {

    var paTosend = this.currentPhysicalActivity;
    this.compareTempAndCurrentPhysicalActivity();
    if (paTosend.name.includes("Create")) {
      this.snackBar.open("Change name before confirming creation", "OK", { duration: 3000 })
      return;
    }
    var paPresent = this.allPhysicalActivities.find(pa => pa.id === paTosend.id);
    //update
    if (paPresent && this.allPhysicalActivities.find(pa => pa.name !== paPresent.name)) {

      this.isUpdating = true;
      console.log(paPresent)
      this.physicaActivityService.updatePhysicalActivity(this.currentPhysicalActivity, this.currentPatient.id)
        .subscribe(paResponse => {
          console.log(paResponse);
          if (paResponse) {
            var updatePhysicalActivity = new PhysicalActivity();
            updatePhysicalActivity.name = paResponse["name"]
            updatePhysicalActivity.rdfOutput = paResponse["rdfOutput"];
            updatePhysicalActivity.imageUrl = paResponse["imageUrl"]
            updatePhysicalActivity.description = paResponse["description"]
            updatePhysicalActivity.startDate = new Date(paResponse["startDate"])
            updatePhysicalActivity.endDate = new Date(paResponse["endDate"])
            updatePhysicalActivity.caloriesPerHour = paResponse["caloriesPerHour"];
            updatePhysicalActivity.id = paResponse["id"]
            updatePhysicalActivity.userId = paResponse["userId"]
            this.currentPhysicalActivity = updatePhysicalActivity;
            Object.assign(this.tempPhysicalActivity, this.currentPhysicalActivity)
            this.isSend = false;
            this.snackBar.open(this.currentPhysicalActivity.name +" successfully updated!","OK",{duration:3000})
            const index = this.allPhysicalActivities.indexOf(this.tempPhysicalActivity);

            if (index >= 0) {
              this.allPhysicalActivities.splice(index, 1);
              this.columnsSameHeight()
              this.allPhysicalActivities.push(this.currentPhysicalActivity)
  
            }
            else {
              this.allPhysicalActivities.push(this.currentPhysicalActivity)
            }
          }
        }, (error: HttpErrorResponse) => {
          this.isUpdating = false;
          this.snackBar.open(error.message, "OK", { duration: 3000 })
        })
      return

    }
    if (paPresent && this.allPhysicalActivities.find(pa => pa.name === paPresent.name)) {
      this.snackBar.open("There is already an activity with name " + paPresent.name + " in the list", "OK", { duration: 3000 })
      return
    }
    //post
    this.isUpdating = true
    this.physicaActivityService.createNewPhysicalActivity(paTosend, this.currentPatient.id)
      .subscribe(response => {
        console.log("ciao")
        console.log(response)
        var postedPa = new PhysicalActivity();
        postedPa.id = response["id"]
        postedPa.name = response["name"]
        postedPa.imageUrl = response["imageUrl"]
        postedPa.caloriesPerHour = response["caloriesPerHour"]
        postedPa.description = response["description"]
        postedPa.dietId = response["dietId"]
        postedPa.endDate = new Date(response["endDate"])
        postedPa.startDate = new Date(response["startDate"])
        postedPa.rdfOutput = response["rdfOutput"]
        postedPa.userId = response["userId"]
        this.isUpdating = false;
        this.currentPhysicalActivity = postedPa
        Object.assign(this.tempPhysicalActivity, this.currentPhysicalActivity);
        this.allPhysicalActivities.unshift(postedPa)
        this.snackBar.open(this.currentPhysicalActivity.name +" successfully created!","OK",{duration:3000})

      }, (error: HttpErrorResponse) => {
        this.isUpdating = false;
        this.snackBar.open(error.message, "OK", { duration: 3000 })
      })


  }
  onAddNewCurrentPhysicalActivity(){
    var dietToSend = this.currentDiet;
    dietToSend.physicalActivity = this.currentPhysicalActivity;
    this.dietService.updateCurrentPhysicalActivity(dietToSend) .subscribe(response => {
      console.log(response)
      
      var map: Map<DayOfWeek, Meal[]> = new Map();

      Object.keys(response.body.dailyFood).forEach(key => {
        var meals: Meal[] = []
        Object.values(response.body.dailyFood[key]).forEach(mealValue => {
          var meal = new Meal();
          var foodArray = mealValue["allFoodEntries"];
          Object.values(foodArray).forEach(value => {
            var food = new Food();

            food.calories = value["calories"];
            food.caloriesPer100 = value["caloriesPer100"]
            food.carbs = value["carbs"]
            food.fats = value["fats"]
            // food.mealTypes = value["mealTypes"]
            food.name = value["name"]
            food.proteins = value["proteins"]
            food.quantity = value["quantity"]
            food.vitamins = value["vitamins"];
            food.salts = value["salts"]
            food.type = value["type"]
            food.id = value["id"]
            food.saltsPer100 = value["saltsPer100"]
            food.vitaminsPer100 = value["vitaminsPer100"]
            food.fatsPer100 = value["fatsPer100"]
            food.proteinsPer100 = value["proteinsPer100"]
            food.carbsPer100 = value["carbsPer100"]
            food.calories = value["calories"]
            meal.addFood(food);
          });
          meal.mealType = mealValue["mealType"];
          meals.push(meal)
        });
        map.set(DayOfWeek[key], meals)


      });
      var caloriesPerDay: Map<DayOfWeek, number> = new Map()
      Object.keys(response.body.caloriesPerDay).forEach(key => {
        caloriesPerDay.set(DayOfWeek[key], response.body.caloriesPerDay[key])
      });

      var diet = new Diet(map, caloriesPerDay, response.body.name, response.body.userId)
      diet.totalCalories = response.body.totalCalories
      diet.id = response.body.id
      var currentPhysicalActivity = new PhysicalActivity();

      var value = response.body["physicalActivity"]
      if (value) {
        currentPhysicalActivity.name = value["name"]
        currentPhysicalActivity.rdfOutput = value["rdfOutput"];
        currentPhysicalActivity.imageUrl = value["imageUrl"]
        currentPhysicalActivity.description = value["description"]
        currentPhysicalActivity.startDate = new Date(value["startDate"])
        currentPhysicalActivity.endDate = new Date(value["endDate"])
        currentPhysicalActivity.userId = value["userId"]
        currentPhysicalActivity.caloriesPerHour = value["caloriesPerHour"];
        currentPhysicalActivity.id = value["id"]
      }

      diet.physicalActivity = currentPhysicalActivity;

      this.dietService.setDiet(diet);
      this.snackBar.open("Current physical activity for diet "+diet.physicalActivity.name+" updated!","OK",{duration:3000})
    });
  }

  private columnsSameHeight() {
    if (window.innerWidth > 960) {
      setTimeout(() => {
        var physicalactivityCard = $("#right_content").outerHeight();
        var sideContent = document.getElementById("left_content")
        if (sideContent != null) {
          sideContent.style.height = physicalactivityCard.toString() + "px";

        }
      }, 0)
    }
  }
  private compareTempAndCurrentPhysicalActivity() {
    console.log(this.tempPhysicalActivity)
    if (this.currentPhysicalActivity.name !== this.tempPhysicalActivity.name) {
      this.isSend = true;
      return
    }
    if (this.currentPhysicalActivity.description !== this.tempPhysicalActivity.description) {
      this.isSend = true;
      return;
    }
    if (this.currentPhysicalActivity.startDate !== this.tempPhysicalActivity.startDate) {
      this.isSend = true;
      return;
    }
    if (this.currentPhysicalActivity.endDate !== this.tempPhysicalActivity.endDate) {
      this.isSend = true;
      return;
    }
    if (this.currentPhysicalActivity.caloriesPerHour !== this.tempPhysicalActivity.caloriesPerHour) {
      this.isSend = true;
      return
    }
    if (this.currentPhysicalActivity.imageUrl !== this.tempPhysicalActivity.imageUrl) {
      this.isSend = true;
      return
    }
    else {
      this.isSend = false;
    }

  }
  private compareGoals() {
    if (this.currentGoal.weeklyGoal !== this.tempGoal.weeklyGoal) {
      return true;
    }
    return false;
  }
}
