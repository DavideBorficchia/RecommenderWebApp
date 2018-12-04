import { Meal } from "./meal";
import { Food } from "./food";
import { MealType } from "./mealtypes";
import { FoodAlreadyAddedException } from "./foodalreadyaddedexception";
import { MealImpl } from "./abstarctmeal";

export class MorningBreak extends MealImpl {
    
    mealType = MealType.MorningBreak;
   
    // mealType = MealType.Breakfast;
    // allFoodEntries: Food[];

    constructor() {
        super();
    }

}