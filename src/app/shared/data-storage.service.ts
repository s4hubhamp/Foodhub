import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Restaurant} from '../restaurant/restaurant.model';
import {RestaurantsService} from '../restaurant/restaurants.service';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  private cities: string[] = [
    'akola',
    'ahmednagar',
    'amravati',
    'aurangabad',
    'beed',
    'bhandara',
    'chandrapur',
    'gondia',
    'ichalkaranji',
    'jalgaon',
    'jalna',
    'karad',
    'kolhapur',
    'latur',
    'mumbai',
    'malegaon',
    'miraj',
    'nagpur',
    'nashik',
    'nanded',
    'parbhani',
    'pune',
    'ratnagiri',
    'sangli',
    'satara',
    'solapur',
    'wardha',
    'yavatmal',
  ];

  constructor(
    private http: HttpClient,
    private restaurantsService: RestaurantsService,
    private router: Router
  ) {
  }

  verifyCity(city: string): boolean {
    return this.cities.includes(city);
  }

  getCitySuggestion(str: string): string[] {
    const suggestions: string[] = [];

    if (str.length === 1) {
      for (const city of this.cities) {
        if (city.indexOf(str) === 0) {
          suggestions.push(city);
        }
      }
    } else {
      for (const city of this.cities) {
        if (city.includes(str) && city.indexOf(str) === 0) {
          suggestions.push(city);
        }
      }
    }
    return suggestions;
  }

  getRestaurants(city: String) {
    this.http
      .get<Restaurant[]>(`${environment.SERVER_URL}city/${city}`)
      .pipe(
        tap((restaurants) => {
          this.restaurantsService.setRestaurants(restaurants);
        })
      )
      .subscribe();
  }

  getRestaurant(restaurant: String) {
    this.http
      .get<Restaurant>(`${environment.SERVER_URL}restaurant/${restaurant}`)
      .pipe(
        tap((restaurant) => {
          if (!restaurant) {
            this.router.navigate(['/pagenotfound']);
          } else {
            this.restaurantsService.setRestaurant(restaurant);
          }
        })
      )
      .subscribe();
  }
}
