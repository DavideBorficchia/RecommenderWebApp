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
  foodToDisplayForOptions: Food[];
  foodToDisplay: Food[];

  constructor(private dietService: DietService, public snackBar: MatSnackBar) { }

  addFoodComponent(event: MatSelectChange) {
    var value = event.value;
    var foodToAdd = this.foodToDisplayForOptions.find(food => food.name == value);
    try {
      this.dietService.updateMealRequest(foodToAdd, this.mealType, this.day)
        .subscribe(response => {

          this.dietService.updateMealHandler(foodToAdd, this.mealType, this.day);
          this.snackBar.open(foodToAdd.name + " has been added!", "OK", {
            duration: 2000
          })
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
    this.dietService.deleteFoodRequest(food, this.day, this.mealType).subscribe(response=>{
      if(response.ok){
        this.dietService.deleteFoodFromMealHandler(food,this.mealType,this.day);
        this.snackBar.open(food.name+" has been removed from your diet", "OK",
        {
          duration:2000
        })
      }
      else{
        
      }
    })

  }
  ngOnInit() {


    this.foodToDisplay = []
 
    this.dietService.getObservableDiet().subscribe(diet => {
      this.meal = diet.dailyFood.get(this.day).find(m => m.mealType == this.mealType.toString())
      console.log(this.meal+" "+diet.name)
      this.foodToDisplay = this.meal.allFoodEntries;
    })

    this.foodToDisplayForOptions = this.dietService.getAllFood().filter(f => f.mealTypes.find(type => type == this.mealType.toString()))
;
  }

}




