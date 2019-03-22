import { Component, OnInit, Input, HostListener, ViewChild } from '@angular/core';
import { MealType } from 'src/app/model/mealtypes';

import { createMeta } from '@angular/platform-browser/src/browser/meta';
import { FoodType } from 'src/app/model/foodtypes';
import { Food } from 'src/app/model/food';
import { MatSelectChange, MatSnackBar, MatSelect, MatDialog } from '@angular/material';
import { DietService } from 'src/app/services/diet.service';
import { DayOfWeek } from 'src/app/model/daysofweek';
import { from } from 'rxjs/internal/observable/from';
import { BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FoodAlreadyAddedException } from 'src/app/model/foodalreadyaddedexception';
import { Meal } from 'src/app/model/abstarctmeal';
import { FoodRecommenderService } from 'src/app/services/food-recommender.service';
import { Diet } from 'src/app/model/diet';
import { User } from '../register/model/user';
import { InformationDialogComponent } from '../information-dialog/information-dialog.component';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit {

  @ViewChild('select') matSelect: MatSelect
  @Input() mealType: MealType;
  @Input() day: DayOfWeek;
  meal: Meal;
  displayedColumns: string[] = ['name', 'type']
  isOver: boolean
  foodToDisplayForOptions: Food[] = [];
  foodToDisplay: Food[];
  diet: Diet;
  user = JSON.parse(sessionStorage["user"]) as User

  constructor(private dietService: DietService,
    public snackBar: MatSnackBar,
    private foodRecommenderService: FoodRecommenderService,
    public dialog: MatDialog) { }

  addFoodComponent(event: MatSelectChange) {
    var value = event.value;
    var foodToAdd = this.foodToDisplayForOptions.find(food => food.name == value);
    console.log(foodToAdd)
    if (this.meal.allFoodEntries.find(food => food.name === foodToAdd.name)) {
      this.snackBar.open("Food " + foodToAdd.name + " already present!", "OK", { duration: 3000 });
      return;

    }
    try {
      this.dietService.updateMealRequest(foodToAdd, this.mealType.toString(), this.day)
        .subscribe(response => {
          this.dietService.updateMealHandler(foodToAdd, this.mealType, this.day);

          var caloriesCount = this.diet.caloriesPerDay.get(this.day);
          console.log(caloriesCount)
          if (caloriesCount > this.user.basicMetabolicRate) {
            var user = JSON.parse(sessionStorage["user"]) as User
            this.dialog.open(InformationDialogComponent,
              {
                width: "350px",
                data: {
                  bmr: user.basicMetabolicRate, userName: user.userName,
                  dietName: this.diet.name, foodAdded: foodToAdd,
                  day: this.day.toString(), calories: caloriesCount
                }
              })
          }
          this.snackBar.open(foodToAdd.name + " has been added!", "OK", {
            duration: 2000
          });
          this.foodRecommenderService.setNewFoodAdded(foodToAdd);
        }, (error: HttpErrorResponse) => {
          if (error.status == 400) {
            console.log("bad request")
          }
          else if (error.status < 500) {
            this.snackBar.open(error.error, "OK", {
              duration: 2000
            })
          }
          else {
            this.snackBar.open("Error with server. No worries, your changes will be saved and updated as soon as possible!", "OK", {
              duration: 3000
            });
          }
        })
    }

    catch (e) {
      if (e instanceof Error) {
        this.snackBar.open(e.message, "OK", { duration: 2000 })
      }

    }
  }
  onDeleteFood(food: Food) {
    this.dietService.deleteFoodRequest(food, this.day, this.mealType).subscribe(response => {
      if (response.ok) {
        this.dietService.deleteFoodFromMealHandler(food, this.mealType, this.day);
        this.snackBar.open(food.name + " has been removed from your diet", "OK",
          {
            duration: 2000
          })
      }

    }, (error: HttpErrorResponse) => {
      if (error.status < 500) {
        this.snackBar.open("Error in deleting food " + food.name, "OK", { duration: 3000 })
      }
      else {
        this.snackBar.open("Error with server, try later", "OK", { duration: 3000 })
      }
    })

  }

  ngOnInit() {


    this.foodToDisplay = []

    this.dietService.getObservableDiet().subscribe(diet => {
      if (diet) {
        this.diet = diet;
        this.meal = diet.dailyFood.get(this.day).find(m => m.mealType == this.mealType.toString())
        this.foodToDisplay = this.meal.allFoodEntries;
      }
    })

    this.foodRecommenderService.getObservableFoodBehavior()
      .subscribe(allFood => {
        if (allFood) {
          allFood.filter(f => f.bestEatenAt.includes(this.mealType.toString())).forEach(f => {
            var food = new Food();
            food.name = f.name;
            food.proteinsPer100 = f.proteins;
            food.quantity = 100;
            food.caloriesPer100 = f.caloriesPer100;
            food.vitaminsPer100 = f.vitamins;
            food.fatsPer100 = f.fats;
            food.carbsPer100 = f.carbs;
            food.saltsPer100 = f.salts;
            food.type = f.type;
            food.calories = f.caloriesPer100
            food.salts = food.saltsPer100
            food.fats = food.fatsPer100
            food.vitamins = food.vitaminsPer100
            food.proteins = food.proteinsPer100
            food.carbs = food.carbsPer100
            food.id = f.id
            this.foodToDisplayForOptions.push(food)
          })
        }
      })
  }

}




