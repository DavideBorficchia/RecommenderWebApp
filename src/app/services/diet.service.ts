import { Injectable, OnInit } from '@angular/core';
import { Diet } from '../model/diet';
import { MealType } from '../model/mealtypes';
import { BreakFast } from '../model/breakfast';
import { AfternoonBreak } from '../model/afternoonbreak';
import { MorningBreak } from '../model/morningbreak';
import { Lunch } from '../model/lunch';
import { Dinner } from '../model/Dinner';
import { Meal } from '../model/meal';
import { Food } from '../model/food';
import { FoodType } from '../model/foodtypes';
import { DayOfWeek } from '../model/daysofweek';
import { Observable, of,from, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DietService {

  private baseUrl = "http://localhost:8080/recommender/diets"
  private diet: Diet;
  private foodEntries: Map<DayOfWeek, Meal[]>
  private allFood: Food[];

  constructor(private httpClient:HttpClient) {

    if (!this.foodEntries) {
      this.foodEntries = new Map();
      Object.keys(DayOfWeek).forEach(dayOfWeek => {
        this.foodEntries.set(DayOfWeek[dayOfWeek], []);
        Object.keys(MealType).forEach(mealType => {
          var meals = this.foodEntries.get(DayOfWeek[dayOfWeek])
          meals.push(this.createMeal(MealType[mealType]));
        })

      });
    }
    this.allFood = [{ type: FoodType.Breakfast, name: "Milk and Coffe", calories: 123, carbs: 67, fat: 89, proteins: 13, healthy: "yes", mealTypes: [MealType.Breakfast], quantity: 100, caloriesPer100: 123 },
    { type: FoodType.Breakfast, name: "Eggs and Bacon", calories: 1200, carbs: 67, fat: 89, proteins: 176, healthy: "no", mealTypes: [MealType.Breakfast, MealType.Lunch], quantity: 100, caloriesPer100: 1200 },
    { type: FoodType.MainCourse, name: "Fried Chicked", calories: 1230, carbs: 67, fat: 89, proteins: 123, healthy: "no", mealTypes: [MealType.Lunch, MealType.Dinner], quantity: 100, caloriesPer100: 1230 },
    { type: FoodType.MainCourse, name: "Pasta with Ragù", calories: 123, carbs: 67, fat: 89, proteins: 123, healthy: "no", mealTypes: [MealType.Lunch, MealType.Dinner], quantity: 100, caloriesPer100: 123 },
    {
      type: FoodType.Fruit, name: "Apple", calories: 34, carbs: 67, fat: 89, proteins: 123, healthy: "yes",
      mealTypes: [MealType.Lunch, MealType.Dinner, MealType.Breakfast, MealType.MorningBreak, MealType.AfternoonBreak], quantity: 100, caloriesPer100: 34
    }]
  }
  updateDiet(food: Food, mealType: MealType, dayOfWeek: DayOfWeek) {
    var dayMeals = this.diet.dailyFood.get(dayOfWeek);
    var meal = dayMeals.find(m => m.mealType == mealType);
    meal.addFood(food)

    //by default httclient expects a json
    this.httpClient.put(this.baseUrl.concat("/meals/update/beautifulDietId"), meal, {observe:'response', responseType:'text'})
    .pipe(catchError(error=>{
      console.log(error)
      return throwError(error)
    })).subscribe(response=>{
      console.log(response)
    });
    //update in server
  
  }

  

  getAllFood() {
    return this.allFood;
  }
  setAllFood(allFood: Food[]) {
    this.allFood = allFood;
  }
  setDiet(diet: Diet) {
    this.diet = diet;
    this.httpClient.post(this.baseUrl.concat("/create"),diet,{
      observe:'response'
    }).subscribe(response=>console.log(response))
  }
  getAllFoodEntries(){
    return this.foodEntries;
  }
  getDiet() {
    return this.httpClient.get<Diet>(this.baseUrl.concat("/Cool Diet"),{observe:'response'});
  }
  getCurrentDiet(){
    return this.diet;
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
