import CableGuy from './cable_guy.po';
import ProductPage from './product_page.po';
import ShoppingBasket from './shopping_basket.po';

export const Pages: {
  CableGuy: typeof CableGuy;
  ProductPage: typeof ProductPage;
  ShoppingBasket: typeof ShoppingBasket;
} = {
  CableGuy,
  ProductPage,
  ShoppingBasket,
};
