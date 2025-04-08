import { Page } from '@playwright/test';
import Base from './base.po';

export default class CableGuy {
  //[linkName: string]: any;

  public base: Base;

  constructor(private page: Page) {
    this.base = new Base(page);
  }

  get Cable_Beginning_Button() {
    return `button.cg-plugButton--left`;
  }

  get Cable_Beginning_Image() {
    return `.cg-plugButton--left>.cg-plugImageButton>.cg-plugImage`;
  }

  get Cable_End_Button() {
    return `button.cg-plugButton--right`;
  }

  get Cable_End_Image() {
    return `.cg-plugButton--right>.cg-plugImageButton>.cg-plugImage`;
  }

  get Cable_Type_Item() {
    return `div.scroll.cg-plugmodal__plugs.select-none > div.boundary > div > div > div:nth-child(1) > div > .cg-plugItem`;
  }

  get Manufacturer_Type_Item() {
    return `#cableguy > div.cg > div.cg-brands.cg-section > div.scroll > div.boundary > div > div > .item`;
  }

  get ItemList_Pagination_Buttons() {
    return '#cg-results > div.cg-pagination.cg-section.fx-pagination > div > button';
  }

  get ItemList_Pagination_Button_NextPage() {
    return '.cg-icons__arrow--right';
  }

  get ItemTitle() {
    return `.product__title`;
  }

  async selectRandomCable(page: Page, cableIndex?: number | undefined) {
    const cableTypeElements = await page.locator(this.Cable_Type_Item).all();

    // Ensure there are cable types available
    if (cableTypeElements.length > 0) {
      // Select a random cable type
      const randomIndex = Math.floor(Math.random() * cableTypeElements.length);
      //To-Do: Replace it with randomIndex
      const randomCableType = cableTypeElements[cableIndex ?? randomIndex];

      await randomCableType.click();
      await page.waitForTimeout(2000);
    } else {
      throw new Error('No cable types found to click');
    }
  }

  async selectRandomManufacturer(page: Page, mfgrIndex?: number | undefined): Promise<number> {
    const manufacturerElements = await page.locator(this.Manufacturer_Type_Item).all();

    // Ensure there are mfgs available
    if (manufacturerElements.length > 0) {
      // Select a random mfgs
      const randomIndex = Math.floor(Math.random() * manufacturerElements.length);

      //To-Do: replace with randomIndex
      const randomMfgr = manufacturerElements[mfgrIndex ?? randomIndex];

      const count = (await randomMfgr.textContent()) ?? '0';
      const cableCount = parseInt(count);
      await randomMfgr.click();
      await page.waitForTimeout(2000);

      return cableCount;
    } else {
      throw new Error('No mfg types found to click');
    }

    return 0;
  }

  public async getAllCableItemNames(page: Page): Promise<string[]> {
    const cable_titles: string[] = [];

    const hasMultiplePages = await page
      .locator(this.ItemList_Pagination_Button_NextPage)
      .isVisible();
    if (hasMultiplePages) {
      while (await page.locator(this.ItemList_Pagination_Button_NextPage).isVisible()) {
        const titles = await page.locator(this.ItemTitle).allTextContents();
        cable_titles.push(...titles);
        await page.locator(this.ItemList_Pagination_Button_NextPage).click();
      }
    } else {
      const titles = await page.locator(this.ItemTitle).allTextContents();
      cable_titles.push(...titles);
    }

    return cable_titles;
  }
}
