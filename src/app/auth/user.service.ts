import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';

import {User} from './user.model';
import {CartService} from '../cart/cart.service';
import {ServerResponseData} from '../shared/ServerResponseData.model';
import {Router} from '@angular/router';
import {Restaurant} from '../restaurant/restaurant.model';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class UserService {
  user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private router: Router
  ) {
  }

  signup(email: string, username: string, password: string) {
    return this.http
      .post<ServerResponseData>(environment.SERVER_URL + 'auth/register', {
        username: username,
        email: email,
        password: password,
      })
      .pipe(
        tap((resData) => {
          this.handleAuthentication(resData);
        })
      );
  }

  logOut() {
    return this.http.get(environment.SERVER_URL + 'auth/logout').subscribe(() => {
      this.user.next(null);

      localStorage.removeItem('user');
      this.cartService.setCart([]);
      this.router.navigate(['/']);
    });
  }

  login(username: string, password: string) {
    return this.http
      .post<ServerResponseData>(environment.SERVER_URL + 'auth/login', {
        username: username,
        password: password,
      })
      .pipe(
        tap((resData) => {
          this.handleAuthentication(resData);
        })
      );
  }

  private handleAuthentication(res: ServerResponseData) {
    let user: User;

    const localCart = JSON.parse(localStorage.getItem('cart'));

    if (res.cart === '') {
      user = new User(
        res.username,
        res._id,
        res.email,
        localCart,
        JSON.parse(res.addresses),
        res.favourites
      );
    } else {
      if (localCart.length === 0) {
        user = new User(
          res.username,
          res._id,
          res.email,
          JSON.parse(res.cart),
          JSON.parse(res.addresses),
          res.favourites
        );
      } else {
        user = new User(
          res.username,
          res._id,
          res.email,
          localCart,
          JSON.parse(res.addresses),
          res.favourites
        );
      }
    }

    localStorage.removeItem('cart');
    localStorage.setItem('user', JSON.stringify(user));
    this.user.next(user);
    this.cartService.setCart(user.cart);
  }

  updateProfile(id: string, username: string, email: string) {
    return this.http
      .post<ServerResponseData>(
        `${environment.SERVER_URL}user/${id}/updateprofile`,
        {username, email}
      )
      .pipe(
        tap((updatedUser) => {
          const user = new User(
            updatedUser.username,
            updatedUser._id,
            updatedUser.email,
            JSON.parse(updatedUser.cart),
            JSON.parse(updatedUser.addresses),
            updatedUser.favourites
          );
          this.user.next(user);
          localStorage.setItem('user', JSON.stringify(user));
          this.cartService.setCart(user.cart);
        })
      );
  }


  addAddress(id: string, address) {
    return this.http
      .post<ServerResponseData>(`${environment.SERVER_URL}user/${id}/addaddress`, {
        address: address,
      }).pipe(
        tap((res) => {
          let user: User;
          user = new User(
            res.username,
            res._id,
            res.email,
            JSON.parse(res.cart),
            JSON.parse(res.addresses),
            res.favourites
          );
          localStorage.setItem('user', JSON.stringify(user));
          this.user.next(user);
        })
      );
  }

  addFavouriteRes(userId, id
    :
    string
  ) {
    this.http.post<ServerResponseData>(`${environment.SERVER_URL}user/${userId}/addFavouriteRes`, {
      resId: id
    }).pipe(
      tap((res) => {
        let user: User;
        user = new User(
          res.username,
          res._id,
          res.email,
          JSON.parse(res.cart),
          JSON.parse(res.addresses),
          res.favourites
        );
        localStorage.setItem('user', JSON.stringify(user));
        this.user.next(user);
      })
    ).subscribe();
  }

  removeFavouriteRes(userId, id
    :
    string
  ) {
    this.http.post<ServerResponseData>(`${environment.SERVER_URL}user/${userId}/removeFavouriteRes`, {
      resId: id
    }).pipe(
      tap((res) => {
        let user: User;
        user = new User(
          res.username,
          res._id,
          res.email,
          JSON.parse(res.cart),
          JSON.parse(res.addresses),
          res.favourites
        );
        localStorage.setItem('user', JSON.stringify(user));
        this.user.next(user);
      })
    ).subscribe();
  }

  getFavourites(userId
                  :
                  string
  ) {
    return this.http.get<Restaurant[]>(`${environment.SERVER_URL}user/${userId}/getFavourites`);
  }
}

