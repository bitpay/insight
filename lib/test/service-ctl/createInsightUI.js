/* jshint ignore:start */
const Network = require('@dashevo/dp-services-ctl/lib/docker/Network');
const getAwsEcrAuthorizationToken = require('@dashevo/dp-services-ctl/lib/docker/getAwsEcrAuthorizationToken');
const Image = require('@dashevo/dp-services-ctl/lib/docker/Image');
const Container = require('@dashevo/dp-services-ctl/lib/docker/Container');
const InsightUIOptions = require('./InsightUIOptions');
const InsightUI = require('./InsightUI');

/**
 * Create Insight UI instance
 *
 * @param {Object|InsightUIOptions} [opts]
 * @returns {Promise<InsightUI>}
 */
async function createInsightUI(opts) {
  const options = opts instanceof InsightUIOptions
    ? opts
    : new InsightUIOptions(opts);

  const { name: networkName, driver } = options.getContainerNetworkOptions();
  const network = new Network(networkName, driver);

  const imageName = options.getContainerImageName();
  let authorizationToken;
  if (imageName.includes('amazonaws.com')) {
    authorizationToken = await getAwsEcrAuthorizationToken(options.getAwsOptions());
  }
  const image = new Image(imageName, authorizationToken);

  const containerOptions = options.getContainerOptions();
  const container = new Container(networkName, imageName, containerOptions);

  return new InsightUI(network, image, container, options);
}

module.exports = createInsightUI;
