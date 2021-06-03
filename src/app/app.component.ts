import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {UserService} from './auth/user.service';
import {User} from './auth/user.model';
import {CartItem} from './cart/cart-item.model';
import {CartService} from './cart/cart.service';
import {ServerResponseData} from './shared/ServerResponseData.model';

import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private httpClient: HttpClient,
    private userService: UserService,
    private cartService: CartService
  ) {
  }

  ngOnInit() {
    return this.httpClient
      .get<ServerResponseData>(environment.SERVER_URL + 'start')
      .subscribe((res) => {
        console.dir(res);
        if (!res) {
          localStorage.removeItem('user');
          const cart = JSON.parse(localStorage.getItem('cart'));
          if (cart) {
            this.cartService.setCart(cart);
          } else {
            this.cartService.setCart([]);
          }

          return;
        } else {
          const cart: CartItem[] = JSON.parse(res.cart);

          const user = new User(
            res.username,
            res._id,
            res.email,
            cart,
            JSON.parse(res.addresses),
            res.favourites
          );
          this.userService.user.next(user);
          localStorage.setItem('user', JSON.stringify(user));
          this.cartService.setCart(cart);
        }
      });
  }
}
