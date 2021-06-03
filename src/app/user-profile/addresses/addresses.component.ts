import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UserService} from '../../auth/user.service';
import {User} from '../../auth/user.model';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import Modal from 'bootstrap/js/dist/modal';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.css']
})
export class AddressesComponent implements OnInit, OnDestroy {

  annotations: string[] = ['home', 'work', 'hotel'];
  user: User;
  subscription: Subscription;
  currentRoute: string;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.subscription = this.userService.user.subscribe((user) => {
      this.user = user;
    });

    this.currentRoute = this.router.url;
  }


  onSubmit(form: NgForm) {
    const address = {
      flat_no: form.value.flat_no,
      address: form.value.address,
      landmark: form.value.landmark,
      city: form.value.city,
      annotation: form.value.annotation
    };
    this.userService.addAddress(this.user._id, address).subscribe(() => {
      console.log('address added');
      new Modal(document.getElementById('AddressHelperModal')).show();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
