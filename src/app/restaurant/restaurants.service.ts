import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Restaurant} from './restaurant.model';

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  restaurantsChanged = new Subject<Restaurant[]>();
  newRestaurant = new Subject<Restaurant>();
  isVegOnly = new Subject<boolean>();

  constructor() {
  }

  setRestaurants(res: Restaurant[]) {
    this.restaurantsChanged.next(res);
  }

  setRestaurant(res: Restaurant) {
    this.newRestaurant.next(res);
  }

}
