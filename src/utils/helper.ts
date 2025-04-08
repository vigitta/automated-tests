import { Page } from '@playwright/test';
import { ICustomWorld } from '../support/custom-world';

export const getPage = async (world: ICustomWorld) => {
  let page: Page | undefined;

  if (world.parameters['isNewPageOpened'] === true) {
    const windowTitle = world.parameters['newPageTitle'];
    const pages = world.context!.pages();
    console.log('Feature name: ' + world.feature?.name);
    console.log('Pages Count: ' + pages.length);
    for (const cPage of pages) {
      const title = await cPage.title();
      console.log(`======= TITLE =======: ${title}`);
      if (windowTitle === title) {
        page = cPage;
        break;
      }
    }
  } else {
    page = world.page;
  }

  if (page === undefined) {
    // throw new Error("Page is not defined.");
    page = world.page!;
    return page;
  }
  return page;
};
