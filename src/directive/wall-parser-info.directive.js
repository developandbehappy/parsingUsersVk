vkApp.directive('wallParserInfo', function (vkFetchDataService, parseAndValidateVkLink) {
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
      scope.$watch('control', function (currentValue, prevValue) {
        var result = parseAndValidateVkLink(currentValue);
        if (!result.validate) {
          return false;
        }
        console.log('result', result);
        scope.infoStatus = true;
        vkFetchDataService.fetchPageInfo(result.id, result.type).then(function (res) {
          scope.info = res;
        });
      });
    }
  };
});