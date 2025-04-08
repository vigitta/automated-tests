import { IWorldOptions, setWorldConstructor, World } from '@cucumber/cucumber';
import * as messages from '@cucumber/messages';
import {
  APIRequestContext,
  BrowserContext,
  Page,
  PlaywrightTestOptions,
  test,
} from '@playwright/test';
export interface CucumberWorldConstructorParams {
  parameters: { [key: string]: string };
}

export interface ICustomWorld extends World {
  debug: boolean;
  feature?: messages.Pickle;
  context?: BrowserContext;
  page?: Page;

  testName?: string;
  startTime?: Date;

  server?: APIRequestContext;

  playwrightOptions?: PlaywrightTestOptions;

  test?: typeof test;
}

export class CustomWorld extends World implements ICustomWorld {
  constructor(options: IWorldOptions) {
    super(options);
  }
  debug = false;
}

setWorldConstructor(CustomWorld);
