import { Then } from '@cucumber/cucumber';
import { Locator, Page, expect } from '@playwright/test';
import { ICustomWorld } from '../../support/custom-world';
import { getPage } from '../../utils/helper';

Then(
  /^I expect( partial)* text "(.*)?" is( not)* displayed$/,
  async function (
    this: ICustomWorld,
    partialMatch: boolean,
    textOrSelector: string,
    falseCase: boolean
  ) {
    const page: Page = await getPage(this);

    let element: Locator;

    if (textOrSelector.startsWith('pw:')) {
      textOrSelector = textOrSelector.split('pw:')[1];
      element = page.locator(textOrSelector);
    } else {
      element = page.getByText(textOrSelector, { exact: !partialMatch });
    }

    if (falseCase) {
      await expect(element).not.toBeVisible({ timeout: 10_000 });
    } else {
      await expect(element).toBeVisible({ timeout: 10_000 });
    }
    // await base.highlight(element);
  }
);
