import { Meal } from "./meal";
import { Food } from "./food";
import { MealType } from "./mealtypes";
import { Guid } from "guid-typescript";

export class BreakFast implements Meal {
   
    mealType = MealType.Breakfast;
    allFoodEntries: Food[];

    addFood(food: Food) {
        this.allFoodEntries.push(food)
    }
    removeFood(food: Food) {
        this.allFoodEntries.find(f=>f.type == food.type)
    }

    constructor() {
        this.allFoodEntries = [];
    }


}