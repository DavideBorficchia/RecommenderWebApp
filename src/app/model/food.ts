import { FoodType } from "./foodtypes";
import { MealType } from "./mealtypes";

export class Food{
    type:FoodType;
    name:String;
    calories:number;
    fat:number;
    carbs:number;
    proteins:number;
    healthy:String;
    mealTypes:MealType[];
    quantity:number;
    caloriesPer100:number;
    
}