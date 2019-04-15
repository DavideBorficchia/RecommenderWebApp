import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { DietService } from 'src/app/services/diet.service';
import { Diet } from 'src/app/model/diet';
import { User } from '../register/model/user';
import { DayOfWeek } from 'src/app/model/daysofweek';
import { Meal } from 'src/app/model/abstarctmeal';
import { Food } from 'src/app/model/food';
import { Goal } from 'src/app/model/goal';
import { PhysicalActivity } from 'src/app/model/physicalactivity';
import { MatSlideToggleChange, MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import * as $ from 'jquery';
import { PhysicalActivityRecord } from 'src/app/model/physicalactivityrecord';
import { Guid } from 'guid-typescript';
import { PatientsService } from 'src/app/services/patients.service';
import { PhysicalActivitiesService } from 'src/app/services/physical-activities.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GoalsAndRecordsService } from 'src/app/services/goals-and-records.service';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-physical-activity-creator',
  templateUrl: './physical-activity-creator.component.html',
  styleUrls: ['./physical-activity-creator.component.css']
})
export class PhysicalActivityCreatorComponent implements OnInit, OnDestroy {

  currentPhysicalActivity: PhysicalActivity
  currentGoal: Goal;
  currentDiet: Diet;
  nameIsChanging: boolean = false;
  showRdf: boolean = false;
  descriptionIsChanging = false;
  currentGoalIsChanging = false;
  imageIsClicked = false;
  isUpdating = false;
  isSend = false;
  postRecordSubscription: Subscription = Subscription.EMPTY;
  physicalActivitySubscription: Subscription = Subscription.EMPTY;
  serializedStartDate: FormControl;
  serializedEndDate: FormControl;
  tempPhysicalActivity: PhysicalActivity = new PhysicalActivity();
  goalPhysicalActivity = new PhysicalActivity();
  tempGoal: Goal = new Goal();
  allPhysicalActivityRecords: PhysicalActivityRecord[];
  allPhysicalActivities: PhysicalActivity[];
  activityInCreation: boolean = false;
  records: PhysicalActivityRecord[];
  image: string | ArrayBuffer;
  currentPatient: User;
  isAlreadyAdded: boolean;
  componentReload: boolean = false;
  addNewGoal: boolean = false;
  goalSub: Subscription = Subscription.EMPTY;
  recordsSub: Subscription= Subscription.EMPTY;
  constructor(private dietService: DietService, public snackBar: MatSnackBar,
    private patientService: PatientsService,
    private physicaActivityService: PhysicalActivitiesService,
    private goalService: GoalsAndRecordsService,
    private datePipe: DatePipe) { }

