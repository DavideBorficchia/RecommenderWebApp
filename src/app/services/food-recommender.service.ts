import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FoodCategory } from '../model/FoodCategory';
import { FoodRdf } from '../model/foodRdf';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Food } from '../model/food';
import { User } from '../components/register/model/user';

@Injectable({
  providedIn: 'root'
})
export class FoodRecommenderService {



  private foodRdfs: FoodRdf[];
  private foodCategoryBehavior: BehaviorSubject<FoodCategory>;
  private foodCategories: FoodCategory[];
  private allFoodRdfBehavior: BehaviorSubject<FoodRdf[]>;
  private allFoodRdf: FoodRdf[];
  private foodAdded: Food;
  private foodAddedBehavior: BehaviorSubject<Food> = new BehaviorSubject<Food>(this.foodAdded);
  foodCategory: FoodCategory;
  foodTest: FoodRdf;
  private baseUrl = "http://localhost:8080/recommender/food"
  constructor(private httpClient: HttpClient) {
    this.getAllFoodFromServer();
    // s
    // this.allFoodRdf = [{ name: "Eggplant", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Peppers", "Pasta"], goodSinergyWith: ["Treadmill", "Box"], proteins: 12, vitamins: 15, type: "Vegetables", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", timeStamp: Date.now(), rdfOutput: "", salts: 10, caloriesPer100: 10, bestEatenAt: ["Lunch", "Dinner"] },
    // { name: "Salad", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Salad", "Apple"], goodSinergyWith: ["Treadmill", "Box"], proteins: 12, vitamins: 15, type: "Vegetables", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", timeStamp: Date.now(), rdfOutput: "", salts: 10, caloriesPer100: 10, bestEatenAt: ["Lunch", "Dinner"] },
    // { name: "Tomato", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Salad", "Pasta", "Hamburger"], goodSinergyWith: ["Treadmill", "Box"], proteins: 12, vitamins: 15, type: "Vegetables", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", timeStamp: Date.now(), rdfOutput: "", salts: 10, caloriesPer100: 10, bestEatenAt: ["Lunch", "Dinner"] },
    // { name: "Carrot", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Soup", "Pasta"], goodSinergyWith: ["Treadmill", "Box"], proteins: 12, vitamins: 15, type: "Vegetables", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", timeStamp: Date.now(), rdfOutput: "", salts: 10, caloriesPer100: 10, bestEatenAt: ["Lunch", "Dinner"] },
    // { name: "Pasta Carbonara", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Eggplant", "Carrot"], goodSinergyWith: ["Treadmill", "Box"], proteins: 12, vitamins: 15, type: "Pasta", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", timeStamp: Date.now(), rdfOutput: "", salts: 10, caloriesPer100: 10, bestEatenAt: ["Lunch", "Dinner"] },
    // { name: "Pasta Amatriciana", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Tomato", "Chicken"], goodSinergyWith: ["Treadmill", "Box"], proteins: 12, vitamins: 15, type: "Pasta", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", timeStamp: Date.now(), rdfOutput: "", salts: 10, caloriesPer100: 10, bestEatenAt: ["Lunch", "Dinner"] },
    // { name: "Mozzarella", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Pasta", "Salad"], goodSinergyWith: ["Treadmill", "Box"], proteins: 12, vitamins: 15, type: "CheeseandMilk", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", timeStamp: Date.now(), rdfOutput: "", salts: 10, caloriesPer100: 10, bestEatenAt: ["Lunch", "Dinner"] },
    // { name: "Hamburger", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Bread", "Tomato", "Salad"], goodSinergyWith: ["Treadmill", "Box"], proteins: 12, vitamins: 15, type: "Meat", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", timeStamp: Date.now(), rdfOutput: "", salts: 10, caloriesPer100: 10, bestEatenAt: ["Lunch", "Dinner"] },
    // { name: "Banana", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Apple"], goodSinergyWith: ["Treadmill", "Box"], proteins: 12, vitamins: 15, type: "Fruits", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", timeStamp: Date.now(), rdfOutput: "", salts: 10, caloriesPer100: 10, bestEatenAt: ["Lunch", "Dinner"] },
    // { name: "Baguette", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Salad", "Mozzarella"], goodSinergyWith: ["Treadmill", "Box"], proteins: 12, vitamins: 15, type: "BakeryandCereals", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", timeStamp: Date.now(), rdfOutput: "", salts: 10, caloriesPer100: 10, bestEatenAt: ["Lunch", "Dinner"] },
    // { name: "Cheesecake", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Strawberry", "Chocolate"], goodSinergyWith: ["Treadmill", "Box"], proteins: 12, vitamins: 15, type: "Sweets", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", timeStamp: Date.now(), rdfOutput: "", salts: 10, caloriesPer100: 10, bestEatenAt: ["Lunch", "Dinner"] },
    // { name: "Tomato", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Salad", "Pasta", "Hamburger"], goodSinergyWith: ["Treadmill", "Box"], proteins: 12, vitamins: 15, type: "Vegetables", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", timeStamp: Date.now(), rdfOutput: "", salts: 10, caloriesPer100: 10, bestEatenAt: ["Lunch", "Dinner"] },
    // { name: "Carrot", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Soup", "Pasta"], goodSinergyWith: ["Treadmill", "Box"], proteins: 12, vitamins: 15, type: "Vegetables", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", timeStamp: Date.now(), rdfOutput: "", salts: 10, caloriesPer100: 10, bestEatenAt: ["Lunch", "Dinner"] },
    // { name: "Artichoke", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Fish", "Chicken"], goodSinergyWith: ["Treadmill", "Box"], proteins: 12, vitamins: 15, type: "Vegetables", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", timeStamp: Date.now(), rdfOutput: "", salts: 10, caloriesPer100: 10, bestEatenAt: ["Lunch", "Dinner"] },
    // { name: "Trout", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Tomato", "Salad"], goodSinergyWith: ["Treadmill", "Box"], proteins: 12, vitamins: 15, type: "Fish", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", timeStamp: Date.now(), rdfOutput: "", salts: 10, caloriesPer100: 10, bestEatenAt: ["Lunch", "Dinner"] },
    // { name: "Mussel", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Pasta", "Artichoke"], goodSinergyWith: ["Treadmill", "Box"], proteins: 12, vitamins: 15, type: "Fish", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", timeStamp: Date.now(), rdfOutput: "", salts: 10, caloriesPer100: 10, bestEatenAt: ["Lunch", "Dinner"] }

    // ]
    this.foodCategories = [
      { categoryName: "Vegetables", categoryAssetPath: "./assets/tomatoes.svg", categorySubTitle: "fake subtitle", avatarAssetColor: "#D0D342", avatarAssetPath: "../../../assets/vegetables_avatar.svg", description: "Vegetables are parts of plants that are consumed by humans or other animals as food. The original meaning is still commonly used and is applied to plants collectively to refer to all edible plant matter, including the flowers, fruits, stems, leaves, roots, and seeds." },
      { categoryName: "Fruits", categoryAssetPath: "./assets/fruits_types.svg", categorySubTitle: "fake subtitle", avatarAssetColor: "#F9EDCF", avatarAssetPath: "../../../assets/fruits_avatar.svg", description: "In botany, a fruit is the seed-bearing structure in flowering plants (also known as angiosperms) formed from the ovary after flowering. Fruits are the means by which angiosperms disseminate seeds. Edible fruits, in particular, have propagated with the movements of humans and animals in a symbiotic relationship as a means for seed dispersal and nutrition; in fact, humans and many animals have become dependent on fruits as a source of food." },
      { categoryName: "Meat", categoryAssetPath: "./assets/meat.svg", categorySubTitle: "fake subtitle", avatarAssetColor: "#C6F2F4", avatarAssetPath: "../../../assets/meat_avatar.svg", description: "Meat is animal flesh that is eaten as food. Humans have hunted and killed animals for meat since prehistoric times. The advent of civilization allowed the domestication of animals such as chickens, sheep, rabbits, pigs and cattle. This eventually led to their use in meat production on an industrial scale with the aid of slaughterhouses." },
      { categoryName: "Fish", categoryAssetPath: "./assets/fish.svg", categorySubTitle: "fake subtitle", avatarAssetColor: "#FA8A2F", avatarAssetPath: "../../../assets/fish_avatar.svg", description: "Fish are gill-bearing aquatic craniate animals that lack limbs with digits. They form a sister group to the tunicates, together forming the olfactores. Included in this definition are the living hagfish, lampreys, and cartilaginous and bony fish as well as various extinct related groups. Tetrapods emerged within lobe-finned fishes, so cladistically they are fish as well. However, traditionally fish are rendered paraphyletic by excluding the tetrapods (i.e., the amphibians, reptiles, birds and mammals which all descended from within the same ancestry). " },
      { categoryName: "Pasta", categoryAssetPath: "./assets/noodles.svg", categorySubTitle: "fake subtitle", avatarAssetColor: "#C6FFB5", avatarAssetPath: "../../../assets/noodles_avatar.svg", description: "Pasta is a type of noodle, or any of the dishes made with it, in Italian cuisine. It is typically made from an unleavened dough of a durum wheat flour mixed with water or eggs, and formed into sheets or various shapes, then cooked by boiling or baking. Some pastas are made using rice flour or legumes like black beans or lentils in place of wheat flour to yield a different taste and texture, or for those who need to avoid products containing gluten. Pasta is a staple[3] of Italian cuisine, and was first mentioned in 1154 in Sicily.[4] Pastas are divided into two broad categories: dried (pasta secca) and fresh (pasta fresca). Most dried pasta is produced commercially via an extrusion process, although it can be produced at home. Fresh pasta is traditionally produced by hand, sometimes with the aid of simple machines.[5] Fresh pastas available in grocery stores are produced commercially by large-scale machines." },
      { categoryName: "Sweets", categoryAssetPath: "./assets/sweets.svg", categorySubTitle: "fake subtitle", avatarAssetColor: "#F3E8E8", avatarAssetPath: "../../../assets/sweets_avatar.svg", description: "Candy, also called sweets or lollies, is a confection that features sugar as a principal ingredient. The category, called sugar confectionery, encompasses any sweet confection, including chocolate, chewing gum, and sugar candy. Vegetables, fruit, or nuts which have been glazed and coated with sugar are said to be candied." },
      { categoryName: "Cheese and Milk", categoryAssetPath: "./assets/cheese.svg", categorySubTitle: "fake subtitle", avatarAssetColor: "#B4D9F3", avatarAssetPath: "../../../assets/cheese_avatar.svg", description: "Cheese is a dairy product derived from milk that is produced in a wide range of flavors, textures, and forms by coagulation of the milk protein casein. It comprises proteins and fat from milk, usually the milk of cows, buffalo, goats, or sheep." },
      { categoryName: "Bakery and Cereals", categoryAssetPath: "./assets/bread.svg", categorySubTitle: "fake subtitle", avatarAssetColor: "#FACBB4", avatarAssetPath: "../../../assets/bread_avatar.svg", description: "A cereal is any grass cultivated for the edible components of its grain (botanically, a type of fruit called a caryopsis), composed of the endosperm, germ, and bran. The term may also refer to the resulting grain itself. Cereal grain crops are grown in greater quantities and provide more food energy worldwide than any other type of crop[1] and are therefore staple crops. Edible grains from other plant families, such as buckwheat (Polygonaceae), quinoa (Amaranthaceae) and chia (Lamiaceae), are referred to as pseudocereals. In their natural, unprocessed, whole grain form, cereals are a rich source of vitamins, minerals, carbohydrates, fats, oils, and protein. When processed by the removal of the bran, and germ, the remaining endosperm is mostly carbohydrate. In some developing countries, grain in the form of rice, wheat, millet, or maize constitutes a majority of daily sustenance. In developed countries, cereal consumption is moderate and varied but still substantial." }

    ]
    // this.foodRdfs = [{ name: "Eggplant", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Peppers", "Pasta"], goodSynergyWith: ["TreadMill", "Box"], proteins: 12, vitamins: 15, type: "Vegetables", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", isHealthy: "Yes", timeStamp: Date.now() },
    // { name: "Salad", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Salad", "Apple"], goodSynergyWith: ["TreadMill", "Box"], proteins: 12, vitamins: 15, type: "Vegetables", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", isHealthy: "Yes", timeStamp: Date.now() },
    // { name: "Tomato", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Salad", "Pasta", "Hamburger"], goodSynergyWith: ["TreadMill", "Box"], proteins: 12, vitamins: 15, type: "Vegetables", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", isHealthy: "Yes", timeStamp: Date.now() },
    // { name: "Carrot", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Soup", "Pasta"], goodSynergyWith: ["TreadMill", "Box"], proteins: 12, vitamins: 15, type: "Vegetables", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", isHealthy: "Yes", timeStamp: Date.now() },
    // { name: "Artichoke", carbs: 12, description: "It is a very good and healthy veggie :)", fats: 13, goodWith: ["Fish", "Chicken"], goodSynergyWith: ["TreadMill", "Box"], proteins: 12, vitamins: 15, type: "Vegetables", imageUrl: "https://api.adorable.io/avatars/120/" + Math.random().toString() + ".png", isHealthy: "Yes", timeStamp: Date.now() },
    // ]

  }
  getAllFoodFromServer(){
    var user = JSON.parse(sessionStorage["user"]) as User
    this.httpClient.get<FoodRdf[]>(this.baseUrl + "/all",
      {
        params: {

          userId: user.id

        }
      })
      .subscribe(response => {
        this.allFoodRdf = []
        Object.keys(response).forEach(key => {
          var value = response[key]
          var food = new FoodRdf()
          food.type = value["type"]
          food.bestEatenAt = value["bestEatenAt"]
          food.name = value["name"]
          food.description = value["description"]
          food.fats = value["fats"]
          food.proteins = value["proteins"]
          food.salts = value["salts"]
          food.rdfOutput = value["rdfOutput"]
          food.imageUrl = value["imageUrl"]
          food.vitamins = value["vitamins"]
          food.goodSinergyWith = value["goodSinergyWith"]
          food.goodWith = value["goodWith"]
          food.caloriesPer100 = value["caloriesPer100"]
          food.carbs = value["carbs"]
          food.timeStamp = value["timeStamp"]
          food.id = value["id"]
          this.allFoodRdf.push(food)
        })
        this.setNewFoodRdf(this.allFoodRdf)
      }, (error: HttpErrorResponse) => {
        console.log(error)

      })

  }
  updateFood(foodRdfPicked: FoodRdf, foodId: string) {
    var user = JSON.parse(sessionStorage["user"]) as User

    return this.httpClient.put<FoodRdf>(this.baseUrl + "/properties/updates", foodRdfPicked, {
      params: {
        foodId: foodId,
        userId: user.id
      }
    })
      .pipe(catchError(error => throwError(error)))
  }
  postFood(foodRdfPicked: FoodRdf) {
    var user = JSON.parse(sessionStorage["user"]) as User

    return this.httpClient.post<FoodRdf>(this.baseUrl + "/creations", foodRdfPicked, {
      params: {

        userId: user.id

      }
    })
      .pipe(catchError(error => throwError(error)))
  }

