import 'dotenv/config';
import * as os from "node:os";
import * as process from "node:process";
import { Status } from "allure-js-commons";

const getWorldParams = () => {
  const params = {
    foo: 'bar',
  };

  return params;
};
const JOB_ID =
  !process.env.JOB_ID || process.env.JOB_ID === ''
    ? ''
    : '/' + process.env.JOB_ID;

const config = {
  requireModule: ['ts-node/register'],
  require: [
    'src/constants/**/*.ts',
    'src/page_objects/**/*.ts',
    'src/steps/**/*.ts',
    'src/support/**/*.ts',
    'src/utils/**/*.ts',
  ],
  format: [
    // 'message:e2e/reports/cucumber-report.ndjson',
    `json:reports${JOB_ID}/json/cucumber-report-${Date.now()}.json`,
    `html:reports${JOB_ID}/report.html`,
    'summary',
    `junit:reports${JOB_ID}/junit/junit.xml`,
    'progress-bar',
  ],
  formatOptions: { snippetInterface: 'async-await' },
  worldParameters: getWorldParams(),
  timeout: 20 * 60 * 1000, // 20 minutes
};

if (process.env.USE_ALLURE) {
  config.format.push('allure-cucumberjs/reporter');
  config.formatOptions = {
    ...config.formatOptions, // Preserve existing format options
    resultsDir: 'reports/allure/results/',
    labels: [
      {
        pattern: [/@epic:(.*)/],
        name: 'epic',
      },
      {
        pattern: [/@severity:(.*)/],
        name: 'severity',
      },
    ],
    environmentInfo: {
      os_platform: os.platform(),
      os_release: os.release(),
      os_version: os.version(),
      node_version: process.version,
    },
  };
} else {
  config.format.push('@cucumber/pretty-formatter');
}
export default config;