  ngOnInit() {





    this.patientService.getSelectedPatientObservable().subscribe(patient => {
      if (patient) {
        this.allPhysicalActivityRecords = []
        this.allPhysicalActivities = [];
        this.records = [];
        this.currentPatient = patient;
        var defaultPhysicalActivity = new PhysicalActivity();
        defaultPhysicalActivity.name = 'Create new activity'
        defaultPhysicalActivity.description = 'Create a cool rdf physical activity!'
        defaultPhysicalActivity.startDate = new Date();
        defaultPhysicalActivity.endDate = new Date();
        defaultPhysicalActivity.caloriesPerHour = 0;
        defaultPhysicalActivity.rdfOutput = '';
        defaultPhysicalActivity.id = Guid.create().toString();
        defaultPhysicalActivity.userId = this.currentPatient.id;
        defaultPhysicalActivity.imageUrl = 'https://api.adorable.io/avatars/120/' + Math.random().toString() + '.png';
        this.dietService.getObservableDiet().subscribe(diet => {
          if (diet && diet.userId === this.currentPatient.id) {
            this.currentDiet = diet;


            this.postRecordSubscription.unsubscribe()
            this.goalSub.unsubscribe();
            this.physicalActivitySubscription.unsubscribe();
            this.recordsSub.unsubscribe();
            this.physicalActivitySubscription = Subscription.EMPTY;
            this.postRecordSubscription = Subscription.EMPTY;
            this.goalSub = Subscription.EMPTY;
            this.recordsSub = Subscription.EMPTY;

            this.allPhysicalActivities = [];
            this.allPhysicalActivityRecords = [];
            this.records = [];
            this.currentGoal = null;
            this.currentPhysicalActivity = null;
            this.goalPhysicalActivity = null;
            this.tempPhysicalActivity = null;
            this.tempGoal = null;




            this.physicaActivityService.getAllPhysicalActivities(this.currentPatient.id).subscribe(response => {
              if (response) {
                this.allPhysicalActivities = [];
                response.forEach(value => {
                  var physicalActivity = new PhysicalActivity();
                  physicalActivity.name = value['name'];
                  physicalActivity.rdfOutput = value['rdfOutput'];
                  physicalActivity.imageUrl = value['imageUrl'];
                  physicalActivity.description = value['description']
                  physicalActivity.startDate = new Date(value['startDate']);
                  physicalActivity.endDate = new Date(value['endDate']);
                  physicalActivity.caloriesPerHour = value['caloriesPerHour'];
                  physicalActivity.userId = value['userId']
                  physicalActivity.id = value['id']
                  this.allPhysicalActivities.push(physicalActivity)
                })
                this.physicaActivityService.setObservablePhysicalActivities(this.allPhysicalActivities)
              }
              else {
                this.physicaActivityService.setObservablePhysicalActivities([])
              }

            }, (error: HttpErrorResponse) => {
              this.physicaActivityService.setObservablePhysicalActivities([]);
            })




            this.physicalActivitySubscription = this.physicaActivityService.getObservablePhysicalActivities().subscribe(activities => {


              if (activities) {
                this.allPhysicalActivities = activities;
                this.goalSub = this.goalService.getObservableGoal().subscribe(goal => {
                  if (goal && goal.userId === this.currentPatient.id) {
                    this.currentGoal = goal;

                    if (this.currentGoal.physicalActivityId) {
                      this.goalPhysicalActivity = this.allPhysicalActivities.find(pa => pa.id === this.currentGoal.physicalActivityId)


                      this.isAlreadyAdded = true;

                    }
                    else {
                      this.goalPhysicalActivity = defaultPhysicalActivity;
                      this.isAlreadyAdded = false;
                    }
                    this.currentPhysicalActivity = new PhysicalActivity();
                    this.tempPhysicalActivity = new PhysicalActivity();
                    this.tempGoal = new Goal();
                    Object.assign(this.currentPhysicalActivity, this.goalPhysicalActivity)
                    Object.assign(this.tempPhysicalActivity, this.goalPhysicalActivity)
                    Object.assign(this.tempGoal, this.currentGoal);
                    this.serializedStartDate = new FormControl(this.currentPhysicalActivity.startDate);
                    this.serializedEndDate = new FormControl(this.currentPhysicalActivity.endDate)
                    this.serializedStartDate.valueChanges.subscribe((value: string | number | Date) => {

                      console.log(value)
                      if (value !== this.tempPhysicalActivity.startDate) {

                        this.currentPhysicalActivity.startDate = new Date(value)
                        this.onTextAreaDeselect()
                      }

                    })
                    this.serializedEndDate.valueChanges.subscribe(value => {
                      console.log(value)

                      if (value !== this.tempPhysicalActivity.endDate) {

                        this.currentPhysicalActivity.endDate = new Date(value)
                        this.onTextAreaDeselect()
                      }
                    })
                    var start = this.datePipe.transform(this.currentPhysicalActivity.startDate, 'dd/MM/yyyy hh:MM:ss')
                    var end = this.datePipe.transform(this.currentPhysicalActivity.endDate, 'dd/MM/yyyy hh:MM:ss')
                    this.recordsSub = this.goalService.getRecords(start, end, this.currentDiet.id.toString(), this.currentPatient.id,
                      this.tempPhysicalActivity.id).subscribe(response => {
                        if (response) {
                          var records = [];
                          Object.keys(response).forEach(key => {
                            var value = response[key]
                            var recordToAdd = new PhysicalActivityRecord();
                            recordToAdd.id = value['id'];
                            recordToAdd.physicalActivityId = value['physicalActivityId'];
                            recordToAdd.sessionTimeStart = new Date(value['sessionTimeStart']);
                            recordToAdd.sessionTimeEnd = new Date(value['sessionTimeEnd']);
                            recordToAdd.burntCalories = value['burntCalories'];
                            recordToAdd.userId = value['userId'];
                            records.push(recordToAdd)

                          })
                          this.goalService.setNewObservableRecords(records);

                        }
                      }, (error: HttpErrorResponse) => {
                        // this.records = [];
                        //this.goalService.setNewObservableRecords([]);
                        this.snackBar.open("No records found lalalalalalala", 'OK', { duration: 3000 });
                      })
                    if (!this.goalPhysicalActivity.name.includes('Create')
                      && this.allPhysicalActivities.length > 0 && this.postRecordSubscription === Subscription.EMPTY
                      && this.currentGoal.weeklyGoal !== 0) {
                      this.postRecordSubscription = interval(10000).pipe(takeWhile(() => true)).subscribe(() => {
                        var record = new PhysicalActivityRecord();
                        record.id = Guid.create().toString();
                        record.sessionTimeStart = new Date();
                        record.sessionTimeEnd = new Date();
                        record.sessionTimeStart = Object.assign(record.sessionTimeStart, this.goalPhysicalActivity.startDate)
                        record.sessionTimeStart.setHours(new Date(Date.now()).getHours())
                        record.sessionTimeEnd.setHours(record.sessionTimeStart.getHours() + 1);
                        record.sessionTimeEnd.setMinutes(Math.floor(Math.random() * 59) + 1);
                        record.burntCalories = 5 * 10;
                        console.log('posting new activity record...')
                        this.goalService.postRecord(record, this.currentDiet.id.toString(),
                          this.goalPhysicalActivity.id, this.currentPatient.id).subscribe(response => {
                            if (response) {
                              var recordToAdd = new PhysicalActivityRecord();
                              recordToAdd.id = response['id'];
                              recordToAdd.physicalActivityId = response['physicalActivityId'];
                              recordToAdd.sessionTimeStart = new Date(response['sessionTimeStart']);
                              recordToAdd.sessionTimeEnd = new Date(response['sessionTimeEnd']);
                              recordToAdd.burntCalories = response['burntCalories'];
                              recordToAdd.userId = response['userId'];
                            }
                            this.allPhysicalActivityRecords.unshift(recordToAdd)
                            this.goalService.setNewObservableRecords(this.allPhysicalActivityRecords)

                          });
                      });
                    }


                  }
                  else {
                    this.goalService.getCurrentGoalForDiet(this.currentDiet.id.toString(), this.currentPatient.id)
                      .subscribe(goalResponse => {
                        if (goalResponse) {
                          var goal = new Goal()
                          goal.adherence = goalResponse['adherence']
                          goal.id = goalResponse['id'];
                          goal.physicalActivityId = goalResponse['physicalActivityId'];
                          goal.userId = goalResponse['userId'];
                          goal.weeklyGoal = goalResponse['weeklyGoal'];
                          goal.dietId = goalResponse['dietId'];
                          goal.physicalActivityName = this.getPhysicalActivityName(goal.physicalActivityId);

                          this.goalService.setNewObservableGoal(goal)

                        }
                      }, (error: HttpErrorResponse) => {
                        this.addNewGoal = true;
                        var emptyGoal = new Goal();
                        emptyGoal.id = Guid.create().toString();
                        emptyGoal.adherence = 0.0;
                        emptyGoal.dietId = this.currentDiet.id.toString();
                        emptyGoal.userId = this.currentPatient.id;
                        emptyGoal.physicalActivityId = null;
                        emptyGoal.weeklyGoal = 0.0;
                        this.currentGoal = emptyGoal;
                        this.snackBar.open(error.error, 'OK', { duration: 3000 })
                      })
                  }
                })

              }
            })
            this.goalService.getObservableRecords().subscribe(records => {
              if (records) {
                this.allPhysicalActivityRecords = records;
                this.records = this.allPhysicalActivityRecords.filter(record => record.physicalActivityId ===
                  this.goalPhysicalActivity.id);
                var start = this.datePipe.transform(this.currentPhysicalActivity.startDate, 'dd/MM/yyyy hh:MM:ss')
                var end = this.datePipe.transform(this.currentPhysicalActivity.endDate, 'dd/MM/yyyy hh:MM:ss')
                this.goalService.updateGoalAdherence(this.currentGoal, start, end).subscribe(goalResponse => {
                  if (goalResponse) {

                    var goal = new Goal()
                    goal.adherence = goalResponse['adherence']
                    goal.id = goalResponse['id'];
                    goal.physicalActivityId = goalResponse['physicalActivityId'];
                    goal.userId = goalResponse['userId'];
                    goal.weeklyGoal = goalResponse['weeklyGoal'];
                    goal.dietId = goalResponse['dietId'];
                    goal.physicalActivityName = this.getPhysicalActivityName(goal.physicalActivityId);

                    this.currentGoalIsChanging = false;
                    this.currentGoal = goal;

                    Object.assign(this.tempGoal, this.currentGoal);
                    // this.currentDiet.goal = this.tempGoal;
                  }
                }, (error: HttpErrorResponse) => {

                  this.snackBar.open(error.error, 'OK', { duration: 3000 })
                })


              }
            })





            this.columnsSameHeight();
          }
          else {
            this.dietService.getDiet(patient.id)
              .subscribe(response => {
                var map: Map<DayOfWeek, Meal[]> = new Map();

                Object.keys(response.body.dailyFood).forEach(key => {
                  var meals: Meal[] = []
                  Object.values(response.body.dailyFood[key]).forEach(mealValue => {
                    var meal = new Meal();
                    var foodArray = mealValue['allFoodEntries'];
                    Object.values(foodArray).forEach(value => {
                      var food = new Food();

                      food.calories = value['calories'];
                      food.caloriesPer100 = value['caloriesPer100']
                      food.carbs = value['carbs']
                      food.fats = value['fats']
                      // food.mealTypes = value["mealTypes"]
                      food.name = value['name']
                      food.proteins = value['proteins']
                      food.quantity = value['quantity']
                      food.vitamins = value['vitamins'];
                      food.salts = value['salts']
                      food.type = value['type']
                      food.id = value['id']
                      food.saltsPer100 = value['saltsPer100']
                      food.vitaminsPer100 = value['vitaminsPer100']
                      food.fatsPer100 = value['fatsPer100']
                      food.proteinsPer100 = value['proteinsPer100']
                      food.carbsPer100 = value['carbsPer100']
                      food.calories = value['calories']
                      meal.addFood(food);
                    });
                    meal.mealType = mealValue['mealType'];
                    meals.push(meal)
                  });
                  map.set(DayOfWeek[key], meals)


                });
                var caloriesPerDay: Map<DayOfWeek, number> = new Map()
                Object.keys(response.body.caloriesPerDay).forEach(key => {
                  caloriesPerDay.set(DayOfWeek[key], response.body.caloriesPerDay[key])
                });

                var diet = new Diet(map, caloriesPerDay, response.body.name, response.body.userId)
                diet.totalCalories = response.body.totalCalories
                diet.id = response.body.id
                var currentPhysicalActivity = new PhysicalActivity();

                var value = response.body['physicalActivity']
                if (value) {
                  currentPhysicalActivity.name = value['name']
                  currentPhysicalActivity.rdfOutput = value['rdfOutput'];
                  currentPhysicalActivity.imageUrl = value['imageUrl']
                  currentPhysicalActivity.description = value['description']
                  currentPhysicalActivity.startDate = new Date(value['startDate'])
                  currentPhysicalActivity.endDate = new Date(value['endDate'])
                  currentPhysicalActivity.userId = value['userId']
                  currentPhysicalActivity.caloriesPerHour = value['caloriesPerHour'];
                  currentPhysicalActivity.id = value['id']
                }
                diet.physicalActivity = currentPhysicalActivity;
                // var goalResponse = response.body['goal']
                // if (goal) {
                //   var goal = new Goal()
                //   goal.adherence = goalResponse['adherence']
                //   goal.id = goalResponse['id'];
                //   goal.physicalActivityId = goalResponse['physicalActivityId'];
                //   goal.userId = goalResponse['userId'];
                //   goal.weeklyGoal = goalResponse['weeklyGoal'];
                //   goal.dietId = goalResponse['dietId'];
                //   this.currentGoal = goal;
                //   Object.assign(this.tempGoal, this.currentGoal);
                // }
                // diet.goal = goal;



                this.dietService.setDiet(diet);
                this.componentReload = false;
              }, (error: HttpErrorResponse) => {
                this.snackBar.open(error.error, 'OK', { duration: 3000 });
                this.currentDiet = null;
              });



          }
        });
      }
    })



  }

