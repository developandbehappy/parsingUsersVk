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
        if (_.isEmpty(urlPage)) {
          return false;
        }
        var typePage = '';
        var groupLink = urlPage.replace(/\D+/g, '');
        console.log('groupLink', groupLink);
        if (urlPage.indexOf('id') + 1) {
          console.log('id found!');
          typePage = 'user';
        }
        if (urlPage.indexOf('club') + 1) {
          console.log('club found');
          typePage = 'slug';
        }
        if (urlPage.indexOf('public') + 1) {
          typePage = 'slug'
        }
        if (urlPage.indexOf('event') + 1) {
          typePage = 'slug'
        } else {
          return {
            type: 'slug',
            idPage: urlPage
          };
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