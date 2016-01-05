var _ = require('lodash');

describe("wallParserLinkSpec", function () {
  var parseLink = function (link) {
    link = link.toLowerCase();
    var validateNic = function (item) {
      var validateReplaceRes = item.replace(/[\w|_|.]+/, '');
      return validateReplaceRes.length === 0;
    };
    var validateReplaceRes = link.replace(/[\w|:|\/|.]+/, '');
    var validateStatus = validateReplaceRes.length === 0;
    if (!validateStatus || _.isEmpty(link)) {
      return {
        validate: false
      }
    }
    if (!isNaN(Number(link))) { // если link число
      var res = Number(link);
      return {
        id: res,
        type: 'user',
        validate: true
      }
    }
    var pageMap = {
      club: 'group',
      public: 'group',
      event: 'group',
      id: 'user'
    };
    var maybeNames = ['club', 'public', 'id', 'event'];
    var tempResult = maybeNames.map(function (item) {
      if (!_.include(link, item)) {
        return false;
      }
      var splitResult = link.split(item);
      var splitItem = splitResult[1];
      if (_.isEmpty(splitItem)) {
        return false
      }
      splitItem = Number(splitItem);
      if (isNaN(splitItem)) {
        // типо строка, знач ошибка
        return false;
      }
      return {
        id: splitItem,
        type: pageMap[item],
        validate: true
      };
    }).filter(function (item) {
      return _.isObject(item);
    });
    if (!_.isEmpty(tempResult)) {
      return _.first(tempResult);
    }
    var domainList = ['vk.com', 'vk.ru', 'vkontakte.ru'];
    var tempDomainResult = domainList.map(function (item) {
      var splitValue = item + "/";
      if (!_.include(link, splitValue)) {
        return false;
      }
      var splitResult = link.split(splitValue);
      var splitItem = splitResult[1];
      if (_.isEmpty(splitItem)) {
        return false
      }
      if (!validateNic(splitItem)) {
        return false;
      }
      return {
        id: splitItem,
        type: 'slug',
        validate: true
      };
    }).filter(function (item) {
      return _.isObject(item);
    });
    if (!_.isEmpty(tempDomainResult)) {
      return _.first(tempDomainResult);
    }
    if (validateNic(link)) {
      return {
        id: link,
        type: 'slug',
        validate: true
      }
    }
    return {
      validate: false
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
      id: 1,
      type: 'user',
      validate: true
    });
  });
  it("https://vk.com/id1", function () {
    expect(parseLink('https://vk.com/id1')).toEqual({
      id: 1,
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
  it("https://vk.com/club_test", function () {
    expect(parseLink('https://vk.com/club_test')).toEqual({
      id: 'club_test',
      type: 'slug',
      validate: true
    });
  });
  it("https://vk.com/club", function () {
    expect(parseLink('https://vk.com/club')).toEqual({
      id: 'club',
      type: 'slug',
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
  it("vk.com/public100", function () {
    expect(parseLink('vk.com/public100')).toEqual({
      id: 100,
      type: 'group',
      validate: true
    });
  });
  it("vkontakte.ru/public100", function () {
    expect(parseLink('vkontakte.ru/public100')).toEqual({
      id: 100,
      type: 'group',
      validate: true
    });
  });
  it("vkontakte.ru/durov", function () {
    expect(parseLink('vkontakte.ru/durov')).toEqual({
      id: 'durov',
      type: 'slug',
      validate: true
    });
  });
  it("vk.com/durov", function () {
    expect(parseLink('vk.com/durov')).toEqual({
      id: 'durov',
      type: 'slug',
      validate: true
    });
  });
  it("club123", function () {
    expect(parseLink('club123')).toEqual({
      id: 123,
      type: 'group',
      validate: true
    });
  });
  it("public777", function () {
    expect(parseLink('public777')).toEqual({
      id: 777,
      type: 'group',
      validate: true
    });
  });
  it("event555", function () {
    expect(parseLink('event555')).toEqual({
      id: 555,
      type: 'group',
      validate: true
    });
  });
  it("id1", function () {
    expect(parseLink('id1')).toEqual({
      id: 1,
      type: 'user',
      validate: true
    });
  });
  it("vk.comvkontakte.rudurov", function () {
    expect(parseLink('vk.comvkontakte.rudurov')).toEqual({
      id: 'vk.comvkontakte.rudurov',
      type: 'slug',
      validate: true
    });
  });
  it("vk.com/clubA", function () {
    expect(parseLink('clubA')).toEqual({
      id: 'cluba',
      type: 'slug',
      validate: true
    });
  });
  it("vk.com/Club", function () {
    expect(parseLink('vk.com/Club')).toEqual({
      id: 'club',
      type: 'slug',
      validate: true
    });
  });

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
  it("durov#", function () {
    expect(parseLink('durov#')).toEqual(validateFalse);
  });
  it("du:rov", function () {
    expect(parseLink('du:rov')).toEqual(validateFalse);
  });
  it("duro/v__1", function () {
    expect(parseLink('duro/v__1')).toEqual(validateFalse);
  });
  it("vk.com/durov::", function () {
    expect(parseLink('vk.com/durov::')).toEqual(validateFalse);
  });
  it("vk.com/club::", function () {
    expect(parseLink('vk.com/club::')).toEqual(validateFalse);
  });
  it("vk.com/#club", function () {
    expect(parseLink('vk.com/#club')).toEqual(validateFalse);
  });
});
