vkApp.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: '/src/partials/home.html',
      controller: 'HomeCtrl'
    })
    .when('/wallParser', {
      templateUrl: '/src/partials/wall-parser/wall-parser.html',
      controller: 'wallParserCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
}]);