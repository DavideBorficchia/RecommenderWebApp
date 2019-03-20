import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FoodRecommenderService } from 'src/app/services/food-recommender.service';
import { FoodCategory } from 'src/app/model/FoodCategory';
import { FoodRdf } from 'src/app/model/foodRdf';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent, MatSlideToggleChange, MatSnackBar } from '@angular/material';
import * as $ from 'jquery';
import * as vkbeautify from 'vkbeautify';
import { HttpErrorResponse } from '@angular/common/http';
import { Guid } from 'guid-typescript';
@Component({
  selector: 'app-food-rdf-creator',
  templateUrl: './food-rdf-creator.component.html',
  styleUrls: ['./food-rdf-creator.component.css']
})

export class FoodRdfCreatorComponent implements OnInit {

  private foodCategory: FoodCategory;
  private foodRdfs: FoodRdf[];
  allFoodRdfs: FoodRdf[];
  private nameIsChanging: boolean;
  foodRdfPicked: FoodRdf;
  foodRdfsProperties = ["Salts", "Calories per 100 g", "Vitamins", "Fats", "Proteins", "Carbohydrates"]
  mealTypes = ["Breakfast", "Morning Break", "Lunch", "Afternoon Break", "Dinner"];
  private statementControl = new FormControl()
  private statementGoodSynergyGroupControl = new FormControl();
  private statementBestEatenAtControl = new FormControl();
  private filteredFoodRdf: Observable<FoodRdf[]>;
  private tempFoodBeforePosting: FoodRdf = new FoodRdf();
  private isUpdating: Boolean = false;
  filteredPhysicalActivities: Observable<string[]>;
  pickImage: boolean = false;
  filteredMealTypes: Observable<string[]>
  allPhysicalActivities: string[];
  showRdf: boolean;
  descriptionIsChanging: boolean;
  isSend = false;
  constructor(private router: Router, private foodRecommenderService: FoodRecommenderService, public snackBar: MatSnackBar) { }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth > 960) {
      this.foodListSameHeight();
    }

  }
  getAvatarFromRdfFood(foodRdf: FoodRdf) {
    if (foodRdf.imageUrl != "") {
      return foodRdf.imageUrl;
    }
    var random = Math.random();
    return "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png";
  }
  onMouseEnter() {
    console.log(this.pickImage)
    this.pickImage = !this.pickImage
  }
  getFoodRdfPickedPropertyValue(property: string) {
    return this.getValueByProperty(property);
  }
  getCategoryPresentationImage() {
    switch (this.foodCategory.categoryName) {
      case "Vegetables":
        return "./assets/vegetables.svg"
      case "Fruits":
        return "./assets/fruits_presentation.svg"
      case "Meat":
        return "./assets/meat_presentation.svg"
      case "Fish":
        return "./assets/fish_presentation.svg"
      case "Pasta":
        return "./assets/spaghetti_presentation.svg"
      case "Sweets":
        return "./assets/sweets_presentation.svg"
      case "Cheese and Milk":
        return "./assets/cheese_presentation.svg"
      case "Bakery and Cereals":
        return "./assets/cereals_presentation.svg"

    }
  }
  onTextAreaDeselect() {
    this.nameIsChanging = false;
    this.descriptionIsChanging = false;
    this.compare();
    if (!this.tempFoodBeforePosting.name.includes('Create') && this.isSend) {
      this.isUpdating = true
      this.foodRecommenderService.updateFood(this.foodRdfPicked, this.foodRdfPicked.id)
        .subscribe(response => {
          console.log(response)
          this.isUpdating = false;
          this.isSend = false;
          const index = this.allFoodRdfs.indexOf(this.tempFoodBeforePosting);

          if (index >= 0) {
            this.foodRdfPicked.goodWith.splice(index, 1);
            this.foodListSameHeight()
            this.allFoodRdfs.push(this.foodRdfPicked)

          }
          this.foodRecommenderService.setNewFoodRdf(this.allFoodRdfs)
          var food = new FoodRdf()
          food.type = response["type"]
          food.bestEatenAt = response["bestEatenAt"]
          food.name = response["name"]
          food.description = response["description"]
          food.fats = response["fats"]
          food.proteins = response["proteins"]
          food.salts = response["salts"]
          food.rdfOutput = response["rdfOutput"]
          food.imageUrl = response["imageUrl"]
          food.vitamins = response["vitamins"]
          food.goodSinergyWith = response["goodSinergyWith"]
          food.goodWith = response["goodWith"]
          food.caloriesPer100 = response["caloriesPer100"]
          food.carbs = response["carbs"]
          food.timeStamp = response["timeStamp"]
          food.id = response["id"]
          this.foodRdfPicked = food;
          this.deepCopyFoodRDFPicked();
          console.log(response["rdfOutput"])

          // console.log(response)
        }, (error:HttpErrorResponse) => {
          this.snackBar.open("Error","OK",{duration:2000})
          this.isUpdating = false;
          this.deepCopyFoodRDFPicked();
        })
    } else if (!this.isSend) {
      // this.foodRdfPicked = this.foodRecommenderService.getMostRecentAddedRdfFood(this.foodCategory.categoryName.toString());
    }

  }

  ngOnInit() {

    this.foodRecommenderService.getObservableFoodCategory()
      .subscribe(changeCategory => {
        this.foodCategory = changeCategory;
        $(window).on('load', function () {
          if (window.innerWidth > 960) {
            var foodCardHeight = $("#card").outerHeight();
            var foodList = document.getElementById("side_content")
            if (foodList !== null) {
              foodList.style.height = foodCardHeight.toString() + "px";
            }
          }

        });
      });


    const url = this.router.url;
    var parsedUrl = url.split("/home/food/");
    var categoryName = parsedUrl[1];
    this.foodCategory = this.foodRecommenderService.getCategory(categoryName)
    var defaultFoodPicked = new FoodRdf();
    defaultFoodPicked.imageUrl = "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png"
    defaultFoodPicked.name = "Create new " + this.foodCategory.categoryName;
    defaultFoodPicked.description = "Start creating your new cool RDF semantic food"
    defaultFoodPicked.rdfOutput = ""
    defaultFoodPicked.salts = 0;
    defaultFoodPicked.caloriesPer100 = 0;
    defaultFoodPicked.proteins = 0;
    defaultFoodPicked.vitamins = 0;
    defaultFoodPicked.carbs = 0;
    defaultFoodPicked.fats = 0;
    defaultFoodPicked.bestEatenAt = [];
    defaultFoodPicked.goodSinergyWith = [];
    defaultFoodPicked.goodWith = [];
    defaultFoodPicked.id = Guid.create().toString();


    this.allPhysicalActivities = ["Treadmill", "Box", "Jogging"]

    this.foodRecommenderService.getObservableFoodBehavior().subscribe(event => {
      this.allFoodRdfs = event;


      if (!this.foodRdfPicked) {
        this.foodRdfPicked = defaultFoodPicked;
      }
      if (!this.allFoodRdfs) {
        this.allFoodRdfs = []
      }
      this.deepCopyFoodRDFPicked();

      this.foodRdfs = this.allFoodRdfs.filter(foodRdf => foodRdf.type.replace(/ /g, "") === categoryName);

      this.filteredFoodRdf = this.statementControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      )
      this.filteredPhysicalActivities = this.statementGoodSynergyGroupControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterPhysical(value))
      )
      this.filteredMealTypes = this.statementBestEatenAtControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterMealTypes(value))
      )
    })





  }

  _filterMealTypes(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.mealTypes.filter(option => option.toLowerCase().includes(filterValue));
  }
  _filterPhysical(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allPhysicalActivities.filter(option => option.toLowerCase().includes(filterValue));
  }
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    var foodRdf = this.allFoodRdfs.find(foodRdf => foodRdf.name === event.option.value);
    const index = this.foodRdfPicked.goodWith.indexOf(foodRdf.name);
    if (index < 0) {
      this.foodRdfPicked.goodWith.push(foodRdf.name);
      this.onTextAreaDeselect();
    }
    this.foodListSameHeight()


  }
  onOptionstatementBestEatenAtSelected(event: MatAutocompleteSelectedEvent) {
    var mealType = this.mealTypes.find(m => m === event.option.value);
    const index = this.foodRdfPicked.bestEatenAt.indexOf(mealType);
    if (index < 0) {
      this.foodRdfPicked.bestEatenAt.push(mealType);

      this.onTextAreaDeselect();

    }
    console.log(this.foodRdfPicked.bestEatenAt)
    this.foodListSameHeight()

  }
  onOptionSynergySelected(event: MatAutocompleteSelectedEvent) {
    var physicalActivity = this.allPhysicalActivities.find(pA => pA === event.option.value);
    const index = this.foodRdfPicked.goodSinergyWith.indexOf(physicalActivity);
    if (index < 0) {
      this.foodRdfPicked.goodSinergyWith.push(physicalActivity);
      this.onTextAreaDeselect();

    }
    this.foodListSameHeight()

  }
  onToggleChange(event: MatSlideToggleChange) {
    if (event.checked) {
      this.showRdf = true;

    }
    else {
      this.showRdf = false
    }
    console.log(event.checked + " " + this.showRdf)

  }
  onChipRemoved(foodName: string) {
    const index = this.foodRdfPicked.goodWith.indexOf(foodName);

    if (index >= 0) {
      this.foodRdfPicked.goodWith.splice(index, 1);
      this.foodListSameHeight()
      this.onTextAreaDeselect();


    }
  }
  onChipSynergyRemoved(physicalActivity: string) {
    const index = this.foodRdfPicked.goodSinergyWith.indexOf(physicalActivity);
    if (index >= 0) {
      this.foodRdfPicked.goodSinergyWith.splice(index, 1);
      this.foodListSameHeight()
      this.onTextAreaDeselect();
    }
  }
  onChipMealTypeRemoved(mealType: string) {
    const index = this.foodRdfPicked.bestEatenAt.indexOf(mealType);

    if (index >= 0) {
      this.foodRdfPicked.bestEatenAt.splice(index, 1);
      this.foodListSameHeight()
      this.onTextAreaDeselect();

    }
  }
  onNewFoodClicked() {
    var categoryName = this.foodCategory.categoryName.toString();
    this.foodRdfPicked = {
      bestEatenAt: [], caloriesPer100: 0, salts: 0, rdfOutput: "", timeStamp: null, carbs: 0, description: "Start creating your new cool RDF semantic food",
      fats: 0, goodSinergyWith: [], goodWith: [], imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png",
      name: "Create new " + this.foodCategory.categoryName, proteins: 0, type: categoryName, vitamins: 0, id: Guid.create().toString()
    }
    this.deepCopyFoodRDFPicked();
    this.isSend = true;
    this.foodListSameHeight();

  }
  onNewFoodPosted() {
    var foodToSend = this.foodRdfPicked;
    if (foodToSend.name.includes("Create")) {
      this.snackBar.open("Change name before confirming creation")
    }
    else {
      foodToSend.imageUrl = "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png";
      foodToSend.type = this.foodCategory.categoryName.toString();
      foodToSend.timeStamp = Date.now();
      console.log(foodToSend)
      this.foodRecommenderService.postFood(foodToSend)
        .subscribe(response => {
          console.log(response)
          var food = new FoodRdf()
          food.type = response["type"]
          food.bestEatenAt = response["bestEatenAt"]
          food.name = response["name"]
          food.description = response["description"]
          food.fats = response["fats"]
          food.proteins = response["proteins"]
          food.salts = response["salts"]
          food.rdfOutput = response["rdfOutput"]
          food.imageUrl = response["imageUrl"]
          food.vitamins = response["vitamins"]
          food.goodSinergyWith = response["goodSinergyWith"]
          food.goodWith = response["goodWith"]
          food.caloriesPer100 = response["caloriesPer100"]
          food.carbs = response["carbs"]
          food.timeStamp = response["timeStamp"]
          food.id = response["id"]
          this.foodRdfPicked = food;
          this.isUpdating = false;
          this.isSend = false;
          const index = this.allFoodRdfs.indexOf(this.tempFoodBeforePosting);

          if (index >= 0) {
            this.foodRdfPicked.goodWith.splice(index, 1);
            this.foodListSameHeight()
            this.allFoodRdfs.push(this.foodRdfPicked)

          }
          else {
            this.allFoodRdfs.push(food)
          }
          this.foodRecommenderService.setNewFoodRdf(this.allFoodRdfs)
          this.deepCopyFoodRDFPicked();


        }, (error: HttpErrorResponse) => {
          if (error.status >= 500) {
            this.snackBar.open("Server error, try later", "OK", { duration: 3000 })
          }
          else {
            this.snackBar.open(error.message, "OK", { duration: 3000 })
          }
        })
      this.foodListSameHeight();
    }


  }
  onItemClicked(foodRdf: FoodRdf) {
    console.log(this.isUpdating)
    if (this.isUpdating) {
      this.snackBar.open("Updating food " + this.foodRdfPicked.name + ", wait a bit!", "OK", { duration: 3000 })
    }
    else {
      this.foodRdfPicked = foodRdf;
      this.isSend = false;
      this.nameIsChanging = false;
      this.descriptionIsChanging = false;
      this.deepCopyFoodRDFPicked()
    }


  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();

    return this.allFoodRdfs.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  private getValueByProperty(property: string): any {
    switch (property) {
      case "Proteins":
        return this.foodRdfPicked.proteins;
      case "Carbohydrates":
        return this.foodRdfPicked.carbs;
      case "Fats":
        return this.foodRdfPicked.fats;
      case "Vitamins":
        return this.foodRdfPicked.vitamins;
      default:
        return null;
    }
  }
  private foodListSameHeight() {
    if (window.innerWidth > 960) {
      setTimeout(() => {
        var foodCardHeight = $("#card").outerHeight();
        var foodList = document.getElementById("side_content")
        if (foodList != null) {
          foodList.style.height = foodCardHeight.toString() + "px";

        }
      }, 0)
    }
  }

  private compare() {
    if (this.foodRdfPicked.goodWith.length !== this.tempFoodBeforePosting.goodWith.length) {
      this.isSend = true;
      return
    } if (this.foodRdfPicked.bestEatenAt.length !== this.tempFoodBeforePosting.bestEatenAt.length) {
      this.isSend = true;
      return
    } if (this.foodRdfPicked.goodSinergyWith.length !== this.tempFoodBeforePosting.goodSinergyWith.length) {
      this.isSend = true;
      return
    }
    for (var f of this.foodRdfPicked.goodWith) {
      var foodCheck = this.tempFoodBeforePosting.goodWith.find(food => food === f)
      if (!foodCheck) {
        this.isSend = true;
        return
      }
    }
    for (var f of this.foodRdfPicked.goodSinergyWith) {
      var foodCheck = this.tempFoodBeforePosting.goodSinergyWith.find(food => food === f)
      if (!foodCheck) {
        this.isSend = true;
        return
      }
    }
    for (var f of this.foodRdfPicked.bestEatenAt) {
      var foodCheck = this.tempFoodBeforePosting.bestEatenAt.find(food => food === f)
      if (!foodCheck) {
        this.isSend = true;
        return
      }
    }

    if (this.foodRdfPicked.name === this.tempFoodBeforePosting.name) {
      this.isSend = false;
    }
    else {
      this.isSend = true;
      return
    }
    if (this.foodRdfPicked.description === this.tempFoodBeforePosting.description) {
      this.isSend = false;
    }
    else {
      this.isSend = true;
      return
    }
    if (this.foodRdfPicked.salts === this.tempFoodBeforePosting.salts) {
      this.isSend = false;
    }
    else {
      this.isSend = true;
      return
    }
    if (this.foodRdfPicked.caloriesPer100 === this.tempFoodBeforePosting.caloriesPer100) {
      this.isSend = false;
    }
    else {
      this.isSend = true;
      return
    }
    if (this.foodRdfPicked.vitamins === this.tempFoodBeforePosting.vitamins) {
      this.isSend = false;
    }
    else {
      this.isSend = true;
      return
    }
    if (this.foodRdfPicked.fats === this.tempFoodBeforePosting.fats) {
      this.isSend = false;
    }
    else {
      this.isSend = true;
      return
    }
    if (this.foodRdfPicked.proteins === this.tempFoodBeforePosting.proteins) {
      this.isSend = false;
    }
    else {
      this.isSend = true;
      return
    }
    if (this.foodRdfPicked.carbs === this.tempFoodBeforePosting.carbs) {
      this.isSend = false;
    }
    else {
      this.isSend = true;
      return
    }
  }
  private deepCopyFoodRDFPicked() {
    this.tempFoodBeforePosting = Object.assign(this.tempFoodBeforePosting, this.foodRdfPicked)
    var goodWith = []
    this.foodRdfPicked.goodWith.forEach(f => {
      goodWith.push(f)
    })
    var goodSinergyWith = []
    this.foodRdfPicked.goodSinergyWith.forEach(f => {
      goodSinergyWith.push(f)
    })
    var bestEatenAt = []
    this.foodRdfPicked.bestEatenAt.forEach(f => {
      bestEatenAt.push(f)
    })
    this.tempFoodBeforePosting.goodWith = goodWith
    this.tempFoodBeforePosting.goodSinergyWith = goodSinergyWith
    this.tempFoodBeforePosting.bestEatenAt = bestEatenAt
  }
}
