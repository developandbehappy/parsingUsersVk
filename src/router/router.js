vkApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/src/partials/home.html',
      controller: 'HomeCtrl'
    })
    .when('/wallParser', {
      templateUrl: '/src/partials/wallParser.html',
      controller: 'wallParserCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);