  ngOnDestroy() {
    this.postRecordSubscription.unsubscribe();
    this.physicalActivitySubscription.unsubscribe();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth > 960) {
      this.columnsSameHeight();
    }

  }
  onAddNewGoal() {
    if (!this.currentGoal.physicalActivityId) {
      this.snackBar.open("Add activity first!", "OK", { duration: 3000 });
      return;
    }


    this.currentGoal.physicalActivityId = this.currentPhysicalActivity.id;
    this.goalService.postGoal(this.currentGoal).subscribe(goalResponse => {
      if (goalResponse) {
        var goal = new Goal()
        goal.adherence = goalResponse['adherence']
        goal.id = goalResponse['id'];
        goal.physicalActivityId = goalResponse['physicalActivityId'];
        goal.userId = goalResponse['userId'];
        goal.weeklyGoal = goalResponse['weeklyGoal'];
        goal.dietId = goalResponse['dietId'];
        goal.physicalActivityName = this.getPhysicalActivityName(goal.physicalActivityId);

        this.goalService.setNewObservableGoal(goal)
        this.addNewGoal = false;
      }
    }, (error: HttpErrorResponse) => {
      this.snackBar.open(error.error, 'OK', { duration: 3000 })
    })
  }
  onPaClicked(pa: PhysicalActivity) {

    if (this.isUpdating) {
      this.snackBar.open('Updating physical activity ' + this.currentPhysicalActivity.name + ', wait a bit!', 'OK', { duration: 3000 })
      return
    }
    else {
      this.currentPhysicalActivity = pa;
      this.serializedStartDate = new FormControl(this.currentPhysicalActivity.startDate);
      this.serializedEndDate = new FormControl(this.currentPhysicalActivity.endDate)
      this.nameIsChanging = false;
      this.descriptionIsChanging = false;
      Object.assign(this.tempPhysicalActivity, this.currentPhysicalActivity)
    }
    this.columnsSameHeight();
    if (this.currentGoal.physicalActivityId !== this.currentPhysicalActivity.id) {
      this.isAlreadyAdded = false;
    }
    else {
      this.isAlreadyAdded = true;
    }
  }
  isToday(record: PhysicalActivityRecord) {
    return record.sessionTimeStart.getDay() === new Date().getDay()
  }
  getRecordImage(record: PhysicalActivityRecord) {
    var record = record;
    return this.allPhysicalActivities.find(pa => pa.id === record.physicalActivityId).imageUrl;
  }
  onTextAreaDeselect() {
    if (!this.activityInCreation) {
      this.nameIsChanging = false;
      this.descriptionIsChanging = false;
      this.imageIsClicked = false;
      this.compareTempAndCurrentPhysicalActivity()
      if (!this.tempPhysicalActivity.name.includes('Create') && this.isSend) {
        this.isUpdating = true;
        this.physicaActivityService.updatePhysicalActivity(this.currentPhysicalActivity, this.currentPatient.id)
          .subscribe(paResponse => {
            if (paResponse) {
              var updatePhysicalActivity = new PhysicalActivity();
              updatePhysicalActivity.name = paResponse['name']
              updatePhysicalActivity.rdfOutput = paResponse['rdfOutput'];
              updatePhysicalActivity.imageUrl = paResponse['imageUrl']
              updatePhysicalActivity.description = paResponse['description']
              updatePhysicalActivity.startDate = new Date(paResponse['startDate'])
              updatePhysicalActivity.endDate = new Date(paResponse['endDate'])
              updatePhysicalActivity.caloriesPerHour = paResponse['caloriesPerHour'];
              updatePhysicalActivity.id = paResponse['id'];
              updatePhysicalActivity.userId = paResponse['userId']
              this.isSend = false;
              this.isUpdating = false
              this.currentPhysicalActivity = updatePhysicalActivity;
              var temp = this.allPhysicalActivities.find(pa => pa.id === this.currentPhysicalActivity.id)
              const index = this.allPhysicalActivities.indexOf(temp);


              if (index >= 0) {
                this.allPhysicalActivities.splice(index, 1);
                this.columnsSameHeight()
                this.allPhysicalActivities.push(this.currentPhysicalActivity)

              }
              else {
                this.allPhysicalActivities.push(this.currentPhysicalActivity)
              }
              this.physicaActivityService.setObservablePhysicalActivities(this.allPhysicalActivities)
              // Object.assign(this.tempPhysicalActivity, this.currentPhysicalActivity)
              // Object.assign(this.goalPhysicalActivity, this.currentPhysicalActivity)

              if (this.isAlreadyAdded) {

                this.snackBar.open(this.currentPhysicalActivity.name + ' successfully updated! Reload page', 'OK', { duration: 3000 })

              } else {
                this.snackBar.open(this.currentPhysicalActivity.name + ' successfully updated!', 'OK', { duration: 3000 })

              }

            }
          }, (error: HttpErrorResponse) => {
            this.isUpdating = false;
            this.addNewGoal = true;
            this.snackBar.open(error.error, 'OK', { duration: 3000 })
          })

      }
      else if (this.tempPhysicalActivity.name.includes('Create')) {
        this.isSend = true;
        return
      }
      else {
        this.isSend = false;

      }
    }
    else {
      this.nameIsChanging = false;
      this.descriptionIsChanging = false;
      this.imageIsClicked = false;
    }

  }
  onGoalDeselect() {
    if (this.compareGoals()) {
      this.goalService.updateGoal(this.currentGoal).subscribe(goalResponse => {
        if (goalResponse) {
          var goal = new Goal()
          goal.adherence = goalResponse['adherence']
          goal.id = goalResponse['id'];
          goal.physicalActivityId = goalResponse['physicalActivityId'];
          goal.userId = goalResponse['userId'];
          goal.weeklyGoal = goalResponse['weeklyGoal'];
          goal.dietId = goalResponse['dietId'];
          goal.physicalActivityName = this.getPhysicalActivityName(goal.physicalActivityId);
          this.currentGoalIsChanging = false;
          this.currentGoal = goal;
          var start = this.datePipe.transform(this.currentPhysicalActivity.startDate, 'dd/MM/yyyy hh:MM:ss')
          var end = this.datePipe.transform(this.currentPhysicalActivity.endDate, 'dd/MM/yyyy hh:MM:ss')
          this.goalService.updateGoalAdherence(this.currentGoal, start, end).subscribe(goalResponse => {
            if (goalResponse) {

              var goal = new Goal()
              goal.adherence = goalResponse['adherence']
              goal.id = goalResponse['id'];
              goal.physicalActivityId = goalResponse['physicalActivityId'];
              goal.userId = goalResponse['userId'];
              goal.weeklyGoal = goalResponse['weeklyGoal'];
              goal.dietId = goalResponse['dietId'];
              goal.physicalActivityName = this.getPhysicalActivityName(goal.physicalActivityId);

              this.currentGoalIsChanging = false;
              this.currentGoal = goal;

              Object.assign(this.tempGoal, this.currentGoal);
              // this.currentDiet.goal = this.tempGoal;
            }
          }, (error: HttpErrorResponse) => {

            this.snackBar.open(error.error, 'OK', { duration: 3000 })
          })

        }
      }, (error: HttpErrorResponse) => {
        this.currentGoalIsChanging = false;
        this.snackBar.open(error.error, 'OK', { duration: 3000 })
      })

    }

  }

  getPhysicalActivityName(activityId: string): string {
    var pa = this.allPhysicalActivities.find(pa => pa.id === activityId)
    return pa.name;

  }
  onToggleChange(event: MatSlideToggleChange) {
    if (event.checked) {
      this.showRdf = true;

    }
    else {
      this.showRdf = false
    }

    this.columnsSameHeight();
  }
  onImageLoad() {
    this.columnsSameHeight()
  }

  onNewPAClicked() {
    this.currentPhysicalActivity = {
      name: 'Create new activity', description: 'Create a new Physical Actvity', imageUrl: 'https://api.adorable.io/avatars/120/' + Math.random().toString() + '.png',
      caloriesPerHour: 0, endDate: new Date(), startDate: new Date(), dietId: this.currentDiet.id.toString(), id: Guid.create().toString(), rdfOutput: '', userId: this.currentPatient.id
    }
    this.isSend = true;
    this.isAlreadyAdded = false;
    this.activityInCreation = true;
    this.columnsSameHeight();

  }
  onNewPAPosted() {

    var paTosend = this.currentPhysicalActivity;
    this.compareTempAndCurrentPhysicalActivity();
    if (paTosend.name.includes('Create')) {
      this.snackBar.open('Change name before confirming creation', 'OK', { duration: 3000 })
      return;
    }
    var paPresent = this.allPhysicalActivities.find(pa => pa.id === paTosend.id);
    //update
    if (paPresent && this.allPhysicalActivities.find(pa => pa.name !== paPresent.name)) {

      this.isUpdating = true;
      this.physicaActivityService.updatePhysicalActivity(this.currentPhysicalActivity, this.currentPatient.id)
        .subscribe(paResponse => {
          if (paResponse) {
            var updatePhysicalActivity = new PhysicalActivity();
            updatePhysicalActivity.name = paResponse['name']
            updatePhysicalActivity.rdfOutput = paResponse['rdfOutput'];
            updatePhysicalActivity.imageUrl = paResponse['imageUrl']
            updatePhysicalActivity.description = paResponse['description']
            updatePhysicalActivity.startDate = new Date(paResponse['startDate'])
            updatePhysicalActivity.endDate = new Date(paResponse['endDate'])
            updatePhysicalActivity.caloriesPerHour = paResponse['caloriesPerHour'];
            updatePhysicalActivity.id = paResponse['id']
            updatePhysicalActivity.userId = paResponse['userId']
            this.currentPhysicalActivity = updatePhysicalActivity;
            Object.assign(this.tempPhysicalActivity, this.currentPhysicalActivity)
            this.isSend = false;
            this.snackBar.open(this.currentPhysicalActivity.name + ' successfully updated!', 'OK', { duration: 3000 })
            const index = this.allPhysicalActivities.indexOf(this.tempPhysicalActivity);

            if (index >= 0) {
              this.allPhysicalActivities.splice(index, 1);
              this.columnsSameHeight()
              this.allPhysicalActivities.push(this.currentPhysicalActivity)

            }
            else {
              this.allPhysicalActivities.push(this.currentPhysicalActivity)
            }
            if (this.isAlreadyAdded) {
              this.componentReload = true;
              this.snackBar.open(this.currentPhysicalActivity.name + ' successfully updated!', 'OK', { duration: 3000 })

            }
            this.physicaActivityService.setObservablePhysicalActivities(this.allPhysicalActivities)

          }
        }, (error: HttpErrorResponse) => {
          this.isUpdating = false;
          this.snackBar.open(error.error, 'OK', { duration: 3000 })
        })
      return

    }
    if (paPresent && this.allPhysicalActivities.find(pa => pa.name === paPresent.name)) {
      this.snackBar.open('There is already an activity with name ' + paPresent.name + ' in the list', 'OK', { duration: 3000 })
      return
    }
    //post
    this.isUpdating = true
    this.physicaActivityService.createNewPhysicalActivity(paTosend, this.currentPatient.id)
      .subscribe(response => {
        var postedPa = new PhysicalActivity();
        postedPa.id = response['id']
        postedPa.name = response['name']
        postedPa.imageUrl = response['imageUrl']
        postedPa.caloriesPerHour = response['caloriesPerHour']
        postedPa.description = response['description']
        postedPa.dietId = response['dietId']
        postedPa.endDate = new Date(response['endDate'])
        postedPa.startDate = new Date(response['startDate'])
        postedPa.rdfOutput = response['rdfOutput']
        postedPa.userId = response['userId']
        this.isUpdating = false;
        this.allPhysicalActivities.unshift(postedPa)
        this.snackBar.open(this.currentPhysicalActivity.name + ' successfully created!', 'OK', { duration: 3000 })
        this.physicaActivityService.setObservablePhysicalActivities(this.allPhysicalActivities)
        this.activityInCreation = false;

      }, (error: HttpErrorResponse) => {
        this.isUpdating = false;
        this.activityInCreation = false;
        this.snackBar.open(error.error, 'OK', { duration: 3000 })
      })


  }
  onAddNewCurrentPhysicalActivity() {
    if (!this.currentGoal.physicalActivityId) {
      this.currentGoal.physicalActivityId = this.currentPhysicalActivity.id;
      this.currentGoal.adherence = 0.0;
      this.goalService.postGoal(this.currentGoal).subscribe(goalResponse => {
        if (goalResponse) {
          var goal = new Goal()
          goal.adherence = goalResponse['adherence']
          goal.id = goalResponse['id'];
          goal.physicalActivityId = goalResponse['physicalActivityId'];
          goal.userId = goalResponse['userId'];
          goal.weeklyGoal = goalResponse['weeklyGoal'];
          goal.dietId = goalResponse['dietId'];
          goal.physicalActivityName = this.getPhysicalActivityName(goal.physicalActivityId);

          this.goalService.setNewObservableGoal(goal)
          this.addNewGoal = false;
        }
      }, (error: HttpErrorResponse) => {
        this.snackBar.open(error.error, 'OK', { duration: 3000 })
      })
      return
    }
    this.currentGoal.physicalActivityId = this.currentPhysicalActivity.id
    this.goalService.updateGoal(this.currentGoal).subscribe(goalResponse => {

      if (goalResponse) {
        var goal = new Goal()
        goal.adherence = goalResponse['adherence']
        goal.id = goalResponse['id'];
        goal.physicalActivityId = goalResponse['physicalActivityId'];
        goal.userId = goalResponse['userId'];
        goal.weeklyGoal = goalResponse['weeklyGoal'];
        goal.dietId = goalResponse['dietId'];
        goal.physicalActivityName = this.getPhysicalActivityName(goal.physicalActivityId);


        this.goalService.setNewObservableGoal(goal);
        this.snackBar.open("Current physical activity for diet " + this.currentDiet.name + " has been updated!", "OK", { duration: 3000 })

      }


    });
    // var dietToSend = this.currentDiet;

    // this.dietService.updateCurrentPhysicalActivity(dietToSend).subscribe(response => {

    //   var map: Map<DayOfWeek, Meal[]> = new Map();

    //   Object.keys(response.body.dailyFood).forEach(key => {
    //     var meals: Meal[] = []
    //     Object.values(response.body.dailyFood[key]).forEach(mealValue => {
    //       var meal = new Meal();
    //       var foodArray = mealValue['allFoodEntries'];
    //       Object.values(foodArray).forEach(value => {
    //         var food = new Food();

    //         food.calories = value['calories'];
    //         food.caloriesPer100 = value['caloriesPer100']
    //         food.carbs = value['carbs']
    //         food.fats = value['fats']
    //         // food.mealTypes = value["mealTypes"]
    //         food.name = value['name']
    //         food.proteins = value['proteins']
    //         food.quantity = value['quantity']
    //         food.vitamins = value['vitamins'];
    //         food.salts = value['salts']
    //         food.type = value['type']
    //         food.id = value['id']
    //         food.saltsPer100 = value['saltsPer100']
    //         food.vitaminsPer100 = value['vitaminsPer100']
    //         food.fatsPer100 = value['fatsPer100']
    //         food.proteinsPer100 = value['proteinsPer100']
    //         food.carbsPer100 = value['carbsPer100']
    //         food.calories = value['calories']
    //         meal.addFood(food);
    //       });
    //       meal.mealType = mealValue['mealType'];
    //       meals.push(meal)
    //     });
    //     map.set(DayOfWeek[key], meals)


    //   });
    //   var caloriesPerDay: Map<DayOfWeek, number> = new Map()
    //   Object.keys(response.body.caloriesPerDay).forEach(key => {
    //     caloriesPerDay.set(DayOfWeek[key], response.body.caloriesPerDay[key])
    //   });

    //   var diet = new Diet(map, caloriesPerDay, response.body.name, response.body.userId)
    //   diet.totalCalories = response.body.totalCalories
    //   diet.id = response.body.id
    //   var currentPhysicalActivity = new PhysicalActivity();

    //   // var value = response.body['physicalActivity']
    //   // if (value) {
    //   //   currentPhysicalActivity.name = value['name']
    //   //   currentPhysicalActivity.rdfOutput = value['rdfOutput'];
    //   //   currentPhysicalActivity.imageUrl = value['imageUrl']
    //   //   currentPhysicalActivity.description = value['description']
    //   //   currentPhysicalActivity.startDate = new Date(value['startDate'])
    //   //   currentPhysicalActivity.endDate = new Date(value['endDate'])
    //   //   currentPhysicalActivity.userId = value['userId']
    //   //   currentPhysicalActivity.caloriesPerHour = value['caloriesPerHour'];
    //   //   currentPhysicalActivity.id = value['id']
    //   // }

    //   // diet.physicalActivity = currentPhysicalActivity;

    //   // var goalResponse = response.body['goal']
    //   // if (goalResponse) {
    //   //   var goal = new Goal()
    //   //   goal.adherence = goalResponse['adherence']
    //   //   goal.id = goalResponse['id'];
    //   //   goal.physicalActivityId = goalResponse['physicalActivityId'];
    //   //   goal.userId = goalResponse['userId'];
    //   //   goal.weeklyGoal = goalResponse['weeklyGoal'];
    //   //   goal.dietId = goalResponse['dietId'];
    //   //   this.currentGoal = goal;
    //   //   diet.goal = goal;

    //   //   Object.assign(this.tempGoal, this.currentGoal);
    //   // }

    //   this.dietService.setDiet(diet);

    //   this.currentGoal.physicalActivityId = this.currentPhysicalActivity.id;



    // });
  }

  private columnsSameHeight() {
    if (window.innerWidth > 960) {
      setTimeout(() => {
        var physicalactivityCard = $('#right_content').outerHeight();
        var sideContent = document.getElementById('left_content')
        if (sideContent != null) {
          sideContent.style.height = physicalactivityCard.toString() + 'px';

        }
      }, 0)
    }
  }
  private compareTempAndCurrentPhysicalActivity() {
    if (this.currentPhysicalActivity.name !== this.tempPhysicalActivity.name) {
      this.isSend = true;
      return
    }
    if (this.currentPhysicalActivity.description !== this.tempPhysicalActivity.description) {
      this.isSend = true;
      return;
    }
    if (this.currentPhysicalActivity.startDate !== this.tempPhysicalActivity.startDate) {
      this.isSend = true;
      return;
    }
    if (this.currentPhysicalActivity.endDate !== this.tempPhysicalActivity.endDate) {
      this.isSend = true;
      return;
    }
    if (this.currentPhysicalActivity.caloriesPerHour !== this.tempPhysicalActivity.caloriesPerHour) {
      this.isSend = true;
      return
    }
    if (this.currentPhysicalActivity.imageUrl !== this.tempPhysicalActivity.imageUrl) {
      this.isSend = true;
      return
    }
    else {
      this.isSend = false;
    }

  }
  private compareGoals() {
    if (this.currentGoal.weeklyGoal !== this.tempGoal.weeklyGoal) {
      return true;
    }
    return false;
  }



}
