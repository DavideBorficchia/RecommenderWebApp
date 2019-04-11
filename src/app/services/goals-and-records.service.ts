import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Goal } from '../model/goal';
import { PhysicalActivityRecord } from '../model/physicalactivityrecord';

@Injectable({
  providedIn: 'root'
})
export class GoalsAndRecordsService {



  private baseUrlGoals = "http://localhost:8080/recommender/goals"
  private baseUrlRecords = "http://localhost:8080/recommender/records"
  private goalBehavior: BehaviorSubject<Goal>;
  private recordsBehavior: BehaviorSubject<PhysicalActivityRecord[]>;

  constructor(private httpClient: HttpClient) { }

  // postRecord(record: Record) {
  //   return this.httpClient.post<Record>(this.baseUrl + "/records")
  //     .pipe(catchError(error => throwError(error)));
  // }
  postGoal(goal: Goal) {
    return this.httpClient.post<Goal>(this.baseUrlGoals + "/weekly", goal)
      .pipe(catchError(error => throwError(error)));

  }
  getCurrentGoalForDiet(dietId: string, userId: string) {
    return this.httpClient.get<Goal>(this.baseUrlGoals + "/weekly", {
      params: {
        userId: userId,
        dietId: dietId
      }
    })
      .pipe(catchError(error => throwError(error)));

  }
  getRecords(startDate: string, endDate: string, dietId: string, userId: string, paId: string) {
    return this.httpClient.get<PhysicalActivityRecord[]>(this.baseUrlRecords + "/" + userId + "/activities/" + paId, {
      params: {
        startDate: startDate,
        endDate: endDate,
        dietId: dietId
      }
    }).pipe(catchError(error => throwError(error)));
  }
  postRecord(record: PhysicalActivityRecord, dietId: string, physicalActivityId: string, userId: string) {
    return this.httpClient.post<PhysicalActivityRecord>(this.baseUrlRecords + "/" + userId + "/diets/" + dietId + "/activities/" + physicalActivityId, record).pipe(catchError(error => throwError(error)));
  }
  getObservableGoal() {
    if (!this.goalBehavior) {
      this.goalBehavior = new BehaviorSubject(null);
    }
    return this.goalBehavior;
  }
  setNewObservableGoal(goal: Goal) {
    if (!this.goalBehavior) {

      this.goalBehavior = new BehaviorSubject(goal);
    }
    else {
      this.goalBehavior.next(goal);
    }
  }
  getObservableRecords() {
    if (!this.recordsBehavior) {
      this.recordsBehavior = new BehaviorSubject(null);
    }
    return this.recordsBehavior;

  }
  setNewObservableRecords(records: PhysicalActivityRecord[]) {
    if (!this.recordsBehavior) {
      this.recordsBehavior = new BehaviorSubject(records);
    }
    else {
      this.recordsBehavior.next(records)
    }
  }
  updateGoal(currentGoal: Goal) {
    return this.httpClient.put<Goal>(this.baseUrlGoals + "/weekly", currentGoal)
      .pipe(catchError(error => throwError(error)));

  }
  updateGoalAdherence(goal: Goal, startDate: string, endDate: string) {
    return this.httpClient.put<Goal>(this.baseUrlGoals + "/weekly/adherence", goal, {
      params: {
        startDate: startDate,
        endDate: endDate
      }
    })
      .pipe(catchError(error => throwError(error)));
  }


}
