import {Component, OnInit} from '@angular/core';
import {User} from '../auth/user.model';
import {NgForm} from '@angular/forms';
import {UserService} from '../auth/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  user: User = null;
  annotations: string[] = ['home', 'work ', 'hotel'];
  isAuthenticated: boolean = false;


  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.user.subscribe(user => {
      this.user = user;
      if (user) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    });
  }

  onSubmit(form: NgForm) {
    const address = {
      flat_no: form.value.flat_no,
      address: form.value.address,
      landmark: form.value.landmark,
      city: form.value.city,
      annotation: form.value.annotations
    };

    this.userService.addAddress(this.user._id, address);
  }
}
