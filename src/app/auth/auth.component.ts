import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {UserService} from './user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  authMode: string = 'logIn';
  emailError: string = null;
  usernameError: string = null;
  Unauthorized: boolean = false;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    document.getElementById('hourglass').style.display = 'none';
    this.authMode = this.router.url === '/signIn' ? 'signIn' : 'signUp';
  }

  onSubmit(form: NgForm) {
    this.Unauthorized = false;
    this.emailError = null;
    this.usernameError = null;
    if (form.valid) {
      document.getElementById('hourglass').style.display = 'inline-block';
      const {email, username, password} = form.value.userData;

      if (this.authMode === 'signUp') {
        this.userService.signup(email, username, password).subscribe(
          (resData) => {
            document.getElementById('hourglass').style.display = 'none';
            this.router.navigate(['/']);
          },
          (err) => {
            this.handleError(err);
          }
        );
      } else {
        this.userService.login(username, password).subscribe(
          (resData) => {
            document.getElementById('hourglass').style.display = 'none';
            this.router.navigate(['/']);
          },
          (err) => {
            this.handleError(err);
          }
        );
      }
    }
  }

  handleError(errorRes: HttpErrorResponse) {
    document.getElementById('hourglass').style.display = 'none';
    try {
      this.Unauthorized = false;
      this.emailError = null;
      this.usernameError = null;
      if (errorRes.error.name === 'MongoError') {
        this.emailError = 'email alreaHdy exists!';
      } else if (errorRes.error === 'Unauthorized') {
        this.Unauthorized = true;
      } else {
        switch (errorRes.error.name) {
          case 'UserExistsError':
            this.usernameError = errorRes.error.message;
            break;
        }
      }
    } catch {
    }
  }

}
