import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { AuthComponent } from './auth/auth.component';
import { AppRoutingModule } from './app-routing.module';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { CityComponent } from './city/city.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { Interceptor } from './shared/http-interceptor.service';
import { OrdersComponent } from './user-profile/orders/orders.component';
import { FavouritesComponent } from './user-profile/favourites/favourites.component';
import { AddressesComponent } from './user-profile/addresses/addresses.component';
import { PaymentsComponent } from './user-profile/payments/payments.component';
import { CheckoutComponent } from './checkout/checkout.component';
import {CartComponent} from './cart/cart.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    FooterComponent,
    HomeComponent,
    CityComponent,
    PageNotFoundComponent,
    RestaurantComponent,
    RecipeListComponent,
    UserProfileComponent,
    OrdersComponent,
    FavouritesComponent,
    AddressesComponent,
    PaymentsComponent,
    CheckoutComponent,
    CartComponent,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule, HttpClientModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
