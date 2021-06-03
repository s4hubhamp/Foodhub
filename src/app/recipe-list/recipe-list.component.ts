import {Component, OnDestroy, OnInit} from '@angular/core';
import {Restaurant} from '../restaurant/restaurant.model';
import {RestaurantsService} from '../restaurant/restaurants.service';
import {Recipe} from '../restaurant/recipe.model';
import {CartService} from '../cart/cart.service';
import {Subscription} from 'rxjs';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  mainCourse: Recipe[] = [];
  quickBites: Recipe[] = [];
  extraas: Recipe[] = [];
  beverages: Recipe[] = [];
  restaurant: Restaurant = null;
  subscription: Subscription;
  cartSubscription: Subscription;
  modal;
  recipeInProcess: Recipe;
  isVegOnly: boolean = false;

  constructor(
    private restaurantsService: RestaurantsService,
    private cartService: CartService
  ) {
  }

  ngOnInit(): void {
    this.subscription = this.restaurantsService.newRestaurant.subscribe(
      (res) => {
        // console.log(res);
        this.setRestaurant(res);
      }
    );

    this.cartSubscription = this.cartService.cartUpdated.subscribe((cart) => {
      if (this.restaurant) {
        this.setRestaurant(this.restaurant);
      }
    });

    this.restaurantsService.isVegOnly.subscribe(
      val => {
        this.isVegOnly = val;
      }
    );
  }

  setRestaurant(res: Restaurant) {
    this.restaurant = res;

    this.mainCourse = [];
    this.quickBites = [];
    this.extraas = [];
    this.beverages = [];

    for (const r of res.recipes) {
      r.numberOfItems = this.cartService.getRecipeInfo(
        r,
        this.restaurant.title
      );

      if (r.category === 'main course') {
        this.mainCourse.push(r);
      } else if (r.category === 'quick bites') {
        this.quickBites.push(r);
      } else if (r.category === 'extra') {
        this.extraas.push(r);
      } else {
        this.beverages.push(r);
      }
    }
  }

  onAdd(e, recipe: Recipe) {
    const err = this.cartService.addRecipe(recipe, this.restaurant.title);
    if (err) {
      this.recipeInProcess = recipe;
      this.handleError();
    } else {
      if (e.target.nodeName === 'IMG') {
        e.target.parentElement.classList.add('d-none');
        e.target.parentElement.nextElementSibling.classList.remove('d-none');
      } else {
        e.target.classList.add('d-none');
        e.target.nextElementSibling.classList.remove('d-none');
      }
    }
  }

  onAddItem(e, recipe: Recipe) {
    const errorMessage = this.cartService.addRecipe(recipe, this.restaurant.title);
    if (errorMessage) {
      this.recipeInProcess = recipe;
      this.handleError();
    } else {
      if (e.target.nodeName === 'IMG') {
        e.target.parentElement.previousElementSibling.innerText =
          +e.target.parentElement.previousElementSibling.innerText + 1;
      } else {
        e.target.previousElementSibling.innerText =
          +e.target.previousElementSibling.innerText + 1;
      }
    }
  }

  onSubtractItem(e, recipe: Recipe) {
    if (recipe.numberOfItems === 0) {
      if (e.target.nodeName === 'IMG') {
        if (e.target.parentElement.nextSibling.innerText === '1') {
          e.target.parentElement.parentElement.classList.add('d-none');
          e.target.parentElement.parentElement.previousSibling.classList.remove(
            'd-none'
          );
        } else {
          e.target.parentElement.nextSibling.innerText =
            +e.target.parentElement.nextSibling.innerText - 1;
        }
      } else {
        if (e.target.nextSibling.innerText === '1') {
          e.target.parentElement.classList.add('d-none');
          e.target.parentElement.previousSibling.classList.remove('d-none');
        } else {
          e.target.nextSibling.innerText = +e.target.nextSibling.innerText - 1;
        }
      }
    } else {
      if (e.target.nodeName === 'IMG') {
        if (e.target.parentElement.nextElementSibling.innerText === '1') {
          e.target.parentElement.parentElement.classList.add('d-none');
          e.target.parentElement.parentElement.previousSibling.classList.remove(
            'd-none'
          );
        } else {
          e.target.parentElement.nextElementSibling.innerText =
            +e.target.parentElement.nextElementSibling.innerText - 1;
        }
      } else {
        if (e.target.nextElementSibling.innerText === '1') {
          e.target.parentElement.classList.add('d-none');
          e.target.parentElement.previousSibling.classList.remove('d-none');
        } else {
          e.target.nextElementSibling.innerText =
            +e.target.nextElementSibling.innerText - 1;
        }
      }
    }

    this.cartService.removeRecipe(recipe, this.restaurant.title);
  }

  private handleError() {
    const myModal = document.getElementById('cartHelperModal');
    this.modal = new Modal(myModal);
    this.modal.show();
  }

  resetCart() {
    this.cartService.setCart([]);
    this.cartService.addRecipe(this.recipeInProcess, this.restaurant.title);
    this.modal.hide();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.cartSubscription.unsubscribe();
  }
}
