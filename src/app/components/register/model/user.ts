


export class User {
    id: string;
    userName: string;
    email: string;
    password: string;
    birthDate: Date;
    gender: string;
    weight: number;
    height: number;
    basicMetabolicRate: number;
    imageUrl: string;
    patients: User[];
  currentPatient: User;
    // constructor(id: string, userName: string, email: string, password: string) {
    //     this.id = id;
    //     this.userName = userName;
    //     this.email = email;
    //     this.password = password;
    // }
}