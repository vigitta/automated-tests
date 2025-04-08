interface URLContent {
  BASE: string;
}

interface URL {
  DEVELOP: URLContent;
  PROD: URLContent;
}

export const URLS: URL = {
  DEVELOP: {
    BASE: 'https://thomann.de',
  },

  PROD: {
    BASE: 'https://thomann.de',
  },
};
