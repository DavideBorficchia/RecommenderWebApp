import { Component, OnInit, HostListener, Input } from '@angular/core';
import { Food } from 'src/app/model/food';
import { DietService } from 'src/app/services/diet.service';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.css']
})
export class FoodComponent implements OnInit {

  @Input() food:Food;

  isOver:boolean;
  constructor(private dietService:DietService) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= 500) {
      this.isOver = true;
    }
    else{
      this.isOver = false;
    }
  }
  onQuantityChange(event){
    this.food.quantity = event
    
    this.food.calories=this.food.caloriesPer100*this.food.quantity/100
    console.log("quantity: "+event+" calories: "+this.food.calories)
    console.log(this.dietService.getCurrentDiet())
  }
  
  ngOnInit() {
    if (innerWidth <= 500) {
      this.isOver = true;
    }
  }

}