  getCategory(categoryName: string): FoodCategory {

    if (categoryName === "CheeseandMilk") {
      categoryName = "Cheese and Milk"
    }
    if (categoryName === "BakeryandCereals") {
      categoryName = "Bakery and Cereals"
    }
    return this.foodCategories.find(fc => fc.categoryName === categoryName);
  }

  getFoodFromServer(foodName: string) {
    return this.httpClient.get<FoodRdf>(this.baseUrl + "/" + foodName,
      {
        // observe: 'response',
        params: {
          outputType: "RDF"
        }
      })
      .pipe(catchError(error => {
        return throwError(error)
      }))
  }

  getFoodCategories() {
    return this.foodCategories;
  }
  getObservableFoodCategoryByName(categoryParam: string) {
    var foodCategory = this.foodCategories.find(foodCategory => foodCategory.categoryName == categoryParam);
    if (!this.foodCategoryBehavior) {
      this.foodCategoryBehavior = new BehaviorSubject(foodCategory);

    }
    return this.foodCategoryBehavior;
  }
  setNewFoodCategory(foodCategory: FoodCategory) {

    this.foodCategory = foodCategory;

    if (!this.foodCategoryBehavior) {
      this.foodCategoryBehavior = new BehaviorSubject(this.foodCategory);
      this.foodCategoryBehavior.next(foodCategory);
    }
    else {
      this.foodCategoryBehavior.next(foodCategory)
    }




  }
  setNewFoodCategoryByName(foodCategoryName: string) {


    this.foodCategory = this.foodCategories.find(fc => fc.categoryName === foodCategoryName);

    if (!this.foodCategoryBehavior) {
      this.foodCategoryBehavior = new BehaviorSubject(this.foodCategory);
      this.foodCategoryBehavior.next(this.foodCategory);
    }
    else {
      this.foodCategoryBehavior.next(this.foodCategory)
    }
  }
  getObservableFoodCategory() {
    if (!this.foodCategoryBehavior) {
      this.foodCategoryBehavior = new BehaviorSubject(this.foodCategory);
    }
    return this.foodCategoryBehavior;
  }
  setNewFoodRdf(foodRdf: FoodRdf[]) {
    this.allFoodRdf = foodRdf;
    if (!this.allFoodRdfBehavior) {
      this.allFoodRdfBehavior = new BehaviorSubject(foodRdf);
      this.allFoodRdfBehavior.next(foodRdf);
    }
    else {
      this.allFoodRdfBehavior.next(foodRdf)
    }
  }
  getObservableFoodBehavior() {
    if (!this.allFoodRdfBehavior) {
      this.allFoodRdfBehavior = new BehaviorSubject(this.allFoodRdf)
    }
    return this.allFoodRdfBehavior;
  }
  getAllFood(): FoodRdf[] {
    if (this.allFoodRdf) {
      return this.allFoodRdf;
    }
    return null;
  }
  setAllFood(allFoodRdfs: FoodRdf[]) {
    this.allFoodRdf = allFoodRdfs
  }

