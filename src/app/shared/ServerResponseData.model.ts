export interface ServerResponseData {
  _id: string;
  username: string;
  email: string;
  cart: string;
  addresses: string;
  favourites: [string];
  lat?: string;
  lan?: string;
}
