import { Injectable } from '@angular/core';
import { PhysicalActivity } from '../model/physicalactivity';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PhysicalActivitiesService {

  baseUrl = "http://localhost:8080/recommender/activities"
  physicalActivitiesBehaviour:BehaviorSubject<PhysicalActivity[]>;
  constructor(private httpClient: HttpClient) { }

  createNewPhysicalActivity(physicalActivity: PhysicalActivity, userId: string) {
    return this.httpClient.post<PhysicalActivity>(this.baseUrl+"/customizations", physicalActivity, {
      params: {
        userId: userId
      }
    }).pipe(catchError(error => throwError(error)))
  }
  getAllPhysicalActivities(userId: string) {
    return this.httpClient.get<PhysicalActivity[]>(this.baseUrl + "/customizations/all", {
      params: {
        userId: userId
      }
    }).pipe(catchError(error => throwError(error)));
  }
  updatePhysicalActivity(physicalActivity: PhysicalActivity, userId: string) {
    return this.httpClient.put<PhysicalActivity>(this.baseUrl+"/customizations", physicalActivity, {
      params: {
        userId: userId
      }
    }).pipe(catchError(error => throwError(error)));
  }
  getObservablePhysicalActivities(){
    if(!this.physicalActivitiesBehaviour){
      this.physicalActivitiesBehaviour = new BehaviorSubject(null);
    }
    return this.physicalActivitiesBehaviour;
  }
  setObservablePhysicalActivities(activities:PhysicalActivity[]){
    if(!this.physicalActivitiesBehaviour){
      this.physicalActivitiesBehaviour = new BehaviorSubject(activities);
    }
    else{
      this.physicalActivitiesBehaviour.next(activities)
    }
  }

}
