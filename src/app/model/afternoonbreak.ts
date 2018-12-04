import { Meal } from "./meal";
import { Food } from "./food";
import { MealType } from "./mealtypes";
import { FoodAlreadyAddedException } from "./foodalreadyaddedexception";
import { MealImpl } from "./abstarctmeal";

export class AfternoonBreak extends MealImpl {
    
    mealType = MealType.AfternoonBreak;
   
    // mealType = MealType.Breakfast;
    // allFoodEntries: Food[];

    constructor() {
        super();
    }

}