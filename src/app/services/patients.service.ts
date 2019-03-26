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

    if (!this.patientBehavior) {
      this.patientBehavior = new BehaviorSubject(null)

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
