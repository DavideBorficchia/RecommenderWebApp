import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Food } from 'src/app/model/food';
import { FoodRecommenderService } from 'src/app/services/food-recommender.service';

@Component({
  selector: 'app-food-recommender',
  templateUrl: './food-recommender.component.html',
  styleUrls: ['./food-recommender.component.css']
})
export class FoodRecommenderComponent implements OnInit {
  @Output() historyClicked = new EventEmitter<boolean>();
  foodAdded: Food;
  currentFoodSuggestions:Food[];  
  constructor(private foodRecommender: FoodRecommenderService) { }


  ngOnInit() {
    this.foodRecommender.getAddedFoodObservable()
      .subscribe(fAdded => {
        console.log(fAdded)
        if(fAdded){
          console.log(fAdded)
          this.foodRecommender.getRecommendationsGoodWiths(fAdded)
            .subscribe(response=> {
              console.log(response)
            });
        }
        
      });
  }

}
