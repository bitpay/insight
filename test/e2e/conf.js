exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  jasmineNodeOpts: {
    defaultTimeoutInterval: 250000,
  },
  specs: ['test.js'],

  multiCapabilities: [
    {
      browserName: 'firefox',
      'moz:firefoxOptions': {
        args: ['--headless'],
      },
    },
    {
      chromeOptions: {
        args: ['--headless'],
      },
      browserName: 'chrome',
    },
  ],
};
