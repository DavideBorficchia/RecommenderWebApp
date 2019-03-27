import { Injectable } from '@angular/core';
import { PhysicalActivity } from '../model/physicalactivity';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhysicalActivitiesService {

  baseUrl = "http://localhost:8080/recommender/activities"
  constructor(private httpClient: HttpClient) { }

  createNewPhysicalActivity(physicalActivity: PhysicalActivity, userId: string) {
    return this.httpClient.post<PhysicalActivity>(this.baseUrl + "/creations", physicalActivity, {
      params: {
        userId: userId
      }
    }).pipe(catchError(error => throwError(error)))
  }
  getAllPhysicalActivities(userId: string) {
    return this.httpClient.get<PhysicalActivity[]>(this.baseUrl + "/all", {
      params: {
        userId: userId
      }
    }).pipe(catchError(error => throwError(error)));
  }
  updatePhysicalActivity(physicalActivity: PhysicalActivity, userId: string) {
    return this.httpClient.put<PhysicalActivity>(this.baseUrl + "/" + physicalActivity.id + "/updates", physicalActivity, {
      params: {
        userId: userId
      }
    }).pipe(catchError(error => throwError(error)));
  }
}
