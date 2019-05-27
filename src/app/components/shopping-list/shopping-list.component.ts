import { Component, OnInit } from '@angular/core';
import { DietService } from 'src/app/services/diet.service';
import { Diet } from 'src/app/model/diet';
import { RegisterService } from 'src/app/services/register.service';
import { DayOfWeek } from 'src/app/model/daysofweek';
import { Food } from 'src/app/model/food';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../register/model/user';
import { FoodRecommenderService } from 'src/app/services/food-recommender.service';
import { FoodRdf } from 'src/app/model/foodRdf';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  diet:Diet;
  user:User;
  show = true;
  shoppingList: Map<String, Food> = new Map();
  alternativeFoods: Map<String, FoodRdf[]> = new Map();

  constructor(private dietService:DietService, private registerService:RegisterService, private foodService: FoodRecommenderService,
    private router: Router, private ds: DataService ) { }

  navigateToBuy(){
    this.ds.setShoppingList(this.shoppingList);
    this.router.navigateByUrl('/home/buy-online');
  }

  editList(event, oldFoodName){
    console.log(event.value + " " + oldFoodName);
    var foodRdf = this.foodService.getFoodRdfByName(event.value);
    var newFood = new Food();
    
    newFood.name = foodRdf.name;

    newFood.quantity = this.shoppingList.get(oldFoodName).quantity;
    newFood.type = foodRdf.type;
    newFood.id = foodRdf.id;
    newFood.caloriesPer100 = foodRdf.caloriesPer100;
    newFood.saltsPer100 = foodRdf.saltsPer100;
    newFood.vitaminsPer100 = foodRdf.vitaminsPer100;
    newFood.fatsPer100 = foodRdf.fatsPer100;
    newFood.proteinsPer100 = foodRdf.proteinsPer100;
    newFood.carbsPer100 = foodRdf.carbsPer100;
    newFood.imgUrl = foodRdf.imageUrl;
    this.shoppingList.delete(oldFoodName);
    this.shoppingList.set(newFood.name, newFood);
  }

  ngOnInit() {
        this.registerService.getUserObservable().subscribe(user => {
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
                  }else{
                    this.shoppingList.set(food.name, food);
                  }
                });
              });
            });

            /*this.shoppingList.forEach( food => {
              this.alternativeFoods.set(food.name, this.foodService.getFoodRdfByCategoryName(food.type));
              var altFoods: FoodRdf[] = Array.from(this.alternativeFoods.get(food.name));
              altFoods.forEach(f => {
                console.log("array alternative food: " + f.name);
              });
            });*/

            this.foodService.getAllFood();


            var caloriesPerDay: Map<DayOfWeek, number> = new Map()
            Object.keys(response.body.caloriesPerDay).forEach(key => {
              caloriesPerDay.set(DayOfWeek[key], response.body.caloriesPerDay[key]);
            });   
          }, (error: HttpErrorResponse) => console.log(error.error + " " + error.status));

          }, err => console.log(err));
      }
}