  getFoodRdfByCategoryName(categoryName: String): FoodRdf[] {
    return
  }
  getMostRecentAddedRdfFood(foodCategoryName: string): FoodRdf {
    return this.allFoodRdf.filter(food => food.type === foodCategoryName)
      .sort((previous, next) => next.timeStamp - previous.timeStamp)[0];
  }
  getFoodRdfByName(name: string): FoodRdf {
    return this.allFoodRdf.find(foodRdf => foodRdf.name === name);
  }
  // getAllFoodFromServer() {

  //   return this.httpClient.get<FoodRdf[]>(this.baseUrl + "/all")

  // }
  getPhysicalActivityByName(value: string): any {
    // return this.
  }

  getAddedFoodObservable() {

    return this.foodAddedBehavior;
  }
  setNewFoodAdded(food: Food) {
    if (!this.foodAddedBehavior) {
      this.foodAdded = food;
      this.foodAddedBehavior = new BehaviorSubject<Food>(this.foodAdded)
    }
    this.foodAdded = food
    this.foodAddedBehavior.next(this.foodAdded);

  }
  getRecommendationsGoodWiths(food: Food) {
    var user = JSON.parse(sessionStorage["user"]) as User
    return this.httpClient.get<FoodRdf>(this.baseUrl + "/" + food.id + "/recommendations/goodwiths",{
      params:{
        userId:user.id
      }
    })

  }


  parseRdfFoodArrayResponseToFood(foodArrayResponse: FoodRdf[]) {
    var foodToShow = [];
    Object.keys(foodArrayResponse).forEach(key => {
      var value = foodArrayResponse[key]
      var food = new FoodRdf()
      food.type = value["type"]
      food.bestEatenAt = value["bestEatenAt"]
      food.name = value["name"]
      food.description = value["description"]
      food.fats = value["fats"]
      food.proteins = value["proteins"]
      food.salts = value["salts"]
      food.rdfOutput = value["rdfOutput"]
      food.imageUrl = value["imageUrl"]
      food.vitamins = value["vitamins"]
      food.goodSinergyWith = value["goodSinergyWith"]
      food.goodWith = value["goodWith"]
      food.caloriesPer100 = value["caloriesPer100"]
      food.carbs = value["carbs"]
      food.timeStamp = value["timeStamp"]
      this.allFoodRdf.push(food)
    })
  }
}
