import { Locator, Page } from '@playwright/test';

export default class Base {
  constructor(private page: Page) {}

  async waitForPageToLoad(timeout: number = 60_000) {
    await this.page.waitForLoadState('load', { timeout: timeout });
    await this.page.waitForLoadState('domcontentloaded', { timeout: timeout });
    await this.page.waitForLoadState('networkidle', { timeout: timeout });
  }

  /**
   * Perform click action
   *
   * @param {Locator} element
   */
  async click(
    selector: Locator | string,
    performJSClick: boolean = false,
    delay: number = 0,
    timeout: number = 30_000
  ) {
    const element = this.isLocator(selector) ? selector : this.page.locator(selector);

    await this.page.waitForLoadState('domcontentloaded', { timeout: timeout });
    await this.page.waitForLoadState('networkidle', { timeout: timeout });

    await element.waitFor({
      state: 'attached',
      timeout: timeout,
    });

    await element.waitFor({
      state: 'visible',
      timeout: timeout,
    });

    if (performJSClick) {
      await element.evaluate((el) => (el as HTMLElement).click());
    } else {
      // await this.highlight(element)
      await element.click({ delay: delay, timeout: timeout });
    }
  }

  /**
   * Set Value on text input fields
   * @param element
   * @param value
   */
  async setValue(element: Locator | string, value: string, delayInMs: number = 0) {
    const el = this.isLocator(element) ? element : this.page.locator(element);

    if (delayInMs === 0) {
      await el.clear();
      await el.fill(value);
    } else {
      await el.clear();
      await el.pressSequentially(value, { delay: delayInMs });
    }
  }

  /**
   * Perform highlighting on active element
   *
   * @param element
   */
  public async highlight(element: Locator | string, clearPreviousHighlights: boolean = true) {
    const el = this.isLocator(element) ? element : this.page.locator(element);

    if (clearPreviousHighlights) {
      // Clear all previous highlights
      await this.page.evaluate(() => {
        const elements = document.querySelectorAll<HTMLElement>(`.pw-highlight`);
        if (elements.length > 0) {
          for (const element of elements) {
            element.style.outline = '';
            element.classList.remove('pw-highlight');
          }
        }
      });
    }
    await el.evaluate((el) => el.classList.add('pw-highlight'));
    await el.evaluate((el) => (el.style.outline = '#f00 solid 4px'));
  }

  /**
   * Mouse hover action
   * @param {Locator|string} selector
   */
  public async hover(selector: Locator | string) {
    const element = this.isLocator(selector) ? selector : this.page.locator(selector);

    const pos = await element.boundingBox({ timeout: 5 * 1000 });

    await this.page.mouse.move(pos!.x + pos!.width / 2, pos!.y + pos!.height / 2);
  }

  public isLocator(element: Locator | string): element is Locator {
    return typeof element !== 'string';
  }

  public async isVisible(
    selector: Locator | string,
    timeout: number = 5_000,
    reverse: boolean = false
  ) {
    const element = this.isLocator(selector) ? selector : this.page.locator(selector);
    try {
      await element.waitFor({ state: 'visible', timeout: timeout });
      return !reverse;
    } catch (error) {
      return reverse;
    }
  }

  public async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  public async isInViewPort(selector: Locator | string) {
    const element = this.isLocator(selector) ? selector : this.page.locator(selector);

    const isVisible: boolean = await element.evaluate(async (el) => {
      return new Promise((resolve) => {
        const observer = new IntersectionObserver(([entry]) => {
          resolve(entry.isIntersecting);
          observer.disconnect();
        });

        observer.observe(el);
        requestAnimationFrame(() => {});
      });
    });

    return isVisible;
  }
  public async getPageTitle() {
    const title = (await this.page.title()).replace(' – Thomann International', '');
    return title;
  }

  public async waitForSeconds(seconds: number) {
    await this.page.waitForTimeout(seconds * 1000);
  }
}
