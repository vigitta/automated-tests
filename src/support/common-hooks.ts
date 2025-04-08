import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  ITestCaseHookParameter,
  setDefaultTimeout,
  Status,
} from '@cucumber/cucumber';

import {
  chromium,
  ChromiumBrowser,
  ConsoleMessage,
  firefox,
  FirefoxBrowser,
  request,
  webkit,
  WebKitBrowser,
} from '@playwright/test';
import fs, { ensureDir } from 'fs-extra';
import { config } from './config';
import { ICustomWorld } from './custom-world';

const JOB_ID = !process.env.JOB_ID || process.env.JOB_ID === '' ? '' : '/' + process.env.JOB_ID;

let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
const tracesDir = 'traces';

declare global {
  // eslint-disable-next-line no-var
  var browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser;
}

// setDefaultTimeout(process.env.PWDEBUG ? -1 : 60 * 1000);
setDefaultTimeout(20 * 60_000); // 20 minutes

BeforeAll(async function () {
  const caps = {
    os: 'Windows',
    osVersion: 11,
    browserName: 'edge',
    browserVersion: 'latest',
    name: 'NAT',
    build: 'User Management',
    buildIdentifier: '#${BUILD_NUMBER}',
    test_observability: true,
    observability: true,
    testObservability: true,
  };

  switch (config.browser) {
    case 'firefox':
      browser = await firefox.launch(config.browserOptions);
      break;
    case 'webkit':
      browser = await webkit.launch(config.browserOptions);
      break;
    default:
      // browser = await chromium.connect({
      //   wsEndpoint: endpoint
      // })
      browser = await chromium.launch(config.browserOptions);
  }

  await ensureDir(tracesDir);
  await fs.remove('screenshots/');
});

Before({ tags: '@ignore' }, async function () {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return 'skipped' as any;
});

Before({ tags: '@debug' }, async function (this: ICustomWorld) {
  this.debug = true;
});

Before(async function (this: ICustomWorld, { pickle }: ITestCaseHookParameter) {
  await updateTestSummaryCount('addTestTotal');
  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, '-');
  // customize the [browser context](https://playwright.dev/docs/next/api/class-browser#browsernewcontextoptions)

  this.context = await browser.newContext({
    acceptDownloads: true,
    // storageState: await getStorageState(pickle.tags),
    recordVideo: process.env.PWVIDEO ? { dir: 'screenshots' } : undefined,
    viewport: { width: 1600, height: 1200 },
    permissions: ['clipboard-read'],
    // viewport: { width: 1400, height: 900 },
  });
  this.server = await request.newContext({
    // All requests we send go to this API endpoint.
    baseURL: config.BASE_API_URL,
  });
  await this.context.tracing.start({ screenshots: true, snapshots: true });

  this.page = await this.context.newPage();
  this.page.on('console', async (msg: ConsoleMessage) => {
    if (msg.type() === 'log') {
      await this.attach(msg.text());
    }
  });

  this.page.setDefaultTimeout(20 * 60_000); // 20 minutes
  this.feature = pickle;

  const scenarioName = pickle.name + pickle.id;
});

After(async function (this: ICustomWorld, { result }: ITestCaseHookParameter) {
  if (result) {
    await this.attach(`Status: ${result?.status}. Duration:${result.duration?.seconds}s`);

    if (result.status !== Status.PASSED) {
      await updateTestSummaryCount('addTestFail');
      const image = await this.page?.screenshot();
      // Replace : with _ because colons aren't allowed in Windows paths
      const timePart = this.startTime?.toISOString().split('.')[0].replaceAll(':', '_');
      image && (await this.attach(image, 'image/png'));
      await this.context?.tracing.stop({
        path: `${tracesDir}/${this.testName}-${timePart}trace.zip`,
      });
    } else {
      await updateTestSummaryCount('addTestPass');
    }
  }

  const pages = this.context!.pages();

  for (const page of pages) {
    await page.close();
  }

  await this.context?.close();
});

AfterAll(async function () {
  const name = browser.browserType().name();
  const version = browser.version();
  await generateBrowserMetaData(name, version);
  await browser.close();
});

async function generateBrowserMetaData(browserName: string, browserVersion: string) {
  const metadata = {
    browserName: browserName,
    browserVersion: browserVersion,
  };

  await ensureDir(`./metadata`);

  await fs.writeFile(`./metadata${JOB_ID}.json`, JSON.stringify(metadata, null, 2));
}

async function updateTestSummaryCount(action: 'addTestTotal' | 'addTestFail' | 'addTestPass') {
  //Write code for syncing the test result API like Xray/Jira here
}
