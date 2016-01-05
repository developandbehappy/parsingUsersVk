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
        var groupLink = urlPage;
        var typePage = 'slug';
        console.log('groupLink', groupLink);
        if (urlPage.indexOf('id') + 1) {
          console.log('id found!');
          groupLink = urlPage.replace(/\D+/g, '');
          typePage = 'user';
        }
        if (urlPage.indexOf('club') + 1) {
          console.log('club found');
          groupLink = urlPage.replace(/\D+/g, '');
          typePage = 'group';
        }
        if (urlPage.indexOf('public') + 1) {
          typePage = 'group'
          groupLink = urlPage.replace(/\D+/g, '');
        }
        if (urlPage.indexOf('event') + 1) {
          typePage = 'group'
          groupLink = urlPage.replace(/\D+/g, '');
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