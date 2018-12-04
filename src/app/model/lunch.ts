import { Meal } from "./meal";
import { Food } from "./food";
import { MealType } from "./mealtypes";
import { FoodAlreadyAddedException } from "./foodalreadyaddedexception";
import { MealImpl } from "./abstarctmeal";

export class Lunch extends MealImpl {
    
    mealType = MealType.Lunch;
   
    // mealType = MealType.Breakfast;
    // allFoodEntries: Food[];

    constructor() {
        super();
    }


}