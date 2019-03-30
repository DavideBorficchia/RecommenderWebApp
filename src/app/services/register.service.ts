import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { User } from '../components/register/model/user';
import { catchError } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Nutritionist } from '../model/nutritionist';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {


  baseUrl = "http://localhost:8080/recommender/users/registrations"
  private userBehavior: BehaviorSubject<User>;
  private nutritionistBehavior: BehaviorSubject<Nutritionist>;
  currentNutritionist: Nutritionist;
  constructor(private httpClient: HttpClient) {

  }

  public doSignUp(user: User) {
    let headers = new HttpHeaders({
      'content-type': 'application/json'
    })
    return this.httpClient.post<User>(this.baseUrl.concat("/signup"), user, { headers: headers, observe: 'response' })
      .pipe(catchError(error => { return throwError(error) }));
  }
  public doLogin(email: string) {
    const parames = new URLSearchParams().set("email", email)
    return this.httpClient.get<User>(this.baseUrl.concat('/signin/' + email), {
      observe: 'response'
    }).pipe(catchError(error => {
      console.log(error)
      return throwError(error)
    }));
  }
  public updateDetails(user: User) {
    let headers = new HttpHeaders({
      'content-type': 'application/json'
    })
    return this.httpClient.put<User>(this.baseUrl.concat("/update"), user, { headers: headers, observe: 'response' })
      .pipe(catchError(error => {
        return throwError(error)
      }))
  }
  public setUserBehavior(user: User) {
    if (!this.userBehavior) {
      this.userBehavior = new BehaviorSubject(user)
    }
    this.userBehavior.next(user);
  }

  public getUserObservable() {
    var currentUser: User;
    sessionStorage["user"] ? currentUser = JSON.parse(sessionStorage["user"]) as User : null
    if (currentUser && !currentUser.email.includes("nutrizionista")) {
      currentUser.birthDate = new Date(currentUser.birthDate)
    }
    else{
      currentUser = null;
    }
    if (!this.userBehavior) {
      this.userBehavior = new BehaviorSubject(currentUser)
      return this.userBehavior;

    }
    return this.userBehavior
  }
  public setNutritionistBehavior(nutritionist: Nutritionist) {
    if (!this.nutritionistBehavior) {
      this.currentNutritionist = nutritionist;
      this.nutritionistBehavior = new BehaviorSubject(nutritionist)
    }
    this.nutritionistBehavior.next(nutritionist);
  }

  public getNutritionistObservable() {
    var currentUser: Nutritionist;
    sessionStorage["user"] ? currentUser = JSON.parse(sessionStorage["user"]) as Nutritionist : null
    var nutritionist = new Nutritionist();
    if (currentUser) {
      nutritionist.email = currentUser["email"];
      nutritionist.id = currentUser["id"];
      nutritionist.patients = []
      nutritionist.userName = currentUser["userName"]
      if (currentUser["patients"]) {
        Object.values(currentUser["patients"]).forEach(value => {
          var patient = new User();
          patient.id = value["id"]
          patient.basicMetabolicRate = value["basicMetabolicRate"]
          patient.birthDate = new Date(value["birthDate"])
          patient.email = value["email"]
          patient.gender = value["gender"]
          patient.height = value["height"]
          patient.userName = value["userName"]
          patient.weight = value["weight"]
          patient.imageUrl = value["imageUrl"]
          nutritionist.patients.push(patient)
        })
        var currentPatient = currentUser["currentPatient"]
        if (currentPatient) {
          nutritionist.currentPatient = new User();

          nutritionist.currentPatient.id = currentPatient["id"]
          nutritionist.currentPatient.basicMetabolicRate = currentPatient["basicMetabolicRate"]
          nutritionist.currentPatient.birthDate = new Date(currentPatient["birthDate"])
          nutritionist.currentPatient.email = currentPatient["email"]
          nutritionist.currentPatient.gender = currentPatient["gender"]
          nutritionist.currentPatient.height = currentPatient["height"]
          nutritionist.currentPatient.userName = currentPatient["userName"]
          nutritionist.currentPatient.weight = currentPatient["weight"]
          nutritionist.currentPatient.imageUrl = currentPatient["imageUrl"]
          nutritionist.currentPatient.userName = currentPatient["userName"];
        }
      }
      else {
        nutritionist = null;
      }


    }

    if (!this.nutritionistBehavior) {
      this.nutritionistBehavior = new BehaviorSubject(nutritionist)
      return this.nutritionistBehavior;

    }
    return this.nutritionistBehavior
  }
  getAllNutritionistPatients(currentNutritionist: Nutritionist) {
    return this.httpClient.get<User[]>(this.baseUrl + "/nutritionists/" + currentNutritionist.id + "/patients/all")
  }

}
