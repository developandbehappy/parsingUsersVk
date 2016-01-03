vkApp.controller('AboutCtrl', function ($scope, $http, $q, vkApiService, vkFetchDataService) {
  $scope.groupId = '206291137';
  $scope.searchBtnHandler = function () {
    var idWall = $scope.groupId;
    var fetchWallData = vkFetchDataService.fetchWallData(idWall, 10000, 20);
    var fetchPostLikeDataPromise = fetchWallData.then(function (response) {
      return vkFetchDataService.fetchPostLikeData(response.slice(0, 3));
    }, function (error) {
      console.log('error', error);
      return false;
    }, function (notify) {
      console.log('notify', notify);
      return false;
    });

    fetchPostLikeDataPromise.then(function (response) {
      console.log('wwww', response);
    }, function (error) {

    }, function (notify) {

    });
  };

//  var getLengthPosts = function (groupId) {
//    var countMax = 0;
//    var url = vkApiService.wallGet({
//      owner_id: groupId
//    });
//    return url.then(function (response) {
//      return countMax = response.data.response[0];
//    });
//  };
//  var postLikeGet = function () {
//
//  }
});