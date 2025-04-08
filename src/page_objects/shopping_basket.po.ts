import { Page } from '@playwright/test';
import Base from './base.po';

export default class ShoppingBasket {
  [linkName: string]: any;

  public base: Base;

  constructor(private page: Page) {
    this.base = new Base(page);
  }

  get Notification_Item_Text() {
    return '#notifications-display > div > div > div > div.fx-infobox__content.fx-text.fx-notification__content';
  }

  async isProductAddedToBasket(page: Page) {
    return await page.locator(this.Notification_Item_Text).isVisible();
  }
}
