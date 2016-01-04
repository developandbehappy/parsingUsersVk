vkApp.directive('wallParserInfo', function factory() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div>TEST123</div>',
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