import { Component, OnInit, HostListener } from '@angular/core';
import { Diet } from 'src/app/model/diet';
import { DietService } from 'src/app/services/diet.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { DayOfWeek } from 'src/app/model/daysofweek';
import { Meal } from 'src/app/model/abstarctmeal';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../register/model/user';
import { Food } from 'src/app/model/food';

@Component({
  selector: 'app-diet-creator',
  templateUrl: './diet-creator.component.html',
  styleUrls: ['./diet-creator.component.css']
})
export class DietCreatorComponent implements OnInit {

  currentDietName: String;
  isHistorySelected: boolean;
  isSpinnerShown: boolean;
  isSmall: boolean
  isNameChanging: boolean
  diet: Diet;
  isReady: boolean;
  isDietEditable: boolean;
  dayOfWeekForMobile = [{ day1: 'Monday', day2: 'Tuesday' }, { day1: 'Wednesday', day2: 'Thursaday' }, { day1: 'Friday', day2: 'Saturday' }, { day1: 'Sunday', day2: null }]
  constructor(private dietService: DietService, private router: Router, public snackBar: MatSnackBar) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= 550) {
      this.isSmall = true
    }
    else {
      this.isSmall = false
    }
  }


  createNewDiet() {
    this.isNameChanging = false;
    this.isSpinnerShown = true;
    this.dietService.createNewDiet().subscribe(response => {

      if (response.status < 400) {
        var map: Map<DayOfWeek, Meal[]> = new Map();
        setTimeout(() => {
          Object.keys(response.body.dailyFood).forEach(key => {
            var meals: Meal[] = []
            Object.values(response.body.dailyFood[key]).forEach(mealValue => {
              var meal = new Meal();
              meal.mealType = mealValue["mealType"];
              meals.push(meal)
            })
            map.set(DayOfWeek[key], meals)


          });


          this.diet = new Diet(map, new Map(), response.body.name, response.body.userId)
          this.isReady = true;
          this.isDietEditable = true;
          this.isSpinnerShown = false;






          this.dietService.setDiet(this.diet);
          this.snackBar.open("A new Diet has been added! You can start adding food", "OK",
            {
              duration: 3500
            })
        }, 500)

      }
    }, (error: HttpErrorResponse) => {

      this.isSpinnerShown = false
      if (error.status == 0) {
        this.snackBar.open("Error. Either server is down or your internet is not working", "OK", {
          duration: 3500
        })
      }
      else if (error.status < 500) {
        this.snackBar.open(error.error, "OK",
          {
            duration: 3500
          })
      }
      else {
        console.log(error)
        this.snackBar.open("Error with server", "OK", {
          duration: 3500
        })
      }
    })
  }
  daysOfTheWeek() {

    if (this.isSmall) {
      return Object.values(this.dayOfWeekForMobile)
    }
    else {
      return Object.keys(DayOfWeek);

    }
  }
  onHistoryClicked(event:boolean) {
    this.isHistorySelected = event
  }

  ngOnInit() {
    this.isHistorySelected = false;
    if (window.innerWidth <= 550) {
      this.isSmall = true
    }
    console.log()
    var user = JSON.parse(sessionStorage["user"]) as User;

    // this.diet = new Diet()
    this.dietService.getDiet(user.id).subscribe(response => {

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
            food.fat = value["fat"]
            food.healthy = value["healthy"]
            food.mealTypes = value["mealTypes"]
            food.name = value["name"]
            food.proteins = value["proteins"]
            food.quantity = value["quantity"]
            food.type = value["type"]
            meal.addFood(food);
          })
          meal.mealType = mealValue["mealType"];
          meals.push(meal)
        })
        map.set(DayOfWeek[key], meals)


      });
      var caloriesPerDay: Map<DayOfWeek, number> = new Map()
      Object.keys(response.body.caloriesPerDay).forEach(key => {
        caloriesPerDay.set(DayOfWeek[key], response.body.caloriesPerDay[key])
      })

      this.diet = new Diet(map, caloriesPerDay, response.body.name, response.body.userId)
      this.currentDietName = this.diet.name;
      this.isReady = true;
      this.isDietEditable = true;



      this.dietService.setDiet(this.diet);
    }, (error: HttpErrorResponse) => {
      this.isDietEditable = false;
      if (error.status < 500) {
        this.isReady = true
        console.log(error.error + " " + error.status)
        this.diet = new Diet(new Map(), new Map(), null, user.id);

        this.dietService.setDiet(this.diet)
        this.currentDietName = this.diet.name;


      }
      else {
        this.isReady = true
        console.log(error.error + " " + error.status)
        this.diet = new Diet(new Map(), new Map(), null, user.id);
        // this.diet.dailyFood = this.dietService.createEmptyFoodEntries();
        this.dietService.setDiet(this.diet)
        this.currentDietName = this.diet.name;
      }
    })


  }

}
