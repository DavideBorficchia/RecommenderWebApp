import { Component, OnInit, HostListener } from '@angular/core';
import { FoodType } from 'src/app/model/foodtypes';
import { WeekDay } from '@angular/common';
import { Diet } from 'src/app/model/diet';
import { DietService } from 'src/app/services/diet.service';
import { DayOfWeek } from 'src/app/model/daysofweek';



@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.css']
})
export class DietComponent implements OnInit {


  isSmall: boolean
  isNameChanging: boolean
  diet: Diet;
  dayOfWeekForMobile = [{ day1: 'Monday', day2: 'Tuesday' }, { day1: 'Wednesday', day2: 'Thursaday' }, { day1: 'Friday', day2: 'Saturday' }, { day1: 'Sunday', day2: null }]
  constructor(private dietService: DietService) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= 500) {
      this.isSmall = true
    }
    else {
      this.isSmall = false
    }
  }

  modifyDietName() {
    if (!this.isNameChanging) {
      this.isNameChanging = true;
    }
    else {
      this.isNameChanging = false
    }
  }
  daysOfTheWeek() {

    if (this.isSmall) {
      return Object.values(this.dayOfWeekForMobile)
    }
    else {
      return Object.values(DayOfWeek);

    }
  }
  ngOnInit() {
    if (window.innerWidth <= 500) {
      this.isSmall = true
    }
    this.diet = new Diet()
    this.dietService.getDiet().subscribe(response => {
      console.log(response);
      this.diet = response.body;
      this.diet.dailyFood = this.dietService.getAllFoodEntries();
      this.dietService.setDiet(this.diet);
    })

  }

}
