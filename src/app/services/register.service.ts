import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { User } from '../components/register/model/user';
@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  baseUrl = "http://localhost:8080/recommender/registrations"
  constructor(private httpClient: HttpClient) {

  }

  public doLogin(user: User) {
    let headers = new HttpHeaders({
      'content-type': 'application/json'
    })
    return this.httpClient.post<User>(this.baseUrl.concat("/signup"), user, { headers: headers, observe: 'response' });
  }

}
