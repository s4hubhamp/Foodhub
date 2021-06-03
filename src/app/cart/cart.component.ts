import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {Recipe} from '../restaurant/recipe.model';
import {CartItem} from './cart-item.model';
import {CartService} from './cart.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, OnDestroy {
  cart: CartItem[] = [];
  subTotal: number;
  cartSubscription: Subscription;
  totalsSubscription: Subscription;
  displayCheckoutButton: boolean;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.router.url === '/checkout' ? this.displayCheckoutButton = false : this.displayCheckoutButton = true;
    this.cart = this.cartService.getCart();


    this.cartSubscription = this.cartService.cartUpdated.subscribe((cart) => {
      this.cart = cart;
    });

    this.subTotal = this.cartService.getSubtotal();

    this.totalsSubscription = this.cartService.totalChanged.subscribe(
      (total) => {
        this.subTotal = total;
      }
    );
  }

  getRecipeInfo(r: Recipe, res: string) {
    return this.cartService.getRecipeInfo(r, res);
  }

  onAddItem(recipe: Recipe, correspondigRes: string) {
    this.cartService.addRecipe(recipe, correspondigRes);
  }

  onSubtractItem(recipe: Recipe, correspondigRes: string) {
    this.cartService.removeRecipe(recipe, correspondigRes);
  }

  ngOnDestroy() {
    this.totalsSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
  }
}
