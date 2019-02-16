import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { User } from '../components/register/model/user';
import { catchError } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  // baseUrl = "http://localhost:8080/recommender/users/registrations"
  baseUrl = "https://recommender-gateway.herokuapp.com/recommender/users/registrations"
  private userBehavior:BehaviorSubject<String>;
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
  public setUserBehavior(userId:String){
    this.userBehavior = new BehaviorSubject(userId)
    this.userBehavior.next(userId);
  }

  public getUserObservable(){
    var currentUser = JSON.parse(sessionStorage["user"]) as User
    if(!this.userBehavior){
      this.userBehavior = new BehaviorSubject(currentUser.id)
      this.userBehavior.next(currentUser.id)
      return this.userBehavior.asObservable();

    }
    return this.userBehavior.asObservable()
  }
}
