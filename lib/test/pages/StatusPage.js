function StatusPage() {
  const syncProgress = element(by.xpath('//table//tr[1]//td[2]'));
  const currentSyncStatus = element(by.xpath('//table//tr[2]//td[2]'));
  const startDate = element(by.xpath('//table//tr[3]//td[2]'));
  const initialBlockChainHeight = element(by.xpath('//table//tr[5]//td[2]'));
  const syncedBlocks = element(by.xpath('//table//tr[6]//td[2]'));
  const skippedBlocks = element(by.xpath('//table//tr[7]//td[2]'));
  const syncType = element(by.xpath('//table//tr[8]//td[2]'));

  const lastBlockHash = element(by.xpath('//table[2]//tr[1]//td[2]'));
  const currentBlockchainTip = element(by.xpath('//table[2]//tr[2]//td[2]'));

  const version = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[1]//td[2]"));
  const protocolVersion = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[2]//td[2]"));
  const blocks = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[3]//td[2]"));
  const timeOffset = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[4]//td[2]"));
  const connections = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[5]//td[2]"));
  const miningDifficulty = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[6]//td[2]"));
  const network = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[7]//td[2]"));
  const proxySetting = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[8]//td[2]"));
  const infoErrors = element(by.xpath("//h2[contains(text(), 'Dash node information')]/../table//tr[9]//td[2]"));


  this.getSyncProgress = () => syncProgress.getText();

  this.getCurrentSyncStatus = () => currentSyncStatus.getText();

  this.getStartDate = () => startDate.getText();

  this.getInitialBlockChainHeight = () => initialBlockChainHeight.getText();

  this.getSkippedBlocks = () => skippedBlocks.getText();

  this.getSyncedBlocks = () => syncedBlocks.getText();

  this.getSyncType = () => syncType.getText();

  this.getLastBlockHash = () => lastBlockHash.getText();

  this.getCurrentBlockchainTip = () => currentBlockchainTip.getText();

  this.getVersion = () => version.getText();

  this.getProtocolVersion = () => protocolVersion.getText();

  this.getBlocks = () => blocks.getText();

  this.getTimeOffset = () => timeOffset.getText();

  this.getConnections = () => connections.getText();

  this.getMiningDifficulty = () => miningDifficulty.getText();

  this.getNetwork = () => network.getText();

  this.getProxySetting = () => proxySetting.getText();

  this.getInfoErrors = () => infoErrors.getText();
}
module.exports = new StatusPage();
