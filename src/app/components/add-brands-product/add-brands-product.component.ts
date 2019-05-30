import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductInBrand } from 'src/app/model/productInBrand';

@Component({
  selector: 'app-add-brands-product',
  templateUrl: './add-brands-product.component.html',
  styleUrls: ['./add-brands-product.component.css']
})
export class AddBrandsProductComponent implements OnInit {

  brandsOntology: string;
  rowBrandsOntology: string[] = [];
  allProducts: ProductInBrand[] = [];
  displayedColumns: string[] = ['Brand', 'product', 'price'];

  constructor(private http: HttpClient) {
    this.http.get('./assets/brands.rdf', {responseType: 'text'})
        .subscribe(data => {
          this.brandsOntology = data;
          this.rowBrandsOntology = this.brandsOntology.split("\n");   
          this.getBrandsAndProduct(); 
          this.allProducts.forEach(e => console.log(e));
        });    
   }

  ngOnInit() {
  }

  getBrandsAndProduct(){ 
    if(this.rowBrandsOntology.length > 0){
      for (var i: number = 0; i < this.rowBrandsOntology.length; i++){
        if (this.rowBrandsOntology[i].includes("brand:name")){
          var brandName = this.getProperyValue(this.rowBrandsOntology[i]);
          console.log(brandName);
          for (var productIndex: number = i; productIndex < this.rowBrandsOntology.length; productIndex++){
            if(this.rowBrandsOntology[productIndex].includes("brand:pricePerGr")){
              console.log(this.getProperyValue(this.rowBrandsOntology[productIndex - 1]));
              console.log(this.getProperyValue(this.rowBrandsOntology[productIndex]));
              // var p: ProductInBrand = new ProductInBrand();
              // p.product = this.getProperyValue(this.rowBrandsOntology[productIndex - 1]);
              // p.brandName = brandName;
              // p.price = this.getProperyValue(this.rowBrandsOntology[productIndex]);
              // this.allProducts.push(p);
            }
            if (this.rowBrandsOntology[productIndex].includes("/brand:produts")){ //blocco la ricerca dei prodotto di questo brand quando arrivo a questa chiusura di tag
              productIndex = this.rowBrandsOntology.length;
            }
          }
        }
      }
    }
  }

  getProperyValue(row: string): string{
    return (row.split(/(?=<)|(?<=>)/)[2]);
  }

}
