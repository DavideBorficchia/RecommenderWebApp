import { Component, OnInit } from '@angular/core';
import { DietService } from 'src/app/services/diet.service';
import { Diet } from 'src/app/model/diet';
import { RegisterService } from 'src/app/services/register.service';
import { DayOfWeek } from 'src/app/model/daysofweek';
import { Food } from 'src/app/model/food';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../register/model/user';
import { FoodRecommenderService } from 'src/app/services/food-recommender.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  diet:Diet;
  user:User;
  shoppingList: Map<String, Food> = new Map();
  constructor(private dietService:DietService, private registerService:RegisterService, private foodService: FoodRecommenderService ) { }

  ngOnInit() {
    /*this.dietService.getObservableDiet().subscribe(diet=>{
      if(diet){
        this.diet = diet;
        console.log("Ho gia la dieta");
        console.log("size " + this.diet.dailyFood.size);
        this.diet.dailyFood.forEach(day => {
          console.log("day " + day);
          day.forEach(meal => {
            console.log("meal " + meal);
            var foodArray = meal["allFoodEntries"];
            foodArray.forEach(value =>{
              console.log("value 1 " + value["name"]);
            })
          })
        });

        Object.keys(this.diet.dailyFood).forEach(key => {
          Object.values(this.diet.dailyFood[key]).forEach(mealValue => {
            var foodArray = mealValue["allFoodEntries"];
            Object.values(foodArray).forEach(value => {

              var food = new Food();
              food.calories = value["calories"];
              food.caloriesPer100 = value["caloriesPer100"];
              food.carbs = value["carbs"];
              food.fats = value["fats"];
              //food.mealTypes = value["mealTypes"]
              food.name = value["name"];
              food.proteins = value["proteins"];
              food.quantity = value["quantity"];
              food.vitamins = value["vitamins"];
              food.salts = value["salts"];
              food.type = value["type"];
              food.id = value["id"];
              food.saltsPer100 = value["saltsPer100"];
              food.vitaminsPer100 = value["vitaminsPer100"];
              food.fatsPer100 = value["fatsPer100"];
              food.proteinsPer100 = value["proteinsPer100"];
              food.carbsPer100 = value["carbsPer100"];
              food.calories = value["calories"];
              if (this.shoppingList.get(food.name)){
                food.quantity = this.shoppingList.get(food.name).quantity + food.quantity;
                this.shoppingList.set(food.name, food);
              }else{
                food.imgUrl = this.foodService.getFoodRdfByName(food.name).imageUrl;
                this.shoppingList.set(food.name, food);
              }

            });
          });
        });
      }
      else{*/
        this.registerService.getUserObservable().subscribe(user => {
          console.log("userid has changed "+user.id);
          var userId = user.id;
    
          this.dietService.getDiet(userId).subscribe(response => {
            this.diet = response.body;

            Object.keys(this.diet.dailyFood).forEach(key => {
              Object.values(this.diet.dailyFood[key]).forEach(mealValue => {
                var foodArray = mealValue["allFoodEntries"];
                Object.values(foodArray).forEach(value => {
                  var food = new Food();
                  food.calories = value["calories"];
                  food.caloriesPer100 = value["caloriesPer100"];
                  food.carbs = value["carbs"];
                  food.fats = value["fats"];
                  // food.mealTypes = value["mealTypes"]
                  food.name = value["name"];
                  food.proteins = value["proteins"];
                  food.quantity = value["quantity"];
                  food.vitamins = value["vitamins"];
                  food.salts = value["salts"];
                  food.type = value["type"];
                  food.id = value["id"];
                  food.saltsPer100 = value["saltsPer100"];
                  food.vitaminsPer100 = value["vitaminsPer100"];
                  food.fatsPer100 = value["fatsPer100"];
                  food.proteinsPer100 = value["proteinsPer100"];
                  food.carbsPer100 = value["carbsPer100"];
                  food.calories = value["calories"];
                  food.imgUrl = this.foodService.getFoodRdfByName(food.name).imageUrl;
                  if (this.shoppingList.get(food.name)){
                    food.quantity = this.shoppingList.get(food.name).quantity + food.quantity;
                    this.shoppingList.set(food.name, food);
                    console.log(food.name + " " + food.quantity);
                  }else{
                    console.log("URL :" + food.imgUrl);
                    this.shoppingList.set(food.name, food);
                  }
                });
              });
            });


            var caloriesPerDay: Map<DayOfWeek, number> = new Map()
            Object.keys(response.body.caloriesPerDay).forEach(key => {
              caloriesPerDay.set(DayOfWeek[key], response.body.caloriesPerDay[key]);
            });   
          }, (error: HttpErrorResponse) => console.log(error.error + " " + error.status));

          }, err => console.log(err));
         // this.foodService.getAllFoodFromServer();
      }
    //}, err=> console.log(err));
 // }
}
