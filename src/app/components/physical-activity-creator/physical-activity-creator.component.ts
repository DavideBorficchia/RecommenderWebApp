import { Component, OnInit } from '@angular/core';
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
  constructor(private dietService: DietService, public snackBar: MatSnackBar,
    private registerService: RegisterService,
    private patientService: PatientsService) { }

  ngOnInit() {



    var tempPhysicalActivity = new PhysicalActivity();
    tempPhysicalActivity.name = "Create new activity"
    tempPhysicalActivity.description = "Create a cool rdf physical activity!"
    tempPhysicalActivity.startDate = new Date();
    tempPhysicalActivity.endDate = new Date();
    tempPhysicalActivity.caloriesPerHour = 0

    this.patientService.getSelectedPatientObservable().subscribe(patient => {
      if (patient) {
        console.log(patient)
        this.dietService.getObservableDiet().subscribe(diet => {
          console.log(diet)
          if (diet) {
            this.currentDiet = diet;
            this.currentGoal = new Goal()
            this.currentGoal.weeklyGoal = 0
            this.currentPhysicalActivity = new PhysicalActivity();
            this.currentPhysicalActivity.name = "Jogging"
            this.currentPhysicalActivity.rdfOutput = '';
            this.currentPhysicalActivity.imageUrl = './assets/runner.svg'
            this.currentPhysicalActivity.description = "running is not fun :("
            this.currentPhysicalActivity.startDate = new Date();
            this.currentPhysicalActivity.endDate = new Date();
            this.currentPhysicalActivity.caloriesPerHour = 12.45;
            this.currentPhysicalActivity.endDate.setDate(this.currentPhysicalActivity.startDate.getDate() + 7)
            this.serializedStartDate = new FormControl(this.currentPhysicalActivity.startDate);
            this.serializedEndDate = new FormControl(this.currentPhysicalActivity.endDate)
            this.serializedStartDate.valueChanges.subscribe((value: string | number | Date) => {
              this.currentPhysicalActivity.startDate = new Date(value)
            })
            this.serializedEndDate.valueChanges.subscribe(value => {
              this.currentPhysicalActivity.endDate = new Date(value)
            })
            this.allPhysicalActivities = [];
            this.allPhysicalActivities.unshift(this.currentPhysicalActivity)
            this.allPhysicalActivities.unshift({ id: Guid.create().toString(), rdfOutput: '', dietId: '', startDate: new Date(), description: "beautiful!", endDate: new Date(), caloriesPerHour: 75.356, name: "Treadmill", imageUrl: "./assets/treadmill.svg" })
            this.allPhysicalActivities.unshift({ id: Guid.create().toString(), rdfOutput: '', dietId: '', startDate: new Date(), description: "beautiful!", endDate: new Date(), caloriesPerHour: 123.356, name: "Box", imageUrl: "./assets/box.svg" })
            this.allPhysicalActivityRecords = [{ burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.currentPhysicalActivity.id },
            { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.currentPhysicalActivity.id },
            { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.currentPhysicalActivity.id },
            { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.currentPhysicalActivity.id },
            { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.currentPhysicalActivity.id },
            { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.currentPhysicalActivity.id },
            { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.currentPhysicalActivity.id },
            { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.currentPhysicalActivity.id },
            { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.currentPhysicalActivity.id },
            { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.currentPhysicalActivity.id },
            { burntCalories: Math.random() * 10, date: new Date(), dietId: this.currentDiet.id.toString(), physicalActivityId: this.currentPhysicalActivity.id }];

            this.records = this.allPhysicalActivityRecords.filter(r => r.dietId === this.currentDiet.id)
            console.log(this.records[0].date.getDay() === new Date().getDay())
            console.log(this.records[0].date.getDay().toString() + " " + new Date().getDay().toString())
            Object.assign(this.tempPhysicalActivity, this.currentPhysicalActivity)
            Object.assign(this.tempGoal, this.currentGoal);

            this.columnsSameHeight();
          }
          else {
            this.dietService.getDiet(patient.id).subscribe(response => {
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
              this.dietService.setDiet(diet);
            });



          }
        });
      }
    })



  }
  onPaClicked(pa: PhysicalActivity) {
    if (this.isUpdating) {
      this.snackBar.open("Updating physical activity " + this.currentPhysicalActivity.name + ", wait a bit!", "OK", { duration: 3000 })
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
      Object.assign(this.tempPhysicalActivity, this.currentPhysicalActivity)
    }
  }
  onGoalDeselect() {
    this.currentGoalIsChanging = false;
    if (this.compareGoals()) {

    }

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
      caloriesPerHour: 0, endDate: new Date(), startDate: new Date(), dietId: this.currentDiet.id.toString(), id: Guid.create().toString(), rdfOutput: ''
    }
    Object.assign(this.tempPhysicalActivity, this.currentPhysicalActivity);
    this.isSend = true;

  }
  onNewPAPosted() {

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
