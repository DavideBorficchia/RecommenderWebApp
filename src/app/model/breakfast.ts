import { Meal } from "./meal";
import { Food } from "./food";
import { MealType } from "./mealtypes";
import { Guid } from "guid-typescript";
import { FoodAlreadyAddedException } from "./foodalreadyaddedexception";
import { MealImpl } from "./abstarctmeal";

export class BreakFast extends MealImpl {
    
    mealType = MealType.Breakfast;
   
    // mealType = MealType.Breakfast;
    // allFoodEntries: Food[];

    constructor() {
        super();
    }


}