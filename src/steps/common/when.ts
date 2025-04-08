import { When } from '@cucumber/cucumber';
import { Locator } from '@playwright/test';
import { Pages } from '../../page_objects/maps.po';
import { ICustomWorld } from '../../support/custom-world';
import { ValidPageClasses } from '../../types/pages';

When(
  /^I click "([^"]*)?"."([^"]*)?"$/,
  async function (this: ICustomWorld, pageClass: ValidPageClasses, selectorName: string) {
    const page = this.page!;
    const obj = new Pages[pageClass](page);

    const selector: Locator | string = obj[selectorName];

    await obj.base.click(selector);
  }
);
