function BlockPage() {
  const blockId = element(by.xpath('//*[contains(text(), "Block #")]'));
  const blockHash = element(by.css('.txid.text-muted.ng-binding'));

  const numberOfTrxs = element(by.xpath('//table//tr[1]//td[2]'));
  const height = element(by.xpath('//table//tr[2]//td[2]'));
  const blockReward = element(by.xpath('//table//tr[3]//td[2]'));
  const timestamp = element(by.xpath('//table//tr[4]//td[2]'));
  const minedBy = element(by.xpath('//table//tr[5]//td[2]'));
  const merkleRoot = element(by.xpath('//table//tr[6]//td[2]//span[2]'));
  const previousBlock = element(by.xpath('//table//tr[7]//td[2]'));
  const difficulty = element(by.xpath("//div[@class='col-md-6'][2]/table//tr[1]/td[2]"));
  const bits = element(by.xpath("//div[@class='col-md-6'][2]/table//tr[2]/td[2]"));
  const size = element(by.xpath("//div[@class='col-md-6'][2]/table//tr[3]/td[2]"));
  const version = element(by.xpath("//div[@class='col-md-6'][2]/table//tr[4]/td[2]"));
  const nonce = element(by.xpath("//div[@class='col-md-6'][2]/table//tr[5]/td[2]"));
  const nextBlock = element(by.xpath("//div[@class='col-md-6'][2]/table//tr[6]/td[2]"));

  const trxHash = element(by.xpath("//a[contains(@href,'tx/')]"));

  this.getBlockId = () => blockId.getText();

  this.getBlockHash = () => blockHash.getText();

  this.getNumberOfTrxs = () => numberOfTrxs.getText();

  this.getHeight = () => height.getText();

  this.getBlockReward = () => blockReward.getText();

  this.getTimestamp = () => timestamp.getText();

  this.getMinedBy = () => minedBy.getText();

  this.getMerkleRoot = () => merkleRoot.getText();

  this.getPreviousBlock = () => previousBlock.getText();

  this.getDifficulty = () => difficulty.getText();

  this.getBits = () => bits.getText();

  this.getSize = () => size.getText();

  this.getVersion = () => version.getText();

  this.getNonce = () => nonce.getText();

  this.getNextBlock = () => nextBlock.getText();

  this.getTrxHash = () => trxHash.getText();
}
module.exports = new BlockPage();
