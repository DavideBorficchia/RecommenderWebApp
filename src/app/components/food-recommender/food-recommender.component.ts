import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-food-recommender',
  templateUrl: './food-recommender.component.html',
  styleUrls: ['./food-recommender.component.css']
})
export class FoodRecommenderComponent implements OnInit {
  @Output() historyClicked = new EventEmitter<boolean>();
    constructor(private router: Router) { }

 
  ngOnInit() {
  }

}
