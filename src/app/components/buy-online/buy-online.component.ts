import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/shared-data.service';
import { Food } from 'src/app/model/food';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Component({
  selector: 'app-buy-online',
  templateUrl: './buy-online.component.html',
  styleUrls: ['./buy-online.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class BuyOnlineComponent implements OnInit {

  shoppingList: Map<String, Food>;
  brandsOntology: string;
  rowBrandsOntology: string[];
  

  constructor(private ds:DataService, private router:Router, private http: HttpClient) {
    this.shoppingList = ds.getShoppingList();

    this.http.get('./assets/brands.rdf', {responseType: 'text'})
        .subscribe(data => {
          //todo leggere singole righe
          //console.log(data)
          this.brandsOntology = data;
          this.rowBrandsOntology = this.brandsOntology.split("\n");    
          this.getBrandsByProduct("Spaghetti al pomodoro");
        });        
  }

getBrandsByProduct(productName:string){
  for (var i: number = 0; i < this.rowBrandsOntology.length; i++){
    //console.log(this.rowBrandsOntology[i]);
    if (this.rowBrandsOntology[i].includes(productName)){
      console.log("------------ INDEX ------------- " + i);
      for (var brandIndex: number = i; brandIndex > 0; brandIndex--){
        if (this.rowBrandsOntology[brandIndex].includes("brand:name")){
          this.getProperyValue(this.rowBrandsOntology[brandIndex]);
          brandIndex = 0;
        }
      }
    }
  }
}

getProperyValue(row: string){
  console.log(row.split(/(?=<)|(?<=>)/)[2]);
}

  ngOnInit() {

  }

  backToShopping(){
    this.router.navigateByUrl("/home/shopping-list");
  }

}
