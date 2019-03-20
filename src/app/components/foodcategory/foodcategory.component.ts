import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FoodCategory } from 'src/app/model/FoodCategory';
import { FoodRecommenderService } from 'src/app/services/food-recommender.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-foodcategory',
  templateUrl: './foodcategory.component.html',
  styleUrls: ['./foodcategory.component.css']
})
export class FoodcategoryComponent implements OnInit {

  @Input() foodCategory: FoodCategory;
  constructor(private foodService: FoodRecommenderService,private route:ActivatedRoute) { }
  @Output() foodCategorySelected = new EventEmitter<FoodCategory>();
  

  ngOnInit() {

    var categoryName = this.route.snapshot.paramMap.get("foodCategoryName");
    if(categoryName){
      this.foodCategory = this.foodService.getCategory(categoryName);
    }
  }

}
