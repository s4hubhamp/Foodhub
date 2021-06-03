import {HttpErrorResponse} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {User} from '../auth/user.model';
import {UserService} from '../auth/user.service';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: User = null;
  emailError: string = null;
  usernameError: string = null;
  subscription: Subscription;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {

    this.subscription = this.userService.user.subscribe((user) => {
      this.user = user;
    });
  }

  onSubmit(form: NgForm) {
    this.emailError = null;
    this.usernameError = null;
    if (form.valid) {
      const {email, username} = form.value;

      this.userService
        .updateProfile(this.user._id, username, email)
        .subscribe(
          () => {
            const myModal = document.getElementById('ProfileHelperModal');
            new Modal(myModal).show();
          },
          (err) => {
            this.handleError(err);
          }
        );
    }
  }

  handleError(errorRes: HttpErrorResponse) {
    try {
      this.emailError = null;
      this.usernameError = null;
      console.log(errorRes);

      if (errorRes.error.message.keyPattern.username) {
        this.usernameError = 'That Username is taken. Try another.';
      } else if (errorRes.error.message.keyPattern.email) {
        this.emailError = 'That Email already exists!';
      } else {
        throw new Error('Unknown Error Occurred!');
      }
    } catch {
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
