import { FoodType } from "./foodtypes";
import { MealType } from "./mealtypes";

export class Food{
    type:String;
    name:String;
    calories:number;
    fat:number;
    carbs:number;
    proteins:number;
    healthy:String;
    mealTypes:String[];
    quantity:number;
    caloriesPer100:number;
    
}