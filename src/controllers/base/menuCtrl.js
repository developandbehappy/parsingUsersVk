vkApp.controller('MenuCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  console.log("Menu!");
  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };
}]);