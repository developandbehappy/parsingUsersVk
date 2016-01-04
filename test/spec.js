describe('Vk app', function () {
  it('should have a title', function () {
    browser.get('http://localhost:3000/#/wallParser');
    browser.sleep(1000);
    element(by.id('searchData')).click();
    browser.sleep(3000);
    expect(browser.getTitle()).toEqual('Angular start');
  });
  afterEach(function () {
    browser.manage().logs().get('browser').then(function (browserLog) {
      var errors = require('lodash').where(browserLog, {level: {name: 'SEVERE'}});
      if (errors.length) {
        console.error('unexpected browser errors:');
        console.log(JSON.stringify(browserLog, null, 2));
      }
      expect(errors.length).toEqual(0);
    });
  });
});