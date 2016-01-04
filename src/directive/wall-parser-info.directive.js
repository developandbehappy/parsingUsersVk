vkApp.directive('wallParserInfo', function factory() {
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
    }
  };
});