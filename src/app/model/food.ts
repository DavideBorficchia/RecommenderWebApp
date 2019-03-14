import { FoodType } from "./foodtypes";
import { MealType } from "./mealtypes";

export class Food{
    type:String;
    name:String;
    calories:number;
    fat:number;
    carbs:number;
    proteins:number;
    mealTypes:String[];
    quantity:number;
    caloriesPer100:number;
    salts:number;
    vitamins;
    
}