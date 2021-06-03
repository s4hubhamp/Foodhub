// import { CartItem } from '../cart/cart-item.model';

// export class User {
//   constructor(
//     public username: string,
//     public _id: string,
//     public email: string,
//     public cart: CartItem[],
//     public expirationDate : Date,
//     public addresses: [string],
//     public favourites: [string],
//     public lat?: string,
//     public lan?: string
//   ) {}

//   // get id() {
//   //   return this.id;
//   // }
// }

import {CartItem} from '../cart/cart-item.model';

export class User {
  constructor(
    public username: string,
    public _id: string,
    public email: string,
    public cart: CartItem[],
    public addresses: [{ annotation: string, landmark: string, address: string, flat_no: string, city: string }],
    public favourites: [string],
    public lat?: string,
    public lan?: string
  ) {
  }

  // get id() {
  //   return this.id;
  // }
}
