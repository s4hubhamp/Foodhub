import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {UserService} from '../auth/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  currentRoute: string;
  isAuthenticated: boolean = false;
  username: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.userService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
      if (user) {
        this.username = user.username;
      }
    });
  }

  onSignIn() {
    this.router.navigate(['/signIn']);
  }

  onSignUp() {
    this.router.navigate(['/signUp']);
  }

  onSignOut() {
    this.userService.logOut();
  }
}
