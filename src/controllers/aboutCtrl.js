vkApp.controller('AboutCtrl', function ($scope, $http, $q, vkApiService, vkFetchDataService) {
  $scope.groupId = '-43215063';
  $scope.searchBtnHandler = function () {
    var idWall = $scope.groupId;
    var fetchWallData = vkFetchDataService.fetchWallData(idWall, 500, 20);
    fetchWallData.then(function (response) {
      console.log('response', response);
    });
  };
  var getLengthPosts = function (groupId) {
    var countMax = 0;
    var url = vkApiService.wallGet({
      owner_id: groupId
    });
    return url.then(function (response) {
      return countMax = response.data.response[0];
    });
  }
});