import { Meal } from "./meal";
import { DayOfWeek } from "./daysofweek";
import { MealType } from "./mealtypes";

export class Diet{
    name:String;
    dailyFood:Map<DayOfWeek,Meal[]>;
    id:String;

    constructor(){
        this.dailyFood = new Map();
        
        this.name="No Name Yet"
    }
}