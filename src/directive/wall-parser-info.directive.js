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
      var parseLink = function (link) {
        if (_.isEmpty(link)) {
          return false;
        }
        if (!isNaN(Number(link))) {
          return 'user'
        } else {
          return 'slug'
        }
      };
      scope.$watch('control', function (currentValue, prevValue) {
        //console.log('currentValue', currentValue);
//        parseLink(currentValue);
        scope.infoStatus = true;
        vkFetchDataService.fetchPageInfo(currentValue, parseLink(currentValue)).then(function (res) {
          //console.log('res', res);
          scope.info = res;
        });
      });
    }
  };
});