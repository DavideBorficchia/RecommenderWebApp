import { Component, OnInit, Input } from '@angular/core';
import { FoodRecommenderService } from 'src/app/services/food-recommender.service';
import { FoodCategory } from 'src/app/model/FoodCategory';
import { FoodRdf } from 'src/app/model/foodRdf';

@Component({
  selector: 'app-food-list',
  templateUrl: './food-list.component.html',
  styleUrls: ['./food-list.component.css']
})
export class FoodListComponent implements OnInit {

  @Input() foodCategory:FoodCategory;
  private randomNumberForAvatarPlaceHolder:Number;
  private foodRdfs:FoodRdf[];
  constructor(private foodService:FoodRecommenderService) { }

  getRandomAvatar(){
    var random = Math.random();
    return "https://api.adorable.io/avatars/80/"+random.toString()+".png"; 
  }
  ngOnInit() {
    this.foodRdfs = this.foodService.getFoodRdfByCategoryName(this.foodCategory.categoryName);
  }

}
