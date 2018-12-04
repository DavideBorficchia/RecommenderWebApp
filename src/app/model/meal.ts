import { MealType } from "./mealtypes";
import { Food } from "./food";



export interface Meal{

    mealType:MealType;
    allFoodEntries:Food[]

    addFood(food:Food);
    removeFood(food:Food);
}