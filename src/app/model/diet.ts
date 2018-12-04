import { Meal } from "./meal";
import { DayOfWeek } from "./daysofweek";
import { MealType } from "./mealtypes";
import { Food } from "./food";

export class Diet {
    name: String;
    dailyFood: Map<DayOfWeek, Meal[]>;
    userId: String;
    caloriesPerDay: Map<DayOfWeek, number>;

    constructor(dailyFood: Map<DayOfWeek, Meal[]>,caloriesPerDay: Map<DayOfWeek, number>,name: String,id: String) {
        this.dailyFood =dailyFood;
        this.caloriesPerDay = caloriesPerDay;
        this.name = name? this.name = name : this.name = "No name yet"
        this.userId = id;
    }

 
    
    updateCaloriesPerDay(day: DayOfWeek, food: Food) {

        if (!this.caloriesPerDay.get(day)) {
            this.caloriesPerDay.set(day, food.calories);
        }
        else {
            var currentCaloriesCount = this.caloriesPerDay.get(day);
            var newCaloriesCount = currentCaloriesCount + food.calories;
            this.caloriesPerDay.set(day, newCaloriesCount);
        }

    }
}