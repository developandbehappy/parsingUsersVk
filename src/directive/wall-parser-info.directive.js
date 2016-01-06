vkApp.directive('wallParserInfo', function (vkFetchDataService, parseAndValidateVkLink) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/src/partials/wall-parser/wall-parser-info.html',
    scope: {
      link: '=',
      params: '='
    },
    link: function (scope) {
      var firstInitialize = true;
      scope.info = false;
      scope.infoStatus = false;
//      console.log('scope.searchParams', scope.params);
      // TODO: fix async request bug and render bug
      scope.$watch('link', function (currentValue, prevValue) {
        scope.params.status = false;
        var result = parseAndValidateVkLink(currentValue);
        if (!result.validate) {
          return false;
        }
        if (!firstInitialize) {
          var resultPrevValue = parseAndValidateVkLink(prevValue);
          if (result.id === resultPrevValue.id) {
            return false;
          }
        }
        vkFetchDataService.fetchPageInfo(result.id, result.type).then(function (res) {
          if (!res) {
            scope.params.data = undefined;
            scope.infoStatus = false;
            return false;
          }
          firstInitialize = false;
          scope.params.status = true;
          res.friendsCount = accounting.formatNumber(res.friendsCount, 0, " ");
          res.data.followers_count = accounting.formatNumber(res.data.followers_count, 0, " ");
          scope.params.data = res;
          scope.info = res;
          scope.infoStatus = true;
        });
      });
    }
  };
});