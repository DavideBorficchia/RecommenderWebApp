import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Food } from 'src/app/model/food';
import { DietService } from 'src/app/services/diet.service';
import { DayOfWeek } from 'src/app/model/daysofweek';
import { MealType } from 'src/app/model/mealtypes';
import { MatSnackBar, MatDialog } from '@angular/material';
import { User } from '../register/model/user';
import { InformationDialogComponent } from '../information-dialog/information-dialog.component';
import { Diet } from 'src/app/model/diet';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {

  @Input() food: Food;
  @Input() day: DayOfWeek;
  @Input() mealType: MealType;
  timeout;
  isOver: boolean;
  diet: Diet;
  constructor(private dietService: DietService, public snackBar: MatSnackBar,
    public dialog: MatDialog) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= 500) {
      this.isOver = true;
    }
    else {
      this.isOver = false;
    }
  }
  onQuantityChange(event) {

    this.food.quantity = event
    this.food.calories = Number.parseFloat(((this.food.caloriesPer100 * this.food.quantity) / 100).toFixed(2))
    this.food.vitamins = Number.parseFloat(((this.food.vitaminsPer100 * this.food.quantity) / 100).toFixed(2))
    this.food.fats = Number.parseFloat(((this.food.fatsPer100 * this.food.quantity) / 100).toFixed(2))
    this.food.carbs = Number.parseFloat(((this.food.carbsPer100 * this.food.quantity) / 100).toFixed(2))
    this.food.proteins = Number.parseFloat(((this.food.proteinsPer100 * this.food.quantity) / 100).toFixed(2))
    this.food.salts = Number.parseFloat(((this.food.saltsPer100 * this.food.quantity) / 100).toFixed(2))
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.dietService.updateFoodAndQuantityAndCaloriesRequest(this.food, this.day, this.mealType).subscribe(response => {
        if (response.ok) {
          this.dietService.updateQuantityAndCaloriesHandler(this.food, this.day, this.mealType);
          var user = JSON.parse(sessionStorage["user"]) as User

          var caloriesCount = this.diet.caloriesPerDay.get(this.day);
          if (caloriesCount > user.basicMetabolicRate) {
            this.dialog.open(InformationDialogComponent,
              {
                width: "350px",
                data: {
                  bmr: user.basicMetabolicRate, userName: user.userName,
                  dietName: this.diet.name, foodAdded: this.food,
                  day: this.day, calories: caloriesCount
                }
              })
          }

          this.snackBar.open(this.food.name + " has been added!", "OK", {
            duration: 2000
          });
          this.snackBar.open("Food quantity has been updated, new calories count for " + this.day.toString() + ": " + this.dietService.getCurrentDiet().caloriesPerDay.get(this.day).toString(),
            "OK", {
              duration: 3500
            })
        }
        else {
          this.snackBar.open("Quantity could not be updated", "OK", {
            duration: 3500

          })
        }
      })
    }, 5000);
    return this.food.calories;


  }

  ngOnInit() {
    if (innerWidth <= 500) {
      this.isOver = true;
    }
    this.dietService.getObservableDiet().subscribe(diet => {
      this.diet = diet;
    })
  }

}
