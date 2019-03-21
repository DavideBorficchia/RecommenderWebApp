import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Food } from 'src/app/model/food';


export class BMRDialogData {
  bmr: number;
  userName: string;
  dietName: string;
  day: string;
  foodAdded: Food;
  calories:number
}
@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.css']
})
export class InformationDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: BMRDialogData, 
  public dialogRef: MatDialogRef<InformationDialogComponent>) {
    
   }

  onGotItClicked(){
    this.dialogRef.close();
  }
  ngOnInit() {
    console.log(BMRDialogData)
  }

}
