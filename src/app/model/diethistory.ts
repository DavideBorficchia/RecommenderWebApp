export class DietHistory{
    timeStamp:String;
    name:String;
    totalCalories:number;
    constructor(name:String,timeStamp:String,totalCalories:number){
        this.timeStamp = timeStamp;
        this.name = name;
        this.totalCalories = totalCalories;
    }
}