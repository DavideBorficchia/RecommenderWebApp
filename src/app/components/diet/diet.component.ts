import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Diet } from 'src/app/model/diet';
import { DietService } from 'src/app/services/diet.service';
import { DayOfWeek } from 'src/app/model/daysofweek';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../register/model/user';
import { MatSnackBar } from '@angular/material';
import { Meal } from 'src/app/model/abstarctmeal';
import { Food } from 'src/app/model/food';
import { Router } from '@angular/router';
import { DietHistory } from 'src/app/model/diethistory';
import { RegisterService } from 'src/app/services/register.service';
import { FoodRecommenderService } from 'src/app/services/food-recommender.service';



@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.css']
})
export class DietComponent implements OnInit {

  currentDietName: String;
  isHistorySelected: boolean;
  isSpinnerShown: boolean;
  isSmall: boolean
  isNameChanging: boolean
  diet: Diet;
  isReady: boolean;
  isDietEditable: boolean;
  isVerySmall: boolean
  isDietSelected: boolean = true;
  isSuggestionsSelected: boolean;

  dayOfWeekForMobile = [{ day1: 'Monday', day2: 'Tuesday' }, { day1: 'Wednesday', day2: 'Thursaday' }, { day1: 'Friday', day2: 'Saturday' }, { day1: 'Sunday', day2: null }]
  constructor(private dietService: DietService,
    private registerService: RegisterService,
    private router: Router,
    public snackBar: MatSnackBar,
    private foodService:FoodRecommenderService) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= 550) {
      this.isVerySmall = true

    }
    else {
      this.isVerySmall = false;
    }
    if (event.target.innerWidth <= 959) {
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
          this.diet.timeStamp = response.body.timeStamp
          this.isReady = true;
          this.isDietEditable = true;
          this.isSpinnerShown = false;






          this.dietService.setDiet(this.diet);
          this.dietService.addDietHistory(new DietHistory(this.diet.name, this.diet.timeStamp.toString(),this.diet.totalCalories))
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

    if (this.isVerySmall) {
      return Object.values(this.dayOfWeekForMobile)
    }
    else {
      return Object.keys(DayOfWeek);

    }
  }
  onHistoryClicked() {
    this.isDietSelected = false;
    this.isSuggestionsSelected = false;
    this.isHistorySelected = true;
  }

  onSuggestionsClicked() {
    this.isDietSelected = false;
    this.isHistorySelected = false;
    this.isSuggestionsSelected = true;
  }
  onDietSelected() {
    this.isDietSelected = true;
    this.isHistorySelected = false;
    this.isSuggestionsSelected = false;

  }
  ngOnInit() {
    this.isHistorySelected = false;


    if (window.innerWidth <= 550) {
      this.isVerySmall = true
    }
    else {
      this.isVerySmall = false;
    }
    if (window.innerWidth <= 959) {
      this.isSmall = true
    }

    // this.diet = new Diet()
    this.registerService.getUserObservable().subscribe(userIdChange => {
      console.log("userid has changed "+userIdChange)
      var userId = userIdChange

      this.dietService.getDiet(userId).subscribe(response => {

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
              console.log(value)
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

        var diet = new Diet(map, caloriesPerDay, response.body.name, response.body.userId)
        // this.currentDietName = diet.name;
        this.isReady = true;
        this.isDietEditable = true;
        this.dietService.setDiet(diet);
        this.dietService.getObservableDiet().subscribe(dietChange => {
          this.diet = dietChange

        })




      }, (error: HttpErrorResponse) => {
        this.isDietEditable = false;
        if (error.status < 500) {
          this.isReady = true
          console.log(error.error + " " + error.status)
          this.diet = new Diet(new Map(), new Map(), null, userId);

          this.dietService.setDiet(this.diet)
          this.currentDietName = this.diet.name;


        }
        else {
          this.isReady = true
          console.log(error.error + " " + error.status)
          this.diet = new Diet(new Map(), new Map(), null, userId);
          // this.diet.dailyFood = this.dietService.createEmptyFoodEntries();
          this.dietService.setDiet(this.diet)
          this.currentDietName = this.diet.name;
        }
      })
      this.foodService.getAllFoodFromServer();
    })



  }

}
