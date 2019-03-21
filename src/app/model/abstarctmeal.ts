import { MealType } from "./mealtypes";
import { Food } from "./food";
import { FoodAlreadyAddedException } from "./foodalreadyaddedexception";

export class Meal {
    public mealType: String;
    public allFoodEntries: Food[];

    addFood(food: Food) {
        var foodIndex = this.allFoodEntries.findIndex(f => f.name == food.name)
        if (foodIndex < 0) {
            this.allFoodEntries.push(food)
            return true
        }
        else {
            return false;
        }


    }
    removeFood(food: Food) {
        var foodIndexToRemove = this.allFoodEntries.findIndex(f => f.name == food.name);
        if (foodIndexToRemove >= 0) {
            this.allFoodEntries.splice(foodIndexToRemove, 1)
            return true;
        } else {
            return false;
        }

    }
    constructor() {
        this.allFoodEntries = []
    }

}