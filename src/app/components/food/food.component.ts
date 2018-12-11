import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Food } from 'src/app/model/food';
import { DietService } from 'src/app/services/diet.service';
import { DayOfWeek } from 'src/app/model/daysofweek';
import { MealType } from 'src/app/model/mealtypes';
import { MatSnackBar } from '@angular/material';

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
  constructor(private dietService: DietService, public snackBar:MatSnackBar) { }

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
    console.log("updating food quantity " + this.food.quantity)
    this.food.calories = this.food.caloriesPer100 * this.food.quantity / 100
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.dietService.updateFoodAndQuantityAndCaloriesRequest(this.food,this.day,this.mealType).subscribe(response=>{
        if(response.ok){
          this.dietService.updateQuantityAndCaloriesHandler(this.food,this.day,this.mealType);
          this.snackBar.open("Food quantity has been updated, new calories count for "+this.day.toString()+": "+this.dietService.getCurrentDiet().caloriesPerDay.get(this.day).toString(),
          "OK",{
            duration:3500
          })
        }
        else{
          this.snackBar.open("Quantity could not be updated","OK",{
            duration:3500

          })
        }
      })
    }, 10000);
    return this.food.calories;


  }

  ngOnInit() {
    if (innerWidth <= 500) {
      this.isOver = true;
    }
  }

}
