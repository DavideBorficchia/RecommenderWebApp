import { Component, OnInit, Input, HostListener, ViewChild } from '@angular/core';
import { MealType } from 'src/app/model/mealtypes';

import { createMeta } from '@angular/platform-browser/src/browser/meta';
import { FoodType } from 'src/app/model/foodtypes';
import { Food } from 'src/app/model/food';
import { MatSelectChange, MatSnackBar, MatSelect } from '@angular/material';
import { DietService } from 'src/app/services/diet.service';
import { DayOfWeek } from 'src/app/model/daysofweek';
import { from } from 'rxjs/internal/observable/from';
import { BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FoodAlreadyAddedException } from 'src/app/model/foodalreadyaddedexception';
import { Meal } from 'src/app/model/abstarctmeal';
import { FoodRecommenderService } from 'src/app/services/food-recommender.service';

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
  foodAdded:Food;

  constructor(private dietService: DietService, public snackBar: MatSnackBar, private foodRecommenderService: FoodRecommenderService) { }

  addFoodComponent(event: MatSelectChange) {
    var value = event.value;
    var foodToAdd = this.foodToDisplayForOptions.find(food => food.name == value);
    try {
      this.dietService.updateMealRequest(foodToAdd, this.mealType, this.day)
        .subscribe(response => {

          this.dietService.updateMealHandler(foodToAdd, this.mealType, this.day);
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
      
    },(error:HttpErrorResponse)=>{
      if(error.status< 500){
        this.snackBar.open("Error in deleting food "+food.name,"OK",{duration:3000})
      }
      else{
        this.snackBar.open("Error with server, try later","OK",{duration:3000})
      }
    })

  }
  ngOnInit() {


    this.foodToDisplay = []

    this.dietService.getObservableDiet().subscribe(diet => {
      this.meal = diet.dailyFood.get(this.day).find(m => m.mealType == this.mealType.toString())
      this.foodToDisplay = this.meal.allFoodEntries;
    })

    this.foodRecommenderService.getObservableFoodBehavior()
      .subscribe(allFood => {
        if (allFood) {
          allFood.filter(f=>f.bestEatenAt.includes(this.mealType.toString())).forEach(f => {
            var food = new Food();
            food.name = f.name;
            food.proteins = f.proteins;
            food.quantity = 100;
            food.caloriesPer100 = f.caloriesPer100;
            food.vitamins = f.vitamins;
            food.fats = f.fats;
            food.carbs = f.carbs;
            food.salts = f.salts;
            food.type = f.type;
            food.calories = 100 *f.caloriesPer100
            food.id = f.id
            // var mealTypes =  [];
            // f.bestEatenAt.forEach(mealName=>mealTypes.push(mealName))
            // food.mealTypes = mealTypes;
            console.log(food.salts)
            this.foodToDisplayForOptions.push(food)
          })
        }
      })
  }

}




