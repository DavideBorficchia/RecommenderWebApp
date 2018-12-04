import { Component, OnInit, Input, HostListener, ViewChild } from '@angular/core';
import { Meal } from 'src/app/model/meal';
import { MealType } from 'src/app/model/mealtypes';
import { BreakFast } from 'src/app/model/breakfast';
import { AfternoonBreak } from 'src/app/model/afternoonbreak';
import { MorningBreak } from 'src/app/model/morningbreak';
import { Lunch } from 'src/app/model/lunch';
import { Dinner } from 'src/app/model/Dinner';
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
    console.log(event)
    // var value = event.value;
    // var foodToAdd = this.foodToDisplayForOptions.find(food => food.name == value);
    // this.dietService.updateQuantityAndCalories(foodToAdd,this.day,this.mealType);
    // this.dietService.updateDiet(foodToAdd, this.mealType, this.day)
    //   .subscribe(response => {
    //     this.snackBar.open(foodToAdd.name + " has been added!", "OK", {
    //       duration: 1500
    //     })
    //   }, (error: HttpErrorResponse) => {
    //     if (error.status < 500) {
    //       this.snackBar.open(error.error, "OK", {
    //         duration: 2000
    //       })
    //     }
    //     else {
    //       this.snackBar.open("Error with server. No worries, your changes will be saved and updated as soon as possible!");
    //     }
    //   })


  }
  onDeleteFood(food: Food) {
    this.dietService.deleteFoodFromMeal(food, this.mealType, this.day)

  }
  ngOnInit() {
    // this.meal = this.createMeal(this.mealType)
    this.meal = this.dietService.getCurrentDiet().dailyFood.get(this.day).find(m => m.mealType == this.mealType)


    this.foodToDisplay = this.meal.allFoodEntries;
    this.foodToDisplayForOptions = this.dietService.getAllFood().filter(f => f.mealTypes.find(type => type == this.mealType))

    this.matSelect.optionSelectionChanges.subscribe(event => {
      var value = event.source.value;
      var foodToAdd = this.foodToDisplayForOptions.find(food => food.name == value);
      this.dietService.updateQuantityAndCalories(foodToAdd, this.day, this.mealType);
      try {
        this.dietService.updateDiet(foodToAdd, this.mealType, this.day)
        .subscribe(response => {
          this.snackBar.open(foodToAdd.name + " has been added!", "OK", {
            duration: 2000
          })
        }, (error: HttpErrorResponse) => {
          if(error.status == 400){
            console.log("bad request")
          }
          if (error.status < 500) {
            this.snackBar.open(error.error, "OK", {
              duration: 2000
            })
          }
          else {
            this.snackBar.open("Error with server. No worries, your changes will be saved and updated as soon as possible!","OK",{
              duration:3000
            });
          }
        })
      }
      catch(e){
        if(e instanceof Error){
          this.snackBar.open(e.message,"OK", {duration:2000})
        }
      }
     
  
    })

  }
  public createMeal(mealType: MealType) {
    switch (mealType) {
      case MealType.Breakfast:
        return new BreakFast();
      case MealType.AfternoonBreak:
        return new AfternoonBreak();
      case MealType.MorningBreak:
        return new MorningBreak();
      case MealType.Lunch:
        return new Lunch();
      case MealType.Dinner:
        return new Dinner();
    }
  }

}
