function TopPanel() {
  const openBlockPage = element(by.xpath("//a[@href='blocks']"));
  const openStatusPage = element(by.xpath("//a[@href='status']"));
  const search = element(by.id('search'));


  this.search = (text) => {
    search.sendKeys(text);
    search.submit();
  };

  this.openBlockPage = () => {
    openBlockPage.click();
  };

  this.openStatusPage = () => {
    openStatusPage.click();
  };
}
module.exports = new TopPanel();
