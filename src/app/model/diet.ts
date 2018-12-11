import { DayOfWeek } from "./daysofweek";
import { Food } from "./food";
import { Meal } from "./abstarctmeal";
import { Guid } from "guid-typescript";

export class Diet {
    private id: String;
    name: String;
    dailyFood: Map<DayOfWeek, Meal[]>;
    userId: String;
    caloriesPerDay: Map<DayOfWeek, number>;
    timeStamp : Date;
    totalCalories:number;

    constructor(dailyFood: Map<DayOfWeek, Meal[]>, caloriesPerDay: Map<DayOfWeek, number>, name: String, id: String) {
        this.dailyFood = dailyFood;
        this.caloriesPerDay = caloriesPerDay;
        this.name = name ? this.name = name : this.name = "No name yet"
        this.userId = id;
        this.id = Guid.create().toString();
        this.totalCalories = 0;
        
    }



    updateCaloriesPerDay(day: DayOfWeek, food: Food) {
        var dailyCalories = 0;
        this.dailyFood.get(day).forEach(meal => {
            meal.allFoodEntries.forEach(food => {
                dailyCalories += food.calories;
            })
        })
        this.caloriesPerDay.set(day, dailyCalories)
        this.updateTotalCalories();


    }

    private updateTotalCalories(){
    
        this.dailyFood.forEach((value,key)=>{
            value.forEach(meal=>{
                meal.allFoodEntries.forEach(food=>{
                    this.totalCalories+=food.calories;
                })
            })
        })
    }
    

}