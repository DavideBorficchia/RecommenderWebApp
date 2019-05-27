import { Injectable } from '@angular/core';
import { Food } from 'src/app/model/food';

@Injectable()
export class DataService {
    private shoppingList: Map<String, Food> = new Map();

    public setShoppingList (list: Map<String, Food>){
        this.shoppingList = list;
    }

    public getShoppingList(): Map<String, Food>{
        return this.shoppingList;
    }
}