import { timestamp } from "rxjs/operators";

export class FoodRdf {

    name: string;
    description: string;
    proteinsPer100: number;
    carbsPer100: number;
    vitaminsPer100: number;
    fatsPer100: number;
    saltsPer100: number;
    caloriesPer100: number;
    goodWith: string[];
    goodSinergyWith: string[];
    type: string;
    imageUrl: string;
    timeStamp: number;
    rdfOutput: string;
    bestEatenAt: string[];
    id:string;
    constructor() { }
    // constructor(name:string,description:string, proteins:number,carbs:number,vitamins:number,fats:number,goodWith:string[],
    //     type:string,imageUrl:string,isHealthy:string,timeStamp:number){
    //        this.name = name;
    //        this.description = description;
    //        this.proteins = proteins;
    //        this.carbs =  carbs;
    //        this.fats = fats;
    //        this.goodWith = goodWith;
    //        this.imageUrl = imageUrl;
    //        this.isHealthy = isHealthy; 
    //        this.timeStamp = timeStamp;
    //     }

   


}