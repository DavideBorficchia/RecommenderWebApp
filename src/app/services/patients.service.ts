import { Injectable } from '@angular/core';
import { User } from '../components/register/model/user';
import { BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  patientBehavior: BehaviorSubject<User>;
  baseUrlPatients = "http://localhost:8080/recommender/users/patients"
  baseUrlNutritionists = "http://localhost:8080/recommender/users/nutritionists"
  constructor(private httpClient: HttpClient) {
  }
  public setCurrentPatient(currentPatient: User) {
    if (!this.patientBehavior) {
      this.patientBehavior = new BehaviorSubject(currentPatient)
    }
    this.patientBehavior.next(currentPatient);
  }

  public getSelectedPatientObservable() {

    var currentUser = sessionStorage["user"] ? JSON.parse(sessionStorage["user"]) as User : null;
    var currentPatient: User;
    if (currentUser && currentUser["currentPatient"]) {
      currentPatient = new User();
      var value = currentUser["currentPatient"]
      currentPatient.id = value["id"]
      currentPatient.basicMetabolicRate = value["basicMetabolicRate"]
      currentPatient.birthDate = new Date(value["birthDate"])
      currentPatient.email = value["email"]
      currentPatient.gender = value["gender"]
      currentPatient.height = value["height"]
      currentPatient.userName = value["userName"]
      currentPatient.weight = value["weight"]
      currentPatient.imageUrl = value["imageUrl"]
    }
    if (!this.patientBehavior) {
      this.patientBehavior = new BehaviorSubject(currentPatient)

      return this.patientBehavior;

    }
    return this.patientBehavior
  }
  public getAllPatients() {
    return this.httpClient.get<User[]>(this.baseUrlPatients + "/all")
      .pipe(catchError(error => {
        return throwError(error)
      }))
  }
}
