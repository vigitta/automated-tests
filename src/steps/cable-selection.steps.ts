import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { URLS } from '../constants/url';
import CableGuy from '../page_objects/cable_guy.po';
import ProductPage from '../page_objects/product_page.po';
import ShoppingBasket from '../page_objects/shopping_basket.po';
import { ICustomWorld } from '../support/custom-world';

Given('I navigate to Cable Guy Page', async function (this: ICustomWorld) {
  const page = this.page!;

  const envUrl = process.env.APP_ENV || 'PROD';

  const url = URLS[envUrl].BASE;

  await page.goto(`${url}/intl/cableguy.html`, { timeout: 2 * 60_000 });
  await page.waitForLoadState('domcontentloaded', { timeout: 60_000 });
  await page.locator('button.spicy-consent-bar__action-accept').click();
});

When('I Click on a random cable type', async function () {
  const page = this.page!;
  const cable_guy = new CableGuy(page);
  // There is a bug in the website that some of the cable types shows multiple manufacturers in the begining but when we click it will not list any products
  // An index can be passed to the `selectRandomCable` to select a particular cable index so that we can test particular cable types
  await cable_guy.selectRandomCable(page);
});

Then('a cable type is displayed on the begining part of the cable UI', async function () {
  const page = this.page!;
  const cable_guy = new CableGuy(page);
  const cableTypeBeginningImage = await page.locator(cable_guy.Cable_Beginning_Image);
  expect(cableTypeBeginningImage).toBeVisible({ timeout: 10_000 });
});

When('I click on a random manufacturer item', async function (this: ICustomWorld) {
  const page = this.page!;
  const cable_guy = new CableGuy(page);
  //Pass-in an index for the manufacturer with atleast 1 cable to test this area
  // So that the bug in the page does not delay the automation code development.
  this.cableCount = await cable_guy.selectRandomManufacturer(page);
});

Then(
  'it shows the same number of products as listed under the manufacturer logo',
  async function (this: ICustomWorld) {
    const page = this.page!;
    const cable_guy = new CableGuy(page);
    const cable_titles = await cable_guy.getAllCableItemNames(page);
    expect(this.cableCount).toBe(cable_titles.length);
  }
);

When('I click on a filtered product', async function () {
  const page = this.page!;
  const cable_guy = new CableGuy(page);
  const filteredProduct = await page.locator(cable_guy.ItemTitle).nth(0);
  this.productTitle = await filteredProduct.textContent();
  await filteredProduct.click();
});

Then('the page opened is having the same title', async function () {
  const page = this.page!;
  const product_page = new ProductPage(page);
  const page_title = await product_page.base.getPageTitle();
  expect(page_title).toBe(this.productTitle);
});

Then('When I add the product to the cart', async function () {
  const page = this.page!;
  const product_page = new ProductPage(page);
  product_page.addProductToBasket(page);
});

Then('the basket notification popup has the same product name', async function () {
  const page = this.page!;
  const shopping_basket_page = new ShoppingBasket(page);
  await shopping_basket_page.base.waitForPageToLoad();
  const isAdded = await shopping_basket_page.isProductAddedToBasket(page);
  expect(isAdded).toBeTruthy();
});
