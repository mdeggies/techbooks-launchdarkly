import { BrowserModule } from '@angular/platform-browser';
import { NgxInfiniteScrollerModule } from 'ngx-infinite-scroller';
import { NgModule } from '@angular/core';

import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CardsComponent } from './cards/cards.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    PageNotFoundComponent,
    DashboardComponent,
    CardsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxInfiniteScrollerModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [

  ],
  bootstrap: [AppComponent, NavbarComponent, FooterComponent, CardsComponent]
})

export class AppModule { }
