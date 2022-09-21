const { merge } = require('lodash');

const startDashCore = require('@dashevo/dp-services-ctl/lib/services/dashCore/startDashCore');
const startInsightUI = require('./service-ctl/startInsightUI');

/**
 * @typedef InsightUI
 * @property {DapiCore} insightUi
 * @property {DashCore} dashCore
 * @property {Promise<void>} clean
 * @property {Promise<void>} remove
 */

/**
 * Create Insight UI instance
 *
 * @param {object} [options]
 * @returns {Promise<InsightUI>}
 */
async function startInsightNode(options) {
  const instances = await startInsightNode.many(1, options);
  return instances[0];
}

/**
 * Create Insight UI instances
 *
 * @param {Number} number
 * @param {object} [options]
 * @returns {Promise<InsightUI[]>}
 */
startInsightNode.many = async function many(number, options = {}) {
  if (number < 1) {
    throw new Error('Invalid number of instances');
  }
  if (number > 1) {
    throw new Error("We don't support more than 1 instance");
  }


  const dashCoreInstances = await startDashCore.many(number, options.dashCore);

  const instances = [];

  for (let i = 0; i < number; i++) {
    const dashCore = dashCoreInstances[i];


    const insightUIOptions = {
      container: {},
      config: {},
      ...options.insightUI,
    };

    merge(insightUIOptions.config, {
      servicesConfig: {
        dashd: {
          connect: [{
            rpchost: `${dashCore.getIp()}`,
            rpcport: `${dashCore.options.getRpcPort()}`,
            rpcuser: `${dashCore.options.getRpcUser()}`,
            rpcpassword: `${dashCore.options.getRpcPassword()}`,
            zmqpubrawtx: `tcp://host.docker.internal:${dashCore.options.getZmqPorts().rawtx}`,
            zmqpubhashblock: `tcp://host.docker.internal:${dashCore.options.getZmqPorts().hashblock}`,
          }],
        },
      },
    });


    const insightUI = await startInsightUI(insightUIOptions);

    const instance = {
      insightUI,
      dashCore,
      async clean() {
        await dashCore.remove();
        await insightUI.remove();

        const newServices = await startInsightNode(options);

        Object.assign(instance, newServices);
      },
      async remove() {
        await dashCore.remove();
        await insightUI.remove();
      },
    };

    instances.push(instance);
  }

  return instances;
};

module.exports = startInsightNode;
