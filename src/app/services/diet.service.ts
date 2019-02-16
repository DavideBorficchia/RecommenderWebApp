import { Injectable, OnInit } from '@angular/core';

import { Food } from '../model/food';
import { FoodType } from '../model/foodtypes';
import { DayOfWeek } from '../model/daysofweek';
import { Observable, of, from, BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { User } from '../components/register/model/user';
import { MealType } from '../model/mealtypes';
import { Meal } from '../model/abstarctmeal';
import { Diet } from '../model/diet';
import { DietHistory } from '../model/diethistory';

@Injectable({
  providedIn: 'root'
})  
export class DietService {


  // private baseUrl = "http://localhost:8080/recommender/diets"
  baseUrl = "https://recommender-gateway.herokuapp.com/recommender/diets"
  private diet: Diet;
  private allFood: Food[];
  private dietBehaviour: BehaviorSubject<Diet>;
  private dietHistorySource: BehaviorSubject<DietHistory[]>;
  private dietHistory: DietHistory[];
  private monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];


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
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.httpClient.post<Diet>(this.baseUrl.concat("/create"), this.diet, {
      observe: 'response',
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    })
      .pipe(catchError(error => {
        console.log(error)
        return throwError(error)
      }));


  }
  updateMealHandler(food: Food, mealType: MealType, dayOfWeek: DayOfWeek) {
    var dayMeals = this.diet.dailyFood.get(dayOfWeek);
    var meal = dayMeals.find(m => m.mealType == mealType);
    console.log(meal.allFoodEntries);

    meal.addFood(food);

    var foodToUpdate = meal.allFoodEntries.find(f => f.name == food.name)
    foodToUpdate = food;
    this.diet.updateCaloriesPerDay(dayOfWeek, foodToUpdate);
    this.dietBehaviour.next(this.diet)
  }
  updateMealRequest(food: Food, mealType: MealType, dayOfWeek: DayOfWeek) {

    //update in server

    var user = JSON.parse(sessionStorage["user"]) as User

    const dietParams = new HttpParams();


    //by default httclient expects a json
    return this.httpClient.put<Food>(this.baseUrl.concat("/" + this.diet.name + "/days/" + dayOfWeek.toString() + "/meals/" + mealType.toString()), food,
      {
        observe: 'response',
        params:
        {
          // dailyCalories: this.diet.caloriesPerDay.get(dayOfWeek).valueOf().toString(),
          userId: user.id

        }
      }
    )
      .pipe(catchError(error => {
        console.log(error)
        return throwError(error)
      }))

  }
  deleteFoodRequest(food: Food, dayOfWeek: DayOfWeek, mealType: MealType) {
    var user = JSON.parse(sessionStorage["user"]) as User

    return this.httpClient.delete<Food>(this.baseUrl.concat("/" + this.diet.name + "/days/" + dayOfWeek.toString() + "/meals/" + mealType.toString()), {
      observe: 'response',
      params:
      {
        userId: user.id,
        foodName: food.name.toString()
      }
    })
  }

  deleteFoodFromMealHandler(food: Food, mealType: MealType, dayOfWeek: DayOfWeek) {
    var dayMeals = this.diet.dailyFood.get(dayOfWeek);
    var meal = dayMeals.find(m => m.mealType == mealType);
    meal.removeFood(food);

    this.diet.updateCaloriesPerDay(dayOfWeek, food)
    this.dietBehaviour.next(this.diet);


  }

  updateQuantityAndCaloriesHandler(food: Food, day: DayOfWeek, mealType: MealType) {

    var dayMeals = this.diet.dailyFood.get(day);
    var meal = dayMeals.find(m => m.mealType == mealType);
    var foodToUpdate = meal.allFoodEntries.find(f => f.name == food.name)
    foodToUpdate = food;

    this.diet.updateCaloriesPerDay(day, foodToUpdate);

  }


  updateFoodAndQuantityAndCaloriesRequest(food: Food, day: DayOfWeek, mealType: MealType) {
    var user = JSON.parse(sessionStorage["user"]) as User
    return this.httpClient.put<Food>(this.baseUrl.concat("/" + this.diet.name + "/days/" + day.toString() + "/meals/" + mealType.toString() + "/" + food.name + "/nutritions"), food,
      {
        observe: 'response',
        params:
        {
          userId: user.id,
        }
      }
    )
      .pipe(catchError(error => {
        console.log(error)
        return throwError(error)
      }))
  }

  getAllFood() {
    return this.allFood;
  }
  setAllFood(allFood: Food[]) {
    this.allFood = allFood;
  }
  setDiet(diet: Diet) {

    this.diet = diet;

    if (!this.dietBehaviour) {
      this.dietBehaviour = new BehaviorSubject(this.diet);
      this.dietBehaviour.next(diet);
    }
    else {
      this.dietBehaviour.next(diet)
    }




  }

  getDiet(userId: String) {
    return this.httpClient.get<Diet>(this.baseUrl.concat("/current"), {
      observe: 'response',
      params: {
        userId: userId.toString()
      }
    })
      .pipe(catchError(error => {
        return throwError(error)
      }))
  }
  getCurrentDiet() {
    return this.diet;
  }


  getObservableDiet() {
    if (!this.dietBehaviour) {
      this.dietBehaviour = new BehaviorSubject(this.diet);
    }
    return this.dietBehaviour;
  }

  getDietHistoryRecent(userId: String) {

    return this.httpClient.get<DietHistory>(this.baseUrl.concat("/years/" + new Date().getFullYear().toString() + "/months/" + this.monthNames[new Date().getMonth()]), {
      observe: 'response',
      params: {
        userId: userId.toString()
      }
    }).pipe(catchError(error => {
      return throwError(error)
    }))

  }

  setObservableDietHistory(dietHistory: DietHistory[]) {
    this.dietHistory = dietHistory;
    if (!this.dietHistorySource) {
      this.dietHistorySource = new BehaviorSubject(this.dietHistory);
      this.dietHistorySource.next(this.dietHistory);
    }
    else {
      this.dietHistorySource.next(this.dietHistory);

    }
  }
  getObservableDietHistory() {
    return this.dietHistorySource.asObservable();
  }


  addDietHistory(historyEntry: DietHistory) {
    this.dietHistory.unshift(historyEntry);
    this.dietHistorySource.next(this.dietHistory)
  }

  getCurrentMonth() {
    return this.monthNames[new Date().getMonth()]
  }
  getTodayDate() {
    var todayDate = new Date()
    return todayDate.getDate().toString() + "/" + (todayDate.getMonth() + 1) + "/" + todayDate.getFullYear().toString()
  }
  getDietByName(dietName: String) {

    var user = JSON.parse(sessionStorage["user"]) as User

    return this.httpClient.get<Diet>(this.baseUrl.concat("/" + dietName.toString()),
      {
        observe: 'response',
        params: {
          userId: user.id
        }
      })


  }
  getDietHistoriesByYear(year: string) {
    var user = JSON.parse(sessionStorage["user"]) as User

    return this.httpClient.get<DietHistory>(this.baseUrl.concat("/years/" + year),
      {
        observe: 'response',
        params: {
          userId: user.id
        }
      }).pipe(catchError(error => {
        return throwError(error)
      }))
  }
}
