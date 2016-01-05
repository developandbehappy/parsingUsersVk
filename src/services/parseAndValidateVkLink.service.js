vkApp.factory('parseAndValidateVkLink', function () {
  return function (link) {
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
  }
});