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
import { PhysicalActivity } from '../model/physicalactivity';

@Injectable({
  providedIn: 'root'
})
export class DietService {


  private baseUrl = "http://localhost:8080/recommender/diets"
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
  updateMealHandler(food: Food, mealType: string, dayOfWeek: DayOfWeek) {
    var dayMeals = this.diet.dailyFood.get(dayOfWeek);
    var meal = dayMeals.find(m => m.mealType == mealType);
    console.log(meal.allFoodEntries);

    meal.addFood(food);

    var foodToUpdate = meal.allFoodEntries.find(f => f.name == food.name)
    foodToUpdate = food;
    this.diet.updateCaloriesPerDay(dayOfWeek, foodToUpdate);
    this.dietBehaviour.next(this.diet)
  }
  updateMealRequest(food: Food, mealType: string, dayOfWeek: DayOfWeek) {

    //update in server

    var user = JSON.parse(sessionStorage["user"]) as User

    //by default httclient expects a json
    return this.httpClient.put<Food>(this.baseUrl.concat("/" + this.diet.name + "/days/" + dayOfWeek.toString() + "/meals/" + mealType), food,
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
  updateCurrentPhysicalActivity(diet:Diet){
    return this.httpClient.put<Diet>(this.baseUrl+"/"+diet.name+"/updates",diet,{
      observe:'response',
      params:{
        userId:diet.userId.toString()
      }
    }).pipe(catchError(error => {
      console.log(error)
      return throwError(error)
    }))
  }

  updateQuantityAndCaloriesHandler(food: Food, day: DayOfWeek, mealType: MealType) {

    var dayMeals = this.diet.dailyFood.get(day);
    var meal = dayMeals.find(m => m.mealType == mealType);
    var foodToUpdate = meal.allFoodEntries.find(f => f.name == food.name)
    foodToUpdate = food;

    this.diet.updateCaloriesPerDay(day, foodToUpdate);
    this.dietBehaviour.next(this.diet)

  }


  updateFoodAndQuantityAndCaloriesRequest(food: Food, day: DayOfWeek, mealType: MealType) {
    var user = JSON.parse(sessionStorage["user"]) as User
    return this.httpClient.put<Food>(this.baseUrl.concat("/" + this.diet.name + "/days/" + day.toString() + "/meals/" + mealType.toString() + "/" + food.name), food,
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
