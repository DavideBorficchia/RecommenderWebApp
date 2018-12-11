import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegisterComponent } from './components/register/register.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from './components/footer/footer.component';
import { MatStepperModule } from '@angular/material/stepper';
import { LayoutModule } from '@angular/cdk/layout';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MatSnackBarModule, MatNativeDateModule, MatListModule, MatDividerModule, MatExpansionModule, MatSortModule, MatTableModule, MatChipsModule, MatSliderModule, MatRipple, MatRippleModule } from '@angular/material';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DietComponent } from './components/diet/diet.component'
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { DiaryComponent } from './components/diary/diary.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FoodComponent } from './components/food/food.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { DietCreatorComponent } from './components/diet-creator/diet-creator.component';
import { DayComponent } from './components/day/day.component';
import { MealComponent } from './components/meal/meal.component';
import { DietHistoryComponent } from './components/diet-history/diet-history.component';
import { FoodRecommenderComponent } from './components/food-recommender/food-recommender.component';


const appRoutes: Routes = [

  // { path: "signup", component: SignUpComponent, outlet:"registration" },
  // { path: "login", component: RegisterComponent, outlet:"registration" }
  {
    path: "registration", component: WelcomeComponent, children: [
      { path: "signup", component: SignUpComponent },
      { path: "login", component: RegisterComponent }
    ]
  },
  {
    path: "home", component: SidebarComponent, children:
      [
        {
          path: "diary", component: DiaryComponent, children:
            [
              {
                path: "dietview", component: DietCreatorComponent
              },
              {
                path: "history", component:DietHistoryComponent
              },
              {
                path: "suggestions",component:FoodRecommenderComponent
              }
            ]
        }
      ]
  }

];
@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    SignUpComponent,
    WelcomeComponent,
    FooterComponent,
    ToolbarComponent,
    SidebarComponent,
    DietComponent,
    DiaryComponent,
    FoodComponent,
    DietCreatorComponent,
    DayComponent,
    MealComponent,
    DietHistoryComponent,
    FoodRecommenderComponent

  ],
  imports: [
    MatSelectModule,
    MatSliderModule,
    MatChipsModule,
    MatExpansionModule,
    MatTableModule,
    MatSortModule,
    MatListModule,
    MatDividerModule,
    MatGridListModule,
    MatTabsModule,
    MatNativeDateModule,
    BrowserModule,
    MatDatepickerModule,
    MatMenuModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    FormsModule,
    MatStepperModule,
    MatSnackBarModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatToolbarModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatRippleModule,
    LayoutModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
