import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/shared-data.service';
import { Food } from 'src/app/model/food';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buy-online',
  templateUrl: './buy-online.component.html',
  styleUrls: ['./buy-online.component.css']
})
export class BuyOnlineComponent implements OnInit {

  shoppingList: Map<String, Food>;

  constructor(private ds:DataService, private router:Router) {
    this.shoppingList = ds.getShoppingList();
    console.log(this.shoppingList.get("Pollo"));
   }

  ngOnInit() {

  }

  backToShopping(){
    this.router.navigateByUrl("/home/shopping-list");
  }

}
