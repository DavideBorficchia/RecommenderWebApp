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

  constructor(private ds:DataService, private router:Router, private http: HttpClient) {
    this.shoppingList = ds.getShoppingList();

    this.http.get('./assets/brands.rdf', {responseType: 'text'})
        .subscribe(data => console.log(data));
  }

  ngOnInit() {

  }

  backToShopping(){
    this.router.navigateByUrl("/home/shopping-list");
  }

}
