import { Recipe } from "../restaurant/recipe.model";

export interface CartItem{
    correspondigRes:string;
    recipes: Recipe[]
}
