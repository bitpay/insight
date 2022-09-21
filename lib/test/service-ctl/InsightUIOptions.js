const fs = require('fs');
const os = require('os');
const path = require('path');

const NodeJsServiceOptions = require('@dashevo/dp-services-ctl/lib/services/node/NodeJsServiceOptions');

class InsightUIOptions extends NodeJsServiceOptions {
  static setDefaultCustomOptions(options) {
    InsightUIOptions.defaultCustomOptions = options;
  }

  mergeWithDefaultOptions(...customOptions) {
    const port = this.getRandomPort(20002, 29998);

    const defaultServiceOptions = {
      config: {
        port,
        network: 'testnet',
        services: [
          'dashd',
          '@dashevo/insight-api',
          '@dashevo/insight-ui',
          'web',
        ],
      },
      cacheNodeModules: false,
    };

    const configPath = this.getConfigPath();

    const defaultContainerOptions = {
      image: 'dashpay/insight',
      network: {
        name: 'dash_test_network',
        driver: 'bridge',
      },
      ports: [
        `${port}:${port}`,
      ],
      cmd: [
        '/insight/bin/dashcore-node',
        'start',
      ],
    };

    const defaultOptions = defaultServiceOptions;
    defaultOptions.container = defaultContainerOptions;

    const options = super.mergeWithDefaultOptions(
      defaultOptions,
      InsightUIOptions.defaultCustomOptions,
      ...customOptions,
    );

    options.container.volumes.push(
      `${configPath}:/insight/dashcore-node.json`,
    );

    this.saveConfig(configPath, options);

    return options;
  }

  /**
   * Get Insight UI port
   *
   * @returns {number}
   */
  getUiPort() {
    return this.options.config.port;
  }

  // noinspection JSMethodCanBeStatic
  getConfigPath() {
    if (this.configPath) {
      return this.configPath;
    }

    let tempDir = os.tmpdir();
    if (os.platform() === 'darwin') {
      // Default temp dir on mac is like '/var/folders/...'
      // docker doesn't allow to share files there without changing 'File sharing' settings
      tempDir = '/tmp';
    }
    const tmpPath = fs.mkdtempSync(path.join(tempDir, 'js-evo-ctl-insight-'));

    this.configPath = path.join(tmpPath, 'bitcore-node-dash.json');

    return this.configPath;
  }

  // noinspection JSMethodCanBeStatic
  saveConfig(configPath, options) {
    const { config } = options;
    const data = JSON.stringify(config);
    fs.writeFileSync(configPath, data);
  }
}

InsightUIOptions.defaultCustomOptions = {};

module.exports = InsightUIOptions;
