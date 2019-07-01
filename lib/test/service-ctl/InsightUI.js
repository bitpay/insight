const axios = require('axios');
const NodeJsService = require('@dashevo/dp-services-ctl/lib/services/node/NodeJsService');
const wait = require('../util/wait');

class InsightUI extends NodeJsService {
  /**
   * @param {Network} network
   * @param {Image} image
   * @param {Container} container
   * @param {InsightUIOptions} options
   */
  constructor(network, image, container, options) {
    super(network, image, container, options);
    this.options = options;
  }

  /**
     * Start instance
     *
     * @return {Promise<void>}
     */
  async start() {
    await super.start();
    await this.initialize();
  }

  /**
     * Clean Insight UI by restarting the instance
     *
     * @returns {Promise<DockerService>}
     */
  async clean() {
    await super.remove();
    await this.start();
  }

  /**
     * Remove Insight UI container
     *
     * @returns {Promise<void>}
     */
  async remove() {
    await super.remove();
  }

  /**
   * @private
   *
   * @return {Promise<void>}
   */
  async initialize() {
    const url = `http://127.0.0.1:${this.options.getUiPort()}`;

    let nodeStarting = true;
    while (nodeStarting) {
      try {
        await axios.get(url);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          nodeStarting = false;
        } else {
          await wait(100);
        }
      }
    }
  }
}

module.exports = InsightUI;
