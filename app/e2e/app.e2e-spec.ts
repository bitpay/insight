import { browser, element, by } from 'protractor';

describe('InsightApp', () => {

  beforeEach(() => {
    browser.get('');
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('Blocks');
  });

  it('should have {nav}', () => {
    expect(element(by.css('ion-navbar')).isPresent()).toEqual(true);
  });

  it('should have correct nav text for Home', () => {
    expect(element(by.css('ion-navbar:first-child')).getText()).toContain('Blocks');
  });

  it('has a menu button that displays the left menu', () => {
    element(by.css('.bar-button-menutoggle')).click()
      .then(() => {
        browser.driver.sleep(2000); // wait for the animation
        expect(element(by.css('ion-menu')).isPresent()).toEqual(true);
      });
  });

  it('the left menu has a link with title Blocks', () => {
    element(by.css('.bar-button-menutoggle')).click()
      .then(() => {
        browser.driver.sleep(2000); // wait for the animation
        expect(element.all(by.css('ion-label')).first().getText()).toEqual('Blocks');
      });
  });
});
