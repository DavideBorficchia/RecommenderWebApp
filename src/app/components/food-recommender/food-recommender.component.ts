import { Component, OnInit, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { Food } from 'src/app/model/food';
import { FoodRecommenderService } from 'src/app/services/food-recommender.service';
import { FoodRdf } from 'src/app/model/foodRdf';
import { MatMenuTrigger, MatSnackBar, MatDialog } from '@angular/material';
import { DietService } from 'src/app/services/diet.service';
import { Diet } from 'src/app/model/diet';
import { DayOfWeek } from 'src/app/model/daysofweek';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../register/model/user';
import { InformationDialogComponent } from '../information-dialog/information-dialog.component';
import { RegisterService } from 'src/app/services/register.service';

@Component({
  selector: 'app-food-recommender',
  templateUrl: './food-recommender.component.html',
  styleUrls: ['./food-recommender.component.css']
})
export class FoodRecommenderComponent implements OnInit {
  @Output() historyClicked = new EventEmitter<boolean>();
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  foodAdded: Food;
  currentFoodSuggestions: FoodRdf[];
  mealTypes = ['Breakfast', 'Morning Break', 'Lunch', 'Afternoon Break', 'Dinner'];
  days = ['Monday', 'Tuesday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'];
  diet: Diet;
  dayPicked: string;
  hide: boolean;
  meatSuggestion: boolean;
  vegsSuggestion: boolean;
  carbsSuggestion: boolean;
  user: User;
  constructor(private foodRecommender: FoodRecommenderService, private dietService: DietService,
    private registrationService: RegisterService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog) { }


  ngOnInit() {
    let width = window.innerWidth;
    if (width > 1200) {
      this.hide = false;
    } else if (width > 768 && width <= 1200) {
      this.hide = true;
    } else {
      this.hide = false;
    }
    this.registrationService.getUserObservable()
      .subscribe(user => {
        this.user = user;
      });
    this.dietService.getObservableDiet().subscribe(diet => {
      if (diet) {
        this.diet = diet;
        this.computeCarbs();
        this.computeProteins();
        this.computeVegetables();
      }
    });
    this.foodRecommender.getAddedFoodObservable()
      .subscribe(fAdded => {
        if (fAdded) {
          this.foodAdded = fAdded;
          this.foodRecommender.getRecommendationsGoodWiths(fAdded)
            .subscribe(response => {
              this.currentFoodSuggestions = [];
              Object.keys(response).forEach(key => {
                let value = response[key];
                let food = new FoodRdf();
                food.type = value['type'];
                food.name = value['name'];
                food.fatsPer100 = value['fatsPer100'];
                food.proteinsPer100 = value['proteinsPer100'];
                food.saltsPer100 = value['saltsPer100'];
                food.vitaminsPer100 = value['vitaminsPer100'];
                food.caloriesPer100 = value['caloriesPer100'];
                food.carbsPer100 = value['carbsPer100'];
                food.id = value['id'];
                food.imageUrl = value['imageUrl'];
                food.bestEatenAt = value['bestEatenAt'];
                this.currentFoodSuggestions.push(food);
              });
            });
        }
      });
  }
  onMealButtonClicked(mealName: string, food: FoodRdf) {
    let day: DayOfWeek = DayOfWeek[this.dayPicked];
    if (this.diet.dailyFood.get(day).find(m => m.mealType === mealName)
      .allFoodEntries.find(f => f.name === food.name)) {
      this.snackBar.open('Food ' + food.name + ' already present!', 'OK', { duration: 3000 });
      return;
    }
    let foodForDiet = new Food();
    foodForDiet.name = food.name;
    foodForDiet.proteins = food.proteinsPer100;
    foodForDiet.quantity = 100;
    foodForDiet.caloriesPer100 = food.caloriesPer100;
    foodForDiet.vitamins = food.vitaminsPer100;
    foodForDiet.fats = food.fatsPer100;
    foodForDiet.carbs = food.carbsPer100;
    foodForDiet.salts = food.saltsPer100;
    foodForDiet.type = food.type;
    foodForDiet.calories = food.caloriesPer100;
    foodForDiet.saltsPer100 = food.saltsPer100;
    foodForDiet.fatsPer100 = food.fatsPer100;
    foodForDiet.vitaminsPer100 = food.vitaminsPer100;
    foodForDiet.proteinsPer100 = food.proteinsPer100;
    foodForDiet.carbsPer100 = food.carbsPer100;
    foodForDiet.id = food.id;
    this.dietService.updateMealRequest(foodForDiet, mealName, day)
      .subscribe(() => {
        let user = JSON.parse(sessionStorage['user']) as User;

        let caloriesCount = this.diet.caloriesPerDay.get(day);
        if (caloriesCount > user.basicMetabolicRate) {
          const dialogRef = this.dialog.open(InformationDialogComponent,
            {
              width: '350px',
              data: {
                bmr: user.basicMetabolicRate, userName: user.userName,
                dietName: this.diet.name, foodAdded: food,
                day: this.dayPicked, calories: caloriesCount
              }
            });
          dialogRef.afterClosed().subscribe(() => {
            this.snackBar.open(foodForDiet.name + ' has been added!', 'OK', {
              duration: 2000
            });
          });
        } else {
          this.snackBar.open(foodForDiet.name + ' has been added!', 'OK', {
            duration: 2000
          });
        }
        this.dietService.updateMealHandler(foodForDiet, mealName, day);

      }, (error: HttpErrorResponse) => {
        if (error.status == 400) {
          console.log('bad request');
        } else if (error.status < 500) {
          this.snackBar.open(error.error, 'OK', {
            duration: 2000
          });
        } else {
          this.snackBar.open('Error with server. No worries, your changes will be saved and updated as soon as possible!', 'OK', {
            duration: 3000
          });
        }
      });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let width = event.target.innerWidth;
    if (width > 1200) {
      this.hide = false;
    } else if (width > 768 && width <= 1200) {
      this.hide = true;
    } else {
      this.hide = false;
    }

  }
  onAskRecomendationClick() {
    this.foodAdded = null;
    this.currentFoodSuggestions = [];
    this.vegsSuggestion = true;
    this.meatSuggestion = false;
    this.vegsSuggestion = false;
    this.foodRecommender.getGeneralFoodRecommendationFruitsAndVegetables(this.diet.name.toString())
      .subscribe(response => {
        if (response) {
          Object.keys(response).forEach(key => {
            let value = response[key];
            let food = new FoodRdf();
            food.type = value['type'];
            food.bestEatenAt = value['bestEatenAt'];
            food.name = value['name'];
            food.description = value['description'];
            food.fatsPer100 = value['fatsPer100'];
            food.proteinsPer100 = value['proteinsPer100'];
            food.saltsPer100 = value['saltsPer100'];
            food.rdfOutput = value['rdfOutput'];
            food.imageUrl = value['imageUrl'];
            food.vitaminsPer100 = value['vitaminsPer100'];
            food.goodSinergyWith = value['goodSinergyWith'];
            food.goodWith = value['goodWith'];
            food.caloriesPer100 = value['caloriesPer100'];
            food.carbsPer100 = value['carbsPer100'];
            food.timeStamp = value['timeStamp'];
            this.currentFoodSuggestions.push(food);
          });
        }

      });

  }
  onAskMeatAndFishRecommendation() {
    this.foodAdded = null;
    this.currentFoodSuggestions = [];
    this.vegsSuggestion = false;
    this.meatSuggestion = true;
    this.vegsSuggestion = false;

    let average = this.computeProteins();
    if (average > this.computeProteinRightAmount()) {
      this.snackBar.open('Try to remove high protein based food to get suggestions!', 'OK', { duration: 4000 });
    } else {
      this.foodRecommender.getGeneralFoodRecommendationMeatAndFish(this.diet.name.toString(), this.computeProteinRightAmount())
        .subscribe(response => {
          if (response) {
            Object.keys(response).forEach(key => {
              let value = response[key];
              let food = new FoodRdf();
              food.type = value['type'];
              food.bestEatenAt = value['bestEatenAt'];
              food.name = value['name'];
              food.description = value['description'];
              food.fatsPer100 = value['fatsPer100'];
              food.proteinsPer100 = value['proteinsPer100'];
              food.saltsPer100 = value['saltsPer100'];
              food.rdfOutput = value['rdfOutput'];
              food.imageUrl = value['imageUrl'];
              food.vitaminsPer100 = value['vitaminsPer100'];
              food.goodSinergyWith = value['goodSinergyWith'];
              food.goodWith = value['goodWith'];
              food.caloriesPer100 = value['caloriesPer100'];
              food.carbsPer100 = value['carbsPer100'];
              food.timeStamp = value['timeStamp'];
              this.currentFoodSuggestions.push(food);
            });
          }

        });
    }


  }
  computeProteinRightAmount() {
    return Math.round(this.user.weight * 0.83 * 7);
  }
  computeProteins() {
    let totalAmount = 0;
    this.diet.dailyFood.forEach((meals, day) => {
      meals.forEach(meal => meal.allFoodEntries.forEach(food => {
        if (food.type === 'Meat' || food.type === 'Fish') {
          totalAmount += food.proteins;
        }
      }));
    });
    return Math.round(totalAmount / 7);
  }
  computeVegetables() {
    let totalAmount = 0;
    this.diet.dailyFood.forEach((meals, day) => {
      meals.forEach(meal => meal.allFoodEntries.forEach(food => {
        if (food.type === 'Fruits' || food.type === 'Vegetabls') {
          totalAmount += food.quantity;
        }
      }));
    });
    return totalAmount;
  }
  computeCarbs() {
    let totalAmount = 0;
    this.diet.dailyFood.forEach((meals, day) => {
      meals.forEach(meal => meal.allFoodEntries.forEach(food => {
        if (food.type === 'Pasta' || food.type === 'Bakery and Cereal') {
          totalAmount += food.proteins;
        }
      }));
    });
    return totalAmount;
  }
}


