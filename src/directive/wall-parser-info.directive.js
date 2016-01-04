vkApp.directive('wallParserInfo', function(vkFetchDataService) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/src/partials/wall-parser/wall-parser-info.html',
    scope: {
      control: '='
    },
    link: function (scope) {
      scope.$watch('control', function (currentValue, prevValue) {
        console.log('prevValue', prevValue);
        console.log('currentValue', currentValue);
        console.log('...........');
      });
      vkFetchDataService.fetchPageInfo('durov', 'slug').then(function () {

      });
    }
  };
});