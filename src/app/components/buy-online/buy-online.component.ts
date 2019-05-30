import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/shared-data.service';
import { Food } from 'src/app/model/food';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductInBrand } from 'src/app/model/productInBrand';
import { MatDialog, MatSnackBar } from '@angular/material';

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
  total: number = 0;
  numberOfSelected = 0;

  listBrandPrice: ProductInBrand[] = [];

  constructor(private ds:DataService, private router:Router, private http: HttpClient, public snackBar: MatSnackBar) {

    this.shoppingList = ds.getShoppingList();

    this.http.get('./assets/brands.rdf', {responseType: 'text'})
        .subscribe(data => {
          this.brandsOntology = data;
          this.rowBrandsOntology = this.brandsOntology.split("\n");   
          this.shoppingList.forEach(e => this.getBrandsByProduct(e.name)); //carico in listBrandPrice tutte le triple < prodotto, brand, prezzo >
          //this.listBrandPrice.forEach(elem => console.log(elem));
        });        
  }

  editList(price){
    this.total = this.total + price.value;
  }

  openDialog(){
    this.snackBar.open("Your products will arrived in 3 working days!", "Order completed!", {
      duration: 3000
    });
    this.router.navigateByUrl("/home/diary");
  }

  getBrandsByProduct(productName:string){ 
    if(this.rowBrandsOntology.length > 0){
      for (var i: number = 0; i < this.rowBrandsOntology.length; i++){
        if (this.rowBrandsOntology[i].includes(productName)){
          for (var brandIndex: number = i; brandIndex > 0; brandIndex--){
            if (this.rowBrandsOntology[brandIndex].includes("brand:name")){
              var p: ProductInBrand = new ProductInBrand();
              p.product = productName;
              p.brandName = this.getProperyValue(this.rowBrandsOntology[brandIndex]);
              p.price = this.getProperyValue(this.rowBrandsOntology[i + 1]);
              this.listBrandPrice.push(p);
              brandIndex = 0;
            }
          }
        }
      }
    }
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
