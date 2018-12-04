import { Goal } from "src/app/goal";



export class User {
    id: string;
    userName: string;
    email: string;
    password: string;
    goal: Goal;
    birthDate: Date;
    gender: string;
    weight: number;
    height: number;
    olderPhysicalActivities: Goal[];
    // constructor(id: string, userName: string, email: string, password: string) {
    //     this.id = id;
    //     this.userName = userName;
    //     this.email = email;
    //     this.password = password;
    // }
}