import { User } from "../components/register/model/user";

export class Nutritionist {
    id: string;
    userName: string;
    email: string;
    password: string;
    patients: User[]
    currentPatient: User;
}