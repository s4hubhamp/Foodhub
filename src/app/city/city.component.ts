import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Restaurant} from '../restaurant/restaurant.model';
import {RestaurantsService} from '../restaurant/restaurants.service';
import {DataStorageService} from '../shared/data-storage.service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css'],
})
export class CityComponent implements OnInit, OnDestroy {
  cityName: string = null;
  paramsSubscription: Subscription;
  restaurants: Restaurant[] = [];
  cityNotFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService,
    private restaurantsService: RestaurantsService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.paramsSubscription = this.route.params.subscribe((params: Params) => {
      if (this.dataStorageService.verifyCity(params['city'])) {

        this.restaurantsService.setRestaurants([]);
        this.cityName = params['city'];
        this.dataStorageService.getRestaurants(params['city']);

        this.restaurantsService.restaurantsChanged.subscribe((r) => {
          this.restaurants = r;
        });
      } else {
        this.cityNotFound = true;
      }
    });

    this.restaurantsService.restaurantsChanged.subscribe((r) => {
      this.restaurants = r;
    });
  }

  onClick(title: string) {
    title = title.replace(/ /g, '-');
    this.router.navigate([title], {relativeTo: this.route});
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}
