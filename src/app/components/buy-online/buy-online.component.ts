import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/shared-data.service';
import { Food } from 'src/app/model/food';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductInBrand } from 'src/app/model/productInBrand';

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
  rowBrandsOntology: string[] = [];

  constructor(private ds:DataService, private router:Router, private http: HttpClient) {
    this.shoppingList = ds.getShoppingList();

    this.http.get('./assets/brands.rdf', {responseType: 'text'})
        .subscribe(data => {
          this.brandsOntology = data;
          this.rowBrandsOntology = this.brandsOntology.split("\n");    
          //console.log(this.getBrandsByProduct("Pollo"));
          //this.brandsMatches.forEach(elem => console.log(elem));
        });        
  }

  getBrandsByProduct(productName:string):ProductInBrand[]{
    console.log("product name " + productName);
    var products: ProductInBrand[] = [];
    for (var i: number = 0; i < this.rowBrandsOntology.length; i++){
      if (this.rowBrandsOntology[i].includes(productName)){
        
        for (var brandIndex: number = i; brandIndex > 0; brandIndex--){
          if (this.rowBrandsOntology[brandIndex].includes("brand:name")){
            var product: ProductInBrand = new ProductInBrand;
            // product.name = this.getProperyValue(this.rowBrandsOntology[brandIndex]);
            // product.price = Number(this.getProperyValue(this.rowBrandsOntology[i + 1]));
            console.log(this.getProperyValue(this.rowBrandsOntology[brandIndex]));
            console.log(this.getProperyValue(this.rowBrandsOntology[i + 1]));
            // products.push(product);
            brandIndex = 0;

            //TODO va a finire in un ciclo infinito
          }
        }
      }
    }
    return products
  }

  getProperyValue(row: string): string{
    return (row.split(/(?=<)|(?<=>)/)[2]);
  }

  ngOnInit() {

  }

  backToShopping(){
    this.router.navigateByUrl("/home/shopping-list");
  }

}
