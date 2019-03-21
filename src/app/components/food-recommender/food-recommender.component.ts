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
  mealTypes = ["Breakfast", "Morning Break", "Lunch", "Afternoon Break", "Dinner"];
  days = ["Monday", "Tuesday", "Wednesday", "Friday", "Saturday", "Sunday"]
  diet: Diet;
  dayPicked: string;
  hide: boolean
  constructor(private foodRecommender: FoodRecommenderService, private dietService: DietService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog) { }


  ngOnInit() {
    var width = window.innerWidth
    if (width > 1200) {
      this.hide = false;
    }
    else if (width > 768 && width <= 1200) {
      this.hide = true
    }
    else {
      this.hide = false;
    }
    console.log(this.hide)
    this.dietService.getObservableDiet().subscribe(diet => {
      if (diet) {
        this.diet = diet;
      }
    })
    this.foodRecommender.getAddedFoodObservable()
      .subscribe(fAdded => {
        if (fAdded) {
          this.foodAdded = fAdded;
          this.foodRecommender.getRecommendationsGoodWiths(fAdded)
            .subscribe(response => {
              this.currentFoodSuggestions = []
              Object.keys(response).forEach(key => {
                var value = response[key]
                console.log(value)
                var food = new FoodRdf()
                food.type = value["type"]
                food.name = value["name"]
                food.fats = value["fats"]
                food.proteins = value["proteins"]
                food.salts = value["salts"]
                food.vitamins = value["vitamins"]
                food.caloriesPer100 = value["caloriesPer100"]
                food.carbs = value["carbs"]
                food.id = value["id"]
                food.imageUrl = value["imageUrl"]
                food.bestEatenAt = value["bestEatenAt"]
                this.currentFoodSuggestions.push(food)
              });
            });
        }
      });
  }
  onMealButtonClicked(mealName: string, food: FoodRdf) {
    var day: DayOfWeek = DayOfWeek[this.dayPicked];
    if (this.diet.dailyFood.get(day).find(m => m.mealType === mealName)
      .allFoodEntries.find(f => f.name === food.name)) {
      this.snackBar.open("Food " + food.name + " already present!", "OK", { duration: 3000 });
      return;
    }
    var foodForDiet = new Food()
    foodForDiet.name = food.name;
    foodForDiet.proteins = food.proteins;
    foodForDiet.quantity = 100;
    foodForDiet.caloriesPer100 = food.caloriesPer100;
    foodForDiet.vitamins = food.vitamins;
    foodForDiet.fats = food.fats;
    foodForDiet.carbs = food.carbs;
    foodForDiet.salts = food.salts;
    foodForDiet.type = food.type;
    foodForDiet.calories = food.caloriesPer100
    foodForDiet.id = food.id
    this.dietService.updateMealRequest(foodForDiet, mealName, day)
      .subscribe(() => {
        var user = JSON.parse(sessionStorage["user"]) as User

        var caloriesCount = this.diet.caloriesPerDay.get(day);
        if (caloriesCount > user.basicMetabolicRate) {
          const dialogRef = this.dialog.open(InformationDialogComponent,
            {
              width: "350px",
              data: {
                bmr: user.basicMetabolicRate, userName: user.userName,
                dietName: this.diet.name, foodAdded: food,
                day: this.dayPicked, calories: caloriesCount
              }
            })
          dialogRef.afterClosed().subscribe(() => {
            this.snackBar.open(foodForDiet.name + " has been added!", "OK", {
              duration: 2000
            });
          })
        }
        else {
          this.snackBar.open(foodForDiet.name + " has been added!", "OK", {
            duration: 2000
          });
        }
        this.dietService.updateMealHandler(foodForDiet, mealName, day);

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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    var width = event.target.innerWidth
    if (width > 1200) {
      this.hide = false;
    }
    else if (width > 768 && width <= 1200) {
      this.hide = true
    }
    else {
      this.hide = false;
    }

  }
  openDialog() {

  }
}


