import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Food } from 'src/app/model/food';
import { DietService } from 'src/app/services/diet.service';
import { DayOfWeek } from 'src/app/model/daysofweek';
import { MealType } from 'src/app/model/mealtypes';

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
  constructor(private dietService: DietService) { }

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

    this.food.calories = this.food.caloriesPer100 * this.food.quantity / 100
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.dietService.updateQuantityAndCalories(this.food, this.day, this.mealType)
    }, 10000);
    return this.food.calories;


  }

  ngOnInit() {
    if (innerWidth <= 500) {
      this.isOver = true;
    }
  }

}
