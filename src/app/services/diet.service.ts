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
import { Observable, of, from, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { User } from '../components/register/model/user';

@Injectable({
  providedIn: 'root'
})
export class DietService {


  private baseUrl = "http://localhost:8080/recommender/diets"
  private diet: Diet;
  private
  private allFood: Food[];

  constructor(private httpClient: HttpClient) {

    // if (!this.foodEntries) {

    // }
    this.allFood = [{ type: FoodType.Breakfast, name: "Milk and Coffe", calories: 123, carbs: 67, fat: 89, proteins: 13, healthy: "yes", mealTypes: [MealType.Breakfast], quantity: 100, caloriesPer100: 123 },
    { type: FoodType.Breakfast, name: "Eggs and Bacon", calories: 1200, carbs: 67, fat: 89, proteins: 176, healthy: "no", mealTypes: [MealType.Breakfast, MealType.Lunch], quantity: 100, caloriesPer100: 1200 },
    { type: FoodType.MainCourse, name: "Fried Chicked", calories: 1230, carbs: 67, fat: 89, proteins: 123, healthy: "no", mealTypes: [MealType.Lunch, MealType.Dinner], quantity: 100, caloriesPer100: 1230 },
    { type: FoodType.MainCourse, name: "Pasta with Ragù", calories: 123, carbs: 67, fat: 89, proteins: 123, healthy: "no", mealTypes: [MealType.Lunch, MealType.Dinner], quantity: 100, caloriesPer100: 123 },
    {
      type: FoodType.Fruit, name: "Apple", calories: 34, carbs: 67, fat: 89, proteins: 123, healthy: "yes",
      mealTypes: [MealType.Lunch, MealType.Dinner, MealType.Breakfast, MealType.MorningBreak, MealType.AfternoonBreak], quantity: 100, caloriesPer100: 34
    }]
  }

  createNewDiet() {

    console.log(this.diet.userId)
    return this.httpClient.post<Diet>(this.baseUrl.concat("/create"), this.diet, {
      observe: 'response'
    }).pipe(catchError(error => {
      console.log(error)
      return throwError(error)
    }))


  }
  createEmptyFoodEntries(): Map<DayOfWeek, import("d:/Repos/angular-recommender/src/app/model/meal").Meal[]> {
    var foodEntries: Map<DayOfWeek, Meal[]>;
    foodEntries = new Map();
    Object.keys(DayOfWeek).forEach(dayOfWeek => {
      foodEntries.set(DayOfWeek[dayOfWeek], []);
      Object.keys(MealType).forEach(mealType => {
        var meals = foodEntries.get(DayOfWeek[dayOfWeek])
        meals.push(this.createMeal(MealType[mealType]));
      })

    });
    return foodEntries;
  }
  updateDiet(food: Food, mealType: MealType, dayOfWeek: DayOfWeek) {
    var dayMeals = this.diet.dailyFood.get(dayOfWeek);
    var meal = dayMeals.find(m => m.mealType == mealType);
    meal.addFood(food)

    //update in server

    var user = JSON.parse(sessionStorage["user"]) as User

    //by default httclient expects a json
    return this.httpClient.put(this.baseUrl.concat("/meals/update/"+this.diet.name+"?userId="+user.id), meal, { observe: 'response', responseType: 'text' })
      .pipe(catchError(error => {
        console.log(error)
        return throwError(error)
      }))

  }
  deleteFoodFromMeal(food: Food, mealType: MealType, dayOfWeek: DayOfWeek) {
    var dayMeals = this.diet.dailyFood.get(dayOfWeek);
    var meal = dayMeals.find(m => m.mealType == mealType);
    meal.removeFood(food);
    var currentCaloriesCount = this.diet.caloriesPerDay.get(dayOfWeek)
    var updatedCaloriesCount = currentCaloriesCount - food.calories;
    this.diet.caloriesPerDay.set(dayOfWeek, updatedCaloriesCount)
    console.log(this.diet)
    //update server
  }

  updateQuantityAndCalories(food: Food, day: DayOfWeek, mealType: MealType) {

    var dayMeals = this.diet.dailyFood.get(day);
    var meal = dayMeals.find(m => m.mealType == mealType);
    var foodToUpdate = meal.allFoodEntries.find(f => f.name == food.name)
    foodToUpdate = food;

    this.diet.updateCaloriesPerDay(day, foodToUpdate);
    console.log(this.diet)

  }


  getAllFood() {
    return this.allFood;
  }
  setAllFood(allFood: Food[]) {
    this.allFood = allFood;
  }
  setDiet(diet: Diet) {
    this.diet = diet;
    // this.httpClient.post(this.baseUrl.concat("/create"), diet, {
    //   observe: 'response'
    // }).subscribe(response => console.log(response))
  }

  getDiet(userId: String) {
    return this.httpClient.get<Diet>(this.baseUrl.concat("/" + userId), { observe: 'response' })
      .pipe(catchError(error => {
        console.log(error)
        return throwError(error)
      }))
  }
  getCurrentDiet() {
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
