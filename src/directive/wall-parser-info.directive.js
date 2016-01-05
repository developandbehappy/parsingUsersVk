vkApp.directive('wallParserInfo', function (vkFetchDataService) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/src/partials/wall-parser/wall-parser-info.html',
    scope: {
      control: '='
    },
    link: function (scope) {
      scope.info = false;
      scope.infoStatus = false;
      var parsePageGroup = function (urlPage) {
        var arrUrlType = {
          id: 'user',
          group: 'group',
          slug: 'slug'
        };

        if (_.isEmpty(urlPage)) {
          return false;
        }
        var splitLink = '';
        var groupLink = urlPage;
        var typePage = 'slug';
        if (!isNaN(Number(urlPage))) {
          typePage = arrUrlType.id;
        }
        if (urlPage.indexOf('id') + 1) {
          splitLink = urlPage.split('id');
          groupLink = splitLink[1];
          typePage = arrUrlType.id;
        }
        if (urlPage.indexOf('club') + 1) {
          splitLink = urlPage.split('club');
          groupLink = splitLink[1];
          typePage = 'group';
        }
        if (urlPage.indexOf('public') + 1) {
          typePage = 'group';
          splitLink = urlPage.split('public');
          groupLink = splitLink[1];
        }
        if (urlPage.indexOf('event') + 1) {
          typePage = 'group';
          groupLink = splitLink[1];
          splitLink = urlPage.split('event');
        }
        return {
          type: typePage,
          idPage: groupLink
        }
      };
      scope.$watch('control', function (currentValue, prevValue) {
        //console.log('currentValue', currentValue);
//        parseLink(currentValue);
        scope.infoStatus = true;
        vkFetchDataService.fetchPageInfo(parsePageGroup(currentValue).idPage, parsePageGroup(currentValue).type).then(function (res) {
          //console.log('res', res);
          scope.info = res;
        });
      });
    }
  };
});