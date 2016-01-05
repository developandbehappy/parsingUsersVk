var _ = require('lodash');

describe("wallParserLinkSpec", function () {
  var parseLink = function (link) {
    var validateReplaceRes = link.replace(/[\w|:|\/|.]+/, '');
    var validateStatus = validateReplaceRes.length === 0;
    if (!validateStatus || _.isEmpty(link)) {
      return {
        validate: false
      }
    }
    if (!isNaN(Number(link))) {
      return {
        id: link,
        type: 'user',
        validate: true
      }
    }
    

    return {
      validate: true
    }
  };
  var validateFalse = {
    validate: false
  };
  it("durov", function () {
    expect(parseLink('durov')).toEqual({
      id: 'durov',
      type: 'slug',
      validate: true
    });
  });
  it("1", function () {
    expect(parseLink('1')).toEqual({
      id: '1',
      type: 'user',
      validate: true
    });
  });
  it("https://vk.com/id1", function () {
    expect(parseLink('https://vk.com/id1')).toEqual({
      id: '1',
      type: 'user',
      validate: true
    });
  });
  it("https://vk.com/mdk", function () {
    expect(parseLink('https://vk.com/mdk')).toEqual({
      id: 'mdk',
      type: 'slug',
      validate: true
    });
  });
  it("https://vk.com/club1", function () {
    expect(parseLink('https://vk.com/club1')).toEqual({
      id: 1,
      type: 'group',
      validate: true
    });
  });
  it("https://vk.com/event100", function () {
    expect(parseLink('https://vk.com/event100')).toEqual({
      id: 100,
      type: 'group',
      validate: true
    });
  });
  it("https://vk.com/public500", function () {
    expect(parseLink('https://vk.com/public500')).toEqual({
      id: 500,
      type: 'group',
      validate: true
    });
  });
//  it("vk.com/public100", function () {
//    expect(parseLink('vk.com/public100')).toEqual({test: 123});
//  });
//  it("vkontakte.ru/public100", function () {
//    expect(parseLink('vkontakte.ru/public100')).toEqual({test: 123});
//  });
//  it("club123", function () {
//    expect(parseLink('club123')).toEqual({test: 123});
//  });
//  it("public123", function () {
//    expect(parseLink('public123')).toEqual({test: 123});
//  });
//  it("event123", function () {
//    expect(parseLink('event123')).toEqual({test: 123});
//  });
//  it("id1", function () {
//    expect(parseLink('id1')).toEqual({test: 123});
//  });

  it("https://vk.com/d%123", function () {
    expect(parseLink('https://vk.com/d%123')).toEqual(validateFalse);
  });
  it("https://vk.com/id^1313", function () {
    expect(parseLink('https://vk.com/d%123')).toEqual(validateFalse);
  });
  it("https://vk.com/привет", function () {
    expect(parseLink('https://vk.com/привет')).toEqual(validateFalse);
  });
  it("#43242$", function () {
    expect(parseLink('#43242$')).toEqual(validateFalse);
  });
  it("", function () {
    expect(parseLink('')).toEqual(validateFalse);
  });
});
