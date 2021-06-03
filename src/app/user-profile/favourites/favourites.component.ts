import {Component, OnInit} from '@angular/core';
import {UserService} from '../../auth/user.service';
import {User} from '../../auth/user.model';
import {Restaurant} from '../../restaurant/restaurant.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {

  user: User = null;
  favouriteRestaurants: Restaurant[] = [];

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.userService.user.subscribe(
      user => this.user = user
    );

    if (this.user) {
      this.userService.getFavourites(this.user._id).subscribe(
        res => {
          this.favouriteRestaurants = res;
        }
      );
    }
  }

  onClick(city: string, title: string) {
    title = title.replace(/ /g, '-');
    this.router.navigate([city, title]);
  }

}
