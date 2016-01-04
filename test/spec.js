describe('Vk app', function () {
  it('should have a title', function () {
    browser.get('http://localhost:3000/#/about');
    browser.sleep(1000);
    element(by.id('searchData')).click();
    browser.sleep(3000);
    expect(browser.getTitle()).toEqual('Angular start');
  });
});