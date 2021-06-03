import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {AuthComponent} from './auth/auth.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {CityComponent} from './city/city.component';
import {HomeComponent} from './home/home.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {RestaurantComponent} from './restaurant/restaurant.component';
import {AddressesComponent} from './user-profile/addresses/addresses.component';
import {FavouritesComponent} from './user-profile/favourites/favourites.component';
import {OrdersComponent} from './user-profile/orders/orders.component';
import {PaymentsComponent} from './user-profile/payments/payments.component';
import {UserProfileComponent} from './user-profile/user-profile.component';

const appRoutes: Routes = [
  {path: '', pathMatch: 'full', component: HomeComponent},
  {path: 'signIn', component: AuthComponent},
  {path: 'signUp', component: AuthComponent},
  {path: 'checkout', component: CheckoutComponent},
  {
    path: 'profile',
    component: UserProfileComponent,
    children: [
      {path: '', redirectTo: 'addresses', pathMatch: 'full'},
      {path: 'orders', component: OrdersComponent},
      {path: 'favourites', component: FavouritesComponent},
      {path: 'addresses', component: AddressesComponent},
      {path: 'payments', component: PaymentsComponent},
    ],
  },
  {path: 'pagenotfound', component: PageNotFoundComponent},
  {path: ':city', component: CityComponent},
  {path: ':city/:restaurant', component: RestaurantComponent},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {scrollPositionRestoration: 'enabled'}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
