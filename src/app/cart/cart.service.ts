import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Recipe} from '../restaurant/recipe.model';
import {CartItem} from './cart-item.model';

import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: CartItem[] = [];
  cartUpdated = new Subject<CartItem[]>();
  totalChanged = new Subject<number>();

  constructor(private http: HttpClient) {
  }

  addRecipe(r: Recipe, correspondigRes: string) {
    let el: CartItem = null;
    for (const c of this.cart) {
      if (c.correspondigRes === correspondigRes) {
        el = c;
      }
    }

    if (el) {
      let recipeReq: Recipe = null;

      if (el.recipes.length === 0) {
        el.recipes.push({...r, numberOfItems: 1});
      } else {
        for (const g of el.recipes) {
          if (g.title === r.title) {
            recipeReq = g;
          }
        }
        if (recipeReq) {
          recipeReq.numberOfItems++;
        } else {
          el.recipes.push({...r, numberOfItems: 1});
        }
      }
    } else {
      if (this.cart.length === 0) {
        this.cart.push({
          correspondigRes,
          recipes: [{...r, numberOfItems: 1}],
        });
      } else {
        return 'Restaurant Already Exists!';
      }
    }

    this.manageCart();
    this.cartUpdated.next(this.cart.slice());
    this.getSubtotal();
  }

  removeRecipe(r: Recipe, correspondigRes: string) {
    let el: CartItem = null;
    let correspondigResIndex: number = null;
    for (const [i, c] of this.cart.entries()) {
      if (c.correspondigRes === correspondigRes) {
        el = c;
        correspondigResIndex = i;
      }
    }

    let indexReq: number = null;

    for (const [k, g] of el.recipes.entries()) {
      if (g.title === r.title) {
        indexReq = k;
      }
    }
    if (el.recipes[indexReq].numberOfItems === 1) {
      el.recipes.splice(indexReq, 1);
    } else {
      el.recipes[indexReq].numberOfItems--;
    }

    if (el.recipes.length === 0) {
      this.cart.splice(correspondigResIndex, 1);
    }

    this.manageCart();
    this.cartUpdated.next(this.cart.slice());
    this.getSubtotal();
  }

  getRecipeInfo(r: Recipe, correspondigRes: string) {
    let el: CartItem = null;
    for (const c of this.cart) {
      if (c.correspondigRes === correspondigRes) {
        el = c;
        break;
      }
    }

    if (el) {
      let reqRec: Recipe = null;
      for (const recipe of el.recipes) {
        if (recipe.title === r.title) {
          reqRec = recipe;
        }
      }

      if (reqRec) {
        return reqRec.numberOfItems;
      } else {
        return 0;
      }
      // return el.recipes.filter((i) => i.title === r.title).length;
      // el = null;
    } else {
      return 0;
    }
  }

  getCart(): CartItem[] {
    return this.cart.slice();
  }

  getSubtotal(): number {
    let total = 0;
    for (const c of this.cart) {
      for (const r of c.recipes) {
        total += r.price * r.numberOfItems;
      }
    }

    this.totalChanged.next(total);
    return total;
  }

  setCart(cart: CartItem[]) {
    this.cart = cart;
    this.cartUpdated.next(cart);
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      user.cart = cart;

      localStorage.setItem('user', JSON.stringify(user));
      this.http
        .post(`${environment.SERVER_URL}user/${user._id}/updatecart`, {
          cart: JSON.stringify(this.cart),
        })
        .subscribe();
    } else {
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    this.getSubtotal();
  }

  manageCart() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      user.cart = this.cart;
      localStorage.setItem('user', JSON.stringify(user));
      this.http
        .post(`${environment.SERVER_URL}user/${user._id}/updatecart`, {
          cart: JSON.stringify(this.cart),
        })
        .subscribe();
    } else {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
    this.getSubtotal();
  }
}
