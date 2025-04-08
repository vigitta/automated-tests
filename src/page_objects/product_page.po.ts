import { Page } from '@playwright/test';
import Base from './base.po';

export default class ProductPage {
  [linkName: string]: any;

  public base: Base;

  constructor(private page: Page) {
    this.base = new Base(page);
  }

  get Button_Add_To_Basket() {
    return 'button.call-to-action__button.fx-button.fx-button--cta';
  }

  async addProductToBasket(page: Page) {
    await page.locator(this.Button_Add_To_Basket).click();
  }
}
