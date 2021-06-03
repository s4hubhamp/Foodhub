import {Recipe} from './recipe.model';

export class Restaurant {
  _id: string;
  title: string;
  description: string;
  image: string;
  recipes?: Recipe[];
  location: string;
  isFavourite?: boolean;
  city: string;
}
