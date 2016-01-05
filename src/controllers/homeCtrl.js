vkApp.controller('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
  console.log("HOME!");
  var plus = function (a, b) {
    return a + b;
  };

  var t1 = plus(3, 10);
  if (t1 === 13) {
    console.log('%c test ok', 'background: green; color: #fff');
  } else {
    console.log('%c test failed', 'background: red; color: #fff');
  }

  if (t1 === 16) {
    console.log('%c test ok', 'background: green; color: #fff');
  } else {
    console.log('%c test failed', 'background: red; color: #fff');
  }
  var t2 = plus(30, 50);
  if (t2 === 81) {
    console.log('%c test ok', 'background: green; color: #fff');
  } else {
    console.log('%c test failed', 'background: red; color: #fff');
  }

}]);