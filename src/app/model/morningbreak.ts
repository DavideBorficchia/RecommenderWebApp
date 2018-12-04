import { Meal } from "./meal";
import { Food } from "./food";
import { MealType } from "./mealtypes";

export class MorningBreak implements Meal {
   
    mealType = MealType.MorningBreak;

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