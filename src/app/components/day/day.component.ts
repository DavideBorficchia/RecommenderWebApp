import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { MealType } from 'src/app/model/mealtypes';
import { MatAccordion } from '@angular/material';
import { DayOfWeek } from 'src/app/model/daysofweek';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.css']
})
export class DayComponent implements OnInit {

  @ViewChild('dayaccordion') dayAccordion:MatAccordion
  @Input() day:DayOfWeek;
  constructor() { }
  mealTypes(){
    return Object.values(MealType)
  }
  ngOnInit() {
    this.dayAccordion.closeAll()
    // console.log(this.day)
  }

}
