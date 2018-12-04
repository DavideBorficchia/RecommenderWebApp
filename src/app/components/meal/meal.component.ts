import { Component, OnInit, Input, HostListener } from '@angular/core';
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
import { MatSelectChange } from '@angular/material';
import { DietService } from 'src/app/services/diet.service';
import { DayOfWeek } from 'src/app/model/daysofweek';
import { from } from 'rxjs/internal/observable/from';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.css']
})
export class MealComponent implements OnInit {

  @Input() mealType: MealType;
  @Input() day: DayOfWeek;
  meal: Meal;
  displayedColumns: string[] = ['name', 'type']
  isOver: boolean
  foodToDisplayForOptions: Food[];
  foodToDisplay: Food[];

  constructor(private dietService: DietService) { }
  addFoodComponent(event: MatSelectChange) {
    var value = event.value;
    var foodToAdd = this.foodToDisplayForOptions.find(food => food.name == value);
    this.dietService.updateDiet(foodToAdd, this.mealType, this.day)


  }
  ngOnInit() {
    // this.meal = this.createMeal(this.mealType)
    this.meal = this.dietService.getCurrentDiet().dailyFood.get(this.day).find(m=>m.mealType==this.mealType)

   


    this.foodToDisplay = this.meal.allFoodEntries;
    this.foodToDisplayForOptions = this.dietService.getAllFood().filter(f => f.mealTypes.find(type => type == this.mealType))

    console.log("this is meal: " + this.day)

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
