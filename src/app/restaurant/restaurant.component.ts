import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {DataStorageService} from '../shared/data-storage.service';
import {Restaurant} from './restaurant.model';
import {RestaurantsService} from './restaurants.service';
import {UserService} from '../auth/user.service';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css'],
})
export class RestaurantComponent implements OnInit, OnDestroy {
  cityName: string;
  restaurantName: string;
  restaurant: Restaurant = null;
  subscription: Subscription;
  isAuthenticated: boolean;
  userId: string;
  modal;

  constructor(
    private route: ActivatedRoute,
    private dataStorageService: DataStorageService,
    private restaurantsService: RestaurantsService,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.userService.user.subscribe(
      user => {
        if (user) {
          this.userId = user._id;
          this.isAuthenticated = true;
        } else {
          this.isAuthenticated = false;
        }
      }
    );
    this.route.params.subscribe((params) => {
      this.cityName = params['city'];
      this.restaurantName = params['restaurant'].replaceAll('-', ' ');
      this.subscription = this.restaurantsService.newRestaurant.subscribe((res) => {
        this.restaurant = res;
        if (res.isFavourite) {
          document.getElementById('favourite').textContent = 'Favourited';
        } else {
          document.getElementById('favourite').textContent = 'Favourite';
        }
      });

      this.dataStorageService.getRestaurant(
        params['restaurant']
      );
    });

    window.addEventListener('scroll', this.scrollFunction);
  }

  scrollFunction() {
    let height: number;
    height = document.getElementById('main').offsetHeight;

    if (
      document.scrollingElement.scrollTop > 101 ||
      document.documentElement.scrollTop > 101
    ) {
      document.getElementById('cart').style.position = 'fixed';
      document.getElementById('cart').style.top = '11rem';
      document.getElementById('restaurant-info').classList.add('d-none');

      document
        .getElementById('restaurant')
        .classList.add('restaurant-scrolled');

      document
        .getElementById('restaurant-name')
        .classList.add('restaurant-name-scrolled');

      document
        .getElementById('restaurant-buttons')
        .classList.add('restaurant-buttons-scrolled');
    } else {
      document.getElementById('cart').style.position = 'relative';
      document.getElementById('cart').style.top = '0';
      document.getElementById('restaurant-info').classList.remove('d-none');

      document
        .getElementById('restaurant')
        .classList.remove('restaurant-scrolled');

      document
        .getElementById('restaurant-name')
        .classList.remove('restaurant-name-scrolled');

      document
        .getElementById('restaurant-buttons')
        .classList.remove('restaurant-buttons-scrolled');
    }

    if (
      document.scrollingElement.scrollTop > height - 700 ||
      document.documentElement.scrollTop > height - 700
    ) {
      // document.getElementById('restaurant').classList.remove('sticky-md-top');
      document.getElementById('cart').style.position = 'relative';
    } else {
      // document.getElementById('restaurant').classList.add('sticky-md-top');
    }
  }

  onFavourite(e) {
    if (this.isAuthenticated) {
      if (e.target.checked) {
        document.getElementById('favourite').textContent = 'Favourited';
        this.userService.addFavouriteRes(this.userId, this.restaurant._id);
      } else {
        document.getElementById('favourite').textContent = 'Favourite';
        this.userService.removeFavouriteRes(this.userId, this.restaurant._id);
      }
    } else {
      e.target.checked = false;
      const myModal = document.getElementById('RestaurantHelperModal');
      this.modal = new Modal(myModal);
      this.modal.show();
    }
  }

  onVegOnly(e) {
    this.restaurantsService.isVegOnly.next(e.target.checked);
  }

  onLogIn() {
    this.modal.hide();
    this.router.navigate(['signIn']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    window.removeEventListener('scroll', this.scrollFunction);
  }
}
