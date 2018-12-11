import { Component, OnInit, ViewChild } from '@angular/core';
import { DietComponent } from '../diet/diet.component';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css']
})
export class DiaryComponent implements OnInit {

  @ViewChild('appdiet') appDiet:DietComponent
  isHistoryClicked:boolean = false;
  isSuggestionsClicked:boolean = false;
  constructor() { }

  onHistoryClicked(){
    console.log(this.isHistoryClicked)
    this.appDiet.onHistoryClicked()
  }
  onSuggestionsClicked(){
    this.appDiet.onSuggestionsClicked()
  }
  onDietClicked(){
    this.appDiet.onDietSelected()
  }
  ngOnInit() {
  }

}
