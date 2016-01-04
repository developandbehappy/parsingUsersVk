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
          console.log('number!');
        } else {
          console.log('string!');
        }
        return link;
      };
      scope.$watch('control', function (currentValue, prevValue) {
        //console.log('currentValue', currentValue);
        parseLink(currentValue);
        scope.infoStatus = true;
        vkFetchDataService.fetchPageInfo(currentValue, 'slug').then(function (res) {
          //console.log('res', res);
          scope.info = res;
        });
      });
    }
  };
});