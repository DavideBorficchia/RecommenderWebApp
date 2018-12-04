import { Component, OnInit, HostListener } from '@angular/core';
import { FoodType } from 'src/app/model/foodtypes';
import { WeekDay } from '@angular/common';
import { Diet } from 'src/app/model/diet';
import { DietService } from 'src/app/services/diet.service';
import { DayOfWeek } from 'src/app/model/daysofweek';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { User } from '../register/model/user';
import { MatSnackBar } from '@angular/material';



@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.css']
})
export class DietComponent implements OnInit {

  currentDietName:String;
  isSpinnerShown: boolean;
  isSmall: boolean
  isNameChanging: boolean
  diet: Diet;
  isReady: boolean;
  isDietEditable: boolean;
  dayOfWeekForMobile = [{ day1: 'Monday', day2: 'Tuesday' }, { day1: 'Wednesday', day2: 'Thursaday' }, { day1: 'Friday', day2: 'Saturday' }, { day1: 'Sunday', day2: null }]
  constructor(private dietService: DietService, public snackBar: MatSnackBar) { }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth <= 500) {
      this.isSmall = true
    }
    else {
      this.isSmall = false
    }
  }


  createNewDiet() {
    this.isNameChanging = false;
    this.isSpinnerShown = true;
    this.dietService.createNewDiet().subscribe(response => {
      if (response.status < 400) {
        setTimeout(() => {
          this.diet = new Diet(response.body.dailyFood, response.body.caloriesPerDay, response.body.name, response.body.userId)
          this.isReady = true;
          this.isDietEditable = true;
          this.isSpinnerShown = false;

          if (!this.diet.dailyFood.values) {
            this.diet.dailyFood = this.dietService.createEmptyFoodEntries()

          }
          if (!this.diet.caloriesPerDay.values) {
            this.diet.caloriesPerDay = new Map();
          }

          this.dietService.setDiet(this.diet);
          this.snackBar.open("A new Diet has been added! You can start adding food", "OK",
            {
              duration: 3500
            })
        }, 500)

      }
    }, (error: HttpErrorResponse) => {
      
      this.isSpinnerShown = false
      if(error.status == 0){
        this.snackBar.open("Error. Either server is down or your internet is not working","OK",{
          duration:3500
        })
      }
      else if (error.status < 500) {
        this.snackBar.open(error.error, "OK",
          {
            duration: 3500
          })
      }
      else {
        console.log(error)
        this.snackBar.open("Error with server", "OK")
      }
    })
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
    var user = JSON.parse(sessionStorage["user"]) as User;

    // this.diet = new Diet()
    this.dietService.getDiet(user.id).subscribe(response => {

      this.diet = new Diet(response.body.dailyFood, response.body.caloriesPerDay, response.body.name, response.body.userId)
      this.currentDietName = this.diet.name;
      this.isReady = true;
      this.isDietEditable = true;

      if (!this.diet.dailyFood.values) {
        this.diet.dailyFood = this.dietService.createEmptyFoodEntries()

      }
      if (!this.diet.caloriesPerDay.values) {
        this.diet.caloriesPerDay = new Map();
      }

      this.dietService.setDiet(this.diet);
    }, (error: HttpErrorResponse) => {
      this.isDietEditable = false;
      if (error.status < 500) {
        this.isReady = true
        console.log(error.error + " " + error.status)
        this.diet = new Diet(new Map(), new Map(), null, user.id);
        this.diet.dailyFood = this.dietService.createEmptyFoodEntries();
        this.dietService.setDiet(this.diet)
        this.currentDietName = this.diet.name;


      }
      else {
        this.isReady = true
        console.log(error.error + " " + error.status)
        this.diet = new Diet(new Map(), new Map(), null, user.id);
        this.diet.dailyFood = this.dietService.createEmptyFoodEntries();
        this.dietService.setDiet(this.diet)
        this.currentDietName = this.diet.name;
      }
    })

  }

}